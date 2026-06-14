const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class Scratch3WebApiSample {
    constructor(runtime) {
        this.runtime = runtime;
        this._result = "";
        this._url = "";
        this._result = "";
    }

    getInfo() {
        return {
            id: 'webapisample',
            name: 'Web API Sample',
            blocks: [
                {
                    opcode: 'setUrl',
                    blockType: BlockType.COMMAND,
                    text: 'Set URL [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "http://localhost:5000/api/Hello/"
                        }
                    }
                },
                {
                    opcode: 'getUrl',
                    blockType: BlockType.REPORTER,
                    text: 'URL'
                },
                {
                    opcode: 'getResult',
                    blockType: BlockType.REPORTER,
                    text: 'result'
                },
                {
                    opcode: 'callWebApiByGet',
                    blockType: BlockType.REPORTER,
                    text: 'Call Web API GET [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "100"
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    setUrl(args) {
        const text = Cast.toString(args.TEXT);
        this._url = text;
    }
    getUrl() {
        return this._url;
    }
    getResult() {
        return this._result;
    }
    callWebApiByGet(args) {
        const text = Cast.toString(args.TEXT);
        const path = this._url + text;
        var pr = fetch(path)
            .then(res => res.text())
            .then(body => this._result = body);
        return pr;
    }
}

module.exports = Scratch3WebApiSample;
