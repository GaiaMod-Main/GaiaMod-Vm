const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

const servo = [
    { text: '4', value: '4' },
    { text: '5', value: '5' },
    { text: '12', value: '12' },
    { text: '13', value: '13' },
    { text: '14', value: '14' },
    { text: '16', value: '16' },
    { text: '17', value: '17' },
    { text: '18', value: '18' },
    { text: '19', value: '19' },
    { text: '23', value: '23' },
    { text: '25', value: '25' },
    { text: '26', value: '26' },
    { text: '27', value: '27' },
    { text: '32', value: '32' },
    { text: '33', value: '33' }
]

const ASSIGN_pin = [
    { text: '32', value: '32' },
    { text: '33', value: '33' },
    { text: '34', value: '34' },
    { text: '35', value: '35' },
    { text: '36', value: '36' },
    { text: '39', value: '39' }
]

class Scratch3MechanicalArm {
    constructor(runtime) {
        this.runtime = runtime
    }

    getInfo() {
        return {
            id: "mechanicalArm",
            name: formatMessage({ id: 'ROBOT_ARM'}),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "openArmWebServer",
                    text: formatMessage({ id: 'ROBOT_ARM_START_SERVE'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "SERVER",
                            defaultValue: "app"
                        }
                    }
                },
                {
                    opcode: "armInit",
                    text: formatMessage({ id: 'ROBOT_ARM_INIT'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "5"
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "16"
                        },
                        THREE: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "17"
                        },
                        FOUR: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "18"
                        },
                    }
                },
                {
                    opcode: "armAction",
                    text: formatMessage({ id: 'ROBOT_ARM_ACTION'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ACTION",
                            defaultValue: "1"
                        }
                    }
                },
                {
                    opcode: "joystick",
                    text: formatMessage({ id: 'ROBOT_ARM_JOYSTICK'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "JOYSTICK",
                            defaultValue: "chassis"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: "setArthrosis",
                    text: formatMessage({ id: 'carMotor.setArmAngleSpeed'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "JOYSTICK",
                            defaultValue: "chassis"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: "getArmAngle",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_ARM_ANGLE'}),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "JOYSTICK",
                            defaultValue: "chassis"
                        }
                    }
                },
                {
                    opcode: "armRocker",
                    text: formatMessage({ id: 'ROBOT_ARM_ROCKER'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "JOYSTICK_PIN",
                            defaultValue: "32"
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "JOYSTICK_PIN",
                            defaultValue: "33"
                        },
                        THREE: {
                            type: ArgumentType.STRING,
                            menu: "JOYSTICK_PIN",
                            defaultValue: "34"
                        },
                        FOUR:{
                            type: ArgumentType.STRING,
                            menu: "ROCKER",
                            defaultValue: "left"
                        }
                    }
                },
                {
                    opcode: "armMemory",
                    text: formatMessage({ id: 'ROBOT_ARM_OPEN_MEMORY'}),
                    blockType: BlockType.COMMAND, 
                },
                {
                    opcode: "armDefaultMotion",
                    text: formatMessage({ id: 'mechanicalArm.armDefaultMotion'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ARM_DEFAULT_MOTION",
                            defaultValue: "keep"
                        }
                    }
                },
                {
                    opcode: "armMotion",
                    text: formatMessage({ id: 'ROBOT_ARM_MOTION'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ARM_MOTION",
                            defaultValue: "keep"
                        }
                    }
                },
                {
                    opcode: "armCoord",
                    text: formatMessage({ id: 'ROBOT_ARM_COORD'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: -10
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: "getJoystickCoord",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_JOYSTICK_COORD'}),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            menu: "COORD",
                            defaultValue: "x"
                        }
                    }
                },
                {
                    opcode: "armError",
                    text: formatMessage({ id: 'ROBOT_ARM_ERROR'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 8
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    }
                },
                {
                    opcode: "armReset",
                    text: formatMessage({ id: 'ROBOT_ARM_RESET'}),
                    blockType: BlockType.COMMAND,
                },
                // {
                //     opcode: "armNetInit",
                //     text: formatMessage({ id: 'ROBOT_ARM_NET_INIT'}),
                //     blockType: BlockType.COMMAND,
                // },
                {
                    opcode: "getAppCommand",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            menu: "SIGNAL",
                            defaultValue: "1"
                        }
                    }
                },
                {
                    opcode: "getAppCommandData",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND_DATA'}),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "SIGNALDATA",
                            defaultValue: "Claws_Silde_Angle"
                        }
                    }
                },
            ],
            menus: {
                ROCKER:{
                    items:[
                        {text:formatMessage({ id: 'ROBOT_ARM_LEFT_ROCKER'}),value:'left'},
                        {text:formatMessage({ id: 'ROBOT_ARM_RIGHT_ROCKER'}),value:'right'}
                    ]
                },
                SERVER: {
                    items: [
                        { text: 'app', value: 'app' },
                        { text: formatMessage({ id: 'ROBOT_ARM_WEB_SERVER'}), value: 'web' }
                    ]
                },
                SERVO_PIN: {
                    items: servo
                },
                JOYSTICK: {
                    items: [
                        { text: 'chassis', value: 'chassis' },
                        { text: 'shoulder', value: 'shoulder' },
                        { text: 'elbow', value: 'elbow' },
                        { text: 'claws', value: 'claws' }
                    ]
                },
                JOYSTICK_PIN: {
                    items: ASSIGN_pin
                },
                COORD: {
                    items: [
                        { text: "x", value: "x" },
                        { text: "y", value: "y" },
                        { text: "z", value: "z" }
                    ]
                },
                ARM_DEFAULT_MOTION:{
                    items: [
                        { text: formatMessage({ id: 'ROBOT_ARM_KEEP'}), value: "keep" },
                        { text: formatMessage({ id: 'ROBOT_ARM_RUN'}), value: "run" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CLEAR'}), value: "clear" }
                    ]
                },
                ARM_MOTION: {
                    items: [
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE1'}), value: "1" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE2'}), value: "2" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE3'}), value: "3" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE4'}), value: "4" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE5'}), value: "5" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE6'}), value: "6" },
                        { text: formatMessage({ id: 'ROBOT_ARM_KEEP'}), value: "keep" },
                        { text: formatMessage({ id: 'ROBOT_ARM_RUN'}), value: "run" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CLEAR'}), value: "clear" }
                    ]
                },
                SIGNAL: {
                    items: [
                        { text: formatMessage({ id: 'ROBOT_ARM_OPEN_CLAWS'}), value: "1" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CLOSE_CLAWS'}), value: "2" },
                        { text: formatMessage({ id: 'ROBOT_ARM_LEFT_CHASSIS'}), value: "4" },
                        { text: formatMessage({ id: 'ROBOT_ARM_RIGHT_CHASSIS'}), value: "5" },
                        { text: formatMessage({ id: 'ROBOT_ARM_UP_SHOULDER'}), value: "6" },
                        { text: formatMessage({ id: 'ROBOT_ARM_DOWN_SHOULDER'}), value: "7" },
                        { text: formatMessage({ id: 'ROBOT_ARM_UP_ELBOW'}), value: "9" },
                        { text: formatMessage({ id: 'ROBOT_ARM_DOWN_ELBOW'}), value: "8" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CLAWS_SLIDE'}), value: "28" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ELBOW_SLIDE'}), value: "27" },
                        { text: formatMessage({ id: 'ROBOT_ARM_SHOULDER_SLIDE'}), value: "26" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CHASSIS_SLIDE'}), value: "25" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CLAWS_INPUT'}), value: "24" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ELBOW_INPUT'}), value: "23" },
                        { text: formatMessage({ id: 'ROBOT_ARM_SHOULDER_INPUT'}), value: "22" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CHASSIS_INPUT'}), value: "21" },
                        { text: formatMessage({ id: 'ROBOT_ARM_DATA_RESRE'}), value: "35" },
                        { text: formatMessage({ id: 'ROBOT_ARM_KEEP_STATE'}), value: "31" },
                        { text: formatMessage({ id: 'ROBOT_ARM_STOP'}), value: "33" },
                        { text: formatMessage({ id: 'ROBOT_ARM_START'}), value: "32" },
                        { text: formatMessage({ id: 'ROBOT_ARM_RUN'}), value: "34" },
                        { text: formatMessage({ id: 'ROBOT_ARM_LOOP_RUN'}), value: "55" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE1'}), value: "41" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE2'}), value: "42" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE3'}), value: "43" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE4'}), value: "44" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE5'}), value: "45" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE6'}), value: "46" },
                        { text: formatMessage({ id: 'ROBOT_ARM_XYZ'}), value: "54" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ZERO'}), value: "60" }
                    ]
                },
                SIGNALDATA: {
                    items: [
                        { text: formatMessage({ id: 'ROBOT_ARM_CLAWS'}), value: "Claws_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ELBOW'}), value: "Elbow_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_SHOULDER'}), value: "Shoulder_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CHASSIS'}), value: "Chassis_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_X'}), value: "PTP_X" },
                        { text: formatMessage({ id: 'ROBOT_ARM_Y'}), value: "PTP_Y" },
                        { text: formatMessage({ id: 'ROBOT_ARM_Z'}), value: "PTP_Z" }
                    ]
                },
                ACTION: {
                    items: [
                        { text: formatMessage({ id: 'ROBOT_ARM_OPEN_CLAWS'}), value: "1" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CLOSE_CLAWS'}), value: "2" },
                        { text: formatMessage({ id: 'ROBOT_ARM_LEFT_CHASSIS'}), value: "4" },
                        { text: formatMessage({ id: 'ROBOT_ARM_RIGHT_CHASSIS'}), value: "5" },
                        { text: formatMessage({ id: 'ROBOT_ARM_UP_SHOULDER'}), value: "6" },
                        { text: formatMessage({ id: 'ROBOT_ARM_DOWN_SHOULDER'}), value: "7" },
                        { text: formatMessage({ id: 'ROBOT_ARM_UP_ELBOW'}), value: "9" },
                        { text: formatMessage({ id: 'ROBOT_ARM_DOWN_ELBOW'}), value: "8" },
                    ]
                }
            }
        }
    }

    armInit = () => { }
    joystick = () => { }
    setJoystickPin = () => { }
    getJoystickData = () => { }
    armMemory = () => { }
    armCoord = () => { }
    getJoystickCoord = () => { }
    armError = () => { }
    setArthrosis = () => { }
    armMotion = () => { }
    armReset = () => { }
    openArmWebServer = () => { }
    armRunAction = () => { }
    armAction = () => { }
    getArmAngle = () => { }
}

module.exports = Scratch3MechanicalArm