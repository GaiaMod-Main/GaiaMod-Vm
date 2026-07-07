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

class Scratch3BipedRobot {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "bipedRobot",
            name: formatMessage({ id: 'bipedRobot.categoryName'}),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "bipedRobotSetPin",
                    text: formatMessage({ id: 'bipedRobot.bipedRobotSetPin'}),
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
                            defaultValue: "18"
                        },
                        FOUR: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "17"
                        },
                    }
                },
                {
                    opcode: "bipedRobotRunAction",
                    text: formatMessage({ id: 'bipedRobot.bipedRobotRunAction'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'ACTIONS',
                            defaultValue: 'forward'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                    }
                },
                {
                    opcode: "bipedRobotStop",
                    text: formatMessage({ id: 'bipedRobot.stop'}),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "bipedRobotReset",
                    text: formatMessage({ id: 'bipedRobot.reset'}),
                    blockType: BlockType.COMMAND,
                },
                {
                    opcode: "bipedRobotCreatAction",
                    text: formatMessage({ id: 'bipedRobot.bipedRobotCreatAction'}),
                    blockType: BlockType.HAT,
                    arguments:{
                        ONE: {
                            type: ArgumentType.STRING,
                            // menu:'DEMO',
                            defaultValue: "custom"
                        },
                    }
                },
                {
                    opcode: "bipedRobotSetAngle",
                    text: formatMessage({ id: 'bipedRobot.bipedRobotSetAngle'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "45"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "45"
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "45"
                        },
                        FOUR: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "45"
                        },
                        FIVE:{
                            type: ArgumentType.NUMBER,
                            defaultValue: "60"
                        }
                    }
                },
                {
                    opcode: "bipedRobotRun",
                    text: formatMessage({ id: 'bipedRobot.bipedRobotRun'}),
                    blockType: BlockType.COMMAND,
                    arguments:{
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: "custom"
                        },
                    }
                },
                {
                    opcode: "bipedRobotServe",
                    text: formatMessage({ id: 'bipedRobot.bipedRobotServe'}),
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
                    opcode: "bipedRobotGetAppCommand",
                    text: formatMessage({ id: 'bipedRobot.bipedRobotGetAppCommand'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            menu: 'COMMAND',
                            defaultValue: '1'
                        }
                    }
                },
            ],
            menus: {
                ACTIONS: {
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
                            text: formatMessage({ id: 'bipedRobot.leftTurn'}),
                            value: "leftward"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightTurn'}),
                            value: "rightward"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftKick'}),
                            value: "left_kick"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightKick'}),
                            value: "right_kick"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftTilt'}),
                            value: "left_tilt"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightTilt'}),
                            value: "right_tilt"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftAnkles'}),
                            value: "left_ankles"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightAnkles'}),
                            value: "right_ankles"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftStamp'}),
                            value: "left_stamp"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightStamp'}),
                            value: "right_stamp"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.shadowsStep'}),
                            value: "shadows_step"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.dance'})+1,
                            value: "dance1"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.dance'})+2,
                            value: "dance2"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.dance'})+3,
                            value: "dance3"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.follow'}),
                            value: "follow"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.avoid'}),
                            value: "avoid"
                        }
                    ]
                },
                COMMAND: {
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
                            text:  formatMessage({ id: 'bipedRobot.leftTurn'}),
                            value: "3"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightTurn'}),
                            value: "4"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftKick'}),
                            value: "11"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightKick'}),
                            value: "12"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftTilt'}),
                            value: "13"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightTilt'}),
                            value: "14"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftAnkles'}),
                            value: "19"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightAnkles'}),
                            value: "21"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.leftStamp'}),
                            value: "15"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.rightStamp'}),
                            value: "20"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.shadowsStep'}),
                            value: "10"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.dance'}),
                            value: "16"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.follow'}),
                            value: "18"
                        },
                        {
                            text: formatMessage({ id: 'bipedRobot.avoid'}),
                            value: "17"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.move.stop'}),
                            value: "8"
                        },
                    ]
                },
                SERVER: {
                    items: [
                        { text: 'app', value: 'app' },
                        { text: formatMessage({ id: 'ROBOT_ARM_WEB_SERVER' }), value: 'web' }
                    ]
                },
                SERVO_PIN: {
                    items: servo
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