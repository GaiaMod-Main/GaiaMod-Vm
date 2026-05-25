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
const BLEDataStoppedError = 'JDCode extension stopped receiving data';


const BLEUUID = {
    service: 0x2261,
    rxChar: '00000227-0000-1000-8000-00805f9b34fb',
    txChar: '00000227-0000-1000-8000-00805f9b34fb'
};


class JDCode {
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
        this.txData = new Int16Array(7);
        this.txArray = new Uint8Array(14);
        this._pollingIntervalID = null;
        this._pollingInterval = 25;
        this.moveX = 0;
        this.moveY = 0;
        this.rotation = 0;    
        this.isFlying = 0;    
        this.armDisableCnt=0;
        this._sensors = {
            button: 0,
            ir: [0, 0, 0],
            ultrasonic: 0,
            joystick: [0, 0],
            tilt: [0, 0],
            sound: 0,
            illum:0
        };
        this.stopAll();
    }
    
		stopAll () {
				for (let i = 0; i < 7; i++)
						this.txData[i] = 0;
				this.txData[4] = 0x01;
				this.txData[5] = 100;
	      this.txData[6] = 100;		
				this.moveX = 0;
	      this.moveY = 0;
	      this.rotation = 0;
	      this.isFlying = 0;
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
    		console.log("reset");
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
        if(this.armDisableCnt>0){
        		this.armDisableCnt -= 1;
        		if(this.armDisableCnt==0)
        				this.txData[4] = 1;
        }

				for(let n=0;n<7;n++){
				    this.txArray[n*2] = this.txData[n]&0xFF;
				    this.txArray[n*2+1] = (this.txData[n]>>8)&0xFF;
				}
        this._ble.write(BLEUUID.service, BLEUUID.txChar, this.txArray, 'ASCII', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
     }

    _onMessage (strData) {
      	this.rxData = strData.split(',');
      	if(this.isFlying && (this.rxData[0]&0x01)){
      			this.stopAll();
      			this.txData[4] = 0;
      			this.isFlying = 0;
      			this.armDisableCnt=5;
      	}
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

class Scratch3JDCodeBlocks {
    static get EXTENSION_NAME () {
        return 'JDCode';
    }
    static get EXTENSION_ID () {
        return 'jdcode';
    }

    constructor (runtime) {

        this.runtime = runtime;
        this._peripheral = new JDCode(this.runtime, Scratch3JDCodeBlocks.EXTENSION_ID);
        this.message = this._peripheral.txData;
        this.tuneID = 0;
        this.moveID = 0;
        this.rotID = 0;
    }


    getInfo () {
        return {
            id: Scratch3JDCodeBlocks.EXTENSION_ID,
            name: Scratch3JDCodeBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'takeoff',
                    text: formatMessage({
                        id: 'takeoff',
                        default: '\uB4DC\uB860 \uC774\uB959\uD558\uAE30',
                    }),
                },
                {
                    opcode: 'landing',
                    text: formatMessage({
                        id: 'landing',
                        default: '\uB4DC\uB860 \uCC29\uB959\uD558\uAE30',
                    }),
                },
                {
                    opcode: 'alt',
                    text: formatMessage({
                        id: 'alt',
                        default: '[TEXT] cm \uB192\uC774\uB85C \uBE44\uD589',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                
                {
                    opcode: 'velocity',
                    text: formatMessage({
                        id: 'velocity',
                        default: '[FBRL] (\uC73C)\uB85C [TEXT] \uC18D\uB3C4(cm/s)\uB85C \uBE44\uD589',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	FBRL: {
                            type: ArgumentType.STRING,
                            menu: 'fbrl',
                            defaultValue: '\uC55E'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 70
                        }
                    }
                },
                
                 {
                    opcode: 'move',
                    text: formatMessage({
                        id: 'move',
                        default: '[FBRL](\uC73C)\uB85C [TEXT1]cm \uAC70\uB9AC\uB97C [TEXT2] \uC18D\uB3C4(cm/s)\uB85C \uBE44\uD589',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	FBRL: {
                            type: ArgumentType.STRING,
                            menu: 'fbrl',
                            defaultValue: '\uC55E'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        TEXT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                
                {
                    opcode: 'rotation',
                    text: formatMessage({
                        id: 'rotation',
                        default: '[ROTDIR]\uC73C\uB85C [TEXT1] \uB3C4\uB97C [TEXT2]\uAC01\uC18D\uB3C4(deg/s)\uB85C \uD68C\uC804',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ROTDIR: {
                            type: ArgumentType.STRING,
                            menu: 'rotdir',
                            defaultValue: '\uC2DC\uACC4\uBC29\uD5A5'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: 70
                        }
                    }
                },
                {
                    opcode: 'proprot',
                    text: formatMessage({
                        id: 'proprot',
                        default: '\uD504\uB85C\uD3A0\uB7EC\uB97C [TEXT]\uC138\uAE30\uB85C \uB3CC\uB9AC\uAE30',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'motorot',
                    text: formatMessage({
                        id: 'motorot',
                        default: '[LTRB]\uBAA8\uD130\uB97C [TEXT]\uC138\uAE30\uB85C \uB3CC\uB9AC\uAE30',
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	LTRB: {
                            type: ArgumentType.STRING,
                            menu: 'ltrb',
                            defaultValue: '\uC67C\uCABD\uC544\uB798'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'emergency',
                    text: formatMessage({
                        id: 'emergency',
                        default: '\uB4DC\uB860\uBE44\uD589\uC744 \uC989\uC2DC \uBA48\uCDA4',
                    }),
                },
                '---',
                {
                    opcode: 'getready',
                    text: formatMessage({
                        id: 'getready',
                        default: '\uB4DC\uB860 \uBE44\uD589 \uC900\uBE44 \uC0C1\uD0DC',
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getbattery',
                    text: formatMessage({
                        id: 'getbattery',
                        default: '\uBC30\uD130\uB9AC(%)',
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getalt',
                    text: formatMessage({
                        id: 'getalt',
                        default: '\uB4DC\uB860 \uB192\uC774',
                    }),
                    blockType: BlockType.REPORTER,
                },
               {
                    opcode: 'gettilt',
                    text: formatMessage({
                        id: 'gettilt',
                        default: '\uB4DC\uB860[FBLR] \uAE30\uC6B8\uAE30',
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
                    opcode: 'getmove',
                    text: formatMessage({
                        id: 'getmove',
                        default: '\uB4DC\uB860[FBLR] \uC774\uB3D9',
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
            ],
           	menus: {
                fbrl: {
                    acceptReporters: true,
                    items: ['\uC55E', '\uB4A4','\uC624\uB978\uCABD', '\uC67C\uCABD']  //앞 뒤 오른쪽 왼쪽
                },
                rotdir: {
                    acceptReporters: true,
                    items: ['\uC2DC\uACC4\uBC29\uD5A5', '\uBC18\uC2DC\uACC4\uBC29\uD5A5']  //시계방향 반시계방향
                },
                fblr: {
                    acceptReporters: true,
                    items: ['\uC55E\uB4A4', '\uC88C\uC6B0'] // 앞뒤 좌우 
                },
                ltrb: {
                    acceptReporters: true,
                    items: ['\uC67C\uCABD\uC544\uB798', '\uC67C\uCABD\uC704', '\uC624\uB978\uCABD\uC544\uB798', '\uC624\uB978\uCABD\uC704']
                    //왼쪽아래, 왼쪽 위, 오른쪽아래, 오른쪽위 
                },
            }
        };
    }
    
    takeoff () {
    		if(this.getready()==0)
    				return;
    		this._peripheral.stopAll();
    		this.message[3] = 70;
    		this.message[4] = 0x2F;
    		this._peripheral.isFlying = 1;
    }
    
    landing () {
    		this.message[3] = 0x0;
    		this._peripheral.isFlying = 0;
    }
    
    alt(args){
    		if(this._peripheral.isFlying==0)
    				return;
    		var value = args.TEXT>150? 150 : args.TEXT<0? 0 : Number(args.TEXT);
    		this.message[3] = value;
    }
    
    velocity(args){
    	  if(this._peripheral.isFlying==0)
    				return;
    		var vel = args.TEXT>200? 200 : args.TEXT<0? 0 : Number(args.TEXT);
    		if(args.FBRL == '\uC55E') this.message[1] = vel;
				if(args.FBRL == '\uB4A4') this.message[1] = vel*-1;
    		if(args.FBRL == '\uC624\uB978\uCABD') this.message[0] = vel;
				if(args.FBRL == '\uC67C\uCABD') this.message[0] = vel*-1;
				this.message[4] &= ~0x20;
    }
    
    move (args){
    		if(this._peripheral.isFlying==0)
    				return;
    		var dist = args.TEXT1>2000? 2000 : args.TEXT1<0? 0 : Number(args.TEXT1); 
    		var vel = args.TEXT2>200? 200 : args.TEXT2<0? 0 : Number(args.TEXT2); 
    		if(args.FBRL == '\uC55E') this._peripheral.moveY += dist; 
				if(args.FBRL == '\uB4A4') this._peripheral.moveY += (-1*dist); 
    		if(args.FBRL == '\uC624\uB978\uCABD') this._peripheral.moveX += dist; 
				if(args.FBRL == '\uC67C\uCABD') this._peripheral.moveX += (-1*dist);
				this.message[0] = this._peripheral.moveX;
				this.message[1] = this._peripheral.moveY;
				this.message[4] |= 0x20;
    	  this.message[5] = vel;
    }
    
    rotation (args){
    		if(this._peripheral.isFlying==0)
    				return;    	
    		var degree = args.TEXT1>179? 179 : args.TEXT1<0? 0 : Number(args.TEXT1);
    		var vel = args.TEXT2>200? 200 : args.TEXT2<0? 0 : Number(args.TEXT2); 
    		if(args.ROTDIR == '\uC2DC\uACC4\uBC29\uD5A5') this._peripheral.rotation += degree; 
				else this.message[2] = this._peripheral.rotation += (-1*degree); 
				this.message[2] = this._peripheral.rotation;	
    	  this.message[6] = vel;
    }
    
    proprot (args){
    		var speed = args.TEXT>100? 1000 : args.TEXT<0? 0 : Number(args.TEXT)*10;
    		this.message[3] = speed;
				this.message[4] = 0x01;
    }

    motorot (args){
    		var speed = args.TEXT>100? 100 : args.TEXT<0? 0 : Number(args.TEXT);
    		if(args.LTRB == '\uC67C\uCABD\uC544\uB798') this.message[2] = speed;
				if(args.LTRB == '\uC67C\uCABD\uC704') this.message[1] = speed;
				if(args.LTRB == '\uC624\uB978\uCABD\uC544\uB798') this.message[3] = speed;
				if(args.LTRB == '\uC624\uB978\uCABD\uC704') this.message[0] = speed;
				this.message[4] = 0x8000;
    }
    
    emergency (args){
    		this._peripheral.isFlying=0;
    		this._peripheral.moveX = 0;
    		this._peripheral.moveY = 0;
    		this._peripheral.rotation = 0;
    		for (let i = 0; i < 7; i++)
						this.message[i] = 0;
				this.message[5] = 100;
      	this.message[6] = 100;		
    }
    

    getready(){
	    	var rxData = this._peripheral.rxData;
	    	if((rxData[0]&0x03) == 0)
	    			return 1;
	    	else
	    			return 0;
    }
    
    getbattery(){
    		var rxData = this._peripheral.rxData;
    		return rxData[1];
    }
    
    getalt(){
    		var rxData = this._peripheral.rxData;
    		return rxData[4];
    }
    
    gettilt(args){
	    	var rxData = this._peripheral.rxData;
				if(args.FBLR == '\uC88C\uC6B0')
						return rxData[2]>127? rxData[2]-256 : rxData[2];
	    	else
	    			return rxData[3]>127? rxData[3]-256 : rxData[3];
    }
    
    getmove(args){
    	var rxData = this._peripheral.rxData;
    	if(args.FBLR == '\uC88C\uC6B0'){
	    		var dist = (rxData[6]<<8) | rxData[5];
	    		return dist>0x7FFF? dist-0x10000 : dist;
    		
    	}
    	else{
	    		var dist = (rxData[8]<<8) | rxData[7];
	    		return dist>0x7FFF? dist-0x10000 : dist;
    	}
    }
}

module.exports = Scratch3JDCodeBlocks;
