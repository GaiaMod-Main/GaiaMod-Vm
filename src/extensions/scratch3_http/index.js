const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast')
const fetch = require('node-fetch');

class Scratch3Http {
    constructor (runtime) {
        this.runtime = runtime;
		this._lastStatusCode = null;
    }

    getInfo () {
        return {
            id: 'http',
            name: 'HTTP',
            color1: '#FF4C4C',
            color2: '#CC3C3C',
            color3: '#992C2C',
            blocks: [{
                opcode: 'fetchUrl',
                blockType: BlockType.REPORTER,
                text: 'get HTTP content from [URL]',
                arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "https://api.chucknorris.io/jokes/random"
                        }
                    }
                },
				{
                    opcode: 'getLastStatusCode',
                    blockType: BlockType.REPORTER,
                    text: 'last HTTP status code'
                }
            ],
            menus: {
            }
        };
    }

    async fetchUrl(args) {
        const url = Cast.toString(args.URL);
        try {
            const response = await fetch(url);
			this._lastStatusCode = response.status;

            if (!response.ok) {
                return `HTTP Error ${response.status}: ${response.statusText}`;
            }

            const text = await response.text();
            return text;
        } catch (e) {
            return `Network Error: ${e.message}`;
        }
    }
	
	getLastStatusCode() {
        return this._lastStatusCode;
    }
}

module.exports = Scratch3Http;