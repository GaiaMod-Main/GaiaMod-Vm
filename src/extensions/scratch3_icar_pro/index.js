const BLE = require('../../io/ble');
const RateLimiter = require('../../util/rateLimiter.js');

const iconURI = 'data:image/png;base64,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';

const BLEService = {
    SERVICE: '000018f0-0000-1000-8000-00805f9b34fb',
    OBD_SERVICE: 'e7810a71-73ae-499d-8c15-faa9aef0c3f2'
};

const BLECharacteristic = {
    CHARACTERISTIC: '00002af0-0000-1000-8000-00805f9b34fb',
    OBD_CHARACTERISTIC: 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'
};

const BLESendRateMax = 20;

class iCarPro {

    constructor(runtime, extensionId) {
        this._runtime = runtime;
        this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
        this._extensionId = extensionId;
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._rateLimiter = new RateLimiter(BLESendRateMax);
        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this.request = null
        this.response = null
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
            optionalServices: [BLEService.OBD_SERVICE]
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
        this.request = null
        this.response = null
    }

    isConnected() {
        if (this._ble) return this._ble.isConnected();
        return false;
    }

    send(command) {
        if (!this.isConnected() || !this._rateLimiter.okayToSend()) return Promise.resolve();
        return this._ble.write(
            BLEService.OBD_SERVICE,
            BLECharacteristic.OBD_CHARACTERISTIC,
            Uint8Array.from(Buffer.from(command + '\r')),
        );
    }

    _onConnect() {
        this._ble.read(BLEService.OBD_SERVICE, BLECharacteristic.OBD_CHARACTERISTIC, true, this._onMessage);
    }

    _onMessage(base64) {
        if (base64 == "DT4=") return
        var data = Buffer.from(base64, "base64").toString("ascii").trim()
        if (data == this.request) return
        if (data.endsWith('>')) {
            data = data.slice(0, -1).trim()
        }
        this.response = data
    }

}

class iCarProBlocks {

    constructor(runtime) {
        this.runtime = runtime;
        this._peripheral = new iCarPro(this.runtime, "iCarPro");
    }

    getInfo() {
        return {
            id: "iCarPro",
            name: 'iCar Pro',
            blockIconURI: iconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: "execute",
                    blockType: "reporter",
                    text: "execute [command]",
                    arguments: {
                        command: {
                            type: "string",
                            defaultValue: "ATZ"
                        }
                    }
                },
                {
                    opcode: "executeWithFormula",
                    blockType: "reporter",
                    text: "execute [command] and return [formula]",
                    arguments: {
                        command: {
                            type: "string",
                            defaultValue: "010C"
                        },
                        formula: {
                            type: "string",
                            defaultValue: "(256*A+B)/4"
                        }
                    }
                },
                {
                    opcode: "rpm",
                    blockType: "reporter",
                    text: "Engine speed (010C)"
                },
                {
                    opcode: "kmh",
                    blockType: "reporter",
                    text: "Vehicle speed (010D)"
                },
            ],
            menus: {}
        };
    }

    execute({ command }, util) {
        if (!command || command.length === 0) return this._peripheral.response
        if (!this.waitingForResponse) {
            this.waitingForResponse = true
            this._peripheral.request = command
            this._peripheral.response = null
            this._peripheral.send(command)
        }
        if (this._peripheral.response == null) {
            util.yield();
        } else {
            this.waitingForResponse = false
            return this._peripheral.response
        }
    }

    executeWithFormula({ command, formula }, util) {
        if (!this.waitingForResponse) {
            this.waitingForResponse = true
            this._peripheral.request = command
            this._peripheral.response = null
            this._peripheral.send(command)
        }
        if (this._peripheral.response == null) {
            util.yield();
        } else {
            this.waitingForResponse = false
            const data = this._peripheral.response.split(' ').slice(2).map(x => Number("0x" + x))
            for (var i = 0; i < data.length; i++) {
                formula = formula.replace(String.fromCharCode('A'.charCodeAt(0) + i), data[i])
            }
            return eval(formula)
        }
    }

    rpm({ }, util) {
        if (!this.waitingForResponse) {
            this.waitingForResponse = true
            const command = "010C"
            this._peripheral.request = command
            this._peripheral.response = null
            this._peripheral.send(command)
        }
        if (this._peripheral.response == null) {
            util.yield();
        } else {
            this.waitingForResponse = false
            const data = this._peripheral.response.split(' ').slice(2).map(x => Number("0x" + x))
            return Math.round((256 * data[0] + data[1]) / 4)
        }
    }

    kmh({ }, util) {
        if (!this.waitingForResponse) {
            this.waitingForResponse = true
            const command = "010D"
            this._peripheral.request = command
            this._peripheral.response = null
            this._peripheral.send(command)
        }
        if (this._peripheral.response == null) {
            util.yield();
        } else {
            this.waitingForResponse = false
            const data = this._peripheral.response.split(' ').slice(2).map(x => Number("0x" + x))
            return data[0]
        }
    }

}

module.exports = iCarProBlocks;
