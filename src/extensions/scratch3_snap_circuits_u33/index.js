const BLE = require('../../io/ble');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAsVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8kZSTAAAAAOXRSTlMAAwQFBgoLDB8gKCkqK0JDREV3fn+AgoSHiImMjY6PkJGTsbK0ubq7xMXGx8nKy9PU1e3u8vP0+/w5olgDAAAAAWJLR0Q6TgnE+gAAAX1JREFUWMPtl31TgkAQxoEj0cTIIs0XfKm0tBIiFfz+XywQkZu7XWTRmWaK/eeYh93fnLj7cChKFUk87EpE78x6nrArGZcFQNd5UQH+PsD/7NXFgkZ/9b31HPMEQEvHIuyofLnaDQ/6hOUB1JesT5+0rJ5x+pzlALp8p98j4zrGAY14n2/WVc1ayJNz1IMmCujHefsd6kupPtOHKGAVrTeJ1BYBnO6iAD9aa4lkiABOX6OANZCI6SDAi1ZL2CqmgwAnWhf6/mG9R5eD9D6kgwAz/huXt4bRjvOC6/Q+pMONNOEfm5M1EqDDADbP8maMa2VZR4aJjYMkLXAYP0yyjo6zOXQ3G3fQFMdZ1FFA0fhPgNbI2/JeSAToU9ELaQD9VfJCGmAqeyEJ0AplLyQBRoAXkgBfgBeSAJjFnXw35pkpGWBRf4IIgDySBIA8svgBw0Y8sjBAe4Y9svgRR+2EoEcSzkj1xw8f8sjqnAgAfveL5a5cva2cR7Crz+VD/AAchTsT1d/28QAAAABJRU5ErkJggg==';

const BLEService = {
    SERVICE: '0000ffe0-0000-1000-8000-00805f9b34fb'
};

const BLECharacteristic = {
    CHARACTERISTIC: '0000ffe1-0000-1000-8000-00805f9b34fb'
};

class SnapCircuitsU33 {

    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
        this._extensionId = extensionId;
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this.commands = ["AT+PIO91", "AT+PIO31", "AT+PIOA1", "AT+PIO61", "AT+PIOB1"];
        this.sendingCommand = false;
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
        this.commands = ["AT+PIO91", "AT+PIO31", "AT+PIOA1", "AT+PIO61", "AT+PIOB1"];
        this.sendingCommand = false;
    }

    isConnected() {
        if (this._ble) return this._ble.isConnected();
        return false;
    }

    send() {
        if (!this.isConnected()) return Promise.resolve();
        this.sendingCommand = true;
        return this._ble.write(
            BLEService.SERVICE,
            BLECharacteristic.CHARACTERISTIC,
            Uint8Array.from(Buffer.from(this.commands.shift())),
        );
    }

    _onConnect() {
        this._ble.read(BLEService.SERVICE, BLECharacteristic.CHARACTERISTIC, true, this._onMessage);
    }

    _onMessage(base64) {
        console.log(Buffer.from(base64, "base64").toString("ascii").trim())
        this.sendingCommand = false
        if (this.commands.length > 0) {
            this.send();
        }
    }

}

class SnapCircuitsU33Blocks {

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new SnapCircuitsU33(this.runtime, "snapCircuitsU33");
    }

    getInfo() {
        return {
            id: "snapCircuitsU33",
            name: 'Snap Circuits U33',
            blockIconURI: iconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: "setPin",
                    blockType: "command",
                    text: "set [pin] to [value]",
                    arguments: {
                        pin: {
                            type: "string",
                            menu: "pin",
                            defaultValue: "D1"
                        },
                        value: {
                            type: "string",
                            menu: "value",
                            defaultValue: "ON"
                        }
                    }
                },
                {
                    opcode: "setVoltage",
                    blockType: "command",
                    text: "set [pins] voltage level to [voltage]",
                    arguments: {
                        pins: {
                            type: "string",
                            menu: "pins",
                            defaultValue: "D1 and D2"
                        },
                        voltage: {
                            type: "string",
                            menu: "voltage",
                            defaultValue: "3V"
                        }
                    }
                },
            ],
            menus: {
                pin: ["D1", "D2", "D3", "D4", "A"],
                value: ["ON", "OFF"],
                pins: ["D1 and D2", "D3 and D4"],
                voltage: ["3V", "5V"]
            }
        };
    }

    setPin({ pin, value }) {
        var command = "AT+PIO"
        switch (pin) {
            case "D1":
                command += "5"
                break;
            case "D2":
                command += "4"
                break;
            case "D3":
                command += "8"
                break;
            case "D4":
                command += "7"
                break;
            case "A":
                command += "2"
                break;
            default:
                break;
        }
        switch (value) {
            case "ON":
                command += "1"
                break;
            case "OFF":
                command += "0"
            default:
                break;
        }
        this._peripheral.commands.push(command)
        if (!this._peripheral.sendingCommand && this._peripheral.commands.length == 1) {
            this._peripheral.send()
        }
    }

    setVoltage({ pins, voltage }) {
        var command = "AT+PIO"
        switch (pins) {
            case "D1 and D2":
                command += "6"
                break;
            case "D3 and D4":
                command += "B"
                break;
            default:
                break;
        }
        switch (voltage) {
            case "3V":
                command += "1"
                break;
            case "5V":
                command += "0"
            default:
                break;
        }
        this._peripheral.commands.push(command)
        if (!this._peripheral.sendingCommand && this._peripheral.commands.length == 1) {
            this._peripheral.send()
        }
    }

}

module.exports = SnapCircuitsU33Blocks;
