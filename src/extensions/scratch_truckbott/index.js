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
            id: "truckbott",
            name: "Truckbott",
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "app_init",
                    text: formatMessage({ id: 'truckbott.app_init' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "sendTip",
                    text: formatMessage({ id: 'truckbott.sendTip' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "get_commant",
                    text: formatMessage({ id: 'truckbott.get_commant' }),
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
                    opcode: "get_commantData",
                    text: formatMessage({ id: 'truckbott.get_commantData' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "COMMANT_DATA",
                            defaultValue: 'forward_dis'
                        }
                    }
                },
                {
                    opcode: "execute",
                    text: formatMessage({ id: 'truckbott.execute' }),
                    blockType: BlockType.CONDITIONAL,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'callback'
                        },
                    }
                },
                {
                    opcode: "tipping_angle",
                    text:formatMessage({ id: 'sharnbot.tipping_angle' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: "tippingBucket",
                    text:formatMessage({ id: 'sharnbot.tippingType' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "BUCKET_TYPE",
                            defaultValue: 'open'
                        }
                    }
                },
                {
                    opcode: "forklift_angle",
                    text:formatMessage({ id: 'sharnbot.forkliftAngle' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: "setRGB_color",
                    text: formatMessage({ id: 'sharnbot.setRGB_color' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "PLACES",
                            defaultValue: '0'
                        },
                        TWO: {
                            type: ArgumentType.COLOR
                        }
                    }
                },
                {
                    opcode: "setRGB",
                    text: formatMessage({ id: 'sharnbot.setRGB' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "PLACES",
                            defaultValue: '0'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        FOUR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: "IR_getData",
                    text: formatMessage({ id: 'sharnbot.IR_getData' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "BUTTONS",
                            defaultValue: '12'
                        }
                    }
                },
                {
                    opcode: "Ultrasonic_launch",
                    text: formatMessage({ id: 'sharnbot.Ultrasonic_launch' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "Ultrasonic_get_time",
                    text: formatMessage({ id: 'sharnbot.Ultrasonic_get_time' }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: "P_Buzzer",
                    text: formatMessage({ id: 'sharnbot.P_Buzzer' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "P_Buzzer_name",
                    text: formatMessage({ id: 'sharnbot.P_Buzzer.name' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            menu:"BUZER",
                            defaultValue: "31"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "Trace_getData",
                    text: formatMessage({ id: 'sharnbot.Trace_getData' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'TRACE',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: "speed_move",
                    text: formatMessage({ id: 'sharnbot.speed_move' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "RUN",
                            defaultValue: "forward"
                        }
                    }
                },
                {
                    opcode: "time_move",
                    text: formatMessage({ id: 'sharnbot.time_move' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "RUN",
                            defaultValue: "forward"
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
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
                    opcode: "encoder_init",
                    text: formatMessage({ id: 'sharnbot.encoder_init' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ALL_WHELL",
                            defaultValue: "M2"
                        }
                    }
                },
                {
                    opcode: "encoder_num",
                    text: formatMessage({ id: 'sharnbot.encoder_num' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ALL_WHELL",
                            defaultValue: "M2"
                        }
                    }
                },
                {
                    opcode: "encoder_reset",
                    text: formatMessage({ id: 'sharnbot.encoder_reset' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ALL_WHELL",
                            defaultValue: "M2"
                        }
                    }
                },
                {
                    opcode: "encoder_turn",
                    text: '[ONE][TWO]°',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "TURN",
                            defaultValue: "turnLeft"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 180
                        }
                    }
                },
                {
                    opcode: "encoder_move",
                    text: '[ONE][TWO]cm',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "MOVE",
                            defaultValue: "forward"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: "rotationAngle",
                    text: formatMessage({ id: 'sharnbot.rotationAngle' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "rotationAngle_time",
                    text: formatMessage({ id: 'sharnbot.rotationAngle_time' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "RUN",
                            defaultValue: "forward"
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: "rotationAngle_speed",
                    text: formatMessage({ id: 'sharnbot.rotationAngle_speed' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "RUN",
                            defaultValue: "forward"
                        },
                    }
                },
                {
                    opcode: "ASR_init",
                    text: formatMessage({ id: 'sharnbot.ASR_init' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "ASR_get_command",
                    text: formatMessage({ id: 'sharnbot.ASR_get_command' }),
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {
                BUCKET_TYPE:{
                    items:[
                        {text:formatMessage({ id: 'sharnbot.COMMANT_DATA.uplift' }),value:"open"},
                        {text:formatMessage({ id: 'sharnbot.COMMANT_DATA.layDown' }),value:"close"},
                    ]
                },
                BUZER: {
                    items: [
                        {text:'B0', value:'31'},
                        {text:'C1', value:'33'},
                        {text:'D1', value:'37'},
                        {text:'E1', value:'41'},
                        {text:'F1', value:'44'},
                        {text:'G1', value:'49'},
                        {text:'A1', value:'55'},
                        {text:'B1', value:'62'},
                        {text:'C2', value:'65'},
                        {text:'D2', value:'73'},
                        {text:'E2', value:'82'},
                        {text:'F2', value:'87'},
                        {text:'G2', value:'98'},
                        {text:'A2', value:'110'},
                        {text:'B2', value:'123'},
                        {text:'C3', value:'131'},
                        {text:'D3', value:'147'},
                        {text:'E3', value:'165'},
                        {text:'F3', value:'175'},
                        {text:'G3', value:'196'},
                        {text:'A3', value:'220'},
                        {text:'B3', value:'247'},
                        {text:'C4', value:'262'},
                        {text:'D4', value:'294'},
                        {text:'E4', value:'330'},
                        {text:'F4', value:'349'},
                        {text:'G4', value:'392'},
                        {text:'A4', value:'440'},
                        {text:'B4', value:'494'},
                        {text:'C5', value:'523'},
                        {text:'D5', value:'587'},
                        {text:'E5', value:'659'},
                        {text:'F5', value:'698'},
                        {text:'G5', value:'784'},
                        {text:'A5', value:'880'},
                        {text:'B5', value:'988'},
                        {text:'C6', value:'1047'},
                        {text:'D6', value:'1175'},
                        {text:'E6', value:'1319'},
                        {text:'F6', value:'1397'},
                        {text:'G6', value:'1568'},
                        {text:'A6', value:'1760'},
                        {text:'B6', value:'1976'},
                        {text:'C7', value:'2093'},
                        {text:'D7', value:'2349'},
                        {text:'E7', value:'2637'},
                        {text:'F7', value:'2794'},
                        {text:'G7', value:'3136'},
                        {text:'GS7',value: '3322'},
                        {text:'A7', value:'3520'},
                        {text:'B7', value:'3951'},
                        {text:'C8', value:'4186'},
                        {text:'D8', value:'4699'}
                    ]
                },
                PLACES: {
                    items: [
                        {
                            text: formatMessage({ id: 'sharnbot.PLACES.left' }),
                            value: "0"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.PLACES.right' }),
                            value: "1"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.PLACES.all' }),
                            value: "2"
                        }
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
                TRACE: {
                    items: [
                        { text: "1", value: "1" },
                        { text: "2", value: "2" },
                        { text: "3", value: "3" },
                        { text: "4", value: "4" }
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
                WHELL: {
                    items: [
                        { text: formatMessage({ id: 'sharnbot.WHELL.left' }), value: "left" },
                        { text: formatMessage({ id: 'sharnbot.WHELL.right' }), value: "right" }
                    ]
                },
                ALL_WHELL: {
                    items: [
                        { text: formatMessage({ id: 'sharnbot.WHELL.left' }), value: "M2" },
                        { text: formatMessage({ id: 'sharnbot.WHELL.right' }), value: "M1" },
                        // {text:"全部",value:"all"}
                    ]
                },
                MOVE: {
                    items: [
                        { text: formatMessage({ id: 'sharnbot.RUN.forward' }), value: "forward" },
                        { text: formatMessage({ id: 'sharnbot.RUN.backward' }), value: "backward" }
                    ]
                },
                TURN: {
                    items: [
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
                            value: "5"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }) + '2',
                            value: "6"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }) + '3',
                            value: "7"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.buzzer' }) + '4',
                            value: "8"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.lineWalking' }),
                            value: "10"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.avoidance' }),
                            value: "11"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.follow' }),
                            value: "12"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.all_light' }),
                            value: "13"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.left_light' }),
                            value: "14"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.right_light' }),
                            value: "15"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_forward' }),
                            value: "16"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_backward' }),
                            value: "17"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_turnLeft' }),
                            value: "19"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_turnRight' }),
                            value: "18"
                        },
                        {
                            text:formatMessage({ id: 'sharnbot.COMMANT_DATA.Forklift' }),
                            value: "20"
                        },
                        {
                            text:formatMessage({ id: 'sharnbot.COMMANT_DATA.Tipping' }),
                            value: "21"
                        }
                    ]
                },
                COMMANT_DATA: {
                    items: [
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_forward' }),
                            value: "forward_dis"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_backward' }),
                            value: "backward_dis"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_turnLeft' }),
                            value: "left_degree"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT.input_turnRight' }),
                            value: "right_degree"
                        },
                        {
                            text: formatMessage({ id: 'sharnbot.COMMANT_DATA.speed' }),
                            value: "Car_Speed"
                        },
                        {
                            text: "R",
                            value: "R"
                        },
                        {
                            text: "G",
                            value: "G"
                        },
                        {
                            text: "B",
                            value: "B"
                        },
                        {
                            text:formatMessage({ id: 'sharnbot.COMMANT_DATA.Forklift' }),
                            value: "Forklift_val"
                        },
                        {
                            text:formatMessage({ id: 'sharnbot.COMMANT_DATA.Tipping' }),
                            value: "Tipping_val"
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