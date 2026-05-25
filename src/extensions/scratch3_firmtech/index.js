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
const BLEDataStoppedError = 'Firmtech extension stopped receiving data';


const BLEUUID = {
    service: 0x2261,
    rxChar: '00000227-0000-1000-8000-00805f9b34fb',
    txChar: '00000227-0000-1000-8000-00805f9b34fb'
};


class Firmtech {
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

class Scratch3FirmtechBlocks {
    static get EXTENSION_NAME () {
        return 'FDrone2';
    }
    static get EXTENSION_ID () {
        return 'firmtech';
    }

    constructor (runtime) {

        this.runtime = runtime;
        this._peripheral = new Firmtech(this.runtime, Scratch3FirmtechBlocks.EXTENSION_ID);
        this.message = this._peripheral.txData;
        this.tuneID = 0;
        this.moveID = 0;
        this.rotID = 0;
    }


    getInfo () {
        return {
            id: Scratch3FirmtechBlocks.EXTENSION_ID,
            name: Scratch3FirmtechBlocks.EXTENSION_NAME,
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

module.exports = Scratch3FirmtechBlocks;
