const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const Keyboard = require('../../io/keyboard')


/**
 * Class for TurboWarp blocks
 * @constructor
 */
class ShredSDK {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }
    pressedKeys = {};

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'shredsdk',
            name: 'ShredSDK',
            blocks: [
                {
                    opcode: 'keyButtonIsDown',
                    text: "Is button [BUTTON] down?",
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BUTTON: {
                            type: ArgumentType.STRING,
                            menu: 'button',
                            defaultValue: 'z'
                        }
                    }
                },
                {
                    opcode: 'whenButtonIsDown',
                    text: "When button [BUTTON] is down",
                    blockType: BlockType.HAT,
                    arguments: {
                        BUTTON: {
                            type: ArgumentType.STRING,
                            menu: 'button',
                            defaultValue: 'z'
                        }
                    }
                },
                {
                    opcode: 'intButtonIsDown',
                    text: "[BUTTON] value",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BUTTON: {
                            type: ArgumentType.STRING,
                            menu: 'button',
                            defaultValue: 'z'
                        }
                    }
                },
                {
                    opcode: 'xAxis',
                    text: "X Axis",
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                },
                {
                    opcode: 'yAxis',
                    text: "Y Axis",
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                }
            ],
            
            menus: {
                button: [
                    {
                        text: "Button A (Z)",
                        value: "z"
                    },
                    {
                        text: "Button B (X)",
                        value: "x"
                    },
                    {
                        text: "Button START (Enter)",
                        value: "enter"
                    },
                    {
                        text: "Button C (Space)",
                        value: "space"
                    },
                    {
                        text: "Up Arrow",
                        value: "up arrow"
                    },
                    {
                        text: "Down Arrow",
                        value: "down arrow"
                    },
                    {
                        text: "Right Arrow",
                        value: "right arrow"
                    },
                    {
                        text: "Left Arrow",
                        value: "left arrow"
                    }
                ]
            }
        };
    }

    getLastKeyPressed (args, util) {
        return util.ioQuery('keyboard', 'getLastKeyPressed');
    }

    keyButtonIsDown (args, util) {
        const button = args.BUTTON;
        return util.ioQuery('keyboard', 'getKeyIsDown', [button]);
    }

    whenButtonIsDown (args, util) {
        const button = args.BUTTON;
        return util.ioQuery('keyboard', 'getKeyIsDown', [button]);
    }

    intButtonIsDown (args, util) {
        const button = args.BUTTON;
        const banana = util.ioQuery('keyboard', 'getKeyIsDown', [button]);
        if (banana) {
            return 1
        }
        else {
            return 0
        }
    }

    xAxis (args, util) {
        const button = args.BUTTON;
        const argys = util.ioQuery('keyboard', 'getKeyIsDown', ["right arrow"]) - util.ioQuery('keyboard', 'getKeyIsDown', ["left arrow"]);
        return argys
    }
    yAxis (args, util) {
        const button = args.BUTTON;
        const argys = util.ioQuery('keyboard', 'getKeyIsDown', ["up arrow"]) - util.ioQuery('keyboard', 'getKeyIsDown', ["down arrow"]);
        return argys
    }
}

module.exports = ShredSDK;