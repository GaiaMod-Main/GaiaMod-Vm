/* eslint-disable */
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const formatMessage = require('format-message');
const Cast = require('../../util/cast');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBkPSJNNTAgMTBDMjcuOTEgMTAgMTAgMjcuOTEgMTAgNTBzMTcuOTEgNDAgNDAgNDAgNDAtMTcuOTEgNDAtNDBTNzIuMDkgMTAgNTAgMTB6bTAgNzBjLTE2LjU0IDAtMzAtMTMuNDYtMzAtMzBzMTMuNDYtMzAgMzAtMzAgMzAgMTMuNDYgMzAgMzAtMTMuNDYgMzAtMzAgMzB6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTM1IDQwYzAgMi43NiAyLjI0IDUgNSA1czUtMi4yNCA1LTUtMi4yNC01LTUtNS01IDIuMjQgNSA1em0yMCAwYzAgMi43NiAyLjI0IDUgNSA1czUtMi4yNCA1LTUtMi4yNC01LTUtNS01IDIuMjQgNSA1em0tMTAgMTVjLTUuNTIgMC0xMCA0LjQ4LTEwIDEwaDIwYzAtNS41Mi00LjQ4LTEwLTEwLTEweiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==';

const VideoState = {
    OFF: 'off',
    ON: 'on',
    ON_FLIPPED: 'on-flipped'
};

class Scratch3PoseFaceBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.globalVideoState = VideoState.ON;
        this.globalVideoTransparency = 50;
        this.affdexDetector = null;
        this.affdexState = null;
        this.DIMENSIONS = [480, 360];

        // Initialize expressions and emotions
        this.expressions = [
            { text: "smile", value: "smile" },
            { text: "mouth open", value: "mouthOpen" },
            { text: "eye closure", value: "eyeClosure" },
            { text: "eyebrow raise", value: "browRaise" },
            { text: "whistling", value: "lipPucker" },
            { text: "eye widening", value: "eyeWiden" },
            { text: "eyebrow furrow", value: "browFurrow" },
            { text: "nose wrinkle", value: "noseWrinkle" },
            { text: "upper lip raise", value: "upperLipRaise" },
            { text: "lip corner pull", value: "lipCornerDepressor" },
            { text: "chin raise", value: "chinRaise" },
            { text: "smirk", value: "smirk" },
            { text: "attention", value: "attention" },
            { text: "eyelid tighten", value: "lidTighten" },
            { text: "jaw drop", value: "jawDrop" },
            { text: "cheek dimple", value: "dimpler" },
            { text: "cheek raise", value: "cheekRaise" },
            { text: "lip stretch", value: "lipStretch" }
        ];

        this.emotions = [
            { text: "joyful", value: "joy" },
            { text: "sad", value: "sadness" },
            { text: "disgusted", value: "disgust" },
            { text: "angry", value: "anger" },
            { text: "fearful", value: "fear" }
        ];

        this.all_emotions = [
            { text: "joy", value: "joy" },
            { text: "sadness", value: "sadness" },
            { text: "disgust", value: "disgust" },
            { text: "contempt", value: "contempt" },
            { text: "anger", value: "anger" },
            { text: "fear", value: "fear" },
            { text: "surprise", value: "surprise" },
            { text: "valence", value: "valence" },
            { text: "engagement", value: "engagement" }
        ];

        if (this.runtime.ioDevices) {
            this._loop();
        }
        this.projectStarted();
    }

    getInfo() {
        return {
            id: 'poseFace',
            name: 'Face Sensing',
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'affdexGoToPart',
                    text: 'go to [AFFDEX_POINT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        AFFDEX_POINT: {
                            type: ArgumentType.STRING,
                            menu: 'AFFDEX_POINT',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'affdexWhenExpression',
                    text: 'when [EXPRESSION] detected',
                    blockType: BlockType.HAT,
                    arguments: {
                        EXPRESSION: {
                            type: ArgumentType.STRING,
                            menu: 'EXPRESSION',
                            defaultValue: 'smile'
                        }
                    }
                },
                {
                    opcode: 'affdexExpressionAmount',
                    text: 'amount of [EXPRESSION]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        EXPRESSION: {
                            type: ArgumentType.STRING,
                            menu: 'EXPRESSION',
                            defaultValue: 'smile'
                        }
                    }
                },
                {
                    opcode: 'affdexIsExpression',
                    text: 'expressing [EXPRESSION]',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        EXPRESSION: {
                            type: ArgumentType.STRING,
                            menu: 'EXPRESSION',
                            defaultValue: 'smile'
                        }
                    }
                },
                {
                    opcode: 'affdexWhenEmotion',
                    text: 'when [EMOTION] feeling detected',
                    blockType: BlockType.HAT,
                    arguments: {
                        EMOTION: {
                            type: ArgumentType.STRING,
                            menu: 'EMOTION',
                            defaultValue: 'joy'
                        }
                    }
                },
                {
                    opcode: 'affdexEmotionAmount',
                    text: 'level of [EMOTION_ALL]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        EMOTION_ALL: {
                            type: ArgumentType.STRING,
                            menu: 'EMOTION_ALL',
                            defaultValue: 'joy'
                        }
                    }
                },
                {
                    opcode: 'affdexIsTopEmotion',
                    text: 'feeling [EMOTION]',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        EMOTION: {
                            type: ArgumentType.STRING,
                            menu: 'EMOTION',
                            defaultValue: 'joy'
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
                AFFDEX_POINT: {
                    acceptReporters: false,
                    items: [
                        { text: "left ear", value: "0" },
                        { text: "left chin", value: "1" },
                        { text: "chin", value: "2" },
                        { text: "right chin", value: "3" },
                        { text: "right ear", value: "4" },
                        { text: "left outer eyebrow", value: "5" },
                        { text: "left eyebrow", value: "6" },
                        { text: "left inner eyebrow", value: "7" },
                        { text: "right inner eyebrow", value: "8" },
                        { text: "right eyebrow", value: "9" },
                        { text: "right outer eyebrow", value: "10" },
                        { text: "nose bridge", value: "11" },
                        { text: "nose tip", value: "12" },
                        { text: "left nostril", value: "13" },
                        { text: "nose tip", value: "14" },
                        { text: "right nostril", value: "15" },
                        { text: "left outer eye crease", value: "16" },
                        { text: "left inner eye crease", value: "17" },
                        { text: "right inner eye crease", value: "18" },
                        { text: "right outer eye crease", value: "19" },
                        { text: "left mouth crease", value: "20" },
                        { text: "left upper lip point", value: "21" },
                        { text: "upper lip", value: "22" },
                        { text: "right upper lip point", value: "23" },
                        { text: "right mouth crease", value: "24" },
                        { text: "right lower lip point", value: "25" },
                        { text: "lower lip", value: "26" },
                        { text: "left lower lip point", value: "27" },
                        { text: "upper lip bottom", value: "28" },
                        { text: "lower lip top", value: "29" },
                        { text: "left upper eyelid", value: "30" },
                        { text: "left lower eyelid", value: "31" },
                        { text: "right upper eyelid", value: "32" },
                        { text: "right lower eyelid", value: "33" }
                    ]
                },
                EXPRESSION: {
                    acceptReporters: true,
                    items: this.expressions
                },
                EMOTION: {
                    acceptReporters: true,
                    items: this.emotions
                },
                EMOTION_ALL: {
                    acceptReporters: true,
                    items: this.all_emotions
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

    _convertCoordsToScratch({ x, y }) {
        return {
            x: x - this.DIMENSIONS[0] / 2,
            y: this.DIMENSIONS[1] / 2 - y
        };
    }

    _hasFace() {
        return this.affdexState && this.affdexState.featurePoints;
    }

    async _loop() {
        while (true) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: 'image-data',
                dimensions: this.DIMENSIONS
            });

            if (frame) {
                try {
                    this.affdexState = await this._estimateAffdexOnImage(frame);
                } catch (err) {
                    console.error("Error detecting face:", err);
                }
            }

            await new Promise(r => setTimeout(r, 100));
        }
    }

    async _estimateAffdexOnImage(imageElement) {
        const affdexDetector = await this._ensureAffdexLoaded(imageElement);
        affdexDetector.process(imageElement, 0);
        
        return new Promise((resolve) => {
            const resultListener = function(faces, image, timestamp) {
                affdexDetector.removeEventListener("onImageResultsSuccess", resultListener);
                if (faces.length < 1) {
                    resolve(null);
                    return;
                }
                resolve(faces[0]);
            };
            affdexDetector.addEventListener("onImageResultsSuccess", resultListener);
        });
    }

    async _ensureAffdexLoaded(imageElement) {
        if (this.affdexDetector) return this.affdexDetector;

        const affdex = await this._loadAffdexScript();
        const affdexStarter = new Promise((resolve) => {
            const width = this.DIMENSIONS[0];
            const height = this.DIMENSIONS[1];
            const faceMode = affdex.FaceDetectorMode.LARGE_FACES;
            const detector = new affdex.PhotoDetector(imageElement, width, height, faceMode);
            detector.detectAllEmotions();
            detector.detectAllExpressions();
            detector.start();
            this.affdexDetector = detector;
            detector.addEventListener("onInitializeSuccess", resolve);
        });
        await affdexStarter;
        return this.affdexDetector;
    }

    _loadAffdexScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://download.affectiva.com/js/3.2.1/affdex.js';
            script.onload = () => {
                if (window.affdex) {
                    resolve(window.affdex);
                } else {
                    reject(new Error('Affdex not loaded'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load Affdex script'));
            document.head.appendChild(script);
        });
    }

    projectStarted() {
        this.setVideoTransparency(this.globalVideoTransparency);
        this.videoToggle({ VIDEO_STATE: this.globalVideoState });
    }

    // Block operations
    affdexGoToPart(args, util) {
        if (!this._hasFace()) return;
        const part = this.affdexState.featurePoints[args.AFFDEX_POINT];
        if (!part) return;
        
        const { x, y } = this._convertCoordsToScratch(part);
        util.target.setXY(x, y, false);
    }

    affdexWhenExpression(args) {
        const expression = Cast.toString(args.EXPRESSION);
        return this._hasFace() && this.affdexState.expressions[expression] > 0.5;
    }

    affdexExpressionAmount(args) {
        const expression = Cast.toString(args.EXPRESSION);
        if (!this._hasFace() || !this.affdexState.expressions) return 0;
        return parseFloat(Number(this.affdexState.expressions[expression]).toFixed(2));
    }

    affdexIsExpression(args) {
        const expression = Cast.toString(args.EXPRESSION);
        return this._hasFace() && this.affdexState.expressions[expression] > 0.5;
    }

    affdexWhenEmotion(args) {
        const emotion = Cast.toString(args.EMOTION);
        return this.isTopEmotion(emotion, this.emotions);
    }

    affdexEmotionAmount(args) {
        const emotion = Cast.toString(args.EMOTION_ALL);
        if (!this._hasFace() || !this.affdexState.emotions) return 0;
        return parseFloat(Number(this.affdexState.emotions[emotion]).toFixed(2));
    }

    affdexIsTopEmotion(args) {
        const emotion = Cast.toString(args.EMOTION);
        return this.isTopEmotion(emotion, this.emotions);
    }

    isTopEmotion(emotion, emotions) {
        if (!this._hasFace() || !this.affdexState.emotions) return false;
        
        let maxEmotionValue = -Number.MAX_VALUE;
        let maxEmotion = null;
        
        emotions.forEach((emotionItem) => {
            const emotionValue = this.affdexState.emotions[emotionItem.value];
            if (emotionValue > maxEmotionValue) {
                maxEmotionValue = emotionValue;
                maxEmotion = emotionItem;
            }
        });
        
        return emotion === maxEmotion.value;
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
}

module.exports = Scratch3PoseFaceBlocks;
