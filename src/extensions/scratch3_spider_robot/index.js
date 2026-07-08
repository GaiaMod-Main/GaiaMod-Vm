const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3SpiderRobot {
    constructor(runtime) {
        this.runtime = runtime

    }

    getInfo() {
        return {
            id: "fourLeggedBionicSpider",
            name: formatMessage({ id: 'fourLeggedBionicSpider.categoryName' }),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "spiderInit",
                    text: formatMessage({ id: 'fourLeggedBionicSpider.init' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'INITSELECT',
                            defaultValue: 'tcp'
                        }
                    }
                },
                {
                    opcode: "spiderMove",
                    text: formatMessage({ id: 'fourLeggedBionicSpider.spiderMove' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'DIRECTION',
                            defaultValue: 'front'
                        }
                    }
                },
                {
                    opcode: "spiderMode",
                    text: formatMessage({ id: 'fourLeggedBionicSpider.spiderMode' }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'MODE',
                            defaultValue: 'standby'
                        }
                    }
                },
                {
                    opcode: "spiderGetInstruct",
                    text: formatMessage({ id: 'fourLeggedBionicSpider.spiderGetInstruct' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: 'MODE_ITEM',
                            defaultValue: 'front'
                        }
                    }
                },
                {
                    opcode: "spiderExecute",
                    text: formatMessage({ id: 'fourLeggedBionicSpider.spiderExecute' }),
                    blockType: BlockType.CONDITIONAL,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'callback'
                        },
                    }
                },
            ],
            menus: {
                DIRECTION: {
                    items: [
                        {
                            text: formatMessage({ id: 'carMotor.front' }),
                            value: "front"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.back' }),
                            value: "back"
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
                            text: formatMessage({ id: 'carMotor.clockwise' }),
                            value: "clockwise"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.anticlockwise' }),
                            value: "anticlockwise"
                        }
                    ],
                },
                INITSELECT: {
                    items: [
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.tcp' }),
                            value: "tcp"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.uart' }),
                            value: "uart"
                        },
                    ]
                },
                MODE: {
                    items: [
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.standby' }),
                            value: "standby"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.lying' }),
                            value: "lying"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.sleep' }),
                            value: "sleep"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.greet' }),
                            value: "greet"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.pushup' }),
                            value: "pushup"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.fighting' }),
                            value: "fighting"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.dancing' }),
                            value: "dancing"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.swing' }),
                            value: "swing"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.handsome' }),
                            value: "handsome"
                        },
                    ]
                },
                MODE_ITEM: {
                    items: [
                        {
                            text: formatMessage({ id: 'carMotor.forward' }),
                            value: "front"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.backward' }),
                            value: "back"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.leftMove' }),
                            value: "left"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.rightMove' }),
                            value: "right"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.clockwise' }),
                            value: "clockwise"
                        },
                        {
                            text: formatMessage({ id: 'carMotor.anticlockwise' }),
                            value: "anticlockwise"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.standby' }),
                            value: "standby"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.lying' }),
                            value: "lying"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.sleep' }),
                            value: "sleep"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.greet' }),
                            value: "greet"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.pushup' }),
                            value: "pushup"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.fighting' }),
                            value: "fighting"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.dancing' }),
                            value: "dancing"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.swing' }),
                            value: "swing"
                        },
                        {
                            text: formatMessage({ id: 'fourLeggedBionicSpider.handsome' }),
                            value: "handsome"
                        }
                    ]
                }
            }
        }
    }

    spiderMove() {

    }

    spiderRotate() {

    }

    spiderMode() {

    }

    spiderInit() {

    }

    spiderExecute() {

    }
}

module.exports = Scratch3SpiderRobot