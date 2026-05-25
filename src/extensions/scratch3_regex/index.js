const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

class Scratch3Regex {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'regex',
            name: 'Regex',
            color1: '#9B59B6',
			color2: '#884EA0',
			color3: '#76448A',
            blocks: [
                {
                    opcode: 'matchRegex',
                    blockType: BlockType.REPORTER,
                    text: 'match regex [REGEX] in text [TEXT]',
                    arguments: {
                        REGEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '\\w+' // default: first word
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello world!'
                        }
                    }
                },
                {
                    opcode: 'matchAllRegex',
                    blockType: BlockType.REPORTER,
                    text: 'match all regex [REGEX] in text [TEXT]',
                    arguments: {
                        REGEX: {
                            type: ArgumentType.STRING,
                            defaultValue: '\\w+' // default: all words
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hello world!'
                        }
                    }
                }
            ]
        };
    }

    matchRegex(args) {
        const regexString = Cast.toString(args.REGEX);
        const text = Cast.toString(args.TEXT);

        try {
            const regex = new RegExp(regexString);
            const match = text.match(regex);
            return match ? match[0] : '';
        } catch (e) {
            return `Invalid regex: ${e.message}`;
        }
    }

    matchAllRegex(args) {
        const regexString = Cast.toString(args.REGEX);
        const text = Cast.toString(args.TEXT);

        try {
            const regex = new RegExp(regexString, 'g');
            const matches = text.match(regex);
            return matches ? matches.join(', ') : '';
        } catch (e) {
            return `Invalid regex: ${e.message}`;
        }
    }
}

module.exports = Scratch3Regex;