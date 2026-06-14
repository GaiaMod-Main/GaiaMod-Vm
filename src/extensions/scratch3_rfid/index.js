const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const formatMessage = require('format-message');
const TargetType = require('../../extension-support/target-type');

class RFID {

    

    get ON_OFF_MENU () {
        return [
            {
                text: 'on',
                value: 'on'
            },
            {
                text: 'off',
                value: 'off'
            }
        ];
    }

	constructor (runtime) {
        console.log("construct rfid reader");
        this._tagList = [];
        that = this;
        /**
         * Store this for later communication with the Scratch VM runtime.
         * If this extension is running in a sandbox then `runtime` is an async proxy object.
         * @type {Runtime}
         */
        this._runtime = runtime;
        this.ws = new WebSocket('ws://localhost:8887');
        this.ws.onopen = function() {
            console.log('web socket opened');
        }

        this.ws.onmessage = function(msg) {
            console.log('receive web socket message');
            console.log(msg);
            try {
                var data = JSON.parse(msg.data);
                that._tagList = data.tags;
                console.log(this._tagList.length);
            } catch(e) {
                console.log('error');
            }
        }

        this.ws.onclose = function() {
            console.log('web socket closed');
        }
        
        
    }

    getInfo () {
        return {
            id: 'rfidReader',
            name: 'Reader switch',
            blocks: [
                {
                    opcode: 'readerOnOff',
                    blockType: BlockType.COMMAND,
                    text: 'Reader [ON_OFF]',
                    arguments: {
                        ON_OFF: {
                            type: ArgumentType.STRING,
                            defaultValue: 'off',
                            menu: 'onOff'
                        }
                    }
                },
                {
                    opcode: 'hasTag',
                    blockType: BlockType.HAT,
                    text: 'When tag detected'                    
                },
                {
                    opcode: 'readNext',
                    blockType: BlockType.REPORTER,
                    text: 'get next tag'
                },
                {
                    opcode: 'readCount',
                    blockType: BlockType.REPORTER,
                    text: 'get tag count'
                }

            ],
            menus: {
                onOff: {
                    acceptReporters: true,
                    items: this.ON_OFF_MENU
                }
            }
        };
    }
    readNext() {
        if(this._tagList.length > 0)
            return this._tagList.shift();
        else
            return "";
    }
    readCount() {
        return this._tagList.length;
    }

    hasTag() {
        return this._tagList.length > 0
    }

    readerOnOff(arg) {
        if(arg == 'on') {

        } else {

        }
    }

    scan() {
        console.log("under scan...");
    }

    
}

module.exports = RFID;