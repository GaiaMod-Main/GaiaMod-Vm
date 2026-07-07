const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const nets = require('nets');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,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';


/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3HaLakeBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'halakeblocks',
            name: 'HaLake Blocks',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'fetchURL',
                    blockType: BlockType.COMMAND,
                    text: '[TEXT]　にアクセスする',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "http://192.168.x.xx:8000/?ON=0"
                        }
                    }
                },
                {
                    opcode: 'reqURL',
                    blockType: BlockType.REPORTER,
                    text: '[URL] にアクセスして値を取ってくる',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "http://192.168.x.xx:8000/?READ=0"
                        }
                    }
                },
                {
                    opcode: 'reqGistPython',
                    blockType: BlockType.REPORTER,
                    text: ' [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "https://gist.github.com/M-Shinoda/73d1b4fb557d5efa76a1405b347809f1/raw/?param=asdfghjk"
                        }
                    }
                },
                {
                    opcode: 'paramValue',
                    blockType: BlockType.REPORTER,
                    text: '  [onlyURL] /? [parNAME] = [parVAL] & [parPLUS]',
                    arguments: {
                        onlyURL: {
                            type: ArgumentType.STRING,
                            defaultValue: "https://gist.github.com/M-Shinoda/73d1b4fb557d5efa76a1405b347809f1/raw"
                        },
                        parNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "param"
                        },
                        parVAL: {
                            type: ArgumentType.STRING,
                            defaultValue: "hogehoge"
                        },
                        parPLUS: {
                            type: ArgumentType.STRING,
                            defaultValue: " "
                        }
                    }
                },
                {
                    opcode: 'paramValuePlus',
                    blockType: BlockType.REPORTER,
                    text: '[parNAME] = [parVAL] & [parPLUS]',
                    arguments: {
                        parNAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "param"
                        },
                        parVAL: {
                            type: ArgumentType.STRING,
                            defaultValue: "hogehoge"
                        },
                        parPLUS: {
                            type: ArgumentType.STRING,
                            defaultValue: " "
                        }
                    }
                },
                {
                    opcode: 'encode',
                    blockType: BlockType.REPORTER,
                    text: '[text]をエンコード',
                    arguments: {
                        text: {
                            type: ArgumentType.STRING,
                            defaultValue: "文字"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    /**
     * Fetch URL.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     */
    fetchURL (args) {
        const text = Cast.toString(args.TEXT);
        fetch(text,
        {
            method: 'GET',
            mode: 'no-cors'
        });
    }

    /**
     * Request URL
     * @property {number} URL
     * @return {number}
     */
    reqURL (args){
        const ajaxPromise = new Promise(resolve => {
            nets({
                url: Cast.toString(args.URL)
            }, function(err, res, body){
                resolve(body);
               return body;
            });
        });
        return ajaxPromise;
    }

    reqGistPython (args){
        const ajaxPromise = new Promise(resolve => {
            nets({
                url: "http://localhost:8000/?URL=" + Cast.toString(args.URL)//localhostを環境に応じて書き換えが必要
            }, function(err, res, body){
                resolve(body);
               return body;
            });
        });
        return ajaxPromise;
    }

    paramValue (args){
        compURL =  args.onlyURL + "/?" + args.parNAME + "=" + args.parVAL + "&" + args.parPLUS
        console.log(compURL)
        const ajaxPromise = new Promise(resolve => {
            nets({
                url: "http://localhost:8000/?URL=" + Cast.toString(compURL)//localhostを環境に応じて書き換えが必要
            }, function(err, res, body){
                resolve(body);
               return body;
            });
        });
        return ajaxPromise;
    }

    paramValuePlus (args){
        return Cast.toString(args.parNAME + "=" + args.parVAL + "&" + args.parPLUS)
    }

    encode (args){
        return encodeURIComponent(args.text)
    }
}

module.exports = Scratch3HaLakeBlocks;