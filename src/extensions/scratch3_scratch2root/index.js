const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const blockIconURI = 'data:image/png;base64,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';
const formatMessage = require('format-message');

const Message = {
    connect: {
        'ja': '接続',
        'ja-Hira': 'せつぞく',
        'en': 'connect'
    },
    disconnect: {
        'ja': '切断',
        'ja-Hira': 'せつだん',
        'en': 'disconnect'
    },
    driveDistance: {
        'ja': '[DISTANCE] mm進む',
        'ja-Hira': '[DISTANCE] mmすすむ',
        'en': 'drive [DISTANCE] mm'
    },
    rotate: {
        'ja': '[ANGLE] 度回転する',
        'ja-Hira': '[ANGLE] どかいてんする',
        'en': 'rotate [ANGLE] degrees'
    },
    penUp: {
        'ja': 'ペンを上げる',
        'ja-Hira': 'ペンをあげる',
        'en': 'pen up'
    },
    penDown: {
        'ja': 'ペンを下げる',
        'ja-Hira': 'ペンをさげる',
        'en': 'pen down'
    },
    playNote: {
        'ja': '音階 [NOTE] を [DURATION] ミリ秒鳴らす',
        'ja-Hira': 'おんかい [NOTE] を [DURATION] ミリびょうならす',
        'en': 'play note [NOTE] for [DURATION] ms'
    }
};

const AvailableLocales = ['en', 'ja', 'ja-Hira'];

// Note to frequency mapping (C1 = 33Hz, C4 = Middle C)
const NoteFrequencies = {
    'C1': 33, 'C#1': 35, 'D1': 37, 'D#1': 39, 'E1': 41, 'F1': 44, 'F#1': 46, 'G1': 49, 'G#1': 52, 'A1': 55, 'A#1': 58, 'B1': 62,
    'C2': 65, 'C#2': 69, 'D2': 73, 'D#2': 78, 'E2': 82, 'F2': 87, 'F#2': 93, 'G2': 98, 'G#2': 104, 'A2': 110, 'A#2': 117, 'B2': 123,
    'C3': 131, 'C#3': 139, 'D3': 147, 'D#3': 156, 'E3': 165, 'F3': 175, 'F#3': 185, 'G3': 196, 'G#3': 208, 'A3': 220, 'A#3': 233, 'B3': 247,
    'C4': 262, 'C#4': 277, 'D4': 294, 'D#4': 311, 'E4': 330, 'F4': 349, 'F#4': 370, 'G4': 392, 'G#4': 415, 'A4': 440, 'A#4': 466, 'B4': 494,
    'C5': 523, 'C#5': 554, 'D5': 587, 'D#5': 622, 'E5': 659, 'F5': 698, 'F#5': 740, 'G5': 784, 'G#5': 831, 'A5': 880, 'A#5': 932, 'B5': 988,
    'C6': 1047, 'C#6': 1109, 'D6': 1175, 'D#6': 1245, 'E6': 1319, 'F6': 1397, 'F#6': 1480, 'G6': 1568, 'G#6': 1661, 'A6': 1760, 'A#6': 1865, 'B6': 1976,
    'C7': 2093, 'C#7': 2217, 'D7': 2349, 'D#7': 2489, 'E7': 2637, 'F7': 2794, 'F#7': 2960, 'G7': 3136, 'G#7': 3322, 'A7': 3520, 'A#7': 3729, 'B7': 3951,
    'C8': 4186, 'C#8': 4435, 'D8': 4699, 'D#8': 4978, 'E8': 5274, 'F8': 5588, 'F#8': 5920, 'G8': 6272, 'G#8': 6645, 'A8': 7040, 'A#8': 7459, 'B8': 7902,
    'C9': 8372
};

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://champierre.github.io/scratch2root/scratch2root.mjs';

class Scratch3Scratch2RootBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'Scratch2Root';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'scratch2root';
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL() {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * extensionURL will be reset when the module is loaded from the web.
     * @param {string} url - URL
     */
    static set extensionURL(url) {
        extensionURL = url;
    }

    constructor (runtime) {
        this.runtime = runtime;
        this.device = null;
        this.rxChar = null;
        this.txChar = null;
        this.crcTable = this.generateCrc8Table();
        this.commandResolvers = new Map();
    }

    getNoteMenuItems () {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteNames = ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ'];
        const items = [];

        for (let octave = 1; octave <= 9; octave++) {
            const octaveNotes = octave === 9 ? ['C'] : notes;
            octaveNotes.forEach((note, index) => {
                const noteName = `${note}${octave}`;
                const displayName = `${noteNames[index]} (${noteName})`;
                items.push({ text: displayName, value: noteName });
            });
        }

        return items;
    }

    getInfo () {
        this.locale = this.setLocale();

        return {
            id: Scratch3Scratch2RootBlocks.EXTENSION_ID,
            name: Scratch3Scratch2RootBlocks.EXTENSION_NAME,
            extensionURL: Scratch3Scratch2RootBlocks.extensionURL,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: Message.connect[this.locale]
                },
                {
                    opcode: 'disconnect',
                    blockType: BlockType.COMMAND,
                    text: Message.disconnect[this.locale]
                },
                {
                    opcode: 'driveDistance',
                    blockType: BlockType.COMMAND,
                    text: Message.driveDistance[this.locale],
                    arguments: {
                        DISTANCE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'rotate',
                    blockType: BlockType.COMMAND,
                    text: Message.rotate[this.locale],
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        }
                    }
                },
                {
                    opcode: 'penUp',
                    blockType: BlockType.COMMAND,
                    text: Message.penUp[this.locale]
                },
                {
                    opcode: 'penDown',
                    blockType: BlockType.COMMAND,
                    text: Message.penDown[this.locale]
                },
                {
                    opcode: 'playNote',
                    blockType: BlockType.COMMAND,
                    text: Message.playNote[this.locale],
                    arguments: {
                        NOTE: {
                            type: ArgumentType.STRING,
                            menu: 'noteMenu',
                            defaultValue: 'C4'
                        },
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1000
                        }
                    }
                }
            ],
            menus: {
                noteMenu: {
                    acceptReporters: true,
                    items: this.getNoteMenuItems()
                }
            }
        };
    }

    async connect () {
        const ROOT_SERVICE_UUID = '48c5d828-ac2a-442d-97a3-0c9822b04979';
        const DEVICE_INFORMATION_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';
        const UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        const TX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
        const RX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

        if (!navigator.bluetooth) {
            console.log('Web Bluetooth API is not supported by this browser.');
            return;
        }

        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{
                    services: [ROOT_SERVICE_UUID]
                }],
                optionalServices: [DEVICE_INFORMATION_SERVICE, UART_SERVICE]
            });

            const server = await this.device.gatt.connect();
            console.log('Connected to GATT server');

            const service = await server.getPrimaryService(UART_SERVICE);
            console.log('Service found:', service.uuid);

            const txChar = await service.getCharacteristic(TX_CHAR_UUID);
            this.txChar = txChar;
            console.log('TX Characteristic found:', txChar.uuid);

            const rxChar = await service.getCharacteristic(RX_CHAR_UUID);
            this.rxChar = rxChar;
            console.log('RX Characteristic found:', rxChar.uuid);

            // Enable notifications for responses
            await rxChar.startNotifications();
            rxChar.addEventListener('characteristicvaluechanged', this.handleResponse.bind(this));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    handleResponse (event) {
        const value = event.target.value;
        const data = new Uint8Array(value.buffer);
        console.log('Response received:', data);

        // Check if this is a driveDistance completion response
        // Format: [1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129]
        if (data.length >= 2 && data[0] === 1 && data[1] === 8) {
            const key = `${data[0]}-${data[1]}`;
            const resolver = this.commandResolvers.get(key);
            if (resolver) {
                resolver();
                this.commandResolvers.delete(key);
            }
        }

        // Check if this is a rotate completion response
        // Format: [1, 12, ...]
        if (data.length >= 2 && data[0] === 1 && data[1] === 12) {
            const key = `${data[0]}-${data[1]}`;
            const resolver = this.commandResolvers.get(key);
            if (resolver) {
                resolver();
                this.commandResolvers.delete(key);
            }
        }

        // Check if this is a pen position completion response
        // Format: [2, 0, ...]
        if (data.length >= 2 && data[0] === 2 && data[1] === 0) {
            const key = `${data[0]}-${data[1]}`;
            const resolver = this.commandResolvers.get(key);
            if (resolver) {
                resolver();
                this.commandResolvers.delete(key);
            }
        }

        // Check if this is a play note completion response
        // Format: [5, 0, ...]
        if (data.length >= 2 && data[0] === 5 && data[1] === 0) {
            const key = `${data[0]}-${data[1]}`;
            const resolver = this.commandResolvers.get(key);
            if (resolver) {
                resolver();
                this.commandResolvers.delete(key);
            }
        }
    }

    async disconnect () {
        console.log('disconnect');

        if (this.device && this.device.gatt.connected) {
            try {
                // Stop notifications
                if (this.rxChar) {
                    await this.rxChar.stopNotifications();
                    this.rxChar.removeEventListener('characteristicvaluechanged', this.handleResponse.bind(this));
                }

                // Disconnect from device
                this.device.gatt.disconnect();
                console.log('Disconnected from Root Robot');

                // Clear references
                this.device = null;
                this.rxChar = null;
                this.txChar = null;
                this.commandResolvers.clear();
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        } else {
            console.log('Not connected to any device');
        }
    }

    async sendCommand (value, waitForResponse = false) {
        if (!this.txChar) {
            console.error('Not connected to Root Robot');
            return;
        }

        let responsePromise = null;
        if (waitForResponse) {
            const key = `${value[0]}-${value[1]}`;
            responsePromise = new Promise((resolve) => {
                this.commandResolvers.set(key, resolve);
            });
        }

        await this.txChar.writeValue(this.appendCrc(value));

        if (waitForResponse) {
            // Wait for response with 10 second timeout
            await Promise.race([
                responsePromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('Command timeout')), 10000))
            ]).catch(err => {
                console.error('Command error:', err);
                const key = `${value[0]}-${value[1]}`;
                this.commandResolvers.delete(key);
            });
        } else {
            // Add small delay to allow robot to process command
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async driveDistance (args) {
        console.log('driveDistance');
        const distance = Cast.toNumber(args.DISTANCE);
        const value = this.setDistance(distance);
        await this.sendCommand(value, true);  // Wait for completion response
    }

    async rotate (args) {
        console.log('rotate');
        const angle = Cast.toNumber(args.ANGLE);
        const value = this.setAngle(angle * 10);
        await this.sendCommand(value, true);  // Wait for completion response
    }

    async penUp () {
        console.log('penUp');
        const value = this.setPenPosition(0);
        await this.sendCommand(value, true);  // Wait for completion response
    }

    async penDown () {
        console.log('penDown');
        const value = this.setPenPosition(1);
        await this.sendCommand(value, true);  // Wait for completion response
    }

    async playNote (args) {
        console.log('playNote');
        const noteName = Cast.toString(args.NOTE);
        const frequency = NoteFrequencies[noteName] || Cast.toNumber(args.NOTE);
        const duration = Cast.toNumber(args.DURATION);
        const value = this.setNote(frequency, duration);
        await this.sendCommand(value, true);  // Wait for completion response
    }

    generateCrc8Table () {
        const polynomial = 0x07;
        const table = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            let crc = i;
            for (let j = 0; j < 8; j++) {
                if (crc & 0x80) {
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc <<= 1;
                }
            }
            table[i] = crc & 0xFF;
        }
        return table;
    }

    crc8 (data) {
        let crc = 0x00; // Initial value
        for (let i = 0; i < data.length; i++) {
            const byte = data[i];
            crc = this.crcTable[(crc ^ byte) & 0xFF];
        }
        return crc;
    }

    appendCrc (value) {
        const newValue = new Uint8Array(value.length + 1);
        newValue.set(value);
        newValue[19] = this.crc8(value);
        return newValue;
    }


    setDistance (distance) {
        const arr = new Uint8Array(19);
        arr[0] = 1;
        arr[1] = 8;
        arr[2] = 0;
        arr[3] = (distance >> 24) & 0xFF;
        arr[4] = (distance >> 16) & 0xFF;
        arr[5] = (distance >> 8) & 0xFF;
        arr[6] = distance & 0xFF;
        return arr;
    }

    setAngle (angle) {
        const arr = new Uint8Array(19);
        arr[0] = 1;
        arr[1] = 12;
        arr[2] = 0;
        arr[3] = (angle >> 24) & 0xFF;
        arr[4] = (angle >> 16) & 0xFF;
        arr[5] = (angle >> 8) & 0xFF;
        arr[6] = angle & 0xFF;
        return arr;
    }

    setPenPosition (position) {
        const arr = new Uint8Array(19);
        arr[0] = 2;  // Device 2 = Marker/Eraser
        arr[1] = 0;  // Command 0 = Set position
        arr[2] = 0;  // Packet ID
        arr[3] = position;  // 0 = up, 1 = down
        return arr;
    }

    setNote (frequency, duration) {
        const arr = new Uint8Array(19);
        arr[0] = 5;  // Device 5 = Sound
        arr[1] = 0;  // Command 0 = Play note
        arr[2] = 0;  // Packet ID
        arr[3] = (frequency >> 24) & 0xFF;  // Frequency byte 3 (32-bit)
        arr[4] = (frequency >> 16) & 0xFF;  // Frequency byte 4
        arr[5] = (frequency >> 8) & 0xFF;   // Frequency byte 5
        arr[6] = frequency & 0xFF;          // Frequency byte 6
        arr[7] = (duration >> 8) & 0xFF;    // Duration byte 7 (16-bit)
        arr[8] = duration & 0xFF;           // Duration byte 8
        return arr;
    }

    generateCrc8Table () {
        const polynomial = 0x07;
        const table = new Uint8Array(256);
        for (let i = 0; i < 256; i++) {
            let crc = i;
            for (let j = 0; j < 8; j++) {
                if (crc & 0x80) {
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc <<= 1;
                }
            }
            table[i] = crc & 0xFF;
        }
        return table;
    }

    crc8 (data) {
        let crc = 0x00; // Initial value
        for (let i = 0; i < data.length; i++) {
            const byte = data[i];
            crc = this.crcTable[(crc ^ byte) & 0xFF];
        }
        return crc;
    }

    appendCrc (value) {
        const newValue = new Uint8Array(value.length + 1);
        newValue.set(value);
        newValue[19] = this.crc8(value);
        return newValue;
    }

    /**
     * Get locale for message text.
     * @return {string} - Locale of this editor.
     */
    setLocale () {
        const locale = formatMessage.setup().locale;
        if (AvailableLocales.includes(locale)) {
            return locale;
        }
        return 'en';
    }
}

exports.blockClass = Scratch3Scratch2RootBlocks; // loadable-extension needs this line.
module.exports = Scratch3Scratch2RootBlocks;
