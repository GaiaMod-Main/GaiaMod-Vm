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
            id: "nineInOne",
            name: "9 in 1 Easy Module Shield V1",
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "delay",
                    text: formatMessage({ id: 'nineInOne_delay' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: "init",
                    text: formatMessage({ id: 'nineInOne_init' }),
                    blockType: BlockType.COMMAND
                },
                // {
                //     opcode: "setPinModel",
                //     text: formatMessage({ id: 'nineInOne_setPinModel' }),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: 'PIN',
                //             defaultValue: '34'
                //         },
                //         TWO: {
                //             type: ArgumentType.STRING,
                //             menu: 'PIN_SWITCH',
                //             defaultValue: 'OUTPUT'
                //         }
                //     }
                // },
                {
                    opcode: "readAnalogPin",
                    text: formatMessage({ id: 'nineInOne_readAnalogPin' }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: "setAnalogPin",
                    text: formatMessage({ id: 'nineInOne_setAnalogPin' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "readNumberPin",
                    text: formatMessage({ id: 'nineInOne_readNumberPin' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'NUMBER_PIN',
                            defaultValue: '25'
                        }
                    }
                },
                {
                    opcode: "setNumberPin",
                    text: formatMessage({ id: 'nineInOne_setNumberPin' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE:{
                            type: ArgumentType.STRING,
                            menu: 'NUMBER_PIN',
                            defaultValue: '25'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu:"ELECTRICAL_LEVEL",
                            defaultValue: 'HIGH'
                        }
                    }
                },
                {
                    opcode: "button",
                    text: formatMessage({ id: 'nineInOne_button' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'BUTTON',
                            defaultValue: '26'
                        }
                    }
                },
                {
                    opcode: "led",
                    text: formatMessage({ id: 'nineInOne_led' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'LED_COLOR',
                            defaultValue: 'red'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: 'SWITCH',
                            defaultValue: 'open'
                        }
                    }
                },
                {
                    opcode: "rgb",
                    text: formatMessage({ id: 'nineInOne_rgb' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                    }
                },
                {
                    opcode: "rgb_color",
                    text: formatMessage({ id: 'nineInOne_rgb_color' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.COLOR
                        }
                    },
                },
                {
                    opcode: "dht11",
                    text: formatMessage({ id: 'nineInOne_dht11' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "HUMITURE",
                            defaultValue: 'temperature'
                        }
                    }
                },
                {
                    opcode: "rotation",
                    text: formatMessage({ id: 'nineInOne_rotation' }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: "setBuzzer",
                    text: formatMessage({ id: 'battleCar.setBuzzer' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    }
                },
                {
                    opcode: "buzzer",
                    text: formatMessage({ id: 'nineInOne_buzzer' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "FREQUENCY",
                            defaultValue: 'B0'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "TIMEOFDUARTION",
                            defaultValue: '0.5'
                        },
                    }
                },
                {
                    opcode: "setBuzzerTime1",
                    text: formatMessage({ id: 'battleCar.setBuzzerTime' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "FREQUENCY",
                            defaultValue: 'B0'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    }
                },
                {
                    opcode: "setBuzzerTime",
                    text: formatMessage({ id: 'battleCar.setBuzzerTime' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    }
                },
                {
                    opcode: "IR_getData",
                    text: formatMessage({ id: 'IR_getData' }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: "light",
                    text: formatMessage({ id: 'nineInOne_light' }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: "lm35",
                    text: formatMessage({ id: 'nineInOne_lm35' }),
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {
                ELECTRICAL_LEVEL: {
                    items: [
                        { text: formatMessage({ id: 'microbit.pinStateMenu.on' }), value: 'HIGH' },
                        { text: formatMessage({ id: 'microbit.pinStateMenu.off' }), value: 'LOW' },
                    ]
                },
                PIN_SWITCH: {
                    items: [
                        { text: formatMessage({ id: 'nineInOne_output' }), value: 'OUTPUT' },
                        { text: formatMessage({ id: 'nineInOne_input' }), value: 'INPUT' },
                    ]
                },
                PIN:{
                    items: [
                        { text: 'A3', value: '34' },
                        { text: 'D3', value: '25' },
                        { text: 'D5', value: '16' },
                    ]
                },
                NUMBER_PIN: {
                    items: [
                        { text: 'D3', value: '25' },
                        { text: 'D5', value: '16' },
                    ]
                },
                BUTTON: {
                    items: [
                        { text: "SW1", value: "26" },
                        { text: "SW2", value: "14" },
                    ]
                },
                BUTTONS: {
                    items: [
                        {
                            text: "up",
                            value: "12"
                        },
                        {
                            text: "down",
                            value: "13"
                        },
                        {
                            text: "left",
                            value: "14"
                        },
                        {
                            text: "right",
                            value: "15"
                        },
                        {
                            text: "ok",
                            value: "16"
                        },
                        {
                            text: "0",
                            value: "0"
                        },
                        {
                            text: "1",
                            value: "1"
                        },
                        {
                            text: "2",
                            value: "2"
                        },
                        {
                            text: "3",
                            value: "3"
                        },
                        {
                            text: "4",
                            value: "4"
                        },
                        {
                            text: "5",
                            value: "5"
                        },
                        {
                            text: "6",
                            value: "6"
                        },
                        {
                            text: "7",
                            value: "7"
                        },
                        {
                            text: "8",
                            value: "8"
                        },
                        {
                            text: "9",
                            value: "9"
                        },
                        {
                            text: "*",
                            value: "10"
                        },
                        {
                            text: "#",
                            value: "11"
                        }
                    ]
                },
                SWITCH: {
                    items: [
                        { text: "ON", value: "open" },
                        { text: "OFF", value: "close" },
                    ]
                },
                LED_COLOR: {
                    items: [
                        { text: formatMessage({ id: 'carMotor.menus.red' }), value: "red" },
                        { text: formatMessage({ id: 'carMotor.menus.blue' }), value: "blue" }
                    ]
                },
                HUMITURE: {
                    items: [
                        { text: formatMessage({ id: 'meteorologicalStation.tem' }), value: "temperature" },
                        { text: formatMessage({ id: 'meteorologicalStation.hum' }), value: "humidity" }
                    ]
                },
                FREQUENCY: {
                    items: [
                        { text: 'B0', value: '31' },
                        { text: 'C1', value: '33' },
                        { text: 'D1', value: '37' },
                        { text: 'E1', value: '41' },
                        { text: 'F1', value: '44' },
                        { text: 'G1', value: '49' },
                        { text: 'A1', value: '55' },
                        { text: 'B1', value: '62' },
                        { text: 'C2', value: '65' },
                        { text: 'D2', value: '73' },
                        { text: 'E2', value: '82' },
                        { text: 'F2', value: '87' },
                        { text: 'G2', value: '98' },
                        { text: 'A2', value: '110' },
                        { text: 'B2', value: '123' },
                        { text: 'C3', value: '131' },
                        { text: 'D3', value: '147' },
                        { text: 'E3', value: '165' },
                        { text: 'F3', value: '175' },
                        { text: 'G3', value: '196' },
                        { text: 'A3', value: '220' },
                        { text: 'B3', value: '247' },
                        { text: 'C4', value: '262' },
                        { text: 'D4', value: '294' },
                        { text: 'E4', value: '330' },
                        { text: 'F4', value: '349' },
                        { text: 'G4', value: '392' },
                        { text: 'A4', value: '440' },
                        { text: 'B4', value: '494' },
                        { text: 'C5', value: '523' },
                        { text: 'D5', value: '587' },
                        { text: 'E5', value: '659' },
                        { text: 'F5', value: '698' },
                        { text: 'G5', value: '784' },
                        { text: 'A5', value: '880' },
                        { text: 'B5', value: '988' },
                        { text: 'C6', value: '1047' },
                        { text: 'D6', value: '1175' },
                        { text: 'E6', value: '1319' },
                        { text: 'F6', value: '1397' },
                        { text: 'G6', value: '1568' },
                        { text: 'A6', value: '1760' },
                        { text: 'B6', value: '1976' },
                        { text: 'C7', value: '2093' },
                        { text: 'D7', value: '2349' },
                        { text: 'E7', value: '2637' },
                        { text: 'F7', value: '2794' },
                        { text: 'G7', value: '3136' },
                        { text: 'GS7', value: '3322' },
                        { text: 'A7', value: '3520' },
                        { text: 'B7', value: '3951' },
                        { text: 'C8', value: '4186' },
                        { text: 'D8', value: '4699' }
                    ]
                },
                TIMEOFDUARTION: {
                    items: [
                        { text: formatMessage({ id: 'battleCar.half' }), value: "0.5" },
                        { text: formatMessage({ id: 'battleCar.quarter' }), value: "0.25" },
                        { text: formatMessage({ id: 'battleCar.one_eighth' }), value: "0.125" },
                        { text: formatMessage({ id: 'battleCar.whole_beat' }), value: "1" },
                        { text: formatMessage({ id: 'battleCar.double_beat' }), value: "2" },
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