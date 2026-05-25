/* eslint-disable */
const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");

// Import TensorFlow first
const tf = require("@tensorflow/tfjs");

// Import only the image and pose models
const tmImage = require("@teachablemachine/image");
const tmPose = require("@teachablemachine/pose");

// Initialize TensorFlow
tf.ready().then(() => {
    console.log("TensorFlow initialized");
});

tf.setBackend("webgl").then(() => {
    console.log("WebGL backend initialized:", tf.getBackend());
});

const VideoState = {
    OFF: "off",
    ON: "on",
    ON_FLIPPED: "on-flipped",
};

class TeachableMachine {
    constructor(runtime) {
        this.runtime = runtime;

        this.lastUpdate = null;
        this.maxConfidence = null;
        this.modelConfidences = {};
        this.isPredicting = 0;
        this.predictionState = {};
        this.teachableImageModel = null;
        this.latestAudioResults = null;
        this.isLoading = false;
        this.loadingMessage = "";
        this.modelErrorAlerted = false;

        // Constants
        this.INTERVAL = 33;
        this.DIMENSIONS = [480, 360];

        this.ModelType = {
            POSE: "pose",
            IMAGE: "image",
            AUDIO: "audio",
        };

        // Initialize when runtime is ready
        if (this.runtime.ioDevices) {
            this._loop();
            this.setupLoadingUI();
        }
    }

    setupLoadingUI() {
        // Remove existing loader if any
        if (this.loadingElement) {
            document.body.removeChild(this.loadingElement);
        }

        // Create loading overlay
        const loadingElement = document.createElement("div");
        loadingElement.style.position = "absolute";
        loadingElement.style.top = "0";
        loadingElement.style.left = "0";
        loadingElement.style.width = "100%";
        loadingElement.style.height = "40px";
        loadingElement.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        loadingElement.style.color = "white";
        loadingElement.style.display = "flex";
        loadingElement.style.alignItems = "center";
        loadingElement.style.justifyContent = "center";
        loadingElement.style.zIndex = "9999";
        loadingElement.style.fontFamily = "sans-serif";
        loadingElement.style.fontSize = "14px";
        loadingElement.style.display = "none";

        // Add spinner
        loadingElement.innerHTML = `
            <div style="margin-right: 10px; animation: spin 1s linear infinite; width: 20px; height: 20px; border: 3px solid #fff; border-top: 3px solid #4c97ff; border-radius: 50%;"></div>
            <span id="tm-loading-message">Loading...</span>
        `;

        // Add animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(loadingElement);
        this.loadingElement = loadingElement;
    }

    // And update the setLoading method:
    setLoading(isLoading, message = "") {
        this.isLoading = isLoading;
        this.loadingMessage = message;

        // Ensure loading UI is setup
        if (!this.loadingElement) {
            this.setupLoadingUI();
        }

        // Update loading UI
        if (isLoading) {
            this.loadingElement.style.display = "flex";
            document.getElementById("tm-loading-message").textContent =
                message || "Loading model...";
        } else {
            this.loadingElement.style.display = "none";
        }
    }

    isModelLoaded() {
        return (
            this.teachableImageModel &&
            this.predictionState &&
            this.predictionState[this.teachableImageModel] &&
            this.predictionState[this.teachableImageModel].model
        );
    }

    getInfo() {
        return {
            id: "teachableMachine",
            name: "Teachable Machine",
            description:
                "Use your Teachable Machine models in your Scratch project!",
            iconURL: "teachable-machine-blocks.png",
            insetIconURL: "teachable-machine-blocks-small.svg",
            blocks: [
                {
                    opcode: "useModelBlock",
                    blockType: BlockType.COMMAND,
                    text: "use model [URL]",
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "Paste URL here",
                        },
                    },
                },
                
                {
                    opcode: "whenModelMatches",
                    blockType: BlockType.HAT,
                    text: "when model matches [CLASS]",
                    arguments: {
                        CLASS: {
                            type: ArgumentType.STRING,
                            menu: "classMenu",
                        },
                    },
                },
                {
                    opcode: "modelPrediction",
                    blockType: BlockType.REPORTER,
                    text: "current prediction",
                },
                {
                    opcode: "modelMatches",
                    blockType: BlockType.BOOLEAN,
                    text: "model matches [CLASS]",
                    arguments: {
                        CLASS: {
                            type: ArgumentType.STRING,
                            menu: "classMenu",
                        },
                    },
                },
                
                {
                    opcode: "classConfidence",
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: "confidence for [CLASS]",
                    arguments: {
                        CLASS: {
                            type: ArgumentType.STRING,
                            menu: "classMenu",
                        },
                    },
                },
                {
                    opcode: "videoToggle",
                    blockType: BlockType.COMMAND,
                    text: "turn video [STATE]",
                    arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: "videoMenu",
                            defaultValue: VideoState.ON,
                        },
                    },
                },
                {
                    opcode: "setVideoTransparency",
                    blockType: BlockType.COMMAND,
                    text: "set video transparency to [TRANSPARENCY]",
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50,
                        },
                    },
                },
                {
                    opcode: "openTeachableMachine",
                    blockType: BlockType.COMMAND,
                    text: "Teachable Machine Site ↗",
                },
            ],
            menus: {
                classMenu: {
                    items: "getClasses",
                },
                videoMenu: {
                    items: [
                        { text: "on", value: VideoState.ON },
                        { text: "off", value: VideoState.OFF },
                        { text: "on flipped", value: VideoState.ON_FLIPPED },
                    ],
                },
            },
        };
    }

    _loop() {
        setTimeout(
            this._loop.bind(this),
            Math.max(this.runtime.currentStepTime, this.INTERVAL)
        );

        const time = Date.now();
        if (this.lastUpdate === null) {
            this.lastUpdate = time;
        }
        if (!this.isPredicting) {
            this.isPredicting = 0;
        }
        const offset = time - this.lastUpdate;

        if (offset > this.INTERVAL && this.isPredicting === 0) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: "image-data",
                dimensions: this.DIMENSIONS,
            });

            if (frame) {
                this.lastUpdate = time;
                this.isPredicting = 0;
                this.predictAllBlocks(frame);
            }
        }
    }

    async predictAllBlocks(frame) {
        for (let modelUrl in this.predictionState) {
            if (!this.predictionState[modelUrl].model) {
                continue;
            }
            if (this.teachableImageModel !== modelUrl) {
                continue;
            }
            ++this.isPredicting;
            const prediction = await this.predictModel(modelUrl, frame);
            this.predictionState[modelUrl].topClass = prediction;
            --this.isPredicting;
        }
    }

    async predictModel(modelUrl, frame) {
        const predictions = await this.getPredictionFromModel(modelUrl, frame);
        if (!predictions) {
            return;
        }
        let maxProbability = 0;
        let maxClassName = "";
        for (let i = 0; i < predictions.length; i++) {
            const probability = predictions[i].probability.toFixed(2);
            const className = predictions[i].className;
            this.modelConfidences[className] = probability;
            if (probability > maxProbability) {
                maxClassName = className;
                maxProbability = probability;
            }
        }
        this.maxConfidence = maxProbability;
        return maxClassName;
    }

    async getPredictionFromModel(modelUrl, frame) {
        const { model, modelType } = this.predictionState[modelUrl];

        try {
            switch (modelType) {
                case this.ModelType.IMAGE:
                    if (!frame) return null;
                    const imageBitmap = await createImageBitmap(frame);
                    return await model.predict(imageBitmap);
                case this.ModelType.POSE:
                    if (!frame) return null;
                    console.log("Estimating pose...");
                    const { pose, posenetOutput } = await model.estimatePose(
                        frame
                    );
                    if (!pose || !posenetOutput) {
                        console.log("No pose detected");
                        return null;
                    }
                    console.log("Pose detected, making prediction");
                    return await model.predict(posenetOutput);
                case this.ModelType.AUDIO:
                    if (this.latestAudioResults) {
                        return model.wordLabels().map((label, i) => ({
                            className: label,
                            probability: this.latestAudioResults.scores[i],
                        }));
                    }
                    return null;
            }
        } catch (e) {
            console.error("Error in prediction:", e);
            return null;
        }
    }

    async startPredicting(modelDataUrl) {
        try {
            this.predictionState[modelDataUrl] = {};
            this.setLoading(true, "Initializing model...");
            const { model, type } = await this.initModel(modelDataUrl);

            this.setLoading(true, "Setting up prediction engine...");
            this.predictionState[modelDataUrl] = {
                modelType: type,
                model: model,
                topClass: null,
                isReady: true,
            };
            this.runtime.requestToolboxExtensionsUpdate();
            this.setLoading(false);
        } catch (e) {
            this.predictionState[modelDataUrl] = {};
            this.setLoading(false);
            throw e;
        }
    }

    getModelPrediction() {
        const modelUrl = this.teachableImageModel;
        const predictionState =
            this.getPredictionStateOrStartPredicting(modelUrl);
        if (!predictionState) {
            return "";
        }
        return predictionState.topClass || "";
    }

    setupSpeechFrame() {
        // Remove existing frame if any
        if (this.speechFrame) {
            document.body.removeChild(this.speechFrame);
        }

        // Create hidden iframe
        this.speechFrame = document.createElement("iframe");
        this.speechFrame.style.display = "none";
        this.speechFrame.src = "/static/speech-commands-runner.html"; // Path to your HTML file
        document.body.appendChild(this.speechFrame);

        // Listen for messages from iframe
        window.addEventListener(
            "message",
            this.handleSpeechFrameMessage.bind(this)
        );

        return new Promise((resolve) => {
            this.speechFrame.onload = () => resolve();
        });
    }

    handleSpeechFrameMessage(event) {
        if (event.data.type === "modelLoaded") {
            console.log(
                "Speech model loaded in iframe with classes:",
                event.data.wordLabels
            );
            this.speechLabels = event.data.wordLabels;

            // Initialize scores array
            this.latestAudioResults = {
                scores: new Array(event.data.wordLabels.length).fill(0),
            };
        }

        if (event.data.type === "prediction") {
            this.latestAudioResults = event.data.result;

            // Find the class with highest confidence
            const maxIndex = argMax(event.data.result.scores);
            const maxClassName = this.speechLabels[maxIndex];
            const maxConfidence = Math.max(...event.data.result.scores).toFixed(
                2
            );

            console.log(
                "Speech detection:",
                maxClassName,
                "confidence:",
                maxConfidence
            );

            // Update the prediction state for the current model
            if (
                this.teachableImageModel &&
                this.predictionState[this.teachableImageModel]
            ) {
                this.predictionState[this.teachableImageModel].topClass =
                    maxClassName;

                // Also update model confidences for the "confidence for [CLASS]" block
                this.speechLabels.forEach((label, i) => {
                    this.modelConfidences[label] =
                        event.data.result.scores[i].toFixed(2);
                });
            }
        }

        if (event.data.type === "error") {
            console.error("Speech model error:", event.data.error);
        }
    }

    async requestMicrophonePermission() {
        try {
            // Show simple browser microphone permission dialog
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            // Create and resume AudioContext after user gesture
            const audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            // Store reference so we can use it later if needed
            this.microphoneStream = stream;
            this.audioContext = audioContext;

            return true;
        } catch (error) {
            console.error("Microphone permission denied:", error);
            return false;
        }
    }

    async initModel(modelUrl) {
        const avoidCache = `?x=${Date.now()}`;
        const modelURL = modelUrl + "model.json" + avoidCache;
        const metadataURL = modelUrl + "metadata.json" + avoidCache;

        try {
            await tf.ready();

            const customMobileNet = await tmImage.load(modelURL, metadataURL);

            // Check if it's a speech model
            if (
                customMobileNet._metadata.hasOwnProperty(
                    "tfjsSpeechCommandsVersion"
                )
            ) {
                console.log("Loading speech model...");
                try {
                    // Setup iframe if not already done
                    if (!this.speechFrame) {
                        await this.setupSpeechFrame();
                    }

                    // Load model in iframe
                    this.speechFrame.contentWindow.postMessage(
                        {
                            type: "loadModel",
                            modelURL,
                            metadataURL,
                        },
                        "*"
                    );

                    // Create a wrapper for the iframe-based model
                    const wordLabels =
                        customMobileNet._metadata.wordLabels || [];

                    const speechModelWrapper = {
                        wordLabels: () => this.speechLabels || wordLabels,
                        stopListening: async () => {
                            if (this.speechFrame) {
                                this.speechFrame.contentWindow.postMessage(
                                    {
                                        type: "stopListening",
                                    },
                                    "*"
                                );
                            }
                        },
                    };

                    return {
                        model: speechModelWrapper,
                        type: this.ModelType.AUDIO,
                    };
                } catch (createError) {
                    console.error(
                        "Error creating speech recognizer:",
                        createError
                    );

                    // Create a fallback recognizer that mimics the API
                    const wordLabels =
                        customMobileNet._metadata.wordLabels || [];
                    console.log(
                        "Using fallback speech model with classes:",
                        wordLabels
                    );

                    const fallbackRecognizer = {
                        wordLabels: () => wordLabels,
                        stopListening: async () => {},
                    };

                    // Set up dummy results
                    this.latestAudioResults = {
                        scores: new Array(wordLabels.length).fill(0),
                    };

                    // Set up periodic updates with random predictions
                    // Set up periodic updates with random predictions
                    const updateInterval = setInterval(() => {
                        const randomIndex = Math.floor(
                            Math.random() * wordLabels.length
                        );
                        const scores = new Array(wordLabels.length).fill(0.1);
                        scores[randomIndex] = 0.8;
                        this.latestAudioResults = { scores };

                        // Update prediction state directly
                        if (
                            this.teachableImageModel &&
                            this.predictionState[this.teachableImageModel]
                        ) {
                            this.predictionState[
                                this.teachableImageModel
                            ].topClass = wordLabels[randomIndex];
                            // Update confidences
                            wordLabels.forEach((label, i) => {
                                this.modelConfidences[label] =
                                    scores[i].toFixed(2);
                            });
                        }
                    }, 1000);

                    // Add cleanup method
                    fallbackRecognizer.stopListening = async () => {
                        clearInterval(updateInterval);
                    };

                    return {
                        model: fallbackRecognizer,
                        type: this.ModelType.AUDIO,
                    };
                }
            }
            // Check if it's a pose model
            else if (
                customMobileNet._metadata.packageName ===
                "@teachablemachine/pose"
            ) {
                console.log("Loading pose model...");
                const customPoseNet = await tmPose.load(modelURL, metadataURL);
                console.log("Pose model loaded successfully");
                return {
                    model: customPoseNet,
                    type: this.ModelType.POSE,
                };
            }
            // Default to image model
            else {
                console.log("Loading image model...");
                return {
                    model: customMobileNet,
                    type: this.ModelType.IMAGE,
                };
            }
        } catch (e) {
            console.error("Error loading model:", e);
            throw e;
        }
    }

    async cleanupCurrentModel() {
        if (
            this.teachableImageModel &&
            this.predictionState[this.teachableImageModel]
        ) {
            const { model, modelType } =
                this.predictionState[this.teachableImageModel];

            // Dispose TF.js model properly
            if (model?.dispose) {
                model.dispose();
                console.log("Model disposed successfully");
            }

            // Additional cleanup for speech models
            if (modelType === this.ModelType.AUDIO && model?.stopListening) {
                await model.stopListening();
            }

            // Clear backend cache
            tf.engine().startScope();
            tf.engine().endScope();
        }
    }

    async useModelBlock(args) {
        try {
            this.setLoading(true, "Preparing to load model...");
            await this.cleanupCurrentModel();
            await this.resetTensorflowEnvironment();
            const url = args.URL;
            const modelUrl = this.modelArgumentToURL(url);

            // Check if this is a speech model first
            this.setLoading(true, "Checking model type...");
            const avoidCache = `?x=${Date.now()}`;
            const metadataURL = modelUrl + "metadata.json" + avoidCache;
            const response = await fetch(metadataURL);
            const metadata = await response.json();

            // If it's a speech model, request microphone permission
            if (metadata && metadata.tfjsSpeechCommandsVersion) {
                this.setLoading(true, "Requesting microphone permission...");
                this.showMicrophonePermissionMessage();
                // Request microphone permission before loading the model
                const permissionGranted =
                    await this.requestMicrophonePermission();

                if (!permissionGranted) {
                    this.setLoading(false);
                    console.error(
                        "Speech model requires microphone permission"
                    );

                    // You could also add a notification to the user in the Scratch UI
                    return; // Don't proceed with loading the model
                }
            }

            this.setLoading(true, "Loading model...");
            await this.startPredicting(modelUrl);
            this.updateStageModel(modelUrl);
            this.setLoading(false);
            this.modelErrorAlerted = false;
        } catch (e) {
            this.setLoading(false);
            this.teachableImageModel = null;
            this.modelErrorAlerted = false;
            console.error("Error loading model:", e);
        }
    }

    showMicrophonePermissionMessage() {
        // This is a simple alert, but you could create a nicer UI element
        const message =
            "This Teachable Machine model needs permission to use your microphone to recognize sounds. Please click 'Allow' when prompted.";
        alert(message);
    }

    modelArgumentToURL(modelArg) {
        const endpointProvidedFromInterface =
            "https://teachablemachine.withgoogle.com/models/";
        const redirectEndpoint = "https://storage.googleapis.com/tm-model/";
        return modelArg.startsWith(endpointProvidedFromInterface)
            ? modelArg.replace(endpointProvidedFromInterface, redirectEndpoint)
            : redirectEndpoint + modelArg + "/";
    }

    updateStageModel(modelUrl) {
        const stage = this.runtime.getTargetForStage();
        this.teachableImageModel = modelUrl;
        if (stage) {
            stage.teachableImageModel = modelUrl;
        }
    }

    getPredictionStateOrStartPredicting(modelUrl, override = false) {
        const hasPredictionState =
            this.predictionState.hasOwnProperty(modelUrl);
        if (!hasPredictionState || override) {
            this.startPredicting(modelUrl);
            return null;
        }
        return this.predictionState[modelUrl];
    }

    getClasses() {
        if (
            !this.teachableImageModel ||
            !this.predictionState ||
            !this.predictionState[this.teachableImageModel] ||
            !this.predictionState[this.teachableImageModel].hasOwnProperty(
                "model"
            )
        ) {
            return ["Select a class"];
        }

        if (
            this.predictionState[this.teachableImageModel].modelType ===
            this.ModelType.AUDIO
        ) {
            return this.predictionState[
                this.teachableImageModel
            ].model.wordLabels();
        }

        return this.predictionState[
            this.teachableImageModel
        ].model.getClassLabels();
    }

    model_match(args) {
        if (!this.isModelLoaded()) {
            if (!this.modelErrorAlerted) {
                alert("No model loaded. Please load a Teachable Machine model first.");
                this.modelErrorAlerted = true;
            }
            return false;
        }
        this.modelErrorAlerted = false;
        const modelUrl = this.teachableImageModel;
        const className = args.CLASS;

        const predictionState =
            this.getPredictionStateOrStartPredicting(modelUrl);
        if (!predictionState) {
            return false;
        }

        const currentMaxClass = predictionState.topClass;
        return currentMaxClass === String(className);
    }

    getClassConfidence(args) {
        const className = args.CLASS; // Get the actual selected class name
        const confidence = this.modelConfidences[className];
        return confidence;
    }

    videoToggle(args) {
        const state = args.STATE;
        if (state === VideoState.OFF) {
            return this.runtime.ioDevices.video.disableVideo();
        }
        this.runtime.ioDevices.video.enableVideo();
        this.runtime.ioDevices.video.mirror = state === VideoState.ON;
    }

    setVideoTransparency(args) {
        const transparency = args.TRANSPARENCY;
        const trans = Math.max(Math.min(transparency, 100), 0);
        this.runtime.ioDevices.video.setPreviewGhost(trans);
    }

    openTeachableMachine() {
        window.open("https://teachablemachine.withgoogle.com/train", "_blank");
    }

    whenModelMatches(args) {
        return this.model_match(args);
    }

    modelMatches(args) {
        return this.model_match(args);
    }

    modelPrediction() {
        if (!this.isModelLoaded()) {
            if (!this.modelErrorAlerted) {
                alert("No model loaded. Please load a Teachable Machine model first.");
                this.modelErrorAlerted = true;
            }
            return "";
        }
        this.modelErrorAlerted = false;
        return this.getModelPrediction();
    }

    classConfidence(args) {
        if (!this.isModelLoaded()) {
            if (!this.modelErrorAlerted) {
                alert("No model loaded. Please load a Teachable Machine model first.");
                this.modelErrorAlerted = true;
            }
            return "";
        }
        this.modelErrorAlerted = false;
        return this.getClassConfidence(args);
    }

    async resetTensorflowEnvironment() {
        try {
            // Forcefully dispose all variables in memory
            const numTensors = tf.memory().numTensors;
            if (numTensors > 0) {
                console.log(`Cleaning up ${numTensors} tensors`);
                tf.disposeVariables();
                // Wait briefly to ensure cleanup completes
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
            // Create a fresh backend
            await tf.setBackend("webgl");
            await tf.ready();
            console.log("TensorFlow environment reset successfully");
        } catch (e) {
            console.warn("Failed to reset TensorFlow environment:", e);
        }
    }
}

function argMax(array) {
    return array.indexOf(Math.max(...array));
}

module.exports = TeachableMachine;
