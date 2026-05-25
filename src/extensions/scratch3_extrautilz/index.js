const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const TargetType = require("../../extension-support/target-type");
const VirtualMachine = require("../../virtual-machine");

class ExtraUtilz {
    constructor(runtime) {
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.lastHttpResult = "";
        this.isHttpGetComplete = false;
    }

    /**
     * Returns the metadata about your extension.
     */
    getInfo() {
        return {
            // unique ID for your extension
            id: "extraUtilz",

            // name that will be displayed in the Scratch UI
            name: "Extra Utilz",

            // colours to use for your extension blocks
            color1: "#a137a4",
            color2: "#1e1e2f",

            // icons to display
            blockIconURI:
                "data:image/png;base64,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",
            menuIconURI:
                "data:image/png;base64,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",

            // your Scratch blocks
            blocks: [
                {
                    // name of the function where your block code lives
                    opcode: "resizeStage",

                    // type of block - choose from:
                    //   BlockType.REPORTER - returns a value, like "direction"
                    //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                    blockType: BlockType.COMMAND,

                    // label to display on the block
                    text: "(buggy) Resize stage [WIDTH] x [HEIGHT]",

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [TargetType.SPRITE, TargetType.STAGE],

                    // arguments used in the block
                    arguments: {
                        WIDTH: {
                            // default value before the user sets something
                            defaultValue: 480,

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.NUMBER,
                        },
                        HEIGHT: {
                            // default value before the user sets something
                            defaultValue: 360,

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.NUMBER,
                        },
                    },
                },
                {
                    // name of the function where your block code lives
                    opcode: "setSpriteXY",

                    // type of block - choose from:
                    //   BlockType.REPORTER - returns a value, like "direction"
                    //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                    blockType: BlockType.COMMAND,

                    // label to display on the block
                    text: "Set sprite [SPRITE] x: [X] y: [Y]",

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [TargetType.SPRITE, TargetType.STAGE],

                    // arguments used in the block
                    arguments: {
                        SPRITE: {
                            // default value before the user sets something
                            defaultValue: "Sprite1",

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.STRING,
                        },
                        X: {
                            // default value before the user sets something
                            defaultValue: 0,

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.NUMBER,
                        },
                        Y: {
                            // default value before the user sets something
                            defaultValue: 0,

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.NUMBER,
                        },
                    },
                },
                {
                    // name of the function where your block code lives
                    opcode: "runArbitraryJS",

                    // type of block - choose from:
                    //   BlockType.REPORTER - returns a value, like "direction"
                    //   BlockType.BOOLEAN - same as REPORTER but returns a true/false value
                    //   BlockType.COMMAND - a normal command block, like "move {} steps"
                    //   BlockType.HAT - starts a stack if its value changes from false to true ("edge triggered")
                    blockType: BlockType.COMMAND,

                    // label to display on the block
                    text: "Run arbitrary JS [JAVASCRIPT]",

                    // true if this block should end a stack
                    terminal: false,

                    // where this block should be available for code - choose from:
                    //   TargetType.SPRITE - for code in sprites
                    //   TargetType.STAGE  - for code on the stage / backdrop
                    // remove one of these if this block doesn't apply to both
                    filter: [TargetType.SPRITE, TargetType.STAGE],

                    // arguments used in the block
                    arguments: {
                        JAVASCRIPT: {
                            // default value before the user sets something
                            defaultValue:
                                'alert("With great power comes no responsibility.");',

                            // type/shape of the parameter - choose from:
                            //     ArgumentType.ANGLE - numeric value with an angle picker
                            //     ArgumentType.BOOLEAN - true/false value
                            //     ArgumentType.COLOR - numeric value with a colour picker
                            //     ArgumentType.NUMBER - numeric value
                            //     ArgumentType.STRING - text value
                            //     ArgumentType.NOTE - midi music value with a piano picker
                            type: ArgumentType.STRING,
                        },
                    },
                },
            ],
        };
    }

    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */
    myFirstBlock({ MY_NUMBER, MY_STRING }) {
        // example implementation to return a string
        return MY_STRING + " : doubled would be " + MY_NUMBER * 2;
    }

    resizeStage({ WIDTH, HEIGHT }) {
        const renderer = this.runtime.renderer;
        const vm = renderer && renderer._vm;

        if (vm) {
            vm.setStageSize(WIDTH, HEIGHT);
        } else {
            console.error("VM is not accessible.");
        }
    }

    setSpriteXY({ SPRITE, X, Y }) {
        this.runtime.targets.forEach((target) => {
            if (!target.isStage && target.getName() === SPRITE) {
                target.setXY(X, Y);
            }
        });
    }

    findTargetSprite({ SPRITE }) {
        this.runtime.targets.forEach((target) => {
            if (!target.isStage && target.getName() === SPRITE) {
                return target;
            }
        });
    }

    runArbitraryJS({ JAVASCRIPT }) {
        eval(JAVASCRIPT);
    }
}

module.exports = ExtraUtilz;
