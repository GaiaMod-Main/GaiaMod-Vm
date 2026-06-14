const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const algosdk = require('algosdk');

class AlgorandBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.lastRound = null;

        this.runtime.on("ALGORAND_ROUND", round => {
            this.lastRound = round;
            this.runtime.startHats('algorand_blockProduced');
        });

        this.firstInstall = true;
    }

    getInfo() {
        if (this.firstInstall) {
            this.runtime.ioDevices.algorand.enable();
            this.ac = this.runtime.ioDevices.algorand.client();
            
            this.firstInstall = false;
        }

        return {
            id: 'algorand',
            name: 'Algorand',
            blocks: [
                {
                    opcode: 'setupWallet',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'setup wallet with mnemonic [MNEMONIC]',
                        description: 'setup wallet with mnemonic'
                    }),
                    arguments: {
                        MNEMONIC: {
                            type: ArgumentType.STRING,
                            default: ''
                        }
                    }
                },
                {
                    opcode: 'pay',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'pay [AMOUNT] to [ADDRESS]',
                    }),
                    arguments: {
                        AMOUNT: {
                            type: ArgumentType.NUMBER,
                        },
                        ADDRESS: {
                            type: ArgumentType.STRING,
                        }
                    }
                },
                {
                    opcode: 'transferAsset',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'transfer [AMOUNT] of [ASSET] to [ADDRESS]',
                    }),
                    arguments: {
                        AMOUNT: {
                            type: ArgumentType.NUMBER,
                        },
                        ASSET: {
                            type: ArgumentType.NUMBER,
                        },
                        ADDRESS: {
                            type: ArgumentType.STRING,
                        }
                    }
                },
                {
                    opcode: 'blockProduced',
                    blockType: BlockType.EVENT,
                    text: 'When a new Algorand block is produced',
                    isEdgeActivated: false,
                },
                {
                    opcode: 'getRound',
                    blockType: BlockType.REPORTER,
                    text: 'last Algorand block round'
                },
                {
                    opcode: 'getBlock',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'read block [ROUND]',
                        description: 'Get the block with the given round number'
                    }),
                    arguments: {
                        ROUND: {
                            type: ArgumentType.NUMBER,
                        }
                    }
                },
                {
                    opcode: 'currentBlockTransactionsCount',
                    blockType: BlockType.REPORTER,
                    text: 'number of transactions in the current Algorand block'
                },
                {
                    opcode: 'getCurrentBlockTransaction',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'read transaction [INDEX]',
                        description: 'Get the transaction with the given index'
                    }),
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'currentBlockForEachTransaction',
                    blockType: BlockType.LOOP,
                    text: formatMessage({
                        default: 'for each transaction',
                        description: 'Loop through all transactions in the current block'
                    }),
                    arguments: {
                        ROUND: {
                            type: ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'currentTxType',
                    blockType: BlockType.REPORTER,
                    text: 'type of the current transaction'
                },
                {
                    opcode: 'currentTxNote',
                    blockType: BlockType.REPORTER,
                    text: 'note of the current transaction'
                },
                {
                    opcode: 'currentTxSender',
                    blockType: BlockType.REPORTER,
                    text: 'sender of the current transaction'
                },
                {
                    opcode: 'currentTxReceiver',
                    blockType: BlockType.REPORTER,
                    text: 'receiver of the current transaction'
                },
                {
                    opcode: 'currentTxAmount',
                    blockType: BlockType.REPORTER,
                    text: 'amount of the current transaction'
                },
                {
                    opcode: 'currentTxAsset',
                    blockType: BlockType.REPORTER,
                    text: 'asset of the current transaction'
                }
            ]
        };
    }

    async transferAsset(args) {
        const sp = await this.ac.getTransactionParams().do();
        const tx = algosdk.makeAssetTransferTxnWithSuggestedParams(this.acc.addr, args.ADDRESS, undefined, undefined, parseInt(args.AMOUNT), undefined, parseInt(args.ASSET), sp, undefined);

        const stx = tx.signTxn(this.acc.sk);
        await this.ac.sendRawTransaction(stx).do();
    }


    async pay(args) {
        const sp = await this.ac.getTransactionParams().do();
        const tx = algosdk.makePaymentTxnWithSuggestedParams(this.acc.addr, args.ADDRESS, parseInt(args.AMOUNT), undefined, undefined, sp, undefined);

        const stx = tx.signTxn(this.acc.sk);
        await this.ac.sendRawTransaction(stx).do();
    }

    setupWallet(args) {
        this.acc = algosdk.mnemonicToSecretKey(args.MNEMONIC);
    }

    currentTxAsset(args) {
        if(!this.tx) {
            return null;
        }

        switch (this.tx.txn.type) {
            case 'axfer':
                return this.tx.txn.xaid;
            default:
                return null;
        }
    }

    currentTxAmount(args) {
        if(!this.tx) {
            return null;
        }

        switch (this.tx.txn.type) {
            case 'pay':
                return this.tx.txn.amt;
            case 'axfer':
                return this.tx.txn.aamt;
            default:
                return null;
        }
    }

    currentTxReceiver(args) {
        if(!this.tx) {
            return null;
        }

        switch (this.tx.txn.type) {
            case 'pay':
                if(!this.tx.txn.rcv) {
                    return null;
                }
                return algosdk.encodeAddress(this.tx.txn.rcv);
            case 'axfer':
                return algosdk.encodeAddress(this.tx.txn.arcv);
            default:
                return null;
        }
    }

    currentTxSender(args) {
        if(!this.tx) {
            return null;
        }

        return algosdk.encodeAddress(this.tx.txn.snd);
    }

    currentTxNote(args) {
        if(!this.tx) {
            return null;
        }

        try {
            const note = Buffer.from(this.tx.txn.note).toString();
            try {
                algosdk.decodeObj(note);
                note = null;
            }
            catch {
                // not an encoded object - just return the string
            }
            return note;
        } catch {
            return null;
        }
    }

    currentTxType(args) {
        if(!this.tx) {
            return null;
        }

        return this.tx.txn.type;
    }

    currentBlockTransactionsCount(args) {
        if(!this.block) {
            return null;
        }

        return this.block.txns.length;
    }

    currentBlockForEachTransaction(args, util) {
        if(!this.block || !this.block.txns) {
            return;
        }

        if (typeof util.stackFrame.index === 'undefined') {
            util.stackFrame.index = 0;
        }

        if (util.stackFrame.index < this.block.txns.length) {
            this.tx = this.block.txns[util.stackFrame.index];
            util.stackFrame.index++;
            util.startBranch(1, true);
        }
    }

    async getBlock(args) {
        this.block = await this.runtime.ioDevices.algorand.readBlock(args.ROUND);
        console.log(this.block);
    }

    getCurrentBlockTransaction(args) {
        if(!this.block || !this.block.txns) {
            return null;
        }

        this.tx = this.block.txns[args.INDEX];
    }

    getRound(args) {
        return this.lastRound;
    }
}

module.exports = AlgorandBlocks;