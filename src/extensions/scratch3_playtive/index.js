const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');

class Playtive {
    constructor(runtime, extensionId) {
        this.runtime = runtime;
        this.extensionId = extensionId;
        this.runtime.registerPeripheralExtension(extensionId, this);
    }

    scan() {
        if (this.ble) {
            this.ble.disconnect();
        }
        this.ble = new BLE(this.runtime, this.extensionId, {
            filters: [
                {services: [0xfaa0]}
            ]
        }, this._onConnect, this.reset);
    }

    connect(id) {
        if (this.ble) {
            this.ble.connectPeripheral(id);
        }
    }

    disconnect () {
        if (this.ble) {
            this.ble.disconnect();
        }

        this.reset();
    }

    _onConnect() {
        console.log("connected");
    }
    

    reset() {
        
    }

    isConnected() {
        let connected = false;
        if(this.ble) {
            connected = this.ble.isConnected();
        }

        return connected;;
    }

    write(data) {
        const encoded = btoa(String.fromCharCode(...data));
        this.ble.write(0xfaa0, "0000faa1-0000-1000-8000-00805f9b34fb", encoded, 'base64', false);
    }
}

class PlaytiveBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.device = null;

        this.peripheral = new Playtive(runtime, 'playtive');
    }

    async _reconnectDevice() {
        const devices = await navigator.bluetooth.getDevices();
        if (devices.length) {
            this.device = devices[0];
        } else {
            this.device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: false,
                filters: [
                    {
                        services: ["0000faa0-0000-1000-8000-00805f9b34fb"]
                    }
                ]
            });
        }

        await this._reconnectGatt();
    }

    async _reconnectGatt() {
        this.gatt = await this.device.gatt.connect();
        this.service = await this.gatt.getPrimaryService("0000faa0-0000-1000-8000-00805f9b34fb");
        this.char = await this.service.getCharacteristic("0000faa1-0000-1000-8000-00805f9b34fb");
    }

    getInfo() {
        return {
            id: 'playtive',
            name: 'Playtive',
            blocks: [
                {
                    opcode: 'setMove',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'set move in direction [DIRECTION] with speed [SPEED]',
                        description: 'Move the model in the given direction',
                    }),
                    arguments: {
                        DIRECTION: {
                            type: ArgumentType.NUMBER,
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                        }
                    }
                },
                {
                    opcode: 'setLight',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: "set light to [MODE]",
                        description: "Set the lights to the given mode",
                    }),
                    arguments: {
                        MODE: {
                            type: ArgumentType.NUMBER,
                        }
                    }
                },
                {
                    opcode: 'playSound',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: "play sound [SOUND]",
                        description: "Plays sound"
                    }),
                    arguments: {
                        SOUND: {
                            type: ArgumentType.NUMBER,
                        }
                    }
                }
            ],
        };
    }

    async _send(data) {
        this.peripheral.write(data);
    }

    async playSound(args) {
        await this._send([165, 2, args.SOUND]);
    }

    async setLight(args) {
        await this._send([165, 3, args.MODE]);
    }

    async setMove(args) {
        await this._send([165, 1, args.DIRECTION, args.SPEED]);
    }

}

module.exports = PlaytiveBlocks;