const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const blockIconURI = 'data:image/png;base64,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';
const formatMessage = require('format-message');

const Message = {
    connect: {
        'ja': '接続',
        'ja-Hira': 'せつぞく',
        'en': 'connect',
        'ko': '연결'
    },
    disconnect: {
        'ja': '切断',
        'ja-Hira': 'せつだん',
        'en': 'disconnect',
        'ko': '연결 해제'
    },
    send: {
        'ja': '[MSG]を送る',
        'ja-Hira': '[MSG]をおくる',
        'en': 'send [MSG]',
        'ko': '[MSG] 보내기'
    },

}

const AvailableLocales = ['en', 'ja', 'ja-Hira', 'ko'];

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://champierre.github.io/scratch2webserialapi/scratch2webserialapi.mjs';

class Scratch3Scratch2WebSerialAPIBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'Scratch2WebSerialAPI';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'scratch2webserialapi';
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

    constructor(runtime) {
        this.runtime = runtime;
        this.port = '';
    }

    getInfo() {
        this.locale = this.setLocale();

        return {
            id: Scratch3Scratch2WebSerialAPIBlocks.EXTENSION_ID,
            name: Scratch3Scratch2WebSerialAPIBlocks.EXTENSION_NAME,
            extensionURL: Scratch3Scratch2WebSerialAPIBlocks.extensionURL,
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
                    opcode: 'send',
                    blockType: BlockType.COMMAND,
                    text: Message.send[this.locale],
                    arguments: {
                        MSG: {
                            type: ArgumentType.STRING,
                            defaultValue: 'test'
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    async connect() {
        console.log('connect');
        if ('serial' in navigator) {
            try {
                this.port = await navigator.serial.requestPort();
                await this.port.open({ baudRate: 115200 });
                alert('Connected to the serial port');
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.error('Web Serial API not supported.');
        }
    }

    async disconnect() {
        console.log('disconnect');
        if ('serial' in navigator) {
            if (this.port && this.port.close) {
                await this.port.close();
                port = null;
                alert('Disconnected from the serial port');
            } else {
                console.error('No active serial connection to disconnect');
            }
        } else {
            console.error('Web Serial API not supported.');
        }
    }

    async send(args) {
        console.log(args.MSG);
        if (this.port && this.port.writable) {
            const writer = this.port.writable.getWriter();
            const data = new TextEncoder().encode(args.MSG);
            await writer.write(data);
            writer.releaseLock();
        }
    }

    /**
     * Get locale for message text.
     * @return {string} - Locale of this editor.
     */
    setLocale() {
        const locale = formatMessage.setup().locale;
        if (AvailableLocales.includes(locale)) {
            return locale;
        }
        return 'en';
    }
}

exports.blockClass = Scratch3Scratch2WebSerialAPIBlocks; // loadable-extension needs this line.
module.exports = Scratch3Scratch2WebSerialAPIBlocks;