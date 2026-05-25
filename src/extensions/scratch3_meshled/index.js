const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');


//MESH UUID
// MESH Service UUID と Characteristics UUID
// https://developer.meshprj.com/hc/ja/articles/8286360648089-%E9%80%9A%E4%BF%A1%E4%BB%95%E6%A7%98%E3%81%AE%E6%A6%82%E8%A6%81

const    CORE_SERVICE_UUID = '72c90001-57a9-4d40-b746-534e22ec9f9e';
const    CORE_INDICATE_UUID = '72c90005-57a9-4d40-b746-534e22ec9f9e';
const    CORE_NOTIFY_UUID = '72c90003-57a9-4d40-b746-534e22ec9f9e';
const    CORE_WRITE_UUID = '72c90004-57a9-4d40-b746-534e22ec9f9e'; 
const    CORE_WRITE_WO_RESPONSE_UUID = '72c90002-57a9-4d40-b746-534e22ec9f9e';


class Scratch3NewBlocks {
    static brightness = 0; //明るさを保持するクラス変数
    static gpio_device = 0; //GPIOを保持するクラス変数
    static core_service = 0; //サービスを保持するクラス変数
    static characteristic_write = 0; //書くときに使うもの(関数?)を保持する変数
    
    constructor (runtime) {

	this.brightnessEvent = 0;

	//一度も接続していなければ接続する
	if (Scratch3NewBlocks.gpio_device == 0){
	    this.connect();
	}

        this.runtime = runtime;
    }


    connect() {
	navigator.bluetooth.requestDevice({
	    filters: [{namePrefix: 'MESH-100LE',
		      }],
	    optionalServices: [CORE_SERVICE_UUID]
	})
	    .then(device => {
		Scratch3NewBlocks.gpio_device = device;
		console.log("device", device);
		return device.gatt.connect();
	    })
	//MESH
	    .then(server =>{
		console.log("server", server)
		return server.getPrimaryService(CORE_SERVICE_UUID);
	    })
	    .then(service => {
		Scratch3NewBlocks.core_service = service;    
		console.log("service", service)
		return Scratch3NewBlocks.core_service.getCharacteristic(CORE_INDICATE_UUID)
	    })
	    .then(chara_indicate => {
		//INCIDATE のイベントを待つ処理設定	    
		console.log("MESH INDICATE:", chara_indicate)
		alert("MESH INDICATEが完了しました。");
		this.characteristic_indicate = chara_indicate;
		this.characteristic_indicate.startNotifications();
		this.characteristic_indicate.addEventListener('characteristicvaluechanged',this.on_receive);
		
		return Scratch3NewBlocks.core_service.getCharacteristic(CORE_NOTIFY_UUID)
	    })
	    .then(chara_notify => {
		// Notification のイベントを待つ処理設定	    
		console.log("MESH NOTIFY", chara_notify)
		alert("MESH NOFITYが完了しました。");
		this.characteristic_notify = chara_notify;
		this.characteristic_notify.startNotifications();
		this.characteristic_notify.addEventListener('characteristicvaluechanged',this.on_receive);
//		return this.core_service.getCharacteristic(CORE_WRITE_UUID)   
		return Scratch3NewBlocks.core_service.getCharacteristic(CORE_WRITE_WO_RESPONSE_UUID)   
	    })
	    .then(chara_write => {
		// ブロック機能の有効化
		// 0x00020103 を送る。
		// Indicate イベントが来れば、いろいろと MESH にお願いができるようになる。
		// 参考
		// 全部ブロック共通の処理
		// https://developer.meshprj.com/hc/ja/articles/8286379681945	    
		console.log("MESH WRITE", chara_write)

		Scratch3NewBlocks.characteristic_write = chara_write;
		Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([0x00,0x02,0x01,0x03]));
		alert("MESH WRITEが完了しました。");
	    })    
	    .catch(error => {
		alert("BLE接続に失敗しました。もう一度試してみてください");
		console.log(error);
	    });    
    }


    
    
    getInfo () {
	//インスタンス変数何を入れたらいいかわからないから0で初期化している

        return {
            id: 'meshled',
            name: 'MESH_LED',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'LED  [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
							menu:'led'
                        }
                    }
                },

		
            ],
            menus: {
				led:{
					acceptReporters:true,
					items:["白色で点灯","黄色で点灯","緑色で点灯","青色で点灯","赤色で点灯","消灯"]
				}
				

            }
        };
	}



    

    writeLog (args) {
	
        const text = Cast.toString(args.TEXT);

//	this.led_on();
	console.log(text);
        log.log(text);
	if(text== "消灯"){
		this.led_off()
	}else if (text == "赤色で点灯"){
	    this.led_red()
	}else if(text == "緑色で点灯"){
		this.led_green()
	}else if(text == "黄色で点灯"){
		this.led_yellow()
	}else if(text == "白色で点灯"){
		this.led_white()
	}else{
		this.led_blue()
	}

    }


	led_off()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する（固定値）
	    0x00, //LED点灯指示(固定値)
	    0x7F, //赤の明るさ
	    0x00, //固定値
	    0x00,//緑の明るさ
	    0x00,//固定値
	    0x00,//青の明るさ
	    0xFF, //点灯時間（LSB）
	    0xFF, //点灯時間（MSB)
	    0x00,//点灯サイクル（LSB)
	    0x00,//点灯サイクル（MSB）
		0x00,//消灯サイクル（LSB)
		0x00,//消灯サイクル（MSB）
		0x01,//点灯パターン
		0x7F//チェックサム
    ]));
	}


    led_red()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する（固定値）
	    0x00, //LED点灯指示(固定値)
	    0x7F, //赤の明るさ
	    0x00, //固定値
	    0x00,//緑の明るさ
	    0x00,//固定値
	    0x00,//青の明るさ
	    0xFF, //点灯時間（LSB）
	    0xFF, //点灯時間（MSB)
	    0x01,//点灯サイクル（LSB)
	    0x00,//点灯サイクル（MSB）
		0x00,//消灯サイクル（LSB)
		0x00,//消灯サイクル（MSB）
		0x01,//点灯パターン
		0x80//チェックサム

	]));
    }

    led_green()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する（固定値）
	    0x00, //LED点灯指示(固定値)
	    0x00, //赤の明るさ
	    0x00, //固定値
	    0x7F,//緑の明るさ
	    0x00,//固定値
	    0x00,//青の明るさ
	    0xFF, //点灯時間（LSB）
	    0xFF, //点灯時間（MSB)
	    0x01,//点灯サイクル（LSB)
	    0x00,//点灯サイクル（MSB）
		0x00,//消灯サイクル（LSB)
		0x00,//消灯サイクル（MSB）
		0x01,//点灯パターン
		0x80//チェックサム
	]));
    }

	led_blue()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する（固定値）
	    0x00, //LED点灯指示(固定値)
	    0x00, //赤の明るさ
	    0x00, //固定値
	    0x00,//緑の明るさ
	    0x00,//固定値
	    0x7F,//青の明るさ
	    0xFF, //点灯時間（LSB）
	    0xFF, //点灯時間（MSB)
	    0x01,//点灯サイクル（LSB)
	    0x00,//点灯サイクル（MSB）
		0x00,//消灯サイクル（LSB)
		0x00,//消灯サイクル（MSB）
		0x01,//点灯パターン
		0x80//チェックサム
	]));
    }

	
    led_yellow()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する（固定値）
	    0x00, //LED点灯指示(固定値)
	    0x7F, //赤の明るさ
	    0x00, //固定値
	    0x7F,//緑の明るさ
	    0x00,//固定値
	    0x00,//青の明るさ
	    0xFF, //点灯時間（LSB）
	    0xFF, //点灯時間（MSB)
	    0x01,//点灯サイクル（LSB)
	    0x00,//点灯サイクル（MSB）
		0x00,//消灯サイクル（LSB)
		0x00,//消灯サイクル（MSB）
		0x01,//点灯パターン
		0xFF//チェックサム

	]));
    }

	
    led_white()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する（固定値）
	    0x00, //LED点灯指示(固定値)
	    0x7F, //赤の明るさ
	    0x00, //固定値
	    0x7F,//緑の明るさ
	    0x00,//固定値
	    0x7F,//青の明るさ
	    0xFF, //点灯時間（LSB）
	    0xFF, //点灯時間（MSB)
	    0x01,//点灯サイクル（LSB)
	    0x00,//点灯サイクル（MSB）
		0x00,//消灯サイクル（LSB)
		0x00,//消灯サイクル（MSB）
		0x01,//点灯パターン
		0x7E//チェックサム

	]));
    }


    
    


    
}

module.exports = Scratch3NewBlocks;
