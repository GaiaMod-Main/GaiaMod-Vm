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
    RIHGT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down'
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

/**
 * Enum for velocity.
 * @readonly
 * @enum {int}
 */
const Velocity = {
    FAST: 500,
    NORMAL: 200,
    SLOW: 100
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
class Scratch3AkariBlocksSimple {
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
                text: 'みぎ',
                value: Joints.RIHGT
            },
            {
                text: 'ひだり',
                value: Joints.LEFT
            },
            {
                text: 'うえ',
                value: Joints.UP
            },
            {
                text: 'した',
                value: Joints.DOWN
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
                text: 'どれか',
                value: Buttons.ANY
            }
        ];
    }

    get DINS_MENU() {
        return [
            {
                text: '0ばん',
                value: Dins.DIN0
            },
            {
                text: '1ばん',
                value: Dins.DIN1
            },
            {
                text: 'どちらか',
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
                text: 'ハイ',
                value: Pinvals.HIGH
            },
            {
                text: 'ロー',
                value: Pinvals.LOW
            }
        ];
    }
    get SENSORS_MENU() {
        return [
            {
                text: 'おんど',
                value: Sensors.TEMPERATURE
            },
            {
                text: 'きあつ',
                value: Sensors.PRESSURE
            },
            {
                text: 'あかるさ',
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

    get VELOCITY_MENU() {
        return [
            {
                text: 'はやく',
                value: Velocity.FAST
            },
            {
                text: 'ゆっくり',
                value: Velocity.NORMAL
            },
            {
                text: 'おそく',
                value: Velocity.SLOW
            }
        ];
    }

    get LETTER_SIZE_MENU() {
        return [
            {
                text: '1',
                value: 1
            },
            {
                text: '2',
                value: 2
            },
            {
                text: '3',
                value: 3
            },
            {
                text: '4',
                value: 4
            },
            {
                text: '5',
                value: 5
            },
            {
                text: '6',
                value: 6
            },
            {
                text: '7',
                value: 7
            },
            {
                text: '8',
                value: 8
            },
            {
                text: '9',
                value: 9
            },
            {
                text: '10',
                value: 10
            },
            {
                text: '11',
                value: 11
            }
        ];
    }

    get ANGLE_MENU() {
        return [
            {
                text: '60',
                value: 60
            },
            {
                text: '50',
                value: 50
            },
            {
                text: '40',
                value: 40
            },
            {
                text: '30',
                value: 30
            },
            {
                text: '20',
                value: 20
            },
            {
                text: '10',
                value: 10
            },
            {
                text: '0',
                value: 0
            },
            {
                text: '-10',
                value: -10
            },
            {
                text: '-20',
                value: -20
            },
            {
                text: '-30',
                value: -30
            },
            {
                text: '-40',
                value: -40
            },
            {
                text: '-50',
                value: -50
            },
            {
                text: '-60',
                value: -60
            }
        ];
    }

    get PWM_MENU() {
        return [
            {
                text: '0',
                value: 0
            },
            {
                text: '25',
                value: 25
            },
            {
                text: '50',
                value: 50
            },
            {
                text: '75',
                value: 75
            },
            {
                text: '100',
                value: 100
            },
            {
                text: '125',
                value: 125
            },
            {
                text: '150',
                value: 150
            },
            {
                text: '175',
                value: 175
            },
            {
                text: '200',
                value: 200
            },
            {
                text: '225',
                value: 225
            },
            {
                text: '255',
                value: 255
            },
        ];
    }

    getInfo() {
        return {
            id: 'akariblockssimple',
            name: 'AKARIブロック(簡易版)',
            menuIconURI: Icons.menuIconURI,
            blockIconURI: Icons.blockIconURI,
            blocks: [
                {
                    opcode: 'servoOn',
                    blockType: BlockType.COMMAND,
                    text: 'サーボをONにする',
                    arguments: {}
                },
                {
                    opcode: 'servoOff',
                    blockType: BlockType.COMMAND,
                    text: 'サーボをOFFにする',
                    arguments: {}
                },
                {
                    opcode: 'getMotorPos',
                    text: '[JOINT]のばしょ',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        JOINT: {
                            type: ArgumentType.STRING,
                            menu: 'joints',
                            defaultValue: Joints.RIHGT
                        }
                    }
                },
                {
                    opcode: 'setMotorPos',
                    blockType: BlockType.COMMAND,
                    text: '[JOINT]を[ANGLE]°にうごかす',
                    arguments: {
                        JOINT: {
                            type: ArgumentType.STRING,
                            menu: 'joints',
                            defaultValue: Joints.RIHGT
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            menu: 'angle',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setAllMotorPos',
                    blockType: BlockType.COMMAND,
                    text: 'さゆうを[PAN]°、じょうげを[TILT]°にうごかす',
                    arguments: {
                        PAN: {
                            type: ArgumentType.NUMBER,
                            menu: 'angle',
                            defaultValue: 0
                        },
                        TILT: {
                            type: ArgumentType.NUMBER,
                            menu: 'angle',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setMotorRelativePos',
                    blockType: BlockType.COMMAND,
                    text: 'いまのばしょから[JOINT]に[ANGLE]°うごかす',
                    arguments: {
                        JOINT: {
                            type: ArgumentType.STRING,
                            menu: 'joints',
                            defaultValue: Joints.RIHGT
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            menu: 'angle',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setAllMotorRelativePos',
                    blockType: BlockType.COMMAND,
                    text: 'いまのばしょからさゆうに[PAN]°、じょうげに[TILT]°うごかす',
                    arguments: {
                        PAN: {
                            type: ArgumentType.NUMBER,
                            menu: 'angle',
                            defaultValue: 0
                        },
                        TILT: {
                            type: ArgumentType.NUMBER,
                            menu: 'angle',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setVel',
                    blockType: BlockType.COMMAND,
                    text: 'モータのはやさを[VEL]する',
                    arguments: {
                        VEL: {
                            type: ArgumentType.NUMBER,
                            menu: 'velocitys',
                            defaultValue: Velocity.NORMAL
                        }
                    }
                },
                // {
                //     opcode: 'setAcc',
                //     blockType: BlockType.COMMAND,
                //     text: 'モータ角加速度を[ACC]°/s^2にする',
                //     arguments: {
                //         ACC: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         }
                //     }
                // },
                {
                    opcode: 'whenButtonPressed',
                    blockType: BlockType.HAT,
                    text: 'ボタンの[BTN]がおされたとき',
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
                    text: 'ボタンの[BTN]がおされた',
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
                    text: 'デジタルにゅうりょくの[PIN]がローになったとき',
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
                    text: 'デジタルにゅうりょくの[PIN]がロー',
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
                    text: 'アナログにゅうりょく',
                    blockType: BlockType.REPORTER,
                    arguments: {
                    }
                },
                {
                    opcode: 'getSensor',
                    text: '[SENSOR]',
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
                    text: 'デジタルしゅつりょく[PIN]を[VALUE]にする',
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
                    text: 'ＰＷＭしゅつりょくを[VALUE]にする',
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            menu: 'pwm',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setDisplayColor',
                    blockType: BlockType.COMMAND,
                    text: 'はいけいのいろを[COLOR]にする',
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
                    text: 'もじのいろを[COLOR]にする',
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
                    text: 'もじのおおきさを[SIZE]にする',
                    arguments: {
                        SIZE: {
                            type: ArgumentType.NUMBER,
                            menu: 'letter_size',
                            defaultValue: 5
                        }
                    }
                },
                {
                    opcode: 'setDisplayText',
                    blockType: BlockType.COMMAND,
                    text: 'がめんに[TEXT]をひょうじする',
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
                    text: 'がめんにがぞう[PATH]をひょうじする',
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
                },
                velocitys: {
                    acceptReporters: true,
                    items: this.VELOCITY_MENU
                },
                letter_size: {
                    acceptReporters: true,
                    items: this.LETTER_SIZE_MENU
                },
                angle: {
                    acceptReporters: true,
                    items: this.ANGLE_MENU
                },
                pwm: {
                    acceptReporters: true,
                    items: this.PWM_MENU
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
        if (args.JOINT === Joints.RIHGT) {
            return -panTarget;
        } else if (args.JOINT === Joints.LEFT) {
            return panTarget;
        } else if (args.JOINT === Joints.UP) {
            return tiltTarget;
        } else if (args.JOINT === Joints.DOWN) {
            return -tiltTarget;
        }
        return 0;
    }

    async setMotorPos(args) {
        if (args.JOINT === Joints.RIHGT) {
            panTarget = setLimit(parseFloat(-args.ANGLE), panMin, panMax);
        } else if (args.JOINT === Joints.LEFT) {
            panTarget = setLimit(parseFloat(args.ANGLE), panMin, panMax);
        } else if (args.JOINT === Joints.UP) {
            tiltTarget = setLimit(parseFloat(args.ANGLE), tiltMin, tiltMax);
        } else if (args.JOINT === Joints.DOWN) {
            tiltTarget = setLimit(parseFloat(-args.ANGLE), tiltMin, tiltMax);
        }
        await (sendAbsolutePosition());
    }

    async setMotorRelativePos(args) {
        if (args.JOINT === Joints.RIHGT) {
            panTarget = setLimit(panTarget + parseFloat(-args.ANGLE), panMin, panMax);
        } else if (args.JOINT === Joints.LEFT) {
            panTarget = setLimit(panTarget + parseFloat(args.ANGLE), panMin, panMax);
        } else if (args.JOINT === Joints.UP) {
            tiltTarget = setLimit(tiltTarget + parseFloat(args.ANGLE), tiltMin, tiltMax);
        } else if (args.JOINT === Joints.DOWN) {
            tiltTarget = setLimit(tiltTarget + parseFloat(-args.ANGLE), tiltMin, tiltMax);
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

module.exports = Scratch3AkariBlocksSimple;
