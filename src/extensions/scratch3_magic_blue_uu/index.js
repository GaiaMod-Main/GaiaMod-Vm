const BLE = require('../../io/ble');
const RateLimiter = require('../../util/rateLimiter.js');

const iconURI = 'data:image/png;base64,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';

const BLEService = {
    SERVICE: '0000ffe5-0000-1000-8000-00805f9b34fb'
};

const BLECharacteristic = {
    CHARACTERISTIC: '0000ffe9-0000-1000-8000-00805f9b34fb'
};

const BLESendRateMax = 2;

class MagicBlueUU {

    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
        this._extensionId = extensionId;
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._rateLimiter = new RateLimiter(BLESendRateMax);
        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
    }

    stopAll() {
        return;
    }

    scan() {
        if (this._ble) this._ble.disconnect();
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [{
                services: [BLEService.SERVICE]
            }],
            optionalServices: []
        }, this._onConnect, this.reset);
    }

    connect(id) {
        if (this._ble) this._ble.connectPeripheral(id);
    }

    disconnect() {
        if (this._ble) this._ble.disconnect();
        this.reset();
    }

    reset() {
        return;
    }

    isConnected() {
        if (this._ble) return this._ble.isConnected();
        return false;
    }

    send(command) {
        if (!this.isConnected() || !this._rateLimiter.okayToSend()) return Promise.resolve();
        console.log(command)
        return this._ble.write(
            BLEService.SERVICE,
            BLECharacteristic.CHARACTERISTIC,
            Uint8Array.from(Buffer.from(command, 'hex')),
        );
    }

    _onConnect() {
        return;
    }

}

class MagicBlueUUBlocks {

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new MagicBlueUU(this.runtime, "magicBlueUU");
    }

    getInfo() {
        return {
            id: "magicBlueUU",
            name: 'Magic Blue UU',
            blockIconURI: iconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: "setLightColor",
                    blockType: "command",
                    text: "set light to [color]",
                    arguments: {
                        color: {
                            type: "color",
                            defaultValue: "#ff0000"
                        }
                    }
                },
                {
                    opcode: "setLightName",
                    blockType: "command",
                    text: "set light to [color]",
                    arguments: {
                        color: {
                            type: "string",
                            menu: "color",
                            defaultValue: "red"
                        }
                    }
                },
                {
                    opcode: "setLightRGB",
                    blockType: "command",
                    text: "set light to [red][green][blue]",
                    arguments: {
                        red: {
                            type: "number",
                            defaultValue: 255
                        },
                        green: {
                            type: "number",
                            defaultValue: 0
                        },
                        blue: {
                            type: "number",
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: "setWarmLight",
                    blockType: "command",
                    text: "set warm light to [brightness]",
                    arguments: {
                        brightness: {
                            type: "number",
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: "turnOffLight",
                    blockType: "command",
                    text: "turn off light"
                },
                {
                    opcode: "setSevenColor",
                    blockType: "command",
                    text: "set seven color [effect], speed [speed]",
                    arguments: {
                        effect: {
                            type: "string",
                            menu: "effect",
                            defaultValue: "cross fade"
                        },
                        speed: {
                            type: "number",
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: "setGradualChange",
                    blockType: "command",
                    text: "set [color] gradual change, speed [speed]",
                    arguments: {
                        color: {
                            type: "string",
                            menu: "color",
                            defaultValue: "red"
                        },
                        speed: {
                            type: "number",
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: "setCrossFade",
                    blockType: "command",
                    text: "set [colorToColor] cross fade, speed [speed]",
                    arguments: {
                        colorToColor: {
                            type: "string",
                            menu: "colorToColor",
                            defaultValue: "red green"
                        },
                        speed: {
                            type: "number",
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: "setStrobeFlash",
                    blockType: "command",
                    text: "set [color] strobe flash, speed [speed]",
                    arguments: {
                        color: {
                            type: "string",
                            menu: "color",
                            defaultValue: "red"
                        },
                        speed: {
                            type: "number",
                            defaultValue: 100
                        }
                    }
                },
            ],
            menus: {
                color: ["red", "green", "blue", "yellow", "cyan", "magenta", "white"],
                effect: ["cross fade", "strobe flash", "jumping change"],
                colorToColor: ["red green", "red blue", "green blue"]
            }
        };
    }

    setLightColor({ color }) {
        let command = "56" + color.substring(1) + "00f0aa";
        this._peripheral.send(command);
    }

    setLightName({ color }) {
        let command = "56" + this._colorNameToHex(color) + "00f0aa";
        this._peripheral.send(command);
    }

    setLightRGB({ red, green, blue }) {
        let command = "56" + this._colorRgbToHex(red, green, blue) + "00f0aa";
        this._peripheral.send(command);
    }

    setWarmLight({ brightness }) {
        let command = "56000000" + this._toHex(brightness) + "0faa";
        this._peripheral.send(command);
    }

    turnOffLight() {
        let command = "56000000000faa";
        this._peripheral.send(command);
    }

    setSevenColor({ effect, speed }) {
        let command = "5600000000f0aa";
        switch (effect) {
            case "cross fade":
                command = "bb25" + this._toHex(speed) + "44"
                break;
            case "strobe flash":
                command = "bb30" + this._toHex(speed) + "44"
                break;
            case "jumping change":
                command = "bb38" + this._toHex(speed) + "44"
                break;
            default:
                break;
        }
        this._peripheral.send(command);
    }

    setGradualChange({ color, speed }) {
        let command = "5600000000f0aa";
        switch (color) {
            case "red":
                command = "bb26" + this._toHex(speed) + "44"
                break;
            case "green":
                command = "bb27" + this._toHex(speed) + "44"
                break;
            case "blue":
                command = "bb28" + this._toHex(speed) + "44"
                break;
            case "yellow":
                command = "bb29" + this._toHex(speed) + "44"
                break;
            case "cyan":
                command = "bb2a" + this._toHex(speed) + "44"
                break;
            case "magenta":
                command = "bb2b" + this._toHex(speed) + "44"
                break;
            case "white":
                command = "bb2c" + this._toHex(speed) + "44"
                break;
            default:
                break;
        }
        this._peripheral.send(command);
    }

    setCrossFade({ colorToColor, speed }) {
        let command = "5600000000f0aa";
        switch (colorToColor) {
            case "red green":
                command = "bb2d" + this._toHex(speed) + "44"
                break;
            case "red blue":
                command = "bb2e" + this._toHex(speed) + "44"
                break;
            case "green blue":
                command = "bb2f" + this._toHex(speed) + "44"
                break;
            default:
                break;
        }
        this._peripheral.send(command);
    }

    setStrobeFlash({ color, speed }) {
        let command = "5600000000f0aa";
        switch (color) {
            case "red":
                command = "bb31" + this._toHex(speed) + "44"
                break;
            case "green":
                command = "bb32" + this._toHex(speed) + "44"
                break;
            case "blue":
                command = "bb33" + this._toHex(speed) + "44"
                break;
            case "yellow":
                command = "bb34" + this._toHex(speed) + "44"
                break;
            case "cyan":
                command = "bb35" + this._toHex(speed) + "44"
                break;
            case "magenta":
                command = "bb36" + this._toHex(speed) + "44"
                break;
            case "white":
                command = "bb37" + this._toHex(speed) + "44"
                break;
            default:
                break;
        }
        this._peripheral.send(command);
    }

    _toHex(value) {
        let intValue = parseInt(value);
        if (intValue < 0) intValue = 0;
        if (intValue > 255) intValue = 255;
        let hexValue = intValue.toString(16);
        if (hexValue.length == 1) hexValue = "0" + hexValue;
        return hexValue;
    }

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

}

module.exports = MagicBlueUUBlocks;
