/* eslint-disable */
const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const Cast = require("../../util/cast");

const blockIconURI = "";

const COCO_CATEGORIES = [
    { text: "person", value: "person" },
    { text: "bicycle", value: "bicycle" },
    { text: "car", value: "car" },
    { text: "motorcycle", value: "motorcycle" },
    { text: "airplane", value: "airplane" },
    { text: "bus", value: "bus" },
    { text: "train", value: "train" },
    { text: "truck", value: "truck" },
    { text: "boat", value: "boat" },
    { text: "traffic light", value: "traffic light" },
    { text: "fire hydrant", value: "fire hydrant" },
    { text: "stop sign", value: "stop sign" },
    { text: "parking meter", value: "parking meter" },
    { text: "bench", value: "bench" },
    { text: "bird", value: "bird" },
    { text: "cat", value: "cat" },
    { text: "dog", value: "dog" },
    { text: "horse", value: "horse" },
    { text: "sheep", value: "sheep" },
    { text: "cow", value: "cow" },
    { text: "elephant", value: "elephant" },
    { text: "bear", value: "bear" },
    { text: "zebra", value: "zebra" },
    { text: "giraffe", value: "giraffe" },
    { text: "backpack", value: "backpack" },
    { text: "umbrella", value: "umbrella" },
    { text: "handbag", value: "handbag" },
    { text: "tie", value: "tie" },
    { text: "suitcase", value: "suitcase" },
    { text: "frisbee", value: "frisbee" },
    { text: "skis", value: "skis" },
    { text: "snowboard", value: "snowboard" },
    { text: "sports ball", value: "sports ball" },
    { text: "kite", value: "kite" },
    { text: "baseball bat", value: "baseball bat" },
    { text: "baseball glove", value: "baseball glove" },
    { text: "skateboard", value: "skateboard" },
    { text: "surfboard", value: "surfboard" },
    { text: "tennis racket", value: "tennis racket" },
    { text: "bottle", value: "bottle" },
    { text: "wine glass", value: "wine glass" },
    { text: "cup", value: "cup" },
    { text: "fork", value: "fork" },
    { text: "knife", value: "knife" },
    { text: "spoon", value: "spoon" },
    { text: "bowl", value: "bowl" },
    { text: "banana", value: "banana" },
    { text: "apple", value: "apple" },
    { text: "sandwich", value: "sandwich" },
    { text: "orange", value: "orange" },
    { text: "broccoli", value: "broccoli" },
    { text: "carrot", value: "carrot" },
    { text: "hot dog", value: "hot dog" },
    { text: "pizza", value: "pizza" },
    { text: "donut", value: "donut" },
    { text: "cake", value: "cake" },
    { text: "chair", value: "chair" },
    { text: "couch", value: "couch" },
    { text: "potted plant", value: "potted plant" },
    { text: "bed", value: "bed" },
    { text: "dining table", value: "dining table" },
    { text: "toilet", value: "toilet" },
    { text: "TV", value: "TV" },
    { text: "laptop", value: "laptop" },
    { text: "mouse", value: "mouse" },
    { text: "remote", value: "remote" },
    { text: "keyboard", value: "keyboard" },
    { text: "cell phone", value: "cell phone" },
    { text: "microwave", value: "microwave" },
    { text: "oven", value: "oven" },
    { text: "toaster", value: "toaster" },
    { text: "sink", value: "sink" },
    { text: "refrigerator", value: "refrigerator" },
    { text: "book", value: "book" },
    { text: "clock", value: "clock" },
    { text: "vase", value: "vase" },
    { text: "scissors", value: "scissors" },
    { text: "teddy bear", value: "teddy bear" },
    { text: "hair drier", value: "hair drier" },
    { text: "toothbrush", value: "toothbrush" },
];


class Scratch3ObjectDetectionBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.DIMENSIONS = [480, 360];
        this.detector = null;
        this.detections = [];
        this.continuous = false;
        this.processFreq = 1000; // ms
        this.color = "#ffffff";
        this.thickness = 5;
        this._canvas = null;
        this._ctx = null;
        this._setupCanvas();
        this._enableVideo();
    }

    getInfo() {
        return {
            id: "objectdetection",
            name: "Object Detection",
            blockIconURI: blockIconURI,
            blocks: [
                // --- Video blocks at the top ---
                {
                    opcode: "videoToggle",
                    text: "turn video [VIDEO_STATE]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: "VIDEO_STATE",
                            defaultValue: "on"
                        }
                    }
                },
                {
                    opcode: "setVideoTransparency",
                    text: "set video transparency to [TRANSPARENCY]%",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                // --- Existing object detection blocks ---
                {
                    opcode: "setFrameRate",
                    text: "set detection rate to [FPS] fps",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FPS: { type: ArgumentType.NUMBER, defaultValue: 10 },
                    },
                },
                {
                    opcode: "setBoxColor",
                    text: "set box color to [COLOR]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            defaultValue: "#ffffff",
                        },
                    },
                },
                {
                    opcode: "setBoxThickness",
                    text: "set box thickness to [THICKNESS]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        THICKNESS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5,
                        },
                    },
                },
                {
                    opcode: "detectObjectForTime",
                    text: "detect objects for [SECONDS] seconds",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SECONDS: { type: ArgumentType.NUMBER, defaultValue: 1 },
                    },
                },
                {
                    opcode: "getBoundingBox",
                    text: "get [DIMENSION] of [INDEX] object",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DIMENSION: {
                            type: ArgumentType.STRING,
                            menu: "DIMENSION",
                            defaultValue: "x",
                        },
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                    },
                },
                {
                    opcode: "isCategoryDetected",
                    text: "is [CATEGORY] detected?",
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        CATEGORY: {
                            type: ArgumentType.STRING,
                            menu: "COCO_CATEGORIES",
                            defaultValue: "person",
                        },
                    },
                },
                {
                    opcode: "toggleContinuousDetection",
                    text: "continuous detection [STATE]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            menu: "ON_OFF",
                            defaultValue: "on"
                        },
                    },
                },
                {
                    opcode: "distanceToCategory",
                    text: "distance from [CATEGORY] to x: [X] y: [Y]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CATEGORY: {
                            type: ArgumentType.STRING,
                            menu: "COCO_CATEGORIES",
                            defaultValue: "person",
                        },
                        X: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                    },
                },
                {
                    opcode: "distanceBetweenCategory",
                    text: "distance from [CATEGORY1] to [CATEGORY2]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CATEGORY1: {
                            type: ArgumentType.STRING,
                            menu: "COCO_CATEGORIES",
                            defaultValue: "person",
                        },
                        CATEGORY2: {
                            type: ArgumentType.STRING,
                            menu: "COCO_CATEGORIES",
                            defaultValue: "cat",
                        },
                    },
                },
                {
                    opcode: "angleBetweenCategory",
                    text: "angle from [CATEGORY1] to [CATEGORY2]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CATEGORY1: {
                            type: ArgumentType.STRING,
                            menu: "COCO_CATEGORIES",
                            defaultValue: "person",
                        },
                        CATEGORY2: {
                            type: ArgumentType.STRING,
                            menu: "COCO_CATEGORIES",
                            defaultValue: "cat",
                        },
                    },
                },
                {
                    opcode: "angleToCategory",
                    text: "angle from [CATEGORY] to x: [X] y: [Y]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CATEGORY: {
                            type: ArgumentType.STRING,
                            menu: "COCO_CATEGORIES",
                            defaultValue: "person",
                        },
                        X: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                    },
                },
                {
                    opcode: "distanceToIndex",
                    text: "distance from box [INDEX] to x: [X] y: [Y]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INDEX: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        X: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                    },
                },
                {
                    opcode: "angleToIndex",
                    text: "angle from box [INDEX] to x: [X] y: [Y]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INDEX: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        X: { type: ArgumentType.NUMBER, defaultValue: 0 },
                        Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
                    },
                },
            ],
            menus: {
                VIDEO_STATE: {
                    acceptReporters: true,
                    items: [
                        { text: "on", value: "on" },
                        { text: "off", value: "off" }
                    ]
                },
                DIMENSION: {
                    acceptReporters: true,
                    items: [
                        { text: "x", value: "x" },
                        { text: "y", value: "y" },
                        { text: "width", value: "width" },
                        { text: "height", value: "height" },
                    ],
                },
                COCO_CATEGORIES: {
                    acceptReporters: true,
                    items: COCO_CATEGORIES,
                },
                ON_OFF: {
                    acceptReporters: true,
                    items: [
                        { text: "on", value: "on" },
                        { text: "off", value: "off" }
                    ]
                },
            },
        };
    }

    // --- Video blocks implementation ---
    videoToggle(args) {
        if (!this.runtime.ioDevices || !this.runtime.ioDevices.video) return;
        if (args.VIDEO_STATE === "on") {
            this.runtime.ioDevices.video.enableVideo();
        } else {
            this.runtime.ioDevices.video.disableVideo();
        }
    }

    setVideoTransparency(args) {
        if (!this.runtime.ioDevices || !this.runtime.ioDevices.video) return;
        let transparency = Cast.toNumber(args.TRANSPARENCY);
        transparency = Math.max(0, Math.min(100, transparency));
        this.runtime.ioDevices.video.setVideoTransparency(transparency);
    }

    _enableVideo() {
        if (this.runtime.ioDevices && this.runtime.ioDevices.video) {
            this.runtime.ioDevices.video.enableVideo();
        }
    }

    _setupCanvas() {
        if (!this._canvas) {
            this._canvas = document.createElement("canvas");
            this._canvas.width = this.DIMENSIONS[0];
            this._canvas.height = this.DIMENSIONS[1];
            this._canvas.style.position = "absolute";
            this._canvas.style.top = "-9999px";
            document.body.appendChild(this._canvas);
            this._ctx = this._canvas.getContext("2d");
        }
    }

    // --- COCO-SSD Model Loader ---
    async _loadModel() {
        if (this.detector) return this.detector;
        // Load TensorFlow.js and COCO-SSD if not already loaded
        await new Promise((resolve, reject) => {
            if (window.cocoSsd && window.tf) return resolve();
            const tfScript = document.createElement('script');
            tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js';
            tfScript.onload = () => {
                const cocoScript = document.createElement('script');
                cocoScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js';
                cocoScript.onload = resolve;
                cocoScript.onerror = reject;
                document.head.appendChild(cocoScript);
            };
            tfScript.onerror = reject;
            document.head.appendChild(tfScript);
        });
        this.detector = await window.cocoSsd.load();
        return this.detector;
    }

    setFrameRate(args) {
        const fps = Cast.toNumber(args.FPS);
        this.processFreq = 1000 / Math.max(1, fps);
    }

    setBoxColor(args) {
        this.color = args.COLOR || "#ffffff";
    }

    setBoxThickness(args) {
        this.thickness = Cast.toNumber(args.THICKNESS);
    }

    async detectObjectForTime(args) {
        const seconds = Cast.toNumber(args.SECONDS);
        const end = Date.now() + seconds * 1000;
        while (Date.now() < end) {
            await this.detectObject();
            await new Promise((r) => setTimeout(r, this.processFreq));
        }
        this._clearCanvas();
    }

    async detectObject() {
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        this.detections = predictions;
        this._drawBoxes(this.detections);
    }

    // Helper: Run detection on ImageData using COCO-SSD
    async _detectOnFrame(detector, frame) {
        // Convert ImageData to Canvas
        const canvas = document.createElement('canvas');
        canvas.width = frame.width;
        canvas.height = frame.height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(frame, 0, 0);
        // Run detection
        return await detector.detect(canvas);
    }

    _drawBoxes(detections) {
        if (!this._ctx) return;
        this._ctx.clearRect(0, 0, this.DIMENSIONS[0], this.DIMENSIONS[1]);
        this._ctx.save();
        this._ctx.strokeStyle = this.color;
        this._ctx.lineWidth = this.thickness;
        for (const det of detections) {
            const [x, y, width, height] = det.bbox;
            this._ctx.strokeRect(x, y, width, height);
            if (det.class) {
                this._ctx.fillStyle = this.color;
                this._ctx.font = "12px Arial";
                this._ctx.fillText(
                    det.class,
                    x,
                    y - 2
                );
            }
        }
        this._ctx.restore();
    }

    _clearCanvas() {
        if (this._ctx) {
            this._ctx.clearRect(0, 0, this.DIMENSIONS[0], this.DIMENSIONS[1]);
        }
    }

    // --- All reporter/boolean blocks now run detection on the current frame ---

    async getBoundingBox(args) {
        const index = Cast.toNumber(args.INDEX);
        const dim = args.DIMENSION;
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return 0;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        if (!predictions || index >= predictions.length) return 0;
        const bbox = predictions[index].bbox;
        if (dim === "x") return bbox[0];
        if (dim === "y") return bbox[1];
        if (dim === "width") return bbox[2];
        if (dim === "height") return bbox[3];
        return 0;
    }

    async isCategoryDetected(args) {
        const category = args.CATEGORY;
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return false;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        return (predictions || []).some(
            (det) => det.class && det.class.toLowerCase() === category.toLowerCase()
        );
    }

    toggleContinuousDetection(args) {
        this.continuous = args.STATE === "on";
        if (this.continuous) {
            this._continuousLoop();
        }
    }

    async _continuousLoop() {
        while (this.continuous) {
            await this.detectObject();
            await new Promise((r) => setTimeout(r, this.processFreq));
        }
        this._clearCanvas();
    }

    // Helper: get center of a detection box
    _getBoxCenter(bbox) {
        return {
            x: bbox[0] + bbox[2] / 2,
            y: bbox[1] + bbox[3] / 2,
        };
    }

    // Helper: Euclidean distance
    _distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    // Helper: Angle in degrees
    _angle(x1, y1, x2, y2) {
        let angleRad = Math.atan2(y2 - y1, x2 - x1);
        let angleDeg = angleRad * (180 / Math.PI);
        angleDeg = (angleDeg + 360) % 360;
        return angleDeg;
    }

    async distanceToCategory(args) {
        const category = args.CATEGORY;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return 0;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        let bbox = null;
        for (let i = 0; i < (predictions || []).length; i++) {
            if (
                predictions[i].class &&
                predictions[i].class.toLowerCase() === category.toLowerCase()
            ) {
                bbox = predictions[i].bbox;
            }
        }
        if (bbox) {
            const center = this._getBoxCenter(bbox);
            return this._distance(center.x, center.y, x, y);
        }
        return 0;
    }

    async distanceBetweenCategory(args) {
        const category1 = args.CATEGORY1;
        const category2 = args.CATEGORY2;
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return 0;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        let bbox1 = null,
            bbox2 = null;
        for (let i = 0; i < (predictions || []).length; i++) {
            if (
                predictions[i].class &&
                predictions[i].class.toLowerCase() === category1.toLowerCase()
            ) {
                bbox1 = predictions[i].bbox;
            }
            if (
                predictions[i].class &&
                predictions[i].class.toLowerCase() === category2.toLowerCase()
            ) {
                bbox2 = predictions[i].bbox;
            }
        }
        if (bbox1 && bbox2) {
            const c1 = this._getBoxCenter(bbox1);
            const c2 = this._getBoxCenter(bbox2);
            return this._distance(c1.x, c1.y, c2.x, c2.y);
        }
        return 0;
    }

    async angleBetweenCategory(args) {
        const category1 = args.CATEGORY1;
        const category2 = args.CATEGORY2;
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return 0;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        let bbox1 = null,
            bbox2 = null;
        for (let i = 0; i < (predictions || []).length; i++) {
            if (
                predictions[i].class &&
                predictions[i].class.toLowerCase() === category1.toLowerCase()
            ) {
                bbox1 = predictions[i].bbox;
            }
            if (
                predictions[i].class &&
                predictions[i].class.toLowerCase() === category2.toLowerCase()
            ) {
                bbox2 = predictions[i].bbox;
            }
        }
        if (bbox1 && bbox2) {
            const c1 = this._getBoxCenter(bbox1);
            const c2 = this._getBoxCenter(bbox2);
            return this._angle(c1.x, c1.y, c2.x, c2.y);
        }
        return 0;
    }

    async angleToCategory(args) {
        const category = args.CATEGORY;
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return 0;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        let bbox = null;
        for (let i = 0; i < (predictions || []).length; i++) {
            if (
                predictions[i].class &&
                predictions[i].class.toLowerCase() === category.toLowerCase()
            ) {
                bbox = predictions[i].bbox;
            }
        }
        if (bbox) {
            const center = this._getBoxCenter(bbox);
            return this._angle(center.x, center.y, x, y);
        }
        return 0;
    }

    async distanceToIndex(args) {
        const index = Cast.toNumber(args.INDEX);
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return 0;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        if (!predictions || index >= predictions.length) return 0;
        const bbox = predictions[index].bbox;
        const center = this._getBoxCenter(bbox);
        return this._distance(center.x, center.y, x, y);
    }

    async angleToIndex(args) {
        const index = Cast.toNumber(args.INDEX);
        const x = Cast.toNumber(args.X);
        const y = Cast.toNumber(args.Y);
        const frame = this.runtime.ioDevices.video.getFrame({
            format: "image-data",
            dimensions: this.DIMENSIONS,
        });
        if (!frame) return 0;
        const detector = await this._loadModel();
        const predictions = await this._detectOnFrame(detector, frame);
        if (!predictions || index >= predictions.length) return 0;
        const bbox = predictions[index].bbox;
        const center = this._getBoxCenter(bbox);
        return this._angle(center.x, center.y, x, y);
    }
}

module.exports = Scratch3ObjectDetectionBlocks;
