const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

class Scratch3Cookies {
    constructor(runtime) {
        this.runtime = runtime;
        this.cookies = {};
    }

    getInfo() {
        return {
            id: 'cookies',
            name: 'Cookies',
            color1: '#FFCC33',
            color2: '#FFB732',
            color3: '#CC8A29',
            blocks: [
                {
                    opcode: 'setCookie',
                    blockType: BlockType.COMMAND,
                    text: 'set cookie [KEY] = [VALUE]',
                    arguments: {
                        KEY: { type: ArgumentType.STRING, defaultValue: 'username' },
                        VALUE: { type: ArgumentType.STRING, defaultValue: 'ScratchUser' }
                    }
                },
                {
                    opcode: 'getCookie',
                    blockType: BlockType.REPORTER,
                    text: 'get cookie [KEY]',
                    arguments: {
                        KEY: { type: ArgumentType.STRING, defaultValue: 'username' }
                    }
                },
                {
                    opcode: 'deleteCookie',
                    blockType: BlockType.COMMAND,
                    text: 'delete cookie [KEY]',
                    arguments: {
                        KEY: { type: ArgumentType.STRING, defaultValue: 'username' }
                    }
                },
                {
                    opcode: 'listCookies',
                    blockType: BlockType.REPORTER,
                    text: 'list all cookies'
                }
            ]
        };
    }

    setCookie(args) {
		const key = Cast.toString(args.KEY);
		const value = Cast.toString(args.VALUE);
		this.cookies[key] = value;
		localStorage.setItem(key, value); // persist to browser
	}

	getCookie(args) {
		const key = Cast.toString(args.KEY);
		return this.cookies[key] ?? localStorage.getItem(key) ?? '';
	}

	deleteCookie(args) {
		const key = Cast.toString(args.KEY);
		delete this.cookies[key];
		localStorage.removeItem(key);
	}

	listCookies() {
		const allCookies = {...this.cookies};
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (!(key in allCookies)) {
				allCookies[key] = localStorage.getItem(key);
			}
		}
		return Object.entries(allCookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
	}
}

module.exports = Scratch3Cookies;