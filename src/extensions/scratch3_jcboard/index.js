const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');


// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';



const BLETimeout = 4500;
const BLESendInterval = 20;
const BLEDataStoppedError = 'JCBoard extension stopped receiving data';


const BLEUUID = {
    service: 0x2262,
    rxChar: '00000227-0000-1000-8000-00805f9b34fb',
    txChar: '00000227-0000-1000-8000-00805f9b34fb'
};


class JCBoard {
    constructor (runtime, extensionId) {
        this._runtime = runtime;
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._extensionId = extensionId;
				this._runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
        this._timeoutID = null;
        this._busy = false;
        this._busyTimeoutID = null;
        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
 				this._pollValues = this._pollValues.bind(this);       
        this.rxData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.txData = new Uint8Array(20);
        this._pollingIntervalID = null;
        this._pollingInterval = 25;
        this.tuneDuration = 0;
        this._sensors = {
            button: 0,
            ir: [0, 0, 0],
            ultrasonic: 0,
            joystick: [0, 0],
            tilt: [0, 0],
            sound: 0,
            illum:0
        };
    }
    
		stopAll () {
			for (let i = 0; i < 20; i++)
					this.txData[i] = 0;
		}
		
    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [BLEUUID.service]}
            ]
        }, this._onConnect, this.reset);
    }

    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this.reset();
    }

    reset () {
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }

    isConnected () {
    	
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }

    send (message) {
        if (!this.isConnected()) return;

				//console.log(message);
        this._ble.write(BLEUUID.service, BLEUUID.txChar, message, 'ASCII', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

    _onConnect () {
    		this._pollingIntervalID = window.setInterval(this._pollValues, this._pollingInterval);
        this._ble.read(BLEUUID.service, BLEUUID.rxChar, true, this._onMessage);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }
    
    _pollValues () {
    		if (!this.isConnected()) {
            window.clearInterval(this._pollingIntervalID);
            return;
        }
        if(this.tuneDuration > 0){
        		this.tuneDuration -= 1;
        		if(this.tuneDuration == 0)
        				this.txData[2] = this.txData[3] = 0;
        }
				//console.log(this.txData);
        this._ble.write(BLEUUID.service, BLEUUID.txChar, this.txData, 'ASCII', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
     }

    _onMessage (strData) {
      	this.rxData = strData.split(',');
        window.clearTimeout(this._timeoutID);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }
    
    get getRxData() {
        return this.rxData;
    }
    
    get getTxData() {
        return this.rxData;
    }
}

class Scratch3JCBoardBlocks {
    static get EXTENSION_NAME () {
        return 'JCBoard';
    }
    static get EXTENSION_ID () {
        return 'jcboard';
    }

    constructor (runtime) {

        this.runtime = runtime;
        this._peripheral = new JCBoard(this.runtime, Scratch3JCBoardBlocks.EXTENSION_ID);
        this.message = this._peripheral.txData;
        this.tuneID = 0;
        this.moveID = 0;
        this.rotID = 0;
    }


    getInfo () {
        return {
            id: Scratch3JCBoardBlocks.EXTENSION_ID,
            name: Scratch3JCBoardBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
            		{
                    opcode: 'ultrasonic',
                    text: formatMessage({
                        id: 'ultrasonic',
                        default: '[ONEFIVE] \uD3EC\uD2B8\uB97C \uCD08\uC74C\uD30C\uC13C\uC11C\uB85C \uC0AC\uC6A9',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ONEFIVE: {
                            type: ArgumentType.STRING,
                            menu: 'onefive',
                            defaultValue: '1\uBC88'
                        }
                    }
                },
                {
                    opcode: 'led',
                    text: formatMessage({
                        id: 'led',
                        default: '[ONETWO] LED [ONOFF]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ONETWO: {
                            type: ArgumentType.STRING,
                            menu: 'onetwo',
                            defaultValue: '1\uBC88'
                        },
                        ONOFF: {
                            type: ArgumentType.STRING,
                            menu: 'onoff',
                            defaultValue: '\uCF1C\uAE30'
                        }
                    }
                },
                {
                    opcode: 'buzzer',
                    text: formatMessage({
                        id: 'buzzer',
                        default: '[TUNE] \uC74C\uC744 [DELAY] \uCD08\uB3D9\uC548 \uC18C\uB9AC\uB0B4\uAE30',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	TUNE: {
                            type: ArgumentType.STRING,
                            menu: 'tune',
                            defaultValue: '\uB3C4'
                        },
                        DELAY: {
                            type: ArgumentType.STRING,
                            menu: 'delay',
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'motor',
                    text: formatMessage({
                        id: 'motor',
                        default: '[ONETWO] DC\uBAA8\uD130\uB97C [TEXT] \uC138\uAE30\uB85C \uD68C\uC804',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ONETWO: {
                            type: ArgumentType.STRING,
                            menu: 'onetwo',
                            defaultValue: '1\uBC88'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'servo',
                    text: formatMessage({
                        id: 'servo',
                        default: '[ONEFOUR] \uC11C\uBCF4\uBAA8\uD130\uB97C [TEXT] \uB3C4 \uD68C\uC804',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ONEFOUR: {
                            type: ArgumentType.STRING,
                            menu: 'onefour',
                            defaultValue: '1\uBC88'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'digitalpin',
                    text: formatMessage({
                        id: 'digitalpin',
                        default: '[ONEFIVE] \uB514\uC9C0\uD138\uD540\uC744 [HIGHLOW] \uB85C \uC124\uC815',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ONEFIVE: {
                            type: ArgumentType.STRING,
                            menu: 'onefive',
                            defaultValue: '1\uBC88'
                        },
                        HIGHLOW: {
                            type: ArgumentType.STRING,
                            menu: 'highlow',
                            defaultValue: 'HIGH'
                        },
                    }
                },
                
                '---',
                
                {
                    opcode: 'getbutton',
                    text: formatMessage({
                        id: 'getbutton',
                        default: '[ONETWO] \uBC84\uD2BC \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                       	ONETWO: {
                            type: ArgumentType.STRING,
                            menu: 'onetwo',
                            defaultValue: '1\uBC88'
                        },
                    }
                },
                {
                    opcode: 'getanalog',
                    text: formatMessage({
                        id: 'getanalog',
                        default: '[ONEFIVE] \uC544\uB0A0\uB85C\uADF8 \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                       	ONEFIVE: {
                            type: ArgumentType.STRING,
                            menu: 'onefive',
                            defaultValue: '1\uBC88'
                        },
                    }
                },
            ],
           	menus: {
                onoff: {
                    acceptReporters: true,
                    items: ['\uCF1C\uAE30', '\uB044\uAE30']  //켜기 끄기
                },
                tune: {
                    acceptReporters: true,
                    items: ['\uB3C4', '\uB808', '\uBBF8', '\uD30C', '\uC194', '\uB77C', '\uC2DC']  //도레미파솔라시
                },
                delay: {
                    acceptReporters: true,
                    items: ['0.5', '0.8', '1', '2', '3', '4', '5']
                },
                onetwo: {
                    acceptReporters: true,
                    items: ['1\uBC88', '2\uBC88'] 
                },
                onefour: {
                    acceptReporters: true,
                    items: ['1\uBC88', '2\uBC88', '3\uBC88', '4\uBC88'] 
                },
                onefive: {
                    acceptReporters: true,
                    items: ['1\uBC88', '2\uBC88', '3\uBC88', '4\uBC88', '5\uBC88'] 
                },
                highlow: {
                    acceptReporters: true,
                    items: ['HIGH', 'LOW'] 
                },
            }
        };
    }
    led (args) {
				if(args.ONOFF == '\uCF1C\uAE30'){
						if(args.ONETWO == '1\uBC88')
								this.message[0] |= 0x11;
						else
								this.message[0] |= 0x12;
				}
				else{
					if(args.ONETWO == '1\uBC88')
								this.message[0] &= ~0x01;
						else
								this.message[0] &= ~0x02;
				}
    }
    digitalpin(args){
    		if(args.HIGHLOW == 'HIGH'){
    				if(args.ONEFIVE == '1\uBC88') this.message[1] |= 0x01;
    				if(args.ONEFIVE == '2\uBC88') this.message[1] |= 0x02;
    				if(args.ONEFIVE == '3\uBC88') this.message[1] |= 0x04;
    				if(args.ONEFIVE == '4\uBC88') this.message[1] |= 0x08;
    				if(args.ONEFIVE == '5\uBC88') this.message[1] |= 0x10;
    		}
    		else{
    			if(args.ONEFIVE == '1\uBC88') this.message[1] &= ~0x01;
    			if(args.ONEFIVE == '2\uBC88') this.message[1] &= ~0x02;
    			if(args.ONEFIVE == '3\uBC88') this.message[1] &= ~0x04;
    			if(args.ONEFIVE == '4\uBC88') this.message[1] &= ~0x08;
    			if(args.ONEFIVE == '5\uBC88') this.message[1] &= ~0x10;
    		}
    }
    buzzer(args){
    		this.tuneID = this.tuneID>14? 1 : this.tuneID+1;
    		if(args.TUNE == '\uB3C4') this.message[2] = 1;
    		if(args.TUNE == '\uB808') this.message[2] = 2;
    		if(args.TUNE == '\uBBF8') this.message[2] = 3;
    		if(args.TUNE == '\uD30C') this.message[2] = 4;
    		if(args.TUNE == '\uC194') this.message[2] = 5;
    		if(args.TUNE == '\uB77C') this.message[2] = 6;
    		if(args.TUNE == '\uC2DC') this.message[2] = 7;
    		this.message[2] |= (this.tuneID<<4);
    		
    		if(args.DELAY == '0.5') this.message[3] = 5;
    		if(args.DELAY == '0.8') this.message[3] = 8;
    		if(args.DELAY == '1') this.message[3] = 10;
    		if(args.DELAY == '2') this.message[3] = 20;
    		if(args.DELAY == '3') this.message[3] = 30;
    		if(args.DELAY == '4') this.message[3] = 40;
    		if(args.DELAY == '5') this.message[3] = 50;
    		this._peripheral.tuneDuration = this.message[3];
    }
    
    motor (args){
    		var speed = args.TEXT>100? 100 : args.Text<-100? -100 : Number(args.TEXT);
    		if(args.ONETWO == '1\uBC88')
    				this.message[4] = speed;
    		else
    				this.message[5] = speed;
    }
    
    servo (args){
    		var degree = args.TEXT>90? 90 : args.Text<-90? -90 : Number(args.TEXT);
    		if(args.ONEFOUR == '1\uBC88') this.message[6] = degree;
    		if(args.ONEFOUR == '2\uBC88') this.message[7] = degree;
    		if(args.ONEFOUR == '3\uBC88') this.message[8] = degree;
    		if(args.ONEFOUR == '4\uBC88') this.message[9] = degree;
    }
    ultrasonic (args) {
				if(args.ONEFIVE == '1\uBC88') this.message[10] = 0x01;
				if(args.ONEFIVE == '2\uBC88') this.message[10] = 0x02;
				if(args.ONEFIVE == '3\uBC88') this.message[10] = 0x04;								
				if(args.ONEFIVE == '4\uBC88') this.message[10] = 0x08;
				if(args.ONEFIVE == '5\uBC88') this.message[10] = 0x10;				
    }
    
    getbutton(args){
    	var rxData = this._peripheral.rxData;
    	if(args.ONETWO == '1\uBC88') return rxData[0]&0x01;
    	if(args.ONETWO == '2\uBC88') return (rxData[0]>>1)&0x01;
    }

    getanalog(args){
    	var rxData = this._peripheral.rxData;
    	if(args.ONEFIVE == '1\uBC88') return rxData[1];
    	if(args.ONEFIVE == '2\uBC88') return rxData[2];
    	if(args.ONEFIVE == '3\uBC88') return rxData[3];
    	if(args.ONEFIVE == '4\uBC88') return rxData[4];
    	if(args.ONEFIVE == '5\uBC88') return rxData[5];
    }
}

module.exports = Scratch3JCBoardBlocks;
