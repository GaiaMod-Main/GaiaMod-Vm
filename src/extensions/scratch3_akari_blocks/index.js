const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const axios = require('axios').default;
const Color = require('./lib/color.js');
const Icons = require('./lib/icons.js');

const hostname = location.hostname;
log.log(`host: ${hostname}`);
const client = `http://${hostname}:52002`;
const motorClient = `${client}/motor`;
const pinoutClient = `${client}/pinout`;
const sensorClient = `${client}/sensor`;
const displayClient = `${client}/display`;

let panMin = 0;
let panMax = 0;
let tiltMin = 0;
let tiltMax = 0;
let panTarget = 0;
let tiltTarget = 0;
let motorVel = 0;
let motorAcc = 0;
let buttonA = false;
let buttonB = false;
let buttonC = false;
let dout0Target = false;
let dout1Target = false;
let pwmout0Target = 0;
let din0 = true;
let din1 = true;
let ain0 = 0;
let temperature = 0;
let pressure = 0;
let brightness = 0;
let displayColor = Color.RgbColors.WHITE;
let foregroundColor = Color.RgbColors.BLACK;
let fontSize = 5;
const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

/**
 * Enum for joints.
 * @readonly
 * @enum {string}
 */
const Joints = {
    PAN: 'pan',
    TILT: 'tilt'
};

/**
 * Enum for buttons.
 * @readonly
 * @enum {string}
 */
const Buttons = {
    A: 'A',
    B: 'B',
    C: 'C',
    ANY: 'any'
};

/**
 * Enum for dins.
 * @readonly
 * @enum {string}
 */
const Dins = {
    DIN0: 'din0',
    DIN1: 'din1',
    ANY: 'any'
};

/**
 * Enum for dins.
 * @readonly
 * @enum {string}
 */
const Douts = {
    DOUT0: 'dout0',
    DOUT1: 'dout1'
};

/**
 * Enum for pin value.
 * @readonly
 * @enum {string}
 */
const Pinvals = {
    HIGH: 'High',
    LOW: 'Low'
};

/**
 * Enum for sensors.
 * @readonly
 * @enum {string}
 */
const Sensors = {
    TEMPERATURE: 'temperature',
    PRESSURE: 'pressure',
    BRIGHTNESS: 'brightness'
};

const setLimit = function (val, min, max) {
    let out = val;
    if (out > max) {
        out = max;
    } else if (out < min) {
        out = min;
    }
    return out;
};

const sendAbsolutePosition = async () => {
    await axios.post(`${motorClient}/positions`, {
        pan: panTarget * DEG2RAD,
        tilt: tiltTarget * DEG2RAD
    });
};

const sendVel = async () => {
    await axios.post(`${motorClient}/velocity`, null, {
        params: { vel: motorVel * DEG2RAD }
    });
};

const sendAcc = async () => {
    await axios.post(`${motorClient}/acceleration`, null, {
        params: { acc: motorAcc * DEG2RAD }
    });
};

const setServoStatus = async function (status) {
    await axios.post(`${motorClient}/servo`, null, {
        params: { enabled: status }
    });
};

const getServoStatus = async () => {
    const res = await axios.get(`${motorClient}/servo`);
    panMin = parseFloat(res.data.pan_min) * RAD2DEG;
    panMax = parseFloat(res.data.pan_max) * RAD2DEG;
    tiltMin = parseFloat(res.data.tilt_min) * RAD2DEG;
    tiltMax = parseFloat(res.data.tilt_max) * RAD2DEG;
    motorVel = parseFloat(res.data.vel) * RAD2DEG;
    motorAcc = parseFloat(res.data.acc) * RAD2DEG;
};

const getServoPosition = async () => {
    const res = await axios.get(`${motorClient}/positions`);
    panTarget = parseFloat(res.data.pan) * RAD2DEG;
    tiltTarget = parseFloat(res.data.tilt) * RAD2DEG;
};

const getSensorData = async () => {
    const res = await axios.get(`${sensorClient}/values`);
    buttonA = res.data.button_a;
    buttonB = res.data.button_b;
    buttonC = res.data.button_c;
    din0 = res.data.din0;
    din1 = res.data.din1;
    ain0 = parseFloat(res.data.ain0);
    temperature = parseFloat(res.data.temperature);
    pressure = parseFloat(res.data.pressure);
    brightness = parseFloat(res.data.brightness);
};

const setPinout = async () => {
    await axios.post(`${pinoutClient}/values`, {
        dout0: dout0Target,
        dout1: dout1Target,
        pwmout0: pwmout0Target
    });
};

const setDisplayText = async function (text) {
    await axios.post(`${displayClient}/values`, {
        text: text,
        display_color: displayColor,
        foreground_color: foregroundColor,
        font_size: fontSize
    });
};

const setDisplayImage = async function (path) {
    await axios.post(`${displayClient}/image`, null, {
        params: { path: path }
    });
};
class Scratch3AkariBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        getServoStatus();
        getServoPosition();
        setInterval(() => {
            getSensorData();
        }, 100);
    }

    get JOINTS_MENU() {
        return [
            {
                text: 'pan',
                value: Joints.PAN
            },
            {
                text: 'tilt',
                value: Joints.TILT
            }
        ];
    }
    get BUTTONS_MENU() {
        return [
            {
                text: 'A',
                value: Buttons.A
            },
            {
                text: 'B',
                value: Buttons.B
            },
            {
                text: 'C',
                value: Buttons.C
            },
            {
                text: 'ANY',
                value: Buttons.ANY
            }
        ];
    }

    get DINS_MENU() {
        return [
            {
                text: '0',
                value: Dins.DIN0
            },
            {
                text: '1',
                value: Dins.DIN1
            },
            {
                text: 'ANY',
                value: Dins.ANY
            }
        ];
    }

    get DOUTS_MENU() {
        return [
            {
                text: '0',
                value: Douts.DOUT0
            },
            {
                text: '1',
                value: Douts.DOUT1
            }
        ];
    }
    get PINVAL_MENU() {
        return [
            {
                text: 'Hi',
                value: Pinvals.HIGH
            },
            {
                text: 'Lo',
                value: Pinvals.LOW
            }
        ];
    }
    get SENSORS_MENU() {
        return [
            {
                text: '温度',
                value: Sensors.TEMPERATURE
            },
            {
                text: '気圧',
                value: Sensors.PRESSURE
            },
            {
                text: '明るさ',
                value: Sensors.BRIGHTNESS
            }
        ];
    }
    get COLOR_MENU() {
        return [
            {
                text: 'しろ',
                value: Color.Colors.WHITE
            },
            {
                text: 'くろ',
                value: Color.Colors.BLACK
            },
            {
                text: 'あか',
                value: Color.Colors.RED
            },
            {
                text: 'みどり',
                value: Color.Colors.GREEN
            },
            {
                text: 'あお',
                value: Color.Colors.BLUE
            },
            {
                text: 'きいろ',
                value: Color.Colors.YELLOW
            },
            {
                text: 'むらさき',
                value: Color.Colors.PURPLE
            },
            {
                text: 'オレンジ',
                value: Color.Colors.ORANGE
            },
            {
                text: 'ピンク',
                value: Color.Colors.PINK
            },
            {
                text: 'はいいろ',
                value: Color.Colors.DARKGRAY
            }
        ];
    }
    getInfo() {
        return {
            id: 'akariblocks',
            name: 'Akari Blocks',
            menuIconURI: Icons.menuIconURI,
            blockIconURI: Icons.blockIconURI,
            blocks: [
                {
                    opcode: 'servoOn',
                    blockType: BlockType.COMMAND,
                    text: 'servoをONにする',
                    arguments: {}
                },
                {
                    opcode: 'servoOff',
                    blockType: BlockType.COMMAND,
                    text: 'servoをOFFにする',
                    arguments: {}
                },
                {
                    opcode: 'getMotorPos',
                    text: '[JOINT]の位置',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        JOINT: {
                            type: ArgumentType.STRING,
                            menu: 'joints',
                            defaultValue: Joints.PAN
                        }
                    }
                },
                {
                    opcode: 'setMotorPos',
                    blockType: BlockType.COMMAND,
                    text: '[JOINT]を[ANGLE]°に移動する',
                    arguments: {
                        JOINT: {
                            type: ArgumentType.STRING,
                            menu: 'joints',
                            defaultValue: Joints.PAN
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setAllMotorPos',
                    blockType: BlockType.COMMAND,
                    text: 'panを[PAN]°、tiltを[TILT]°に移動する',
                    arguments: {
                        PAN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TILT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setMotorRelativePos',
                    blockType: BlockType.COMMAND,
                    text: '[JOINT]を現在位置から[ANGLE]°移動する',
                    arguments: {
                        JOINT: {
                            type: ArgumentType.STRING,
                            menu: 'joints',
                            defaultValue: Joints.PAN
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setAllMotorRelativePos',
                    blockType: BlockType.COMMAND,
                    text: 'panを現在位置から[PAN]°、tiltを現在位置から[TILT]°移動する',
                    arguments: {
                        PAN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TILT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setVel',
                    blockType: BlockType.COMMAND,
                    text: 'モータ角速度を[VEL]°/sにする',
                    arguments: {
                        VEL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setAcc',
                    blockType: BlockType.COMMAND,
                    text: 'モータ角加速度を[ACC]°/s^2にする',
                    arguments: {
                        ACC: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'whenButtonPressed',
                    blockType: BlockType.HAT,
                    text: 'ボタン[BTN]が押されたとき',
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons',
                            defaultValue: Buttons.A
                        }
                    }
                },
                {
                    opcode: 'isButtonPressed',
                    text: 'ボタン[BTN]が押された',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons',
                            defaultValue: Buttons.A
                        }
                    }
                },
                {
                    opcode: 'whenDin',
                    blockType: BlockType.HAT,
                    text: 'din[PIN]がLowになったとき',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'dins',
                            defaultValue: Dins.DIN0
                        }
                    }
                },
                {
                    opcode: 'isDin',
                    text: 'din[PIN]がLow',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'dins',
                            defaultValue: Dins.DIN0
                        }
                    }
                },
                {
                    opcode: 'getAin',
                    text: 'ain0の値',
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                },
                {
                    opcode: 'getSensor',
                    text: '[SENSOR]の値',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        SENSOR: {
                            type: ArgumentType.STRING,
                            menu: 'sensors',
                            defaultValue: Sensors.Temperature
                        }
                    }
                },
                {
                    opcode: 'setDOut',
                    blockType: BlockType.COMMAND,
                    text: 'dout[PIN]を[VALUE]にする',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'douts',
                            defaultValue: Douts.Dout0
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            menu: 'pinvals',
                            defaultValue: Pinvals.LOW
                        }
                    }
                },
                {
                    opcode: 'setPwmOut',
                    blockType: BlockType.COMMAND,
                    text: 'pwmout0を[VALUE]にする',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setDisplayColor',
                    blockType: BlockType.COMMAND,
                    text: '画面表示の背景色を[COLOR]に設定する',
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'colors',
                            defaultValue: Color.Colors.WHITE
                        }
                    }
                },
                {
                    opcode: 'setForegroundColor',
                    blockType: BlockType.COMMAND,
                    text: '画面表示の文字色を[COLOR]に設定する',
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'colors',
                            defaultValue: Color.Colors.BLACK
                        }
                    }
                },
                {
                    opcode: 'setDisplayFontSize',
                    blockType: BlockType.COMMAND,
                    text: '画面表示の文字サイズを[SIZE]にする',
                    arguments: {
                        SIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: 'setDisplayText',
                    blockType: BlockType.COMMAND,
                    text: '画面に[TEXT]を表示する',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                {
                    opcode: 'setDisplayImage',
                    blockType: BlockType.COMMAND,
                    text: '画面に画像[PATH]を表示する',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: '/jpg/logo320.jpg'
                        }
                    }
                }
            ],
            menus: {
                joints: {
                    acceptReporters: true,
                    items: this.JOINTS_MENU
                },
                buttons: {
                    acceptReporters: true,
                    items: this.BUTTONS_MENU
                },
                dins: {
                    acceptReporters: true,
                    items: this.DINS_MENU
                },
                douts: {
                    acceptReporters: true,
                    items: this.DOUTS_MENU
                },
                pinvals: {
                    acceptReporters: true,
                    items: this.PINVAL_MENU
                },
                sensors: {
                    acceptReporters: true,
                    items: this.SENSORS_MENU
                },
                colors: {
                    acceptReporters: true,
                    items: this.COLOR_MENU
                }
            }
        };
    }

    async servoOn() {
        await (setServoStatus(true));
    }

    async servoOff() {
        await (setServoStatus(false));
    }

    async getMotorPos(args) {
        await (getServoPosition());
        if (args.JOINT === Joints.PAN) {
            return panTarget;
        } else if (args.JOINT === Joints.TILT) {
            return tiltTarget;
        }
        return 0;
    }

    async setMotorPos(args) {
        if (args.JOINT === Joints.PAN) {
            panTarget = setLimit(parseFloat(args.ANGLE), panMin, panMax);
        } else if (args.JOINT === Joints.TILT) {
            tiltTarget = setLimit(parseFloat(args.ANGLE), tiltMin, tiltMax);
        }
        await (sendAbsolutePosition());
    }

    async setMotorRelativePos(args) {
        if (args.JOINT === Joints.PAN) {
            panTarget = setLimit(panTarget + parseFloat(args.ANGLE), panMin, panMax);
        } else if (args.JOINT === Joints.TILT) {
            tiltTarget = setLimit(tiltTarget + parseFloat(args.ANGLE), tiltMin, tiltMax);
        }
        await (sendAbsolutePosition());
    }

    async setAllMotorPos(args) {
        panTarget = setLimit(parseFloat(args.PAN), panMin, panMax);
        tiltTarget = setLimit(parseFloat(args.TILT, tiltMin, tiltMax));
        await (sendAbsolutePosition());
    }

    async setAllMotorRelativePos(args) {
        panTarget = setLimit(panTarget + parseFloat(args.PAN), panMin, panMax);
        tiltTarget = setLimit(tiltTarget + parseFloat(args.TILT), tiltMin, tiltMax);
        await (sendAbsolutePosition());
    }

    async setVel(args) {
        motorVel = args.VEL;
        await (sendVel());
    }

    async setAcc(args) {
        motorAcc = args.ACC;
        await (sendAcc());
    }

    whenButtonPressed(args) {
        if (args.BTN === Buttons.ANY) {
            return buttonA | buttonB | buttonC;
        } else if (args.BTN === Buttons.A) {
            return buttonA;
        } else if (args.BTN === Buttons.B) {
            return buttonB;
        } else if (args.BTN === Buttons.C) {
            return buttonC;
        }
        return false;
    }
    async isButtonPressed(args) {
        if (args.BTN === Buttons.ANY) {
            return buttonA | buttonB | buttonC;
        } else if (args.BTN === Buttons.A) {
            return buttonA;
        } else if (args.BTN === Buttons.B) {
            return buttonB;
        } else if (args.BTN === Buttons.C) {
            return buttonC;
        }
        return false;
    }

    whenDin(args) {
        if (args.PIN === Dins.ANY) {
            return !(din0 && din1);
        } else if (args.PIN === Dins.DIN0) {
            return !(din0);
        } else if (args.PIN === Dins.DIN1) {
            return !(din1);
        }
        return false;
    }

    async isDin(args) {
        if (args.PIN === Dins.ANY) {
            return !(din0 && din1);
        } else if (args.PIN === Dins.DIN0) {
            return !(din0);
        } else if (args.PIN === Dins.DIN1) {
            return !(din1);
        }
        return false;
    }

    async getAin() {
        return ain0;
    }

    async getSensor(args) {
        if (args.SENSOR === Sensors.TEMPERATURE) {
            return temperature;
        } else if (args.SENSOR === Sensors.PRESSURE) {
            return pressure;
        } else if (args.SENSOR === Sensors.BRIGHTNESS) {
            return brightness;
        }
        return 0;
    }

    async setDOut(args) {
        if (args.PIN === Douts.DOUT0) {
            if (args.VALUE === Pinvals.HIGH) {
                dout0Target = true;
            } else if (args.VALUE === Pinvals.LOW) {
                dout0Target = false;
            }
        } else if (args.PIN === Douts.DOUT1) {
            if (args.VALUE === Pinvals.HIGH) {
                dout1Target = true;
            } else if (args.VALUE === Pinvals.LOW) {
                dout1Target = false;
            }
        }
        await (setPinout());
    }

    async setPwmOut(args) {
        pwmout0Target = parseInt(args.VALUE, 10);
        await (setPinout());
    }

    setDisplayColor(args) {
        displayColor = Color.rgbFromStr(args.COLOR);
    }

    setForegroundColor(args) {
        foregroundColor = Color.rgbFromStr(args.COLOR);
    }

    setDisplayFontSize(args) {
        let num = args.SIZE;
        if (num > 11) {
            num = 11;
        } else if (num < 1) {
            num = 1;
        }
        fontSize = num;
    }

    async setDisplayText(args) {
        const text = Cast.toString(args.TEXT);
        await (setDisplayText(text));
    }

    async setDisplayImage(args) {
        const path = Cast.toString(args.PATH);
        await (setDisplayImage(path));
    }
}

module.exports = Scratch3AkariBlocks;
