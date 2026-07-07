const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3SmartFarme {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "smartFarm",
            name: formatMessage({ id: 'smartFarm.categoryName' }),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "smartFarm_server",
                    text: formatMessage({ id: 'smartFarm.server' }),
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
                    opcode: "smartFarm_get_instruct",
                    text: formatMessage({ id: 'carMotor.carGetInstruct' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'CARTYPE',
                            defaultValue: 'LEDVal == 1'
                        }
                    }
                },
                {
                    opcode: "smartFarm_send_data",
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
                    opcode: "smartFarm_get_commandData",
                    text: formatMessage({ id: 'ROBOT_ARM_GET_COMMAND_DATA' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "CARSIGNALDATA",
                            defaultValue: "RVal"
                        }
                    }
                },
                {
                    opcode: "smartFarm_reset",
                    text: formatMessage({ id: 'smartHome.reset' }),
                    blockType: BlockType.COMMAND
                },
            ],
            menus: {
                SERVER: {
                    items: [
                        { text: 'app', value: 'app' },
                    ]
                },
                CARTYPE: {
                    items: [
                        {
                            text: formatMessage({ id: 'smartHome.openLED' }),
                            value: "LEDVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.closeLED' }),
                            value: "LEDVal == 0"
                        },
                        {
                            text: formatMessage({ id: 'smartFarm.openFeeder' }),
                            value: "DoorVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartFarm.closeFeeder' }),
                            value: "DoorVal == 0"
                        },
                        {
                            text: formatMessage({ id: 'smartFarm.waterLevel' }),
                            value: "WaterVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.PIR' }),
                            value: "HumanVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.Tem' }),
                            value: "TemVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.Hum' }),
                            value: "HumVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartFarm.soilMoisture' }),
                            value:"SoilVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.light' }),
                            value: "LightVal == 1"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.openRGB' }),
                            value: "RGBVal == 1"
                        }
                    ]
                },
                CARTYPE1: {
                    items: [
                        {
                            text: formatMessage({ id: 'smartFarm.waterLevel' }),
                            value: "water"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.PIR' }),
                            value: "human"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.Tem' }),
                            value: "tem"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.Hum' }),
                            value: "hum"
                        },
                        {
                            text: formatMessage({ id: 'smartFarm.soilMoisture' }),
                            value:"soil"
                        },
                        {
                            text: formatMessage({ id: 'smartHome.light' }),
                            value: "light"
                        }
                    ]
                },
                CARSIGNALDATA: {
                    items: [
                        {
                            text:"R",
                            value: "RVal"
                        },
                        {
                            text: "G",
                            value: "GVal"
                        },
                        {
                            text: "B",
                            value: "BVal"
                        }
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

module.exports = Scratch3SmartFarme