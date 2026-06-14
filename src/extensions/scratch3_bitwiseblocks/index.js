const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'newblocks',
            name: 'New Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },

                {
                    opcode: 'EchoTrue',
                    blockType: BlockType.BOOLEAN,
                    text: 'True',
                    arguments: {}
                },

                {
                    opcode: 'EchoFalse',
                    blockType: BlockType.BOOLEAN,
                    text: 'False',
                    arguments: {}
                },

                {
                    opcode: 'BitwiseNOT',
                    blockType: BlockType.REPORTER,
                    text: '~ [LETTER_NUM]',
                    arguments: {
                        LETTER_NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },

                {
                    opcode: 'BitwiseAND',
                    blockType: BlockType.REPORTER,
                    text: '[LETTER_NUM1] & [LETTER_NUM2]',
                    arguments: {
                        LETTER_NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        LETTER_NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },

                {
                    opcode: 'BitwiseOR',
                    blockType: BlockType.REPORTER,
                    text: '[LETTER_NUM1] | [LETTER_NUM2]',
                    arguments: {
                        LETTER_NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        LETTER_NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },

                {
                    opcode: 'BitwiseXOR',
                    blockType: BlockType.REPORTER,
                    text: '[LETTER_NUM1] ^ [LETTER_NUM2]',
                    arguments: {
                        LETTER_NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        LETTER_NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },

                {
                    opcode: 'LeftShift',
                    blockType: BlockType.REPORTER,
                    text: '[LETTER_NUM1] << [LETTER_NUM2]',
                    arguments: {
                        LETTER_NUM1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        },
                        LETTER_NUM2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: ""
                        }
                    }
                },

                {
                    opcode: 'ConditionalOperator',
                    blockType: BlockType.REPORTER,
                    text: '[CONDITION] ? [EXPRIFTRUE] : [EXPRIFFALSE]',
                    arguments: {
                        CONDITION: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: ""
                        },
                        EXPRIFTRUE: {
                            type: ArgumentType.STRING,
                            defaultValue: " "
                        },
                        EXPRIFFALSE: {
                            type: ArgumentType.STRING,
                            defaultValue: " "
                        }
                    }
                }

            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    EchoTrue (args) {
        return true;
    }

    EchoFalse (args) {
        return false;
    }
    BitwiseNOT(args) {
        return  ~args.LETTER_NUM;
    }

    BitwiseAND (args) {
        return args.LETTER_NUM1 & args.LETTER_NUM2;
    }

    BitwiseOR (args) {
        return args.LETTER_NUM1 | args.LETTER_NUM2;
    }

    BitwiseXOR (args) {
        return args.LETTER_NUM1 ^ args.LETTER_NUM2;
    }

    LeftShift (args) {
        return args.LETTER_NUM1 << args.LETTER_NUM2;
    }
    
    ConditionalOperator (args) {
        return args.CONDITION ? args.EXPRIFTRUE : args.EXPRIFFALSE;
    }
}


module.exports = Scratch3NewBlocks;