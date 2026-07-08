const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

const servo = [
    { text: '1', value: '1' },
    { text: '3', value: '3' },
    { text: '4', value: '4' },
    { text: '5', value: '5' },
    { text: '12', value: '12' },
    { text: '13', value: '13' },
    { text: '14', value: '14' },
    { text: '16', value: '16' },
    { text: '17', value: '17' },
    { text: '18', value: '18' },
    { text: '19', value: '19' },
    { text: '21', value: '21' },
    { text: '22', value: '22' },
    { text: '23', value: '23' },
    { text: '25', value: '25' },
    { text: '26', value: '26' },
    { text: '27', value: '27' },
    { text: '32', value: '32' },
    { text: '33', value: '33' }
]

class Scratch3CarMotorV2 {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "carMotorV2",
            name: formatMessage({ id: 'carMotor.categoryName' })+'V2',
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "carWebInit",
                    text: formatMessage({ id: 'carMotorV2.carWebInit' }), 
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: "initCar",
                    text: formatMessage({ id: 'carMotorV2.initCar' }),
                    blockType:BlockType.COMMAND,
                },
                {
                    opcode:"motor",
                    text:formatMessage({ id: 'carMotorV2.setMotorSpeed' }),
                    blockType:BlockType.COMMAND,
                    arguments:{
                        ONE:{
                            type:ArgumentType.STRING,
                            menu:"MOTOR_PIN",
                            defaultValue:"1"
                        },
                        TWO:{
                            type:ArgumentType.NUMBER,
                            defaultValue:100
                        }
                    }
                },
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
                },
                // {
                //     opcode: "cargetInstructData",
                //     text: formatMessage({ id: 'carMotor.cargetInstructData' }),
                //     blockType: BlockType.REPORTER
                // },

                {
                    func:"aabutton",
                    text:formatMessage({ id: 'carMotor.car.armExpand' }),
                    blockType:BlockType.BUTTON
                },
                //机械臂
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
                    opcode: "armInit",
                    text: formatMessage({ id: 'arm_car.arm.init' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "25"
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "26"
                        },
                        THREE: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "27"
                        },
                        FOUR: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "33"
                        },
                        FIVE: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "4"
                        },
                    }
                },
                {
                    opcode: "setArmAngle",
                    text: formatMessage({ id: 'arm_car.arm.setAngle' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "PART",
                            defaultValue: "chassis"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: "setArmAngleSpeed",
                    text: formatMessage({ id: 'carMotor.setArmAngleSpeed' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "PART",
                            defaultValue: "chassis"
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },
                    }
                },
                {
                    opcode: "getArmAngle",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_ARM_ANGLE' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "PART",
                            defaultValue: "chassis"
                        }
                    }
                },
                {
                    opcode: "armCoord",
                    text: formatMessage({ id: 'ROBOT_ARM_COORD' }),
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
                    opcode: "armReset",
                    text: formatMessage({ id: 'ROBOT_ARM_RESET' }),
                    blockType: BlockType.COMMAND,
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
                    opcode: "getAppCommand",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            menu: "SIGNAL",
                            defaultValue: "28"
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
                {
                    func:"aabutton",
                    text:formatMessage({ id: 'carMotor.firing.expansion'}),
                    blockType:BlockType.BUTTON
                },
                {
                    opcode:"firingModuleInit",
                    text:formatMessage({ id: 'carMotor.firing.module'}),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "32"
                        },
                    }
                },
                {
                    opcode:"firing",
                    text:formatMessage({ id: 'carMotor.firing'}),
                    blockType:BlockType.COMMAND,
                },
                {
                    opcode:"continuous_firing",
                    text:formatMessage({ id: 'carMotor.continuous.firing'}),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "FIRING_TYPE",
                            defaultValue: "open"
                        },
                    }
                },
                {
                    opcode:"firingServoInit",
                    text:formatMessage({ id: 'carMotor.firing.servoInit'}),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "SERVO_PIN",
                            defaultValue: "26"
                        },
                    }
                },
                {
                    opcode:"firingServoSetAngle",
                    text:formatMessage({ id: 'carMotor.firing.servoSetAngle'}),
                    blockType:BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                    }
                },
                {
                    opcode: "firingGetCommand",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.NUMBER,
                            menu: "FIRING_COMMAND",
                            defaultValue: "88"
                        }
                    }
                },
                // {
                //     opcode: "firingGetCommandData",
                //     text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND_DATA'}),
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         TWO: {
                //             type: ArgumentType.STRING,
                //             menu: "FIRING_COMMAND_DATA",
                //             defaultValue: "Camera_servo_angles"
                //         }
                //     }
                // },
                {
                    func:"aabutton",
                    text:formatMessage({ id: 'carMotor.camera.module'}),
                    blockType:BlockType.BUTTON
                },
                {
                    opcode: "carCameraServerInit",
                    text:formatMessage({ id: 'carMotor.camera.serverInit'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'OVERTURN',
                            defaultValue: '1'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: 'LEFT_RIGHT',
                            defaultValue: '1'
                        },
                        THREE:{
                            type: ArgumentType.STRING,
                            menu: 'DEFINITION',
                            defaultValue: '2'
                        }
                    }
                },
                {
                    opcode: "carCameraStartCamera",
                    text:formatMessage({ id: 'carMotor.camera.open'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CAMERA_TYPE',
                            defaultValue: 'web'
                        }
                    }
                },
                {
                    opcode: "cameraServer",
                    text:formatMessage({ id: 'carMotor.camera.server'}),
                    blockType: BlockType.CONDITIONAL,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'SERVER',
                            defaultValue: 'app'
                        }
                    }
                },
                {
                    opcode: "clientIsGetData",
                    text:formatMessage({ id: 'carMotor.camera.clientIsGetData'}),
                    blockType: BlockType.BOOLEAN,
                },
                {
                    opcode: "dataForward",
                    text:formatMessage({ id: 'carMotor.camera.dataForward'}),
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
                    opcode: "cameraCarRun",
                    text:formatMessage({ id: 'carMotor.camera.carRun'}),
                    blockType: BlockType.CONDITIONAL,
                },
                {
                    opcode: "cameraLED",
                    text: formatMessage({ id: 'carMotor.camera.led'}),
                    arguments:{
                        ONE:{
                            type:ArgumentType.STRING,
                            menu:"CAMETA_LED",
                            defaultValue:"1"
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "cameraGetCommant",
                    text: formatMessage({ id: 'carMotor.camera.Commant'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CAMETA_LED',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    func:"aabutton",
                    text:formatMessage({ id: 'carMotor.aabutton.name'}),
                    blockType:BlockType.BUTTON
                },
                // {
                //     opcode: "lcd_init",
                //     text: formatMessage({ id: 'carMotor.visionModule.lcd_init'}),
                //     blockType: BlockType.COMMAND,
                // },
                // {
                //     opcode: "lcd_rotation",
                //     text: formatMessage({ id: 'carMotor.visionModule.lcd_rotation'}),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: 'LED_DIRECTION',
                //             defaultValue: '2'
                //         }
                //     }
                // },
                // {
                //     opcode: "vision_camera_init",
                //     text: formatMessage({ id: 'carMotor.visionModule.vision_camera_init'}),
                //     blockType: BlockType.COMMAND,
                // },
                // {
                //     opcode: "camera_resolution_ratio",
                //     text: formatMessage({ id: 'carMotor.visionModule.camera_resolution_ratio'}),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: 'RESOLUTION_RATIO',
                //             defaultValue: 'QVGA'
                //         }
                //     }
                // },
                // {
                //     opcode: "vision_camera_switch",
                //     text: formatMessage({ id: 'carMotor.visionModule.camera_resolution_ratio'}),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         ONE: {
                //             type: ArgumentType.STRING,
                //             menu: 'CAMERA_SWITCH',
                //             defaultValue: 'open'
                //         }
                //     }
                // },
                {
                    opcode: "ai_mode_init",
                    text:formatMessage({ id: 'arm_car.ai_mode_init'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'SERVO_PIN',
                            defaultValue: '26'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: 'SERVO_PIN',
                            defaultValue: '27'
                        }
                    }
                },
                {
                    opcode: "ai_mode_return",
                    text:formatMessage({ id: 'arm_car.ai_mode_return'}),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "ai_mode_set_color",
                    text:formatMessage({ id: 'arm_car.ai_mode_set_color'}),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: '255'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            defaultValue: '255'
                        },
                        THREE: {
                            type: ArgumentType.STRING,
                            defaultValue: '255'
                        }
                    }
                },
                {
                    opcode: "ai_mode",
                    text: "[ONE]",
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'AI_MODE',
                            defaultValue: 'qrcode_recognize'
                        }
                    }
                },
                {
                    opcode: "color_appoint_recognize",
                    text: formatMessage({ id: 'carMotor.visionModule.color_appoint_recognize'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: "get_recognition_data",
                    text: formatMessage({ id: 'carMotor.visionModule.get_recognition_data'}),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'DATA_NAME',
                            defaultValue: "X"
                        },
                    }
                },
                {
                    opcode: "get_visionModule_command",
                    text: formatMessage({ id: 'carMotor.visionModule.get_visionModule_command'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'VISION_COMMAND',
                            defaultValue: 89
                        }
                    }
                },
                {
                    opcode: "get_visionModule_command_data",
                    text: formatMessage({ id: 'carMotor.visionModule.get_visionModule_command_data'}),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'VISION_COMMAND_DATA',
                            defaultValue: 'RGB_Red_Val'
                        }
                    }
                },
            ],
            menus: {
                MOTOR_PIN:{
                    items:[
                        {text:"M1",value:"1"},
                        {text:"M2",value:"2"},
                        {text:"M3",value:"3"},
                        {text:"M4",value:"4"},
                    ]
                },
                VISION_COMMAND_DATA:{
                    items:[
                        {text:"R",value:"RGB_Red_Val"},
                        {text:"G",value:"RGB_Green_Val"},
                        {text:"B",value:"RGB_Blue_Val"},
                    ]
                },
                VISION_COMMAND:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.menus.qrCode'}),value:"89"},
                        {text:formatMessage({ id: 'carMotor.menus.barCode'}),value:"90"},
                        {text:formatMessage({ id: 'carMotor.menus.num'}),value:"91"},
                        {text:formatMessage({ id: 'carMotor.menus.color'}),value:"92"},
                        {text:formatMessage({ id: 'carMotor.menus.image'}),value:"93"},
                        {text:formatMessage({ id: 'carMotor.menus.color_red'}),value:"94"},
                        {text:formatMessage({ id: 'carMotor.menus.color_blue'}),value:"95"},
                        {text:formatMessage({ id: 'carMotor.menus.color_green'}),value:"96"},
                        {text:formatMessage({ id: 'carMotor.menus.visionModuleLine'}),value:"97"},
                        {text:formatMessage({ id: 'carMotor.menus.trafficIdentification'}),value:"98"},
                        {text:formatMessage({ id: 'carMotor.menus.machineLearning'}),value:"99"},
                        {text:formatMessage({ id: 'carMotor.menus.face'}),value:"100"},
                        {text:formatMessage({ id: 'carMotor.menus.exit'}),value:"3"},
                    ]
                },
                COLOR:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.menus.anyColor'}),value:"0"},
                        {text:formatMessage({ id: 'carMotor.menus.red'}),value:"1"},
                        {text:formatMessage({ id: 'carMotor.menus.green'}),value:"2"},
                        {text:formatMessage({ id: 'carMotor.menus.blue'}),value:"3"}
                    ]
                },
                DATA_NAME:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.menus.x'}),value:"X"},
                        {text:formatMessage({ id: 'carMotor.menus.y'}),value:"Y"},
                        {text:formatMessage({ id: 'carMotor.menus.width'}),value:"W"},
                        {text:formatMessage({ id: 'carMotor.menus.height'}),value:"H"},
                        {text:formatMessage({ id: 'carMotor.menus.result'}),value:"Tag"},
                        {text:formatMessage({ id: 'carMotor.menus.lineData'}),value:"Visual_data"},
                        // {text:"上权重",value:"Tag"},
                        // {text:"中权重",value:"Tag"},
                        // {text:"下权重",value:"Tag"},
                    ]
                },
                AI_MODE:{
                    items:[
                        // {text:formatMessage({ id: 'carMotor.menus.color'}),value:"color_recognize"},
                        {text:formatMessage({ id: 'carMotor.menus.qrCode'}),value:"qrcode_recognize"},
                        {text:formatMessage({ id: 'carMotor.menus.barCode'}),value:"barcode_recognize"},
                        {text:formatMessage({ id: 'carMotor.menus.face'}),value:"face_recognize"},
                        {text:formatMessage({ id: 'carMotor.menus.image'}),value:"image_recognize"},
                        {text:formatMessage({ id: 'carMotor.menus.num'}),value:"number_recognize"},
                        {text:formatMessage({ id: 'carMotor.menus.Traffic_recognize_card'}),value:"Traffic_recognize_card"},
                        {text:formatMessage({ id: 'carMotor.menus.Traffic_recognize_signPlate'}),value:"Traffic_recognize_signPlate"},
                        {text:formatMessage({ id: 'carMotor.menus.visionModuleLine'}),value:"visual_patrol"},
                        // {text:"颜色追踪",value:"color_appoint_recognize"},
                        {text:formatMessage({ id: 'carMotor.menus.machineLearning'}),value:"machine_learning"},
                    ]
                },
                CAMERA_SWITCH:{
                    items:[
                        {text:formatMessage({ id: 'open'}),value:"open"},
                        {text:formatMessage({ id: 'close'}),value:"close"}
                    ]
                },
                RESOLUTION_RATIO:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.menus.QVGA'}),value:"QVGA"},
                        {text:formatMessage({ id: 'carMotor.menus.QQVGA'}),value:"QQVGA"}
                    ]
                },
                LED_DIRECTION:{
                    items:[
                        {text:formatMessage({ id: 'wedo2.tiltDirection.up'}),value:"2"},
                        {text:formatMessage({ id: 'wedo2.tiltDirection.down'}),value:"0"},
                        {text:formatMessage({ id: 'wedo2.tiltDirection.left'}),value:"3"},
                        {text:formatMessage({ id: 'wedo2.tiltDirection.right'}),value:"1"},
                    ]
                },
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
                        },
                        {
                            text: formatMessage({ id: 'carMotor.bluetoothController.leftUp'}),
                            value: "leftUp"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.bluetoothController.leftDown'}),
                            value: "leftDown"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.bluetoothController.rightUp'}),
                            value: "rightUp"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.bluetoothController.rightDown'}),
                            value: "rightDown"
                        },
                        // {
                        //     text: formatMessage({ id: 'carMotor.lf' }),
                        //     value: "leftUp"
                        // },
                        // {
                        //     text: formatMessage({ id: 'carMotor.lr' }),
                        //     value: "leftDown"
                        // },
                        // {
                        //     text: formatMessage({ id: 'carMotor.rf' }),
                        //     value: "rightUp"
                        // },
                        // {
                        //     text: formatMessage({ id: 'carMotor.rr' }),
                        //     value: "rightDown"
                        // },
                        {
                            text: formatMessage({ id: 'carMotor.clockwise' }),
                            value: "clockwise"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.anticlockwise' }),
                            value: "anticlockwise"
                        },

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
                            text: formatMessage({ id: 'carMotor.leftUp' }),
                            value: "74"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.leftDown' }),
                            value: "71"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.rightUp' }),
                            value: "72"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.rightDown' }),
                            value: "73"
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
                PART: {
                    items: [
                        { text: 'chassis', value: 'chassis' },
                        { text: 'shoulder', value: 'shoulder' },
                        { text: 'elbow', value: 'elbow' },
                        { text: 'claws', value: 'claws' },
                        { text: 'wrist', value: 'wrist' }
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
                SERVO_PIN: {
                    items: servo
                },
                SIGNALDATA: {
                    items: [
                        { text: formatMessage({ id: 'ROBOT_ARM_CLAWS'}), value: "Claws_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ELBOW'}), value: "Elbow_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_SHOULDER'}), value: "Shoulder_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CHASSIS'}), value: "Chassis_Silde_Angle" },
                        { text: formatMessage({ id: 'arm_car.arm.wrist'}), value: "Wrist_Silde_Angle" },
                        { text: formatMessage({ id: 'ROBOT_ARM_X'}), value: "PTP_X" },
                        { text: formatMessage({ id: 'ROBOT_ARM_Y'}), value: "PTP_Y" },
                        { text: formatMessage({ id: 'ROBOT_ARM_Z'}), value: "PTP_Z" },
                        // {text: "小车速度", value: "Car_Speed"}
                    ]
                },
                SIGNAL: {
                    items: [
                        { text: formatMessage({ id: 'ROBOT_ARM_CLAWS_SLIDE' }), value: "28" },
                        { text: formatMessage({ id: 'arm_car.arm.wristSlide' }), value: "30" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ELBOW_SLIDE' }), value: "27" },
                        { text: formatMessage({ id: 'ROBOT_ARM_SHOULDER_SLIDE' }), value: "26" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CHASSIS_SLIDE' }), value: "25" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CLAWS_INPUT' }), value: "24" },
                        { text: formatMessage({ id: 'arm_car.arm.wristInput' }), value: "29" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ELBOW_INPUT' }), value: "23" },
                        { text: formatMessage({ id: 'ROBOT_ARM_SHOULDER_INPUT' }), value: "22" },
                        { text: formatMessage({ id: 'ROBOT_ARM_CHASSIS_INPUT' }), value: "21" },
                        { text: formatMessage({ id: 'ROBOT_ARM_DATA_RESRE' }), value: "35" },
                        { text: formatMessage({ id: 'ROBOT_ARM_KEEP_STATE' }), value: "31" },
                        { text: formatMessage({ id: 'ROBOT_ARM_STOP' }), value: "33" },
                        { text: formatMessage({ id: 'ROBOT_ARM_START' }), value: "32" },
                        { text: formatMessage({ id: 'ROBOT_ARM_RUN' }), value: "34" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE1' }), value: "41" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE2' }), value: "42" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE3' }), value: "43" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE4' }), value: "44" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE5' }), value: "45" },
                        { text: formatMessage({ id: 'ROBOT_ARM_MODE6' }), value: "46" },
                        { text: formatMessage({ id: 'ROBOT_ARM_XYZ' }), value: "54" },
                        { text: formatMessage({ id: 'ROBOT_ARM_ZERO' }), value: "70" }
                    ]
                },
                FIRING_COMMAND: {
                    items: [
                        { text: formatMessage({ id: 'carMotor.item.firing' }), value: "88" },
                        // { text: "射击角度", value: "81" }
                    ]
                },
                FIRING_COMMAND_DATA: {
                    items: [
                        { text: formatMessage({ id: 'carMotor.item.firingAngle' }), value: "Camera_servo_angles" }
                    ]
                },
                CARSIGNALDATA:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.speed' }),value:"Car_Speed"},
                        {text:formatMessage({ id: 'carMotor.slider' }),value:"SliderAngle"},
                    ]
                },
                OVERTURN:{
                    items:[
                        {text: formatMessage({ id: 'carMotor.item.forwardDirection' }),value:"1"},
                        {text: formatMessage({ id: 'carMotor.item.reverseDirection' }),value:"0"}
                    ]
                },
                LEFT_RIGHT:{
                    items:[
                        {text: formatMessage({ id: 'carMotor.item.flipToTheLeft' }),value:'1'},
                        {text: formatMessage({ id: 'carMotor.item.flipToTheRight' }),value:'0'}
                    ]
                },
                CAMERA_TYPE:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.camera.frames' }),value:"camera"},
                        {text:formatMessage({ id: 'carMotor.camera.webPageControl' }),value:"web"}
                    ]
                },
                DEFINITION:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.camera.highDefinition' }),value:"3"},
                        {text:formatMessage({ id: 'carMotor.camera.mediumQuality' }),value:"2"},
                        {text:formatMessage({ id: 'carMotor.camera.lowQuality' }),value:"1"}
                    ]
                },
                Buttons:{
                    items:[
                        {text: "L1",value:"l1"},
                        {text: "L2",value:"l2"},
                        {text: "R1",value:"r1"},
                        {text: "R2",value:"r2"},
                        {text: "UP",value:"up"},
                        {text: "DOWN",value:"down"},
                        {text: "LEFT",value:"left"},
                        {text: "RIGHT",value:"right"},
                        {text: "X",value:"square"},
                        {text: "Y",value:"triangle"},
                        {text: "A",value:"cross"},
                        {text: "B",value:"circle"},
                        {text: "SELECT",value:"select"},
                        {text: "START",value:"start"},
                        {text: "PS",value:"ps"}
                    ]
                },
                ROCKER:{
                    items:[
                        {text: formatMessage({ id: 'ROBOT_ARM_LEFT_ROCKER' }),value:"left"},
                        {text: formatMessage({ id: 'ROBOT_ARM_RIGHT_ROCKER' }),value:"right"}
                    ]
                },
                AXIS:{
                    items:[
                        {text: "x",value:"x"},
                        {text: "y",value:"y"}
                    ]
                },
                Buttons_ACTION:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.bluetoothController.pressDown' }),value:"down"},
                        {text:formatMessage({ id: 'carMotor.bluetoothController.undo' }),value:"up"}
                    ]
                },
                FIRING_TYPE:{
                    items:[
                        {text:formatMessage({ id: 'open' }),value:"open"},
                        {text:formatMessage({ id: 'close' }),value:"close"}
                    ]
                },
                CAMETA_LED:{
                    items:[
                        {
                            text: formatMessage({ id: 'carMotor.openLED' }),
                            value: "1"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.closeLED' }),
                            value: "0"
                        },
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

module.exports = Scratch3CarMotorV2