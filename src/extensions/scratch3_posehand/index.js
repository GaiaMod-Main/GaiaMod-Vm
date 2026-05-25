/* eslint-disable */
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const formatMessage = require('format-message');
const Cast = require('../../util/cast');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjRjE1QTgzIi8+PC9zdmc+';

const VideoState = {
    OFF: 'off',
    ON: 'on',
    ON_FLIPPED: 'on-flipped'
};

class Scratch3PoseHandBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.globalVideoState = VideoState.ON;
        this.globalVideoTransparency = 50;
        this.handModel = null;
        this.handPoseState = null;
        this.DIMENSIONS = [480, 360];

        this.fingerParts = [
            { text: "thumb", value: "thumb" },
            { text: "index finger", value: "indexFinger" },
            { text: "middle finger", value: "middleFinger" },
            { text: "ring finger", value: "ringFinger" },
            { text: "pinky", value: "pinky" }
        ];

        this.fingerSubParts = [
            { text: "base", value: 0 },
            { text: "first knuckle", value: 1 },
            { text: "second knuckle", value: 2 },
            { text: "tip", value: 3 }
        ];

        if (this.runtime.ioDevices) {
            this._loop();
        }
        this.projectStarted();
    }

    getInfo() {
        return {
            id: 'posehand',
            name: 'Hand Sensing',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'goToHandPart',
                    text: 'go to [HAND_PART] [HAND_SUB_PART]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        HAND_PART: {
                            type: ArgumentType.STRING,
                            menu: 'HAND_PART',
                            defaultValue: 'thumb'
                        },
                        HAND_SUB_PART: {
                            type: ArgumentType.NUMBER,
                            menu: 'HAND_SUB_PART',
                            defaultValue: 3
                        }
                    }
                },
                {
                    opcode: 'videoToggle',
                    text: 'turn video [VIDEO_STATE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'VIDEO_STATE',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'setVideoTransparency',
                    text: 'set video transparency to [TRANSPARENCY]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                }
            ],
            menus: {
                HAND_PART: {
                    acceptReporters: true,
                    items: this.fingerParts
                },
                HAND_SUB_PART: {
                    acceptReporters: true,
                    items: this.fingerSubParts
                },
                VIDEO_STATE: {
                    acceptReporters: true,
                    items: [
                        { text: "off", value: VideoState.OFF },
                        { text: "on", value: VideoState.ON },
                        { text: "on flipped", value: VideoState.ON_FLIPPED }
                    ]
                }
            }
        };
    }

    async _loop() {
        while (true) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: 'image-data',
                dimensions: this.DIMENSIONS
            });
    
            if (frame) {
                try {
                    this.handPoseState = await this._estimateHandPoseOnImage(frame);
                } catch (err) {
                    // Only log errors that are not about 'util'
                    if (!String(err).includes("util")) {
                        console.error("Error detecting hand:", err);
                    }
                }
            }
            await new Promise(r => setTimeout(r, 100));
        }
    }

    async _estimateHandPoseOnImage(imageElement) {
        const handModel = await this._getLoadedHandModel();
        return await handModel.estimateHands(imageElement, { flipHorizontal: false });
    }

    async _getLoadedHandModel() {
        if (this.handModel) return this.handModel;
        if (!window.handpose) {
            await this._loadHandposeScript();
        }
        this.handModel = await window.handpose.load();
        return this.handModel;
    }

    _loadHandposeScript() {
        return new Promise((resolve, reject) => {
            // Load tfjs if not present
            const loadTf = () => {
                if (window.tf) return Promise.resolve();
                return new Promise((res, rej) => {
                    const tfScript = document.createElement('script');
                    tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
                    tfScript.onload = res;
                    tfScript.onerror = rej;
                    document.head.appendChild(tfScript);
                });
            };
    
            // Load handpose if not present
            const loadHandpose = () => {
                if (window.handpose) return Promise.resolve();
                return new Promise((res, rej) => {
                    const handposeScript = document.createElement('script');
                    handposeScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose';
                    handposeScript.onload = res;
                    handposeScript.onerror = rej;
                    document.head.appendChild(handposeScript);
                });
            };
    
            loadTf()
                .then(loadHandpose)
                .then(resolve)
                .catch(reject);
        });
    }

    _tfCoordsToScratch({ x, y, z }) {
        // These values are based on PRG-RAISE's mapping
        return { x: x - 250, y: 200 - y };
    }

    goToHandPart(args, util) {
        if (!util || !util.target) return;
        if (!this.isConnected()) return;
        const handPart = args.HAND_PART;
        const fingerPart = Cast.toNumber(args.HAND_SUB_PART);
    
        try {
            const [x, y, z] = this.handPoseState[0].annotations[handPart][fingerPart];
    
            // Get stage dimensions
            const stageWidth = this.runtime.constructor.STAGE_WIDTH;
            const stageHeight = this.runtime.constructor.STAGE_HEIGHT;
    
            // Convert coordinates from video space (0-480, 0-360) to Scratch space (-240 to 240, -180 to 180)
            const scratchX = (x / this.DIMENSIONS[0]) * stageWidth - stageWidth / 2;
            const scratchY = (1 - y / this.DIMENSIONS[1]) * stageHeight - stageHeight / 2;
    
            // Keep sprite within stage bounds
            const fencedPosition = util.target.keepInFence(scratchX, scratchY);
    
            // Set the position
            util.target.setXY(fencedPosition[0], fencedPosition[1]);
        } catch (e) {
            // If hand or part not detected, do nothing
        }
    }

    videoToggle(args) {
        const state = Cast.toString(args.VIDEO_STATE);
        this.globalVideoState = state;

        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            this.runtime.ioDevices.video.mirror = (state === VideoState.ON);
        }
    }

    setVideoTransparency(args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = Math.max(0, Math.min(100, transparency));
        this.runtime.ioDevices.video.setPreviewGhost(this.globalVideoTransparency);
    }

    isConnected() {
        return !!this.handPoseState && this.handPoseState.length > 0;
    }

    projectStarted() {
        this.setVideoTransparency({ TRANSPARENCY: this.globalVideoTransparency });
        this.videoToggle({ VIDEO_STATE: this.globalVideoState });
    }
}

module.exports = Scratch3PoseHandBlocks;