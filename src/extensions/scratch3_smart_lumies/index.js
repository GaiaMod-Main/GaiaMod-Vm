const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const color = require('../../util/color');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const MathUtil = require('../../util/math-util');
const RateLimiter = require('../../util/rateLimiter.js');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABVBJREFUeF7tm11oHFUUx/93NrbZ2q+tjYaG1rRqbSNoK5QEFSzGh1rwoRHTQtMoLSi+mIopCOKDgj5ohQZF0AfFqqBIAkItKn6kLdFIIU3T0EhD6EceuqVpEqux0CZ75E6cdXeyH3PnzpntDnchD0nvuff+f/M/9+PsVMB8tAgIrWgTDANQ0wQGoAGoSUAz3DjQANQkoBluHGgAahLQDDcONAA1CWiGGwcagJoENMONAw1ATQKa4caB5Q6Q+k8TLo0BPxwDkpeB6ipg33MQ1VV5Hy5dHCM6OQycuwhM/j2LID4fqKmCqFstf0IzRmgDuR80fX+UbGgnh+Z6oLUJorUp59you4+od7Cwb1avgNjSALFkIbs+9gFyKaWX36Sc4JzGD6yHePfVOXNLHeohDI54S7rEIojmRojEYlaNrJ3PcZ1M1/a3igO4YznEFwey5kY9A0TH+ovHZrZYeTusnVtYNbJ2nqnFXuu8wJNBLoCpq1OEDzrV4P3X2k7lDWvZdLJ1nAUveZnQ8pJ3AC6A1DtI1N3nPT6zZU0VrF1PsOlk6zgL4M69szut148bYOcvRMOjXqPntLNeaWXTydaxo4IOdhEOdqmJd6fwJ4cIl8bV+shoLZ7fBpFYxKKVpdM0PNXUdQKDBvhCE9uRhhegH/fl2kS+OUoYOufPgTEL1r4WNp1sHUu19HgL+VLtdmD/GcJ3vb66wl01sJ5uZNPJ1jH5Td8cDpR/Sr33NWHqmjrEbZth3buKTSdbx742jzxroA3w1Ajh2x41gPetgfXkI2wa5WTYOg8aoA2xZ4Dg8TYi1tTIqxybPudJsg1Ab384Wyzw88lxlUvv7KdGZg/VhdJ503pYjZvYtGVKYhukaMGgENgCANMgT5whnE+CxibtPBILF9jlLKy7E2L5UjZd7mmzDcTlQD+G5owxADXp8gGUBdN3PvI3vTwpfOHKNI1emcHDa+ezzVt1wqwTCeogLUU1dYzTr8PXbX0rl8Xw0D3z0FxfWXKYvABVqzB5zoFf9v5Dez+/mtMcEmZnWwKrbqtg1ZLPmayD+j4LulK47bM/6avf899CJMTtDZVo38pTcSmU1qwA7fuwHxcqAnQESpDH38j/bZ7q+ualPT9APxUZnwCd9TFMiOwAbReqQtQAKMfbXh9Hx64loWgLZRDlVNYEKMc70LIYOxoWsOtjHyBzHfG8HgYAMKz1MFSAthO9FBkCABhWKocO0IYovyOWt5R839QFBDAMF5YEYLqiIq978hs7N0jXuzHFzoGFjhudLyZYbyslBZgGKcv/8s2sgT+A+9dBbKjLmpcOwPatt7IesG8KgMUOrDoA5Z25q20Zm062jotBUfl3HYDc66ABqPIkc7SNPECpOfl+NZtOto6dhzV99nVKTRwBTR4p+qxFZS1ita8htuLZwDaRsk7h1LWzdOO3u4uCczeo2PgTYonNaYg6a2BZbyI3Tu+mVPJTZYBi6aOY9+DPgQDkLiywpvD1vsfIS+q6CQcJsKwP0jcDQM4NRD74SDswjJJWpAFyuy/SDuRe+5x1O5IO5D66ZG56kQMYJrzIpXDY8CIFkLvul+82wJrCMxPdNH2iUfkmYlU/g1vqPk7Pbf/hv2j/4amc/UjXyeNKJF/tkHfh6aE9ngoJ6V2tshYVG3+EFf////zKt7Ke6pjA6PiM3cx5laO5Pl4ycKHsws4gEiRNFK/GIF6bVUTItJyEKH8vldNKksLKuVuGAaxrYBnyUJ6yAaiMLDvAADQANQlohhsHGoCaBDTDjQMNQE0CmuHGgQagJgHNcONAA1CTgGa4caAmwH8BttSAb6PNO/0AAAAASUVORK5CYII=';

/**
 * A list of Smart Lumies BLE service UUIDs.
 * @enum
 */
const BLEService = {
    DEVICE_SERVICE: '00001800-0000-1000-8000-00805f9b34fb',
    BATTERY_SERVICE: '0000180f-0000-1000-8000-00805f9b34fb',
    COMMAND_SERVICE: '00001120-0000-1000-8000-00805f9b34fb',
    SENSORS_SERVICE: '00001234-0000-1000-8000-00805f9b34fb'
};

/**
 * A list of Smart Lumies BLE characteristic UUIDs.
 *
 * Characteristics on BATTERY_SERVICE:
 * - BATTERY_CHARACTERISTIC
 *
  * Characteristics on COMMAND_SERVICE:
 * - COMMAND_CHARACTERISTIC
 *
 * Characteristics on SENSORS_SERVICE:
 * - POSITION_CHARACTERISTIC
 * - TOUCH_CHARACTERISTIC
 * - UPSIDE_CHARACTERISTIC
 *
 * @enum
 */
const BLECharacteristic = {
    BATTERY_CHARACTERISTIC: '00002a19-0000-1000-8000-00805f9b34fb',
    COMMAND_CHARACTERISTIC: '00000005-0000-1000-8000-00805f9b34fb',
    POSITION_CHARACTERISTIC: '00000004-0000-1000-8000-00805f9b34fb',
    TOUCH_CHARACTERISTIC: '00000005-0000-1000-8000-00805f9b34fb',
    UPSIDE_CHARACTERISTIC: '00000007-0000-1000-8000-00805f9b34fb'
};

/**
 * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
 * @type {number}
 */
const BLESendInterval = 100;

/**
 * A maximum number of BLE message sends per second, to be enforced by the rate limiter.
 * @type {number}
 */
const BLESendRateMax = 20;


/**
 * Manage communication with a Smart Lumies peripheral over a WebBluetooth.
 */
class SmartLumies {

    constructor(runtime, extensionId) {
        /**
         * A list of active side colors.
         * @type {string[]}
         * @private
         */
        this._activeColors = ["unknown", "unknown", "unknown", "unknown", "unknown", "unknown"];

        /**
         * A side which is upside.
         * @type {int}
         * @private
         */
        this._upside = -1;

        /**
         * A last received touch message.
         * @type {int[]}
         * @private
         */
        this._lastTouchMessage = [255, 255, 255, 255, 255, 255];

        /**
         * A list of side touch values.
         * @type {boolean[]}
         * @private
         */
        this._isSideTouched = [false, false, false, false, false, false];

        /**
         * A battery percentage.
         * @type {int}
         * @private
         */
        this._battery = -1;

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * The Bluetooth connection socket for reading/writing peripheral data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * A rate limiter utility, to help limit the rate at which we send BLE messages
         * over the socket to Scratch Link to a maximum number of sends per second.
         * @type {RateLimiter}
         * @private
         */
        this._rateLimiter = new RateLimiter(BLESendRateMax);

        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onBatteryMessage = this._onBatteryMessage.bind(this);
        this._onUpsideMessage = this._onUpsideMessage.bind(this);
        this._onTouchMessage = this._onTouchMessage.bind(this);
    }

    /**
     * @return {string[]} - A list of active side colors."
     */
    get activeColors() {
        return this._activeColors;
    }

    /**
     * @param {string[]} value - A list of active side colors."
     */
    set activeColors(value) {
        this._activeColors = value;
    }

    /**
     * @return {int} - A side which is upside."
     */
    get upside() {
        return this._upside;
    }

    /**
     * @param {int} value - A side which is upside."
     */
    set upside(value) {
        this._upside = value;
    }

    /**
     * @return {int[]} - A last received touch message."
     */
    get lastTouchMessage() {
        return this._lastTouchMessage;
    }

    /**
     * @param {int[]} value - A last received touch message."
     */
    set lastTouchMessage(value) {
        this._lastTouchMessage = value;
    }

    /**
     * @return {boolean[]} - A list of side touch values."
     */
    get isSideTouched() {
        return this._isSideTouched;
    }

    /**
     * @param {boolean[]} value - A list of side touch values."
     */
    set isSideTouched(value) {
        this._isSideTouched = value;
    }

    /**
     * @return {int} - A battery percentage."
     */
    get battery() {
        return this._battery;
    }

    /**
     * @param {int} value - A battery percentage."
     */
    set battery(value) {
        this._battery = value;
    }

    /**
     * Called by the runtime when project is stopped?
     */
    stopAll() {
        return;
    }

    /**
     * Called by the runtime when user wants to scan for a Smart Lumies peripheral.
     */
    scan() {
        if (this._ble) this._ble.disconnect();
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [{
                services: [BLEService.BATTERY_SERVICE]
            }],
            optionalServices: [BLEService.DEVICE_SERVICE, BLEService.COMMAND_SERVICE, BLEService.SENSORS_SERVICE]
        }, this._onConnect, this.reset);
    }

    /**
     * Called by the runtime when user wants to connect to a certain Smart Lumies peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect(id) {
        if (this._ble) this._ble.connectPeripheral(id);
    }

    /**
     * Disconnects from the current BLE socket.
     */
    disconnect() {
        if (this._ble) this._ble.disconnect();
        this.reset();
    }

    /**
     * Reset all the state.
     */
    reset() {
        this.activeColors = ["unknown", "unknown", "unknown", "unknown", "unknown", "unknown"];
        this.upside = -1;
        this.lastTouchMessage = [255, 255, 255, 255, 255, 255];
        this.isSideTouched = [false, false, false, false, false, false];
        this.battery = -1;
    }

    /**
     * Called by the runtime to detect whether the Smart Lumies peripheral is connected.
     * @return {boolean} - the connected state.
     */
    isConnected() {
        if (this._ble) return this._ble.isConnected();
        return false;
    }

    /**
     * Write a BLE message to the Smart Lumies peripheral.
     * @param {string} message - the message to write.
     * @return {Promise} - a promise result of the write operation
     */
    send(message) {
        if (!this.isConnected() || !this._rateLimiter.okayToSend()) return Promise.resolve();
        return this._ble.write(
            BLEService.COMMAND_SERVICE,
            BLECharacteristic.COMMAND_CHARACTERISTIC,
            Uint8Array.from(Buffer.from(message.substring(2), 'hex')),
        );
    }

    /**
     * Sets notifications and initial color after BLE has connected.
     * @private
     */
    _onConnect() {
        this._ble.read(BLEService.BATTERY_SERVICE, BLECharacteristic.BATTERY_CHARACTERISTIC, true, this._onBatteryMessage);
        this._ble.read(BLEService.SENSORS_SERVICE, BLECharacteristic.UPSIDE_CHARACTERISTIC, true, this._onUpsideMessage);
        this._ble.read(BLEService.SENSORS_SERVICE, BLECharacteristic.TOUCH_CHARACTERISTIC, true, this._onTouchMessage);
        this.send("0x02000011");
    }

    /**
     * Process battery data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _onBatteryMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        this.battery = data[0];
    }

    /**
     * Process upside data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _onUpsideMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        this.upside = data[2];
    }

    /**
     * Process touch data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _onTouchMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        if (this.lastTouchMessage.every(function (val, idx) { return val == data[idx] })) return;
        for (let i = 0; i < data.length; i++) {
            if (data[i] == 0) {
                this.isSideTouched[i] = true;
            } else {
                this.isSideTouched[i] = false;
            }
        }
        this.lastTouchMessage = data;
    }
}


/**
 * Enum for colors.
 * @readonly
 * @enum {string}
 */
const SmartLumiesColor = {
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    CYAN: "cyan",
    MAGENTA: "magenta",
    YELLOW: "yellow",
    WHITE: "white",
    OFF: "off"
};

/**
 * Enum for side values.
 * @readonly
 * @enum {int}
 */
const SmartLumiesSide = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
};


/**
 * Scratch 3.0 blocks to interact with a Smart Lumies peripheral.
 */
class Scratch3SmartLumiesBlocks {

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'smartLumies';
    }

    /**
     * Construct a set of Smart Lumies blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new Smart Lumies peripheral instance
        this._peripheral = new SmartLumies(this.runtime, Scratch3SmartLumiesBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: Scratch3SmartLumiesBlocks.EXTENSION_ID,
            name: 'Smart Lumies',
            blockIconURI: iconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'setCubeColor',
                    text: formatMessage({
                        id: 'SmartLumies.setCubeColor',
                        default: 'set cube color to [COLOR]',
                        description: 'set cube color'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        }
                    }
                },
                {
                    opcode: 'setCubeColorRgb',
                    text: formatMessage({
                        id: 'SmartLumies.setCubeColorRgb',
                        default: 'set cube color to [RED][GREEN][BLUE]',
                        description: 'set cube color to RGB value'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        RED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        GREEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        BLUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: 'setSideColor',
                    text: formatMessage({
                        id: 'SmartLumies.setSideColor',
                        default: 'set side [SIDE] color to [COLOR]',
                        description: 'set side color'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SIDE: {
                            type: ArgumentType.NUMBER,
                            menu: 'SIDE',
                            defaultValue: SmartLumiesSide.ZERO
                        },
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        }
                    }
                },
                {
                    opcode: 'setSideColorRgb',
                    text: formatMessage({
                        id: 'SmartLumies.setSideColorRgb',
                        default: 'set side [SIDE] color to [RED][GREEN][BLUE]',
                        description: 'set side color to RGB value'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SIDE: {
                            type: ArgumentType.NUMBER,
                            menu: 'SIDE',
                            defaultValue: SmartLumiesSide.ZERO
                        },
                        RED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        GREEN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        BLUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: 'setSideColors',
                    text: formatMessage({
                        id: 'SmartLumies.setSideColors',
                        default: 'set side colors to [COLOR0][COLOR1][COLOR2][COLOR3][COLOR4][COLOR5]',
                        description: 'set side colors'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR0: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        },
                        COLOR1: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        },
                        COLOR2: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        },
                        COLOR3: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        },
                        COLOR4: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        },
                        COLOR5: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        }
                    }
                },
                {
                    opcode: 'setBrightness',
                    text: formatMessage({
                        id: 'SmartLumies.setBrightness',
                        default: 'set brightness to [BRIGHTNESS]',
                        description: 'set brightness'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BRIGHTNESS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'getUpside',
                    text: formatMessage({
                        id: 'SmartLumies.getUpside',
                        default: 'upside',
                        description: 'upside value'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'whenUpside',
                    text: formatMessage({
                        id: 'SmartLumies.whenUpside',
                        default: 'when side [SIDE] is upside',
                        description: 'check if side is upside'
                    }),
                    func: 'whenUpside',
                    blockType: BlockType.HAT,
                    arguments: {
                        SIDE: {
                            type: ArgumentType.NUMBER,
                            menu: 'SIDE',
                            defaultValue: SmartLumiesSide.ZERO
                        }
                    }
                },
                {
                    opcode: 'enableTouch',
                    text: formatMessage({
                        id: 'SmartLumies.enableTouch',
                        default: 'enable touch',
                        description: 'enable touch'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'disableTouch',
                    text: formatMessage({
                        id: 'SmartLumies.disableTouch',
                        default: 'disable touch',
                        description: 'disable touch'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'whenTouched',
                    text: formatMessage({
                        id: 'SmartLumies.whenTouched',
                        default: 'when cube is touched',
                        description: 'check if cube is touched'
                    }),
                    func: 'whenTouched',
                    blockType: BlockType.HAT
                },
                {
                    opcode: 'whenSideTouched',
                    text: formatMessage({
                        id: 'SmartLumies.whenSideTouched',
                        default: 'when side [SIDE] is touched',
                        description: 'check if side is touched'
                    }),
                    func: 'whenSideTouched',
                    blockType: BlockType.HAT,
                    arguments: {
                        SIDE: {
                            type: ArgumentType.NUMBER,
                            menu: 'SIDE',
                            defaultValue: SmartLumiesSide.ZERO
                        }
                    }
                },
                {
                    opcode: 'whenColorTouched',
                    text: formatMessage({
                        id: 'SmartLumies.whenColorTouched',
                        default: 'when [COLOR] is touched',
                        description: 'check if color is touched'
                    }),
                    func: 'whenColorTouched',
                    blockType: BlockType.HAT,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR',
                            defaultValue: SmartLumiesColor.RED
                        }
                    }
                },
                {
                    opcode: 'getBattery',
                    text: formatMessage({
                        id: 'SmartLumies.getBattery',
                        default: 'battery',
                        description: 'the value returned by the battery sensor'
                    }),
                    blockType: BlockType.REPORTER
                }
            ],
            menus: {
                COLOR: {
                    acceptReporters: true,
                    items: [
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.RED',
                                default: "red"
                            }),
                            value: SmartLumiesColor.RED
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.GREEN',
                                default: "green"
                            }),
                            value: SmartLumiesColor.GREEN
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.BLUE',
                                default: "blue"
                            }),
                            value: SmartLumiesColor.BLUE
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.CYAN',
                                default: "cyan"
                            }),
                            value: SmartLumiesColor.CYAN
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.MAGENTA',
                                default: "magenta"
                            }),
                            value: SmartLumiesColor.MAGENTA
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.YELLOW',
                                default: "yellow"
                            }),
                            value: SmartLumiesColor.YELLOW
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.WHITE',
                                default: "white"
                            }),
                            value: SmartLumiesColor.WHITE
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.color.OFF',
                                default: "off"
                            }),
                            value: SmartLumiesColor.OFF
                        }
                    ]
                },
                SIDE: {
                    acceptReporters: true,
                    items: [
                        {
                            text: formatMessage({
                                id: 'SmartLumies.side.ZERO',
                                default: 0
                            }),
                            value: SmartLumiesSide.ZERO
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.side.ONE',
                                default: 1
                            }),
                            value: SmartLumiesSide.ONE
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.side.TWO',
                                default: 2
                            }),
                            value: SmartLumiesSide.TWO
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.side.THREE',
                                default: 3
                            }),
                            value: SmartLumiesSide.THREE
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.side.FOUR',
                                default: 4
                            }),
                            value: SmartLumiesSide.FOUR
                        },
                        {
                            text: formatMessage({
                                id: 'SmartLumies.side.FIVE',
                                default: 5
                            }),
                            value: SmartLumiesSide.FIVE
                        }
                    ]
                }
            }
        };
    }


    /**
     * Set cube color.
     * @param {object} args - the block's arguments.
     * @property {string} COLOR - color name.
     * @return {Promise} - a Promise that resolves after some delay.
     */
    setCubeColor(args) {
        this._peripheral.send("0x02" + this._colorNameToHex(args.COLOR));
        for (let i = 0; i < this._peripheral.activeColors.length; i++) {
            this._peripheral.activeColors[i] = args.COLOR;
        }

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Set cube color to RGB value.
     * @param {object} args - the block's arguments.
     * @property {int} RED - red value, in the range [0,255].
     * @property {int} GREEN - green value, in the range [0,255].
     * @property {int} BLUE - blue value, in the range [0,255].
     * @return {Promise} - a Promise that resolves after some delay.
     */
    setCubeColorRgb(args) {
        const hex = this._colorRgbToHex(args.RED, args.GREEN, args.BLUE);
        this._peripheral.send("0x02" + hex);
        const color = this._hexToColorName(hex);
        for (let i = 0; i < this._peripheral.activeColors.length; i++) {
            this._peripheral.activeColors[i] = color;
        }

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Set side color.
     * @param {object} args - the block's arguments.
     * @property {int} SIDE - side, in the range [0,5].
     * @property {string} COLOR - color name.
     * @return {Promise} - a Promise that resolves after some delay.
     */
    setSideColor(args) {
        this._peripheral.send("0x04" + "0" + args.SIDE + this._colorNameToHex(args.COLOR));
        this._peripheral.activeColors[args.SIDE] = args.COLOR;

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Set side color to RGB value.
     * @param {object} args - the block's arguments.
     * @property {int} SIDE - side, in the range [0,5].
     * @property {int} RED - red value, in the range [0,255].
     * @property {int} GREEN - green value, in the range [0,255].
     * @property {int} BLUE - blue value, in the range [0,255].
     * @return {Promise} - a Promise that resolves after some delay.
     */
    setSideColorRgb(args) {
        const hex = this._colorRgbToHex(args.RED, args.GREEN, args.BLUE);
        this._peripheral.send("0x04" + "0" + args.SIDE + hex);
        this._peripheral.activeColors[args.SIDE] = this._hexToColorName(hex);

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Set side colors.
     * @param {object} args - the block's arguments.
     * @property {string} COLOR0 - color name.
     * @property {string} COLOR1 - color name.
     * @property {string} COLOR2 - color name.
     * @property {string} COLOR3 - color name.
     * @property {string} COLOR4 - color name.
     * @property {string} COLOR5 - color name.
     * @return {Promise} - a Promise that resolves after some delay.
     */
    setSideColors(args) {
        this._peripheral.send("0x03" + this._colorNameToHex(args.COLOR0) + this._colorNameToHex(args.COLOR1) + this._colorNameToHex(args.COLOR2) + this._colorNameToHex(args.COLOR3) + this._colorNameToHex(args.COLOR4) + this._colorNameToHex(args.COLOR5));
        this._peripheral.activeColors[0] = args.COLOR0;
        this._peripheral.activeColors[1] = args.COLOR1;
        this._peripheral.activeColors[2] = args.COLOR2;
        this._peripheral.activeColors[3] = args.COLOR3;
        this._peripheral.activeColors[4] = args.COLOR4;
        this._peripheral.activeColors[5] = args.COLOR5;

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Set brightness.
     * @param {object} args - the block's arguments.
     * @property {int} BRIGHTNESS - brightness, in the range [0,100].
     * @return {Promise} - a Promise that resolves after some delay.
     */
    setBrightness(args) {
        let brightness = parseInt(args.BRIGHTNESS);
        if (brightness < 0) brightness = 0;
        if (brightness > 100) brightness = 100;
        let brightnessHexValue = brightness.toString(16);
        if (brightnessHexValue.length == 1) brightnessHexValue = "0" + brightnessHexValue;
        this._peripheral.send("0x15" + brightnessHexValue);

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * @return {int} - side which is upside.
     */
    getUpside() {
        return this._peripheral.upside;
    }

    /**
     * Test whether side is upside.
     * @param {object} args - the block's arguments.
     * @property {int} SIDE - side, in the range [0,5].
     * @return {boolean} - true if side is upside.
     */
    whenUpside(args) {
        return args.SIDE == this._peripheral.upside;
    }

    /**
     * Enable touch functionality.
     */
    enableTouch() {
        this._peripheral.send("0x0f01");

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Disable touch functionality.
     */
    disableTouch() {
        this._peripheral.send("0x0f00");

        return new Promise(resolve => {
            window.setTimeout(() => {
                resolve();
            }, BLESendInterval);
        });
    }

    /**
     * Test whether some side is touched.
     * @return {boolean} - true if any side is touched.
     */
    whenTouched() {
        return this._peripheral.isSideTouched.includes(true);
    }

    /**
     * Test whether side is touched.
     * @param {object} args - the block's arguments.
     * @property {int} SIDE - side, in the range [0,5].
     * @return {boolean} - true if side is touched.
     */
    whenSideTouched(args) {
        return this._peripheral.isSideTouched[args.SIDE];
    }

    /**
     * Test whether color is touched.
     * @param {object} args - the block's arguments.
     * @property {string} COLOR - color name.
     * @return {boolean} - true if color is touched.
     */
    whenColorTouched(args) {
        for (let i = 0; i < this._peripheral.isSideTouched.length; i++) {
            if (this._peripheral.isSideTouched[i] && this._peripheral.activeColors[i] == args.COLOR) return true;
        }
        return false;
    }

    /**
     * @return {int} - battery percentage.
     */
    getBattery() {
        return this._peripheral.battery;
    }

    /**
     * Convert color name to hex value.
     * @param {string} name - color name.
     * @return {string} - hex value.
     * @private
     */
    _colorNameToHex(name) {
        let hex = "000000"
        switch (name) {
            case "red":
                hex = "ff0000";
                break;
            case "green":
                hex = "00ff00";
                break;
            case "blue":
                hex = "0000ff";
                break;
            case "cyan":
                hex = "00ffff";
                break;
            case "magenta":
                hex = "ff00ff";
                break;
            case "yellow":
                hex = "ffff00";
                break;
            case "white":
                hex = "ffffff";
                break;
            case "off":
                hex = "000000";
        }
        return hex;
    }

    /**
     * Convert RGB value to hex value.
     * @param {int} red - red value.
     * @param {int} green - green value.
     * @param {int} blue - blue value.
     * @return {string} - hex value.
     * @private
     */
    _colorRgbToHex(red, green, blue) {
        let redValue = parseInt(red);
        if (redValue < 0) redValue = 0;
        if (redValue > 255) redValue = 255;
        let redHexValue = redValue.toString(16);
        if (redHexValue.length == 1) redHexValue = "0" + redHexValue;
        let greenValue = parseInt(green);
        if (greenValue < 0) greenValue = 0;
        if (greenValue > 255) greenValue = 255;
        let greenHexValue = greenValue.toString(16);
        if (greenHexValue.length == 1) greenHexValue = "0" + greenHexValue;
        let blueValue = parseInt(blue);
        if (blueValue < 0) blueValue = 0;
        if (blueValue > 255) blueValue = 255;
        let blueHexValue = blueValue.toString(16);
        if (blueHexValue.length == 1) blueHexValue = "0" + blueHexValue;
        return redHexValue + greenHexValue + blueHexValue;
    }

    /**
     * Convert hex value to color name.
     * @param {string} hex - hex value.
     * @return {string} - color name.
     * @private
     */
    _hexToColorName(hex) {
        let colorName = "unknown"
        switch (hex) {
            case "ff0000":
                colorName = "red";
                break;
            case "00ff00":
                colorName = "green";
                break;
            case "0000ff":
                colorName = "blue";
                break;
            case "00ffff":
                colorName = "cyan";
                break;
            case "ff00ff":
                colorName = "magenta";
                break;
            case "ffff00":
                colorName = "yellow";
                break;
            case "ffffff":
                colorName = "white";
                break;
            case "000000":
                colorName = "off";
        }
        return colorName;
    }
}

module.exports = Scratch3SmartLumiesBlocks;
