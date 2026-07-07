const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3Truckbott {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "battleCar",
            name: "BattleBolt",
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "app_init",
                    text: formatMessage({ id: 'battleCar.app_init' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "get_commant",
                    text: formatMessage({ id: 'battleCar.get_commant' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "COMMANT",
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: "app_getBlueCode",
                    text: formatMessage({ id: 'battleCar.app_getBlueCode' }),
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "COMMANT_DATA",
                            defaultValue: 'bluetooth'
                        },
                    },
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: "getMacLocation",
                    text: formatMessage({ id: 'battleCar.getMacLocation' }),
                    blockType: BlockType.REPORTER
                },
                // {
                //     opcode: "app_sendData",
                //     text:" 格斗小车发送[ONE]到app",
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: "SEND_DATA",
                //             defaultValue: 'speed_max'
                //         },
                //     }
                // },
                {
                    opcode: "reset",
                    text: formatMessage({ id: 'battleCar.reset' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "execute",
                    text: formatMessage({ id: 'battleCar.execute' }),
                    blockType: BlockType.CONDITIONAL,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'callback'
                        },
                    }
                },
                {
                    opcode: "setPWM",
                    text: formatMessage({ id: 'sharnbot.setPWM' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: "stop",
                    text: formatMessage({ id: 'battleCar.stop' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "setSpeed",
                    text: formatMessage({ id: 'battleCar.setSpeed' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 150
                        }
                    }
                },
                {
                    opcode: "setServo",
                    text: formatMessage({ id: 'battleCar.setServo' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "PIN",
                            defaultValue: '17'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
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
                    text: formatMessage({ id: 'battleCar.buzzer' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "BUZER",
                            defaultValue: '31'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "TIME",
                            defaultValue: '0.5'
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
                    opcode: "setTypeBuzzer",
                    text: formatMessage({ id: 'battleCar.setTypeBuzzer' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "BUZER",
                            defaultValue: '31'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "SWITCH",
                            defaultValue: 'open'
                        }
                    }
                }
            ],
            menus: {
                COMMANT_DATA: {
                    items: [
                        { text: formatMessage({ id: 'battleCar.bluetoothCode' }), value: "bluetooth" },
                        { text: formatMessage({ id: 'battleCar.weapon_max' }), value: "weapon_max" },
                        { text: formatMessage({ id: 'battleCar.weapon_min' }), value: "weapon_min" },
                    ]
                },
                // SEND_DATA:{
                //     items:[
                //         {text:"速度达到最大值",value:"speed_max"},
                //         {text:"速度达到最小值",value:"speed_min"}
                //     ]
                // },
                SWITCH: {
                    items: [
                        { text: formatMessage({ id: 'open' }), value: "open" },
                        { text: formatMessage({ id: 'close' }), value: "close" },
                    ]
                },
                TIME: {
                    items: [
                        { text: formatMessage({ id: 'battleCar.half' }), value: "0.5" },
                        { text: formatMessage({ id: 'battleCar.quarter' }), value: "0.25" },
                        { text: formatMessage({ id: 'battleCar.one_eighth' }), value: "0.125" },
                        { text: formatMessage({ id: 'battleCar.whole_beat' }), value: "1" },
                        { text: formatMessage({ id: 'battleCar.double_beat' }), value: "2" },
                    ]
                },
                BUZER: {
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
                PIN: {
                    items: [
                        { text: "17", value: "17" },
                        { text: "14", value: "14" },
                        { text: "12", value: "12" }
                    ]
                },
                RUN: {
                    items: [
                        { text: formatMessage({ id: 'sharnbot.RUN.forward' }), value: "forward" },
                        { text: formatMessage({ id: 'sharnbot.RUN.backward' }), value: "backward" },
                        { text: formatMessage({ id: 'sharnbot.RUN.turnLeft' }), value: "turnLeft" },
                        { text: formatMessage({ id: 'sharnbot.RUN.turnRight' }), value: "turnRight" }
                    ]
                },
                COMMANT: {
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
                            text: formatMessage({ id: 'fourLeggedBionicSpider.leftMove' }),
                            value: "3"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.rightMove' }),
                            value: "4"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.move.stop' }),
                            value: "0"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }) + '1',
                            value: "11"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }) + '2',
                            value: "12"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }) + '3',
                            value: "13"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }) + '4',
                            value: "14"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.tone' }) + ' C5',
                            value: "15"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.tone' }) + ' D5',
                            value: "16"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.tone' }) + ' E5',
                            value: "17"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.tone' }) + " F5",
                            value: "18"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.tone' }) + " G5",
                            value: "19"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.tone' }) + " A5",
                            value: "20"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.tone' }) + " B5",
                            value: "21"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.speedCut' }),
                            value: "7"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.speedUp' }),
                            value: "6"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.attack' }),
                            value: "5"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.stopAttack' }),
                            value: "10"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.bluetoothCode' }),
                            value: "23"
                        },
                        {
                            text: formatMessage({ id: 'battleCar.weapon' }),
                            value: "22"
                        }
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
    openBle() {

    }
}

module.exports = Scratch3Truckbott