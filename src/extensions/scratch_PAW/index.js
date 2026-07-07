const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3PAW {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "PAW",
            name: formatMessage({ id: 'PAW.categoryName' }),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "MPU6050_init",
                    text: formatMessage({ id: 'PAW_MPU6050_init' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "MPU6050_getData",
                    text: formatMessage({ id: 'PAW_MPU6050_getData' }),
                    blockType: BlockType.COMMAND
                },
                // {
                //     opcode: "getXYZData",
                //     text: formatMessage({ id: 'PAW_getXYZData' }),
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: 'AXIS',
                //             defaultValue: 'X'
                //         }
                //     }
                // },
                // {
                //     opcode: "getAngle",
                //     text: formatMessage({ id: 'PAW_getAngle' }),
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: 'RP',
                //             defaultValue: 'potValue1'
                //         }
                //     }
                // },
                // {
                //     opcode: "RPcomparison",
                //     text: formatMessage({ id: 'PAW_RPcomparison' }),
                //     blockType: BlockType.BOOLEAN,
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: 'COMPARISON',
                //             defaultValue: '>'
                //         },
                //         TWO:{
                //             type: ArgumentType.NUMBER,
                //             defaultValue: '100'
                //         },
                //         THREE:{
                //             type: ArgumentType.NUMBER,
                //             menu: 'GATE',
                //             defaultValue: '&&'
                //         },

                //         FOUR: {
                //             type: ArgumentType.STRING,
                //             menu: 'COMPARISON',
                //             defaultValue: '>'
                //         },
                //         FIVE:{
                //             type: ArgumentType.NUMBER,
                //             defaultValue: '100'
                //         },
                //         SIX:{
                //             type: ArgumentType.NUMBER,
                //             menu: 'GATE',
                //             defaultValue: '&&'
                //         },

                //         SEVEN: {
                //             type: ArgumentType.STRING,
                //             menu: 'COMPARISON',
                //             defaultValue: '>'
                //         },
                //         EIGHT:{
                //             type: ArgumentType.NUMBER,
                //             defaultValue: '100'
                //         },
                //         NINE:{
                //             type: ArgumentType.NUMBER,
                //             menu: 'GATE',
                //             defaultValue: '&&'
                //         },

                //         TEN: {
                //             type: ArgumentType.STRING,
                //             menu: 'COMPARISON',
                //             defaultValue: '>'
                //         },
                //         ELEVEN:{
                //             type: ArgumentType.NUMBER,
                //             defaultValue: '100'
                //         },
                //         TWELEV:{
                //             type: ArgumentType.NUMBER,
                //             menu: 'GATE',
                //             defaultValue: '&&'
                //         },

                //         THIRTEEN: {
                //             type: ArgumentType.STRING,
                //             menu: 'COMPARISON',
                //             defaultValue: '>'
                //         },
                //         FOURTEEN:{
                //             type: ArgumentType.NUMBER,
                //             defaultValue: '100'
                //         },
                //         FIFTEEN:{
                //             type: ArgumentType.NUMBER,
                //             menu: 'GATE',
                //             defaultValue: '&&'
                //         }
                //     }
                // },
                // {
                //     opcode: "getK1Button",
                //     text: formatMessage({ id: 'PAW_getK1Button' }),
                //     blockType: BlockType.BOOLEAN,
                //     setEditable: true,
                // }
                {
                    opcode: "getCommand",
                    text: formatMessage({ id: 'PAW.getCommand' }),
                    blockType: BlockType.REPORTER,
                    setEditable: false,
                },
                {
                    opcode: "bel_led",
                    text: formatMessage({ id: 'PAW.getCommand.bel_led' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'LED_TYPE',
                            defaultValue: 'open'
                        }
                    }
                }
            ],
            menus: {
                LED_TYPE: {
                    items: [
                        { text: formatMessage({ id: 'open' }), value: "open" },
                        { text: formatMessage({ id: 'close' }), value: "close" }
                    ]
                },
                OPERATE: {
                    items: [
                        {
                            text: formatMessage({ id: 'carMotor.forward' }),
                            value: "forward"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.backward' }),
                            value: "backward"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.leftMove' }),
                            value: "moveleft"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.rightMove' }),
                            value: "moveright"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.clockwise' }),
                            value: "clockwise"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.anticlockwise' }),
                            value: "contrarotate"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.move.stop' }),
                            value: "stop"
                        }
                    ]
                },
                OPERATE_VAL: {
                    items: [
                        {
                            text: formatMessage({ id: 'carMotor.forward' }),
                            value: "1"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.backward' }),
                            value: "2"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.leftMove' }),
                            value: "3"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.rightMove' }),
                            value: "4"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.clockwise' }),
                            value: "5"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.anticlockwise' }),
                            value: "6"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.move.stop' }),
                            value: "0"
                        },
                    ]
                },
                AXIS: {
                    items: [
                        {
                            text: "x",
                            value: "X"
                        },
                        {
                            text: "y",
                            value: "Y"
                        },
                        {
                            text: "z",
                            value: "Z"
                        },
                    ]
                },
                RP: {
                    items: [
                        {
                            text: formatMessage({ id: 'PAW_RP_potValue1' }),
                            value: "potValue1"
                        },
                        {
                            text: formatMessage({ id: 'PAW_RP_potValue2' }),
                            value: "potValue2"
                        },
                        {
                            text: formatMessage({ id: 'PAW_RP_potValue3' }),
                            value: "potValue3"
                        },
                        {
                            text: formatMessage({ id: 'PAW_RP_potValue4' }),
                            value: "potValue4"
                        },
                        {
                            text: formatMessage({ id: 'PAW_RP_potValue5' }),
                            value: "potValue5"
                        }
                    ]
                },
                GATE: {
                    items: [
                        { text: formatMessage({ id: 'PAW_and' }), value: "&&" },
                        { text: formatMessage({ id: 'PAW_or' }), value: "||" }
                    ]
                },
                COMPARISON: {
                    items: [
                        { text: formatMessage({ id: 'PAW_greaterThan' }), value: ">" },
                        { text: formatMessage({ id: 'PAW_lessThan' }), value: "<" }
                    ]
                }
            }
        }
    }
    getK1Button() {

    }
    getAngle() {

    }
    getXYZData() {

    }
    getCommand() {

    }
    getData() {

    }
    connectBle() {

    }
    MPU6050_sendData() {

    }
    MPU6050_getData() {

    }
    MPU6050_init() {

    }

    openBle(arg) {

    }

    getKCommand() { }
}

module.exports = Scratch3PAW