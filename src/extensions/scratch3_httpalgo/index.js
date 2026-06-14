const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const algosdk = require('algosdk');

class HttpBlocks {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'http',
            name: 'HTTP',
            blocks: [
                {
                    opcode: 'httpPost',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'post [DATA] to [URL]',
                    }),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                        },
                        URL: {
                            type: ArgumentType.STRING,
                        }
                    }
                }
            ]
        };
    }

    async httpPost(args) {
        fetch(args.URL, {
            method: 'POST',
            body: args.DATA
        });
    }
}

module.exports = HttpBlocks;