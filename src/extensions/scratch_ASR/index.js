const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3BipedRobot {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "ASR",
            name: formatMessage({ id: 'ASR.categoryName' }),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "ASR",
                    text: formatMessage({ id: 'ASR.categoryName' }),
                    blockType: BlockType.CONDITIONAL,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'callback'
                        },
                    }
                },
                {
                    opcode: "set_baudRate",
                    text: formatMessage({ id: 'ASR.set_baudRate' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'BAUDRATE',
                            defaultValue: '9600'
                        },
                    }
                },
                {
                    opcode: "sound_config",
                    text: formatMessage({ id: 'ASR.sound_config' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'SOUND',
                            defaultValue: '1'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                    }
                },
                {
                    opcode: "turn_on_the_radio",
                    text: formatMessage({ id: 'ASR.turn_on_the_radio' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: "wakeword",
                    text: formatMessage({ id: 'ASR.wakeword' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'SENSITIVITY',
                            defaultValue: 'middle'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'robot'
                        },
                        THREE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'i am here'
                        },
                    }
                },
                {
                    opcode: "exit_reply",
                    text: formatMessage({ id: 'ASR.exit_reply' }),
                    blockType: BlockType.COMMAND,
                    arguments:{
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: "bye"
                        },
                    }
                },
                {
                    opcode: "initiative_exit",
                    text: formatMessage({ id: 'ASR.initiative_exit' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: "bye"
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            defaultValue: "bye"
                        },
                    }
                },
                {
                    opcode: "command_recognition_sensitivity",
                    text: formatMessage({ id: 'ASR.command_recognition_sensitivity' }),
                    blockType: BlockType.COMMAND,
                    arguments:{
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'SENSITIVITY',
                            defaultValue: "middle"
                        },
                    }
                },
                {
                    opcode: "recognition_command",
                    text: formatMessage({ id: 'ASR.recognition_command' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'open'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        THREE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'turn on the light'
                        },
                        FOUR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ok'
                        },
                        FIVE: {
                            type: ArgumentType.STRING,
                            defaultValue: 1
                        },
                    }
                },
                {
                    opcode: "learn_command_words",
                    text: formatMessage({ id: 'ASR.learn_command_words' }),
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'open'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Start learning the command word open'
                        },
                        THREE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Learning success'
                        },
                    },
                    blockType: BlockType.COMMAND,
                },
            ],
            menus: {
                BAUDRATE:{
                    items: [
                        { text: '9600', value: '9600' },
                        { text: '115200', value: '115200' },
                    ]
                },
                SOUND: {
                    items: [
                        { text: formatMessage({ id: 'ASR.sweet_girl' }), value: '1' },
                        { text: formatMessage({ id: 'ASR.cute_girl_voice' }), value: '2' },
                        { text: formatMessage({ id: 'ASR.vivacious_female_voice' }), value: '3' },
                        { text: formatMessage({ id: 'ASR.male_announcer' }), value: '4' },
                        { text: formatMessage({ id: 'ASR.naive_boy_voice' }), value: '5' },
                        { text: formatMessage({ id: 'ASR.childs_voice' }), value: '6' },
                        // { text: '天真男生', value: '7' }
                    ]
                },
                SENSITIVITY: {
                    items: [
                        { text: formatMessage({ id: 'ASR.LOW' }), value: 'low' },
                        { text: formatMessage({ id: 'ASR.MIDDLE' }), value: 'middle' },
                        { text: formatMessage({ id: 'ASR.HIGH' }), value: 'high' },
                    ]
                }
            }
        }
    }

    bipedRobotSetPin() { }

    bipedRobotRunAction() { }

    bipedRobotCreatAction() { }

    bipedRobotServe() { }

    bipedRobotRun() { }

    bipedRobotCreatAction() { }
}

module.exports = Scratch3BipedRobot