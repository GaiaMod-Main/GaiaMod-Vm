const ArgumentType = require('scratch-vm/src/extension-support/argument-type');
const BlockType = require('scratch-vm/src/extension-support/block-type');
const Cast = require('scratch-vm/src/util/cast');
const blockIconURI = 'data:image/png;base64,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';
const fetchWithTimeout = require('scratch-vm/src/util/fetch-with-timeout');
const log = require('../../util/log');

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000;

/**
 * The url of the translate server.
 * @type {string}
 */

const serverURL = 'https://openai2scratch-api.fly.dev/';
// const serverURL = 'http://localhost:3000/';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://champierre.github.io/openai2scratch/openai2scratch.mjs';

class Scratch3Openai2Scratch {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'OpenAI2Scratch';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'openai2scratch';
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
        this._answer = '';
        this._lastQuestion = '';
        this._serialCode = '';
    }

    getInfo () {
        return {
            id: Scratch3Openai2Scratch.EXTENSION_ID,
            name: Scratch3Openai2Scratch.EXTENSION_NAME,
            extensionURL: Scratch3Openai2Scratch.extensionURL,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'setSerialCode',
                    blockType: BlockType.COMMAND,
                    text: 'シリアルコードを入力する'
                },
                {
                    opcode: 'getAnswer',
                    blockType: BlockType.REPORTER,
                    text: '[QUESTION] の答え',
                    arguments: {
                        QUESTION: {
                            type: ArgumentType.STRING,
                            defaultValue: '日本の首都は？'
                        }
                    }
                }
            ]
        };
    }

    setSerialCode () {
        this._serialCode = window.prompt('作者から教わったシリアルコードを入力してください。', this._serialCode);
    }

    getAnswer (args) {
        if (this._lastQuestion === args.QUESTION) {
            return this._answer;
        }

        let urlBase = `${serverURL}ask`;
        urlBase += '?q=';
        urlBase += encodeURIComponent(args.QUESTION);
        urlBase += '&sc=';
        urlBase += encodeURIComponent(this._serialCode);

        const tempThis = this;
        const fetchPromise = fetchWithTimeout(urlBase, {}, serverTimeoutMs)
            .then(response => response.text())
            .then(responseText => {
                const regex = new RegExp('^{"error":"Forbidden"}');
                if (regex.test(responseText)) {
                    tempThis._answer = '';
                } else {
                    tempThis._lastQuestion = args.QUESTION;
                    tempThis._answer = responseText;
                }
                return responseText;
            })
            .catch(err => {
                log.warn(`error fetching result! ${err}`);
                return '';
            });
        return fetchPromise;
    }
}

exports.blockClass = Scratch3Openai2Scratch; // loadable-extension needs this line.
module.exports = Scratch3Openai2Scratch;
