const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3LordBot {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "LordBot",
            name: "LordBot",
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "carMove",
                    text: formatMessage({ id: 'carMotor.move' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'DIRECTION',
                            defaultValue: 'forward'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                    }
                },
                {
                    opcode: "carStop",
                    text: formatMessage({ id: 'carMotor.stop' }),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "carMode",
                    text: formatMessage({ id: 'carMotor.mode.fun' }),
                    blockType: BlockType.HAT,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CARMODE',
                            defaultValue: 'roundTrack'
                        }
                    }
                },
                {
                    opcode: "carExecute",
                    text: formatMessage({ id: 'carMotor.execute.mode' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CARMODE',
                            defaultValue: 'roundTrack'
                        }
                    }
                },
                {
                    opcode: "carRunMode",
                    text: formatMessage({ id: 'carMotor.mode.fun' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CARMODE',
                            defaultValue: 'roundTrack'
                        }
                    }
                },
                {
                    opcode: "carInit",
                    text: formatMessage({ id: 'carMotor.carInit' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'SERVER',
                            defaultValue: 'app'
                        }
                    }
                },
                {
                    opcode: "carGetInstruct",
                    text: formatMessage({ id: 'carMotor.carGetInstruct' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CARTYPE',
                            defaultValue: '63'
                        }
                    }
                },
                {
                    opcode: "getCarAppCommandData",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND_DATA'}),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "CARSIGNALDATA",
                            defaultValue: "Car_Speed"
                        }
                    }
                },
                {
                    opcode: "spiderExecute",
                    text: formatMessage({ id: 'carMotor.run' }),
                    blockType: BlockType.CONDITIONAL,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'callback'
                        },
                    }
                }
            ],
            menus: {
                SERVER:{
                    items:[
                        {text:formatMessage({ id: 'ROBOT_ARM_WEB_SERVER' }),value:"web"},
                        {text:"app",value:"app"},
                    ]
                },
                DIRECTION: {
                    items: [
                        {
                            text: formatMessage({ id: 'carMotor.front' }),
                            value: "forward"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.back' }),
                            value: "backward"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.left' }),
                            value: "left"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.right' }),
                            value: "right"
                        }

                    ]
                },
                CARMODE: {
                    items: [
                        {
                            text: formatMessage({ id: 'carMotor.move.value' }),
                            value: "move"
                        },
                        {
                            text: 'LED',
                            value: "led"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }),
                            value: "buzzer"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.roundTrack' }),
                            value: "roundTrack"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.8track' }),
                            value: "8track"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.avoidance' }),
                            value: "avoidance"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.follow' }),
                            value: "follow"
                        }
                    ]
                },
                CARTYPE: {
                    items: [
                        {
                            text: formatMessage({ id: 'carMotor.forward' }),
                            value: "63"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.backward' }),
                            value: "65"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.leftMove' }),
                            value: "61"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.rightMove' }),
                            value: "62"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.clockwise' }),
                            value: "66"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.anticlockwise' }),
                            value: "64"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.speed' }),
                            value: "58"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.move.stop' }),
                            value: "60"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.openLED' }),
                            value: "82"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.closeLED' }),
                            value: "83"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' })+'1',
                            value: "84"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' })+'2',
                            value: "85"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' })+'3',
                            value: "86"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' })+'4',
                            value: "87"
                        },
                        { text: formatMessage({ id: 'carMotor.roundTrack' }), value: "67" },
                        { text: formatMessage({ id: 'carMotor.8track' }), value: "59" },
                        {
                            text: formatMessage({ id: 'carMotor.avoidance' }),
                            value: "69"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.follow' }),
                            value: "68"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.slider' }),
                            value: "81"
                        }
                    ]
                },
                CARSIGNALDATA:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.speed' }),value:"Car_Speed"},
                        {text:formatMessage({ id: 'carMotor.slider' }),value:"SliderAngle"},
                    ]
                }
            }
        }
    }

    carMove() { }

    carRotate() { }

    carStop() { }

    carSetSpeed() { }

    carMode() { }

    carExecute() { }

    aabutton(){}

    aaaaa(){}
}

module.exports = Scratch3LordBot