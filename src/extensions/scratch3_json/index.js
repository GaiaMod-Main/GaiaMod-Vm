const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

class Scratch3Json {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'json',
            name: 'JSON',
            color1: '#FF9933',
            color2: '#CC7A29',
            color3: '#995C1F',
            blocks: [
                {
                    opcode: 'parseJsonField',
                    blockType: BlockType.REPORTER,
                    text: 'get field [FIELD] from JSON [JSON_STRING]',
                    arguments: {
                        JSON_STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"name":"Scratch","type":"editor"}'
                        },
                        FIELD: {
                            type: ArgumentType.STRING,
                            defaultValue: "name"
                        }
                    }
                }
            ]
        };
    }

    parseJsonField(args) {
        const jsonString = Cast.toString(args.JSON_STRING);
        const field = Cast.toString(args.FIELD);

        try {
            const data = JSON.parse(jsonString);

            if (data.hasOwnProperty(field)) {
                return String(data[field]);
            } else {
                return `Field "${field}" not found`;
            }
        } catch (e) {
            return `Invalid JSON: ${e.message}`;
        }
    }
}

module.exports = Scratch3Json;