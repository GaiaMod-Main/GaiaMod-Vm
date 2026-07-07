const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3MeteorologicalStation {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "meteorologicalStation",
            name: formatMessage({ id: 'meteorologicalStation.categoryName' }),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "weather_setWebTitle",
                    text: formatMessage({ id: 'meteorologicalStation_weather_setWebTitle' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Weather Station"
                        }
                    }
                },
                {
                    opcode: "weather_setServoName",
                    text: formatMessage({ id: 'meteorologicalStation_weather_setServoName' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: "Servo"
                        }
                    }
                },
                {
                    opcode: "weather_setLanguage",
                    text: formatMessage({ id: 'meteorologicalStation_weather_setLanguage' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'LANGUAGE',
                            defaultValue: 'English'
                        }
                    }
                },
                {
                    opcode: "weather_server",
                    text: formatMessage({ id: 'meteorologicalStation.server' }),
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
                    opcode: "weather_get_instruct",
                    text: formatMessage({ id: 'carMotor.carGetInstruct' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CARTYPE',
                            defaultValue: 'lightVal'
                        }
                    }
                },
                {
                    opcode: "weather_send_data",
                    text: formatMessage({ id: 'meteorologicalStation.sendData' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CARTYPE1',
                            defaultValue: 'light'
                        },
                        TWO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                    }
                },
                {
                    opcode: "weather_get_commandData",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND_DATA' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "CARSIGNALDATA",
                            defaultValue: "servo_angle"
                        }
                    }
                }
            ],
            menus: {
                LANGUAGE:{
                    items: [
                        { text: formatMessage({ id: 'meteorologicalStation.english' }), value: 'English' },
                        { text: formatMessage({ id: 'meteorologicalStation.chinese' }), value: 'Chinese' }
                    ]
                },
                SERVER: {
                    items: [
                        { text: 'app', value: 'app' },
                        { text: formatMessage({ id: 'ROBOT_ARM_WEB_SERVER' }), value: 'web' }
                    ]
                },
                CARTYPE: {
                    items: [
                        {
                            text: formatMessage({ id: 'meteorologicalStation.light' }),
                            value: "lightVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.uv' }),
                            value: "uvVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.atm' }),
                            value: "atmVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.rain' }),
                            value: "rainVal"
                        },
                        {
                            text: 'PM2.5',
                            value: "pm25Val"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.wind' }),
                            value: "windVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.tem' }),
                            value: "temVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.hum' }),
                            value: "humVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.vibration' }),
                            value: "VibrationVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.servo' }),
                            value: "servoVal"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.all' }),
                            value: "allVal"
                        }
                    ]
                },
                CARTYPE1: {
                    items: [
                        {
                            text: formatMessage({ id: 'meteorologicalStation.light' }),
                            value: "light"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.uv' }),
                            value: "uv"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.atm' }),
                            value: "atm"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.rain' }),
                            value: "rain"
                        },
                        {
                            text: 'PM2.5',
                            value: "pm25_value"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.wind' }),
                            value: "wind"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.tem' }),
                            value: "bmp_tem"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.hum' }),
                            value: "hum"
                        },
                        {
                            text: formatMessage({ id: 'meteorologicalStation.vibration' }),
                            value: "Vibration1"
                        }
                    ]
                },
                CARSIGNALDATA: {
                    items: [
                        { text: formatMessage({ id: 'meteorologicalStation.servo' }), value: "servo_angle" }
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

    aabutton() { }

    aaaaa() { }
}

module.exports = Scratch3MeteorologicalStation