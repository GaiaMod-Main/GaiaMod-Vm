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
const BLEDataStoppedError = 'RoboDog extension stopped receiving data';


const BLEUUID = {
    service: 0x2264,
    rxChar: '00000227-0000-1000-8000-00805f9b34fb',
    txChar: '00000227-0000-1000-8000-00805f9b34fb'
};


class RoboDog {
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
        this.rxData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.txData = new Int8Array(36);
        this._pollingIntervalID = null;
        this._pollingInterval = 25;
        this.trackID = 0;
        this._sensors = {
            battery: 0,
            tof: 0,
            gyro: [0, 0],
            yaw: 0,
        };
        this.stopAll();
    }
    
		stopAll () {
			for (let i = 0; i < 36; i++)
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

class Scratch3RoboDogBlocks {
    static get EXTENSION_NAME () {
        return 'RoboDog';
    }
    static get EXTENSION_ID () {
        return 'robodog';
    }

    constructor (runtime) {

        this.runtime = runtime;
        this._peripheral = new RoboDog(this.runtime, Scratch3RoboDogBlocks.EXTENSION_ID);
        this.message = this._peripheral.txData;
        this.tuneID = 0;
    }


    getInfo () {
        return {
            id: Scratch3RoboDogBlocks.EXTENSION_ID,
            name: Scratch3RoboDogBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'gesture',
                    text: formatMessage({
                        id: 'gesture',
                        default: '[MOTION]\uC790\uC138 \uCDE8\uD558\uAE30',   //자세 취하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MOTION: {
                            type: ArgumentType.STRING,
                            menu: 'motion',
                            defaultValue: '\uC900\uBE44'
                        },
                    }
                },
                {
                    opcode: 'legact',
                    text: formatMessage({
                        id: 'legact',
                        default: '[LEGWHAT]\ub97c[TEXT]\ub192\uc774\ub85c\u0020\uc124\uc815\ud558\uae30',  //네다리 를 60 높이로 설정하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LEGWHAT: {
                            type: ArgumentType.STRING,
                            menu: 'legwhat',
                            defaultValue: '\ub124\ub2e4\ub9ac'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        }
                    }
                },
                {
                    opcode: 'move',
                    text: formatMessage({
                        id: 'move',
                        default: '[FB]\u0028\uc73c\u0029\ub85c[TEXT]\ube60\ub974\uae30\ub85c\u0020\uc774\ub3d9\ud558\uae30',   //앞으로 50 빠르기로 이동하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FB: {
                            type: ArgumentType.STRING,
                            menu: 'fb',
                            defaultValue: '\uc55e'
                        },
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                
                {
                    opcode: 'leg',
                    text: formatMessage({
                        id: 'leg',
                        default: '[LEGPOS]\ub2e4\ub9ac \ub192\uc774 [TEXT1], \ubc1c\ub05d \uc55e\ub4a4[TEXT2]\ub85c\u0020\uc124\uc815\ud558\uae30',  //왼쪽 위 다리높이 60, 발끝앞뒤 0로 설정하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LEGPOS: {
                            type: ArgumentType.STRING,
                            menu: 'legpos',
                            defaultValue: '\uc67c\ucabd\u0020\uc704'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 60
                        },
                        TEXT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                
                 {
                    opcode: 'motor',
                    text: formatMessage({
                        id: 'motor',
                        default: '[LEGPOS]\uc5b4\uae68 [TEXT1]\ub3c4\u002c\u0020\ubb34\ub98e[TEXT2]\ub3c4\u0020\uc124\uc815\ud558\uae30',   //왼쪽 위 어깨 0도, 무릎 0도 설정하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LEGPOS: {
                            type: ArgumentType.STRING,
                            menu: 'legpos',
                            defaultValue: '\uc67c\ucabd\u0020\uc704'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                
                {
                    opcode: 'rotation',
                    text: formatMessage({
                        id: 'rotation',
                        default: '[ROTDIR]\uc73c\ub85c[TEXT1]\ub3c4\ub97c [TEXT2]\uac01\uc18d\ub3c4\ub85c\u0020\ud68c\uc804\ud558\uae30', // 시계방향 으로 0도를 100각속도로 회전하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                       	ROTDIR: {
                            type: ArgumentType.STRING,
                            menu: 'rotdir',
                            defaultValue: '\uc2dc\uacc4\ubc29\ud5a5'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                        TEXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'rotvel',
                    text: formatMessage({
                        id: 'rotvel',
                        default: '\ubaa8\ud130\u0020\ud68c\uc804\uc18d\ub3c4\ub97c[TEXT]\u0028\uc73c\u0029\ub85c\u0020\uc124\uc815\ud558\uae30', // 모터 회전속도를 50(으)로 설정하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        },

                    }
                },
                '---',
                {
                    opcode: 'headledexp',
                    text: formatMessage({
                        id: 'headledexp',
                        default: '[LEDEXP]\ud45c\uc815\uc744 \ud5e4\ub4dc\u004c\u0045\u0044\u0020\uc5d0\u0020\ucd9c\ub825\ud558\uae30',           //초롱초롱 표정을 왼쪽 헤드LED 에 표현하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LEDEXP: {
                            type: ArgumentType.STRING,
                            menu: 'ledexp',
                            defaultValue: '\ucd08\ub871\ucd08\ub871'
                        },
                    }
                },
                {
                    opcode: 'headled',
                    text: formatMessage({
                        id: 'headled',
                        default: '[LR]\ud5e4\ub4dc\u0020\u004c\u0045\u0044\uc5d0\u000d [TEXT1][TEXT2][TEXT3][TEXT4][TEXT5][TEXT6][TEXT7][TEXT8]\ubaa8\uc591\uc73c\ub85c\u0020\ucd9c\ub825\ud558\uae30\u000d',  //왼쪽 헤드LED에 0x12345678 모양으로 출력하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LR: {
                            type: ArgumentType.STRING,
                            menu: 'lr',
                            defaultValue: '\uc67c\ucabd\u000d'
                        },
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT4: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT5: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT6: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT7: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        TEXT8: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'bodyled',
                    text: formatMessage({
                        id: 'bodyled', 
                        default: 'R:[TEXT1], G:[TEXT2], B:[TEXT3]\ub85c\u0020\ubc14\ub514\u0020\u004c\u0045\u0044\u0020\uc0c9\uc0c1\u0020\ucd9c\ub825\ud558\uae30\u000d', // R G B 로 바디 LED 색상 출력하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        TEXT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        TEXT3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                '---',

                {
                    opcode: 'mp3play',
                    text: formatMessage({
                        id: 'mp3play',
                        default: '[MP3EFFECT] \uc18c\ub9ac\ub97c\u0020\ubcfc\ub960 [MP3VOLUME]\u0028\uc73c\u0029\ub85c\u0020\ucd9c\ub825\ud558\uae30',   //멍멍 소리를 볼률 3(으)로 출력하기 
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        MP3EFFECT: {
                            type: ArgumentType.STRING,
                            menu: 'mp3effect',
                            defaultValue: '\uba4d\uba4d'
                        },
                        MP3VOLUME: {
                            type: ArgumentType.STRING,
                            menu: 'mp3volume',
                            defaultValue: '3'
                        },
                    }
                },

                {
                    opcode: 'expservo',
                    text: formatMessage({
                        id: 'expservo',
                        default: '\ud655\uc7a5\u0020\uc11c\ubcf4\ubaa8\ud130\u000d[TEXT]\ub3c4\u0020\uc124\uc815\ud558\uae30',   //확장 서보모터를 90도 회전하기
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                '---',
                {
                    opcode: 'getbattery',
                    text: formatMessage({
                        id: 'getbattery',
                        default: '\ubc30\ud130\ub9ac(%)',            //배터리
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getalt',
                    text: formatMessage({
                        id: 'getalt',
                        default: '\uac70\ub9ac\u0020\uc13c\uc11c',  //거리센서
                    }),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'gettilt',
                    text: formatMessage({
                        id: 'getlrtilt',
                        default: '[LRFB]\uae30\uc6b8\uae30',   //좌우 기울기
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        LRFB: {
                            type: ArgumentType.STRING,
                            menu: 'lrfb',
                            defaultValue: '\uc88c\uc6b0'
                        }
                    }
                },
                {
                    opcode: 'getyaw',
                    text: formatMessage({
                        id: 'getyaw',
                        default: '\ud68c\uc804',      //회전
                    }),
                    blockType: BlockType.REPORTER,
                },

                '---',
                {
                    opcode: 'getrbdata',
                    text: formatMessage({
                        id: 'getrbdata',
                        default: '\ub77c\uc988\ubca0\ub9ac\ud30c\uc774[RBDATA]\ubc88\u0020\uac12',   //라즈베리파이 0번 값
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        RBDATA: {
                            type: ArgumentType.STRING,
                            menu: 'rbdata',
                            defaultValue: '0'
                        },
                    }
                },
            ],
           	menus: {
                motion: {
                    acceptReporters: true,
                    items: ['\uC900\uBE44', '\uc549\uae30','\uBB3C\uAD6C\uB098\uBB34\uC11C\uAE30', '\uae30\uc9c0\uac1c\u0020\ucf1c\uae30']
                },
                legwhat: {
                    acceptReporters: true,
                    items: ['\ub124\ub2e4\ub9ac', '\uc55e\ub2e4\ub9ac','\ub4b7\ub2e4\ub9ac', '\uc67c\ucabd\ub2e4\ub9ac','\uc624\ub978\ucabd\ub2e4\ub9ac']
                },
                fb: {
                    acceptReporters: true,
                    items: ['\uc55e', '\ub4a4']
                },
                legpos: {
                    acceptReporters: true,
                    items: ['\uc67c\ucabd\u0020\uc704', '\uc67c\ucabd\u0020\uc544\ub798', '\uc624\ub978\ucabd\u0020\uc544\ub798', '\uc624\ub978\ucabd\u0020\uc704']
                },
                rotdir: {
                    acceptReporters: true,
                    items: ['\uc2dc\uacc4\ubc29\ud5a5', '\ubc18\uc2dc\uacc4\ubc29\ud5a5']
                },
                ledexp: {
                    acceptReporters: true,
                    items: ['\ucd08\ub871\ucd08\ub871', 'I❤U', '\ub208\uac10\uae30', '\uac10\uc0ac', '\uace0\ub9c8\uc6cc\uc694', '\ubc41\uc0c8', '\uc88c\uc6b0\uad74\ub9ac\uae30', '\ucc22\ub208', '\ucc22\ub208\u0020\uae5c\ubc15\uc784', '\uace4\ucda9', '\uae5c\ubc15', '\ubc40\ub208', '\ubc14\ub78c\uac1c\ube44']
                },
                lr: {
                    acceptReporters: true,
                    items: ['\uc67c\ucabd\u000d', '\uc624\ub978\ucabd\u000d']
                },
                xy: {
                    acceptReporters: true,
                    items: ['X', 'Y']
                },
                mp3effect: {
                    acceptReporters: true,
                    items: ['\uba4d\uba4d', '\uc73c\ub974\ub801', '\uae68\uac31']
                },
                mp3volume: {
                    acceptReporters: true,
                    items: ['\uc791\uac8c', '\uc911\uac04\uc73c\ub85c', '\ud06c\uac8c']
                },
                lrfb: {
                    acceptReporters: true,
                    items: ['\uc88c\uc6b0', '\uc55e\ub4a4']
                },
                rbdata: {
                    acceptReporters: true,
                    items: ['0', '1', '2', '3']
                }
            }
        };
    }
    
    gesture (args) {   //blockID == 0

        if((this.message[9]&0x0F) != 0x04){
            this.message[10] = this.message[11] = this.message[12] = this.message[13] = 0;
            this.message[14] = this.message[15] = this.message[16] = this.message[17] = 0;
        }
        this.message[9] = (this.message[9]&0xF0) | 0x04;

        if(args.MOTION == '\uC900\uBE44')
            this.message[10] = 0;
        else if(args.MOTION == '\uc549\uae30')
            this.message[10] = 1;
        else if(args.MOTION == '\uBB3C\uAD6C\uB098\uBB34\uC11C\uAE30')
            this.message[10] = 2;
        else if(args.MOTION == '\uae30\uc9c0\uac1c\u0020\ucf1c\uae30')
            this.message[10] = 3;
        else
            this.message[10] = 0;
    }

    legact (args) {    //blockID == 1
        if((this.message[9]&0x0F) != 0x01){
            this.message[10] = this.message[11] = this.message[12] = this.message[13] = 0;
            this.message[14] = this.message[15] = this.message[16] = this.message[17] = 0;
        }
        this.message[9] = (this.message[9]&0xF0) | 0x01;

        let height = args.TEXT>90? 90 : args.TEXT<20? 20 : args.TEXT;
        let what = 0;
        if(args.LEGWHAT == '\ub124\ub2e4\ub9ac')
            what = 0;
        else if(args.LEGWHAT == '\uc55e\ub2e4\ub9ac')
            what = 1;
        else if(args.LEGWHAT == '\ub4b7\ub2e4\ub9ac')
            what = 2;
        else if(args.LEGWHAT == '\uc67c\ucabd\ub2e4\ub9ac')
            what = 3;
        else if(args.LEGWHAT == '\uc624\ub978\ucabd\ub2e4\ub9ac')
            what = 4;
        if(what == 0) {
            for (let n = 0; n < 4; n++)
                this.message[10 + n] = height;
        }
        if(what == 1)
            this.message[10] = this.message[13] = height;
        if(what == 2)
            this.message[11] = this.message[12] = height;
        if(what == 3)
            this.message[10] = this.message[11] = height;
        if(what == 4)
            this.message[12] = this.message[13] = height;
    }

    move(args){         //blockID == 2
        if((this.message[9]&0x0F) != 0x01){
            this.message[10] = this.message[11] = this.message[12] = this.message[13] = 0;
            this.message[14] = this.message[15] = this.message[16] = this.message[17] = 0;
        }
        this.message[9] = (this.message[9]&0xF0) | 0x01;

        let val = args.TEXT>100? 100 : args.TEXT<-100? -100 : args.TEXT;
        if(args.FB == '\ub4a4')
            val = -1*val;
        this.message[14] = val;
    }

    leg(args){           //blockID == 3
        if((this.message[9]&0x0F) != 0x02){
            this.message[10] = this.message[11] = this.message[12] = this.message[13] = -127;
            this.message[14] = this.message[15] = this.message[16] = this.message[17] = -127;
        }
        this.message[9] = (this.message[9]&0xF0) | 0x02;

        let what = 0;
        if(args.LEGPOS == '\uc67c\ucabd\u0020\uc704')
            what = 0; 
        else if(args.LEGPOS == '\uc67c\ucabd\u0020\uc544\ub798')
            what = 1;
        else if(args.LEGPOS == '\uc624\ub978\ucabd\u0020\uc544\ub798')
            what = 2;
        else if(args.LEGPOS == '\uc624\ub978\ucabd\u0020\uc704')
            what = 3;
        
        let height = args.TEXT1>90? 90 : args.TEXT1<20? 20 : args.TEXT1;
        let fw = args.TEXT2>90? 90 : args.TEXT2<-90? -90 : args.TEXT2;

        this.message[10+what*2] = height;
        this.message[10+what*2+1] = fw;
    }
    
    motor (args){            //blockID == 4
        if((this.message[9]&0x0F) != 0x03){
            this.message[10] = this.message[11] = this.message[12] = this.message[13] = -127;
            this.message[14] = this.message[15] = this.message[16] = this.message[17] = -127;
        }
        this.message[9] = (this.message[9]&0xF0) | 0x03;
        let what = 0;
        if(args.LEGPOS == '\uc67c\ucabd\u0020\uc704')
            what = 0; 
        else if(args.LEGPOS == '\uc67c\ucabd\u0020\uc544\ub798')
            what = 1;
        else if(args.LEGPOS == '\uc624\ub978\ucabd\u0020\uc544\ub798')
            what = 2;
        else if(args.LEGPOS == '\uc624\ub978\ucabd\u0020\uc704')
            what = 3;
        
        let deg1 = args.TEXT1>90? 90 : args.TEXT1<-90? -90 : args.TEXT1;
        let deg2 = args.TEXT2>70? 70 : args.TEXT2<-90? -90 : args.TEXT2;

        this.message[10+what*2] = deg1;
        this.message[10+what*2+1] = deg2;
    }
    
    rotation(args){               //blockID == 5
        if((this.message[9]&0x0F) != 0x01){
            this.message[10] = this.message[11] = this.message[12] = this.message[13] = 0;
            this.message[14] = this.message[15] = this.message[16] = this.message[17] = 0;
        }
        this.message[9] = (this.message[9]&0xF0) | 0x01;

        let deg = args.TEXT1>1000? 1000 : args.TEXT1<-1000? -1000 : args.TEXT1;
        let vel = args.TEXT2>100? 100 : args.TEXT2<10? 10 : args.TEXT2;

        if(args.ROTDIR == '\ubc18\uc2dc\uacc4\ubc29\ud5a5')
            deg = -1*deg;

        this.message[15] = vel;
        this.message[16] = deg&0xFF;
        this.message[17] = (deg>>8)&0xFF;
    }

    rotvel(args){          //blockID == 15       
        this.message[7] = args.TEXT>100? 100 : args.TEXT<10? 10 : args.TEXT;
    }

    headledexp(args){      //blockID == 6
        let what = 0;
        if(args.LEDEXP == '\ucd08\ub871\ucd08\ub871') 
            what = 0;
        else if(args.LEDEXP == 'I❤U')
            what = 1;
        else if(args.LEDEXP == '\ub208\uac10\uae30') 
            what = 2; 
        else if(args.LEDEXP == '\uac10\uc0ac') 
            what = 3;
        else if(args.LEDEXP == '\uace0\ub9c8\uc6cc\uc694') 
            what = 4;
        else if(args.LEDEXP == '\ubc41\uc0c8') 
            what = 5;
        else if(args.LEDEXP == '\uc88c\uc6b0\uad74\ub9ac\uae30') 
            what = 6;
        else if(args.LEDEXP == '\ucc22\ub208') 
            what = 7;
        else if(args.LEDEXP == '\ucc22\ub208\u0020\uae5c\ubc15\uc784') 
            what = 8;
        else if(args.LEDEXP == '\uace4\ucda9') 
            what = 9;
        else if(args.LEDEXP == '\uae5c\ubc15') 
            what = 10;
        else if(args.LEDEXP == '\ubc40\ub208') 
            what = 11;
        else if(args.LEDEXP == '\ubc14\ub78c\uac1c\ube44') 
            what = 12;

        this.message[9] = (this.message[9]&0x0F) | 0x20;
        this.message[18] = what;
    }

    headled(args){         //blockID == 7
        let lr = args.LR == '\uc67c\ucabd\u000d'? 0 : 8;
        let data = new Int8Array(8);
        data[0] = args.TEXT1&0xFF;
        data[1] = args.TEXT2&0xFF;
        data[2] = args.TEXT3&0xFF;
        data[3] = args.TEXT4&0xFF;
        data[4] = args.TEXT5&0xFF;
        data[5] = args.TEXT6&0xFF;
        data[6] = args.TEXT7&0xFF;
        data[7] = args.TEXT8&0xFF;

        this.message[9] = (this.message[9]&0x0F) | 0x10;
        let k, val;
        for(let n=0; n<8; n++) {
            for (k = 0, val = 0; k < 8; k++)
                val |= (((data[k] >> (7 - n)) & 0x01) << k);
            this.message[18 + lr + n] = val;
        }
    }

    bodyled(args){             //blockID == 8
        this.message[2] = args.TEXT1>255? 255 : args.TEXT1<0? 0 : args.TEXT1;
        this.message[3] = args.TEXT2>255? 255 : args.TEXT2<0? 0 : args.TEXT2;
        this.message[4] = args.TEXT3>255? 255 : args.TEXT3<0? 0 : args.TEXT3;
        this.message[5] = 0x0F;
    }

    mp3play(args){             //blockID == 9
        let effect = 0;
        let volume = 0;
        if(args.MP3EFFECT == '\uba4d\uba4d') effect = 1;
        if(args.MP3EFFECT == '\uc73c\ub974\ub801') effect = 2;
        if(args.MP3EFFECT == '\uae68\uac31') effect = 3;


        if(args.MP3VOLUME == '\uc791\uac8c') volume = 1;
        if(args.MP3VOLUME == '\uc911\uac04\uc73c\ub85c') volume = 2;
        if(args.MP3VOLUME == '\ud06c\uac8c') volume = 3;

        let id = (this.message[0]&0x80) == 0x80? 0x00 : 0x80;
        effect |= id;
        this.message[0] = effect;
        this.message[1] = volume;
    }

    expservo(args){             //blockID == 10
        this.message[6] = args.TEXT>90? 90 : args.TEXT<-90? -90 : args.TEXT;
    }

    getbattery(){
        let rxData = this._peripheral.rxData;
        return rxData[0];
    }

    getalt(){
        let rxData = this._peripheral.rxData;
        return rxData[1]; 
    }

    gettilt(args){
        let rxData = this._peripheral.rxData;
        let val = (args.LRFB == '\uc88c\uc6b0')? rxData[2] : rxData[3];
        val = val>127? val-256 : val;
        return val;
    }

    getyaw(){
        let rxData = this._peripheral.rxData;
        let val =  rxData[4] | (rxData[5]<<8);
        val = val>0x7FFF? val-0x10000 : val;
        return val;

    }

    getrbdata(args){
        let rxData = this._peripheral.rxData;
        let num = 0;
        if(args.RBDATA == '1') num = 1;
        if(args.RBDATA == '2') num = 2;
        if(args.RBDATA == '3') num = 3;
        return rxData[12+num];
    }
}

module.exports = Scratch3RoboDogBlocks;
