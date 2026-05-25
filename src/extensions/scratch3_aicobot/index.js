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
const BLESendInterval = 10;
const BLEDataStoppedError = 'AICoBot extension stopped receiving data';


const BLEUUID = {
    service: 0x2261,
    rxChar: '00000227-0000-1000-8000-00805f9b34fb',
    txChar: '00000227-0000-1000-8000-00805f9b34fb'
};


class AICoBot {
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
        this.rxData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.txData = new Uint8Array(12);
        this._pollingIntervalID = null;
        this._pollingInterval = 25;
        this.Cnt = 0;
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
			for (let i = 0; i < 12; i++)
					this.txData[i] = 0;
			this.Cnt = 0;
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

				console.log(message);
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

class Scratch3AICoBotBlocks {
    static get EXTENSION_NAME () {
        return 'AICoBot';
    }
    static get EXTENSION_ID () {
        return 'aicobot';
    }

    constructor (runtime) {
        this.runtime = runtime;
        this._peripheral = new AICoBot(this.runtime, Scratch3AICoBotBlocks.EXTENSION_ID);
        this.message = this._peripheral.txData;
        this.tuneID = 0;
        this.moveID = 0;
        this.rotID = 0;
    }


    getInfo () {
        return {
            id: Scratch3AICoBotBlocks.EXTENSION_ID,
            name: Scratch3AICoBotBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'led',
                    text: formatMessage({
                        id: 'led',
                        default: '[RIGHTLEFT] LED [ONOFF]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	RIGHTLEFT: {
                            type: ArgumentType.STRING,
                            menu: 'rightleft',
                            defaultValue: '\uC624\uB978\uCABD'
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
                        default: '[RIGHTLEFT] \uBAA8\uD130\uB97C [TEXT] \uC138\uAE30\uB85C \uD68C\uC804',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	RIGHTLEFT: {
                            type: ArgumentType.STRING,
                            menu: 'rightleft',
                            defaultValue: '\uC624\uB978\uCABD'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                
                {
                    opcode: 'move',
                    text: formatMessage({
                        id: 'move',
                        default: '[FRONTBACK] (\uC73C)\uB85C [TEXT] cm \uC774\uB3D9',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	FRONTBACK: {
                            type: ArgumentType.STRING,
                            menu: 'frontback',
                            defaultValue: '\uC55E'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                
                 {
                    opcode: 'rotate',
                    text: formatMessage({
                        id: 'rotate',
                        default: '[ROTDIR] \uC73C\uB85C [TEXT] \uB3C4 \uD68C\uC804',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ROTDIR: {
                            type: ArgumentType.STRING,
                            menu: 'rotdir',
                            defaultValue: '\uC2DC\uACC4\uBC29\uD5A5'
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
                        default: '[ONETWO] \uC11C\uBCF4\uBAA8\uD130\uB97C [TEXT] \uB3C4 \uD68C\uC804',
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
                    opcode: 'irsensor',
                    text: formatMessage({
                        id: 'irsensor',
                        default: '[LMR] \uC801\uC678\uC120 \uC13C\uC11C\uB97C [ONOFF]',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	LMR: {
                            type: ArgumentType.STRING,
                            menu: 'lmr',
                            defaultValue: '\uC67C\uCABD'
                        },
                        ONOFF: {
                            type: ArgumentType.STRING,
                            menu: 'onoff',
                            defaultValue: '\uCF1C\uAE30'
                        }
                    }
                },
                
                '---',
                
                {
                    opcode: 'getbutton',
                    text: formatMessage({
                        id: 'getbutton',
                        default: '\uC9D0\uCE78 \uBC84\uD2BC\uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getirsensor',
                    text: formatMessage({
                        id: 'getirsensor',
                        default: '[LMR] \uC801\uC678\uC120\uC13C\uC11C \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                       	LMR: {
                            type: ArgumentType.STRING,
                            menu: 'lmr',
                            defaultValue: '\uC67C\uCABD'
                        },
                    }
                },
                {
                    opcode: 'getultrasonic',
                    text: formatMessage({
                        id: 'getultrasonic',
                        default: '\uCD08\uC74C\uD30C\uC13C\uC11C \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getjoystic',
                    text: formatMessage({
                        id: 'getjoystic',
                        default: '[FBLR] \uC870\uC774\uC2A4\uD2F1 \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                       	FBLR: {
                            type: ArgumentType.STRING,
                            menu: 'fblr',
                            defaultValue: '\uC55E\uB4A4'
                        },
                    }
                },
               {
                    opcode: 'gettilt',
                    text: formatMessage({
                        id: 'gettilt',
                        default: '[FBLR] \uAE30\uC6B8\uAE30 \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                       	FBLR: {
                            type: ArgumentType.STRING,
                            menu: 'fblr',
                            defaultValue: '\uC55E\uB4A4'
                        },
                    }
                },
              	{
                    opcode: 'getsound',
                    text: formatMessage({
                        id: 'getsound',
                        default: '\uC18C\uB9AC\uC13C\uC11C \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getillum',
                    text: formatMessage({
                        id: 'getillum',
                        default: '\uC870\uB3C4\uC13C\uC11C \uAC12',
                    }),
                    blockType: BlockType.REPORTER,
                }
            ],
           	menus: {
                rightleft: {
                    acceptReporters: true,
                    items: ['\uC624\uB978\uCABD', '\uC67C\uCABD']  //오른쪽 왼쪽
                },
                lmr: {
                    acceptReporters: true,
                    items: ['\uC67C\uCABD', '\uC911\uAC04', '\uC624\uB978\uCABD']  //왼쪽 중간 오른쪽
                },
                frontback: {
                    acceptReporters: true,
                    items: ['\uC55E', '\uB4A4']  //앞 뒤
                },
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
                rotdir: {
                    acceptReporters: true,
                    items: ['\uC2DC\uACC4\uBC29\uD5A5', '\uBC18\uC2DC\uACC4\uBC29\uD5A5']  //시계방향 반시계방향
                },
                onetwo: {
                    acceptReporters: true,
                    items: ['1\uBC88', '2\uBC88'] // 1번 2
                },
                fblr: {
                    acceptReporters: true,
                    items: ['\uC55E\uB4A4', '\uC88C\uC6B0'] // 앞뒤 좌우 
                },
            }
        };
    }
    led (args) {
				if(args.ONOFF == '\uCF1C\uAE30'){
						if(args.RIGHTLEFT == '\uC624\uB978\uCABD')
								this.message[0] |= 0x11;
						else
								this.message[0] |= 0x12;
				}
				else{
					if(args.RIGHTLEFT == '\uC624\uB978\uCABD')
								this.message[0] &= ~0x01;
						else
								this.message[0] &= ~0x02;
				}
    }
    
    buzzer(args){
    		this.tuneID = (this.tuneID<14)? this.tuneID+1 : 1;
    		if(args.TUNE == '\uB3C4') this.message[1] = 1;
    		if(args.TUNE == '\uB808') this.message[1] = 2;
    		if(args.TUNE == '\uBBF8') this.message[1] = 3;
    		if(args.TUNE == '\uD30C') this.message[1] = 4;
    		if(args.TUNE == '\uC194') this.message[1] = 5;
    		if(args.TUNE == '\uB77C') this.message[1] = 6;
    		if(args.TUNE == '\uC2DC') this.message[1] = 7;
    		this.message[1] |= (this.tuneID<<4);
    		
    		if(args.DELAY == '0.5') this.message[2] = 5;
    		if(args.DELAY == '0.8') this.message[2] = 8;
    		if(args.DELAY == '1') this.message[2] = 10;
    		if(args.DELAY == '2') this.message[2] = 20;
    		if(args.DELAY == '3') this.message[2] = 30;
    		if(args.DELAY == '4') this.message[2] = 40;
    		if(args.DELAY == '5') this.message[2] = 50;
    }
    
    motor (args){
    		var value = Number(args.TEXT);
    		value = value>100?100 : value<-100? -100 : value;
    		if(args.RIGHTLEFT == '\uC624\uB978\uCABD')
    				this.message[3] = value;
    		else
    				this.message[4] = value;
    }
    
    move (args){
    		var value = Number(args.TEXT);
    		if(args.FRONTBACK == '\uB4A4')
    				value *= -1;
				value = value>1000?1000 : value<-1000? -1000 : value;
				
				this.moveID = (this.moveID<14)? this.moveID+1 : 1;
				value = value&0xFFF;
    	  value |= (this.moveID<<12);
    	  
    	  this.message[6] = (value>>8);
    	  this.message[5] = value&0xFF;
    }
    
    rotate (args){
    		var value = Number(args.TEXT);
    		if(args.ROTDIR == '\uBC18\uC2DC\uACC4\uBC29\uD5A5')
    				value *= -1;
				value = value>1000?1000 : value<-1000? -1000 : value;
				this.rotID = (this.rotID<14)? this.rotID+1 : 1;
				value = value&0xFFF;
    	  value |= (this.rotID<<12);
    	  
    	  this.message[8] = (value>>8);
    	  this.message[7] = value&0xFF;
    }
    
    servo (args){
    		var value = Number(args.TEXT);
    		value = value>90?90 : value<-90? -90 : value;
    		if(args.ONETWO == '1\uBC88')
    				this.message[9] = value;
    		else
    				this.message[10] = value;
    }
    
    irsensor (args){
    		if(args.ONOFF == '\uCF1C\uAE30'){
		    		if(args.LMR == '\uC67C\uCABD')
		    				this.message[11] |= 0x01;
		    		else if(args.LMR == '\uC911\uAC04')
		    				this.message[11] |= 0x02;
		    		else
		    				this.message[11] |= 0x04;
    		}
    		else{
		    		if(args.LMR == '\uC67C\uCABD')
		    				this.message[11] &= ~0x01;
		    		else if(args.LMR == '\uC911\uAC04')
		    				this.message[11] &= ~0x02;
		    		else
		    				this.message[11] &= ~0x04;
    		}
    }
    
    
    
    
    getbutton(){
    	var rxData = this._peripheral.rxData;
    	return rxData[0];
    }

    getirsensor(args){
    	var rxData = this._peripheral.rxData;
    	if(args.LMR == '\uC67C\uCABD')
    		return rxData[1];
    	if(args.LMR == '\uC911\uAC04')
    		return rxData[2];
    	else
    		return rxData[3];
    }
    
    getultrasonic(){
    	var rxData = this._peripheral.rxData;
    	return rxData[4];
    }
    
    getjoystic(args){
	    	var rxData = this._peripheral.rxData;
	    	if(args.FBLR == '\uC55E\uB4A4')
		    		return rxData[5]>127? rxData[5]-256 : rxData[5];
	    	else{
	    			if(rxData[11] == 4)
		    				return rxData[6];
		    		else
	    				return rxData[6]>127? rxData[6]-256 : rxData[6];
	    	}
    }
    
    gettilt(args){
    	var rxData = this._peripheral.rxData;
    	if(args.FBLR == '\uC55E\uB4A4')
    		return rxData[7]>127? rxData[7]-256 : rxData[7];
    	else
    		return rxData[8]>127? rxData[8]-256 : rxData[8];
    }
    
    getsound(){
    	var rxData = this._peripheral.rxData;
    	return rxData[9]>127? rxData[9]-256 : rxData[9];
    }
    
    getillum(){
    	var rxData = this._peripheral.rxData;
    	return rxData[10];
    }
}

module.exports = Scratch3AICoBotBlocks;
