const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const { captureRejectionSymbol } = require('../../engine/target');
const { uniqueId } = require('lodash');
const Cast = require('../../util/cast');

class OBSBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.s = null;
    }

    getInfo() {
        return {
            id: 'obs',
            name: 'OBS',
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'connect to OBS at [URL]',
                    }),
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                        }
                    }
                },
                {
                    opcode: 'setText',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'set input [INPUT] to [TEXT]',
                    }),
                    arguments: {
                        INPUT: {
                            type: ArgumentType.STRING,
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                        }
                    }
                }
            ]
        };
    }

    async connect(args) {
        if(this.s) {
            this.s.close();
            this.s = null;
        }

        this.s = await new Promise((resolve, reject) => {
            const s = new WebSocket(args.URL);

            const onmessage = e => {
                const data = JSON.parse(e.data);
                switch (data.op) {
                    case 0:
                        s.send(JSON.stringify({
                            op: 1,
                            d: {
                                rpcVersion: 1
                            }
                        }));
                        break;
                    case 2:
                        resolve(s);
                        s.removeEventListener('message', onmessage);
                        break;
                    default:
                        s.removeEventListener('message', onmessage);
                        reject(new Error(`Unexpected opcode ${data.op}`));
                        break;
                }
            };

            s.addEventListener('message', onmessage);
        });
    }

    async _send(data) {
        return await this.s.send(JSON.stringify(data));
    }

    async setText(args) {
        this._send({
            op: 6,
            d: {
                requestType: "SetInputSettings",
                requestId: uniqueId(),
                requestData: {
                    inputName: args.INPUT,
                    inputSettings: {
                        text: Cast.toString(args.TEXT)
                    }
                }
            }
        });
    }
}

module.exports = OBSBlocks;