/* eslint-disable */
const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const formatMessage = require("format-message");
const Cast = require("../../util/cast");
const tf = require("@tensorflow/tfjs");
const posenet = require("@tensorflow-models/posenet");

/**
 * Icon svg to be displayed at left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjMEZCRDhDIi8+PGcgZmlsbD0iI2ZmZiIgc3Ryb2tlPSJub25lIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjEwIiByPSI0Ii8+PHJlY3QgeD0iMTgiIHk9IjE0IiB3aWR0aD0iNCIgaGVpZ2h0PSIxMiIvPjxyZWN0IHg9IjEyIiB5PSIxOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjQiLz48cmVjdCB4PSIxMiIgeT0iMjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iMjQiIHk9IjIyIiB3aWR0aD0iNCIgaGVpZ2h0PSIxMCIvPjwvZz48L3N2Zz4=";

/**
 * Enum for video state values.
 * @readonly
 * @enum {string}
 */
const VideoState = {
    OFF: "off",
    ON: "on",
    ON_FLIPPED: "on-flipped",
};

/**
 * Class for the body pose detection blocks.
 * @constructor
 */
class Scratch3PoseBodyBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The current video state.
         * @type {string}
         */
        this.globalVideoState = VideoState.ON;

        /**
         * The current video transparency.
         * @type {number}
         */
        this.globalVideoTransparency = 50;

        /**
         * The pose detection model.
         * @type {object}
         */
        this.bodyModel = null;

        /**
         * The current pose state.
         * @type {object}
         */
        this.poseState = null;

        /**
         * Dimensions of the video frame
         */
        this.DIMENSIONS = [480, 360];

        tf.ready().then(() => {
            tf.setBackend("webgl").then(() => {
                console.log(
                    "WebGL backend initialized for PoseBody:",
                    tf.getBackend()
                );
            });
        });

        if (this.runtime.ioDevices) {
            this._loop();
        }

        // Initialize default settings
        this.projectStarted();
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: "posebody",
            name: formatMessage({
                id: "posebody.categoryName",
                default: "Body Sensing",
                description:
                    "Label for the body pose detection extension category",
            }),
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "goToPart",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "posebody.goToPart",
                        default: "go to [PART]",
                        description: "Go to the specified body part",
                    }),
                    arguments: {
                        PART: {
                            type: ArgumentType.STRING,
                            menu: "bodyParts",
                            defaultValue: "nose",
                        },
                    },
                },
                {
                    opcode: "videoToggle",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "posebody.videoToggle",
                        default: "turn video [VIDEO_STATE]",
                        description:
                            "Controls display of the video preview layer",
                    }),
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: "videoMenu",
                            defaultValue: VideoState.ON,
                        },
                    },
                },
                {
                    opcode: "setVideoTransparency",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "posebody.setVideoTransparency",
                        default: "set video transparency to [TRANSPARENCY]",
                        description:
                            "Controls transparency of the video preview layer",
                    }),
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50,
                        },
                    },
                },
            ],
            menus: {
                bodyParts: {
                    acceptReporters: true,
                    items: [
                        { text: "nose", value: "nose" },
                        { text: "left eye", value: "leftEye" },
                        { text: "right eye", value: "rightEye" },
                        { text: "left ear", value: "leftEar" },
                        { text: "right ear", value: "rightEar" },
                        { text: "left shoulder", value: "leftShoulder" },
                        { text: "right shoulder", value: "rightShoulder" },
                        { text: "left elbow", value: "leftElbow" },
                        { text: "right elbow", value: "rightElbow" },
                        { text: "left wrist", value: "leftWrist" },
                        { text: "right wrist", value: "rightWrist" },
                        { text: "left hip", value: "leftHip" },
                        { text: "right hip", value: "rightHip" },
                        { text: "left knee", value: "leftKnee" },
                        { text: "right knee", value: "rightKnee" },
                        { text: "left ankle", value: "leftAnkle" },
                        { text: "right ankle", value: "rightAnkle" },
                    ],
                },
                videoMenu: {
                    acceptReporters: true,
                    items: [
                        { text: "off", value: VideoState.OFF },
                        { text: "on", value: VideoState.ON },
                        { text: "on flipped", value: VideoState.ON_FLIPPED },
                    ],
                },
            },
        };
    }

    /**
     * Converts pose coordinates to Scratch coordinates.
     * @param {object} pose - The pose point to convert.
     * @returns {object} The converted coordinates.
     */
    _convertCoords({ x, y }) {
        return {
            x: x - 250,
            y: 200 - y,
        };
    }

    /**
     * Check if a pose is detected.
     * @returns {boolean} True if a pose is detected.
     */
    _hasPose() {
        return (
            this.poseState &&
            this.poseState.keypoints &&
            this.poseState.score > 0.01
        );
    }

    /**
     * Initialize the model and start the detection loop.
     */
    // ... existing code ...
    async _loop() {
        // Load PoseNet model if not loaded
        if (!this.bodyModel) {
            try {
                // Make sure TF is ready
                await tf.ready();

                // Try to set WebGL backend if not already
                if (tf.getBackend() !== "webgl") {
                    await tf.setBackend("webgl");
                }
                console.log("TensorFlow.js backend:", tf.getBackend());

                // Now load PoseNet
                this.bodyModel = await posenet.load();
                console.log("PoseNet model loaded successfully");
            } catch (err) {
                console.error("Error loading PoseNet:", err);
                // Wait a bit before trying again
                await new Promise((r) => setTimeout(r, 1000));
                return; // Exit the loop iteration and try again next time
            }
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: "image-data",
                dimensions: this.DIMENSIONS,
            });

            if (frame) {
                console.log("Got video frame");
                try {
                    // Check if model is loaded before using it
                    if (this.bodyModel) {
                        this.poseState =
                            await this.bodyModel.estimateSinglePose(frame, {
                                flipHorizontal: false,
                            });
                        console.log("Pose detected:", this.poseState);
                    } else {
                        console.warn("PoseNet model not loaded yet");
                    }
                } catch (err) {
                    console.error("Error detecting pose:", err);
                }
            }

            await new Promise((r) => setTimeout(r, 100));
        }
    }

    /**
     * Initialize extension state.
     */
    projectStarted() {
        this.setVideoTransparency(this.globalVideoTransparency);
        this.videoToggle({ VIDEO_STATE: this.globalVideoState });
    }

    /**
     * Block to go to a body part.
     * @param {object} args - The block's arguments.
     * @param {object} util - The block utility object.
     */
    goToPart(args, util) {
        if (!this._hasPose()) {
            console.log("No pose detected");
            return;
        }

        const part = this.poseState.keypoints.find(
            (point) => point.part === args.PART
        );
        if (!part) {
            console.log("Part not found:", args.PART);
            return;
        }

        console.log("Found part:", part.part, "at position:", part.position);

        // Get stage dimensions
        const stageWidth = this.runtime.constructor.STAGE_WIDTH;
        const stageHeight = this.runtime.constructor.STAGE_HEIGHT;

        // Convert coordinates from PoseNet space (0-480, 0-360) to Scratch space (-240 to 240, -180 to 180)
        const scratchX =
            (part.position.x / this.DIMENSIONS[0]) * stageWidth -
            stageWidth / 2;
        const scratchY =
            (1 - part.position.y / this.DIMENSIONS[1]) * stageHeight -
            stageHeight / 2;

        console.log("Converting to Scratch coordinates:", {
            scratchX,
            scratchY,
        });

        // Keep sprite within stage bounds
        const fencedPosition = util.target.keepInFence(scratchX, scratchY);

        // Set the position
        util.target.setXY(fencedPosition[0], fencedPosition[1]);
    }

    /**
     * Block to toggle video state.
     * @param {object} args - The block's arguments.
     */
    videoToggle(args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;

        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            // First request camera access
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(() => {
                    this.runtime.ioDevices.video.enableVideo();
                    this.runtime.ioDevices.video.mirror =
                        state === VideoState.ON;
                })
                .catch((err) => {
                    console.error("Error accessing camera:", err);
                });
        }
    }

    /**
     * Block to set video transparency.
     * @param {object} args - The block's arguments.
     */
    setVideoTransparency(args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
}

module.exports = Scratch3PoseBodyBlocks;
