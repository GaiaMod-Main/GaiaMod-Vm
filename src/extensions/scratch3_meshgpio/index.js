//第3版 2025.7.28

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


function sleep(time) {
	return new Promise((resolve, reject) => setTimeout(resolve, time));
}


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


    connect() { //MESHとの接続
	navigator.bluetooth.requestDevice({ //名前がMESH-100GPから始まり，かつ，
	    filters: [{namePrefix: 'MESH-100GP', // MESHのサービスのUUIDを
		      }],//持っているデバイスを探す
	    optionalServices: [CORE_SERVICE_UUID]
	})
	    .then(device => { //デバイス(ブロック)がみつかる
		Scratch3NewBlocks.gpio_device = device;
		console.log("device", device);
		return device.gatt.connect(); //みつかったデバイスのGATTサーバに接続
	    })
	//MESH
	    .then(server =>{
		console.log("server", server) //接続したデバイスのMESHのサービス
		return server.getPrimaryService(CORE_SERVICE_UUID); //取得
	    })
	    .then(service => { // 特性とキャラクリスティックは同義語
		Scratch3NewBlocks.core_service = service;    
		console.log("service", service) // 特性INDICATEの取得
		return Scratch3NewBlocks.core_service.getCharacteristic(CORE_INDICATE_UUID)
	    })
	    .then(chara_indicate => {
		//特性INCIDATEの設定	    
		console.log("MESH INDICATE:", chara_indicate)
		alert("MESH INDICATEが完了しました。");
		this.characteristic_indicate = chara_indicate;
		this.characteristic_indicate.startNotifications();
		this.characteristic_indicate.addEventListener('characteristicvaluechanged',this.on_receive);
		//特性NOTIFYの取得
		return Scratch3NewBlocks.core_service.getCharacteristic(CORE_NOTIFY_UUID)
	    })
	    .then(chara_notify => {
		//特性NOTIFYの設定    
		console.log("MESH NOTIFY", chara_notify)
		alert("MESH NOFITYが完了しました。");
		this.characteristic_notify = chara_notify;
		this.characteristic_notify.startNotifications();
		this.characteristic_notify.addEventListener('characteristicvaluechanged',this.on_receive);
		//特性WRITE_WO_RESPONSEを取得
//		return this.core_service.getCharacteristic(CORE_WRITE_UUID)   
		return Scratch3NewBlocks.core_service.getCharacteristic(CORE_WRITE_WO_RESPONSE_UUID)   
	    })
	    .then(chara_write => {
		// ブロック機能の有効化
		// 0x00020103 を送る。
		// Indicate イベントが来れば、いろいろと MESH にお願いができるようになる。
		// 参考
		// 全部ブロック共通の処理
		// https://developer.meshprj.com/hc/ja/articles/8286379681945	                // 00020103という命令のデータ送って，MESHブロック機能を有効化する
		console.log("MESH WRITE", chara_write)

		Scratch3NewBlocks.characteristic_write = chara_write;
		Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([0x00,0x02,0x01,0x03]));
		/*
		sleep(600).then(() => {
		    this.led_off()
		});
                */
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
            id: 'newblocks',
            name: 'MESH_GPIO',
            blocks: [
		/*
                {
                    opcode: 'ledOnOff',
                    blockType: BlockType.COMMAND,
                    text: 'LEDのonまたはoff [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "on"
                        }
                    }
                },
                {
		    //使う時にconnect時に電源onにする
                    opcode: 'getBrightness',
                    blockType: BlockType.REPORTER,
                    text: '明るさ',
                },*/
                {
                    opcode: 'powerOnOff',
                    blockType: BlockType.COMMAND,
                    text: '電源出力 [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
							menu:'powerOnOff'
                        }
                    }
                }
		
            ],
            menus: {
				powerOnOff:{
					acceptReporters:true,
				    items:["オン","オフ"]
				}
		
            }
        };
    }



    

    ledOnOff (args) {
	
        const text = Cast.toString(args.TEXT);

//	this.led_on();
	console.log(text);
        log.log(text);

	if (text == 'on'){
	    this.led_on()
	}else{
    	    this.led_off()
	}

    }


//    getBrightness () {
//	this.led_off(); //フォトトランジトランジスタの電源をオン	
//	this.request_brightness();
//	console.log('event:',Scratch3NewBlocks.brightness)
//	return String(Scratch3NewBlocks.brightness);
//    }

    getBrightness(){

	let brightness = 0;
	
	brightness = sleep(600).then(() => {	
	    //this.led_off(); //フォトトラン5ジトランジスタの電源をオン	
	    this.request_brightness();
	    console.log('event:',Scratch3NewBlocks.brightness)
	    return String(Scratch3NewBlocks.brightness);
	});

	return brightness;
    }
			

    

    on_receive(event) { //通知(要求していたアナログ入力値など)が到達時に呼び出される関数
	this.brightnessEvent = event.target.value;
	//0番目，1番目, 4番目の意味はPythonの時と同じ
	this.brightnessEvent = new Uint8Array(this.brightnessEvent.buffer)
	if (this.brightnessEvent[0] == 0x01 && this.brightnessEvent[1] == 0x03){
	    Scratch3NewBlocks.brightness = this.brightnessEvent[4];
//	    console.log('event:',this.brightness);
//	    console.log('event:',this.brightnessEvent[4]);
	}
	//console.log('event:', event);
    }

    led_on()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する
	    0x01, //GPIOの入出力設定をするコマンド(イベント)である
	    0x00, //デジタル入力がLからHになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x00, //デジタル入力がHからLになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x01,//デジタル出力をHigh Levelにするピン 0x01 DOUT1, 0x02 DOUT2, 0x04 DOUT3
	    0x00,//アナログ出力のレベル(PWM) 0から255
	    0x01,//電源 0 OFF, 1 ON
	    0x7f, //アナログ入力のイベントのしきい値 上限は 0x7f (1.5v)
	    0x00, //アナログ入力のイベントのしきい値 下限は 0x00 (0.0v)
	    0x00,//イベント通知設定の条件(0x00通知しない, 0x11 上限下限の外なら通知，0x22 上限下限の内なら通知)
	    0x83 //チェックサム
	]));
    }

    led_off()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する
	    0x01, //GPIOの入出力設定をするコマンド(イベント)である
	    0x00, //デジタル入力がLからHになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x00, //デジタル入力がHからLになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x00,//デジタル出力をHigh Levelにするピン 0x01 DOUT1, 0x02 DOUT2, 0x04 DOUT3
	    0x00,//アナログ出力のレベル(PWM) 0から255
	    0x01,//電源 0 OFF, 1 ON
	    0x7f, //アナログ入力のイベントのしきい値 上限は 0x7f (1.5v)
	    0x00, //アナログ入力のイベントのしきい値 下限は 0x00 (0.0v)
	    0x00,//イベント通知設定の条件(0x00通知しない, 0x11 上限下限の外なら通知，0x22 上限下限の内なら通知)
	    0x82 //チェックサム
	]));
    }



    power_on()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する
	    0x01, //GPIOの入出力設定をするコマンド(イベント)である
	    0x00, //デジタル入力がLからHになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x00, //デジタル入力がHからLになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x00,//デジタル出力をHigh Levelにするピン 0x01 DOUT1, 0x02 DOUT2, 0x04 DOUT3
	    0x00,//アナログ出力のレベル(PWM) 0から255
	    0x01,//電源 2 OFF, 1 ON
	    0x7f, //アナログ入力のイベントのしきい値 上限は 0x7f (1.5v)
	    0x00, //アナログ入力のイベントのしきい値 下限は 0x00 (0.0v)
	    0x00,//イベント通知設定の条件(0x00通知しない, 0x11 上限下限の外なら通知，0x22 上限下限の内なら通知)
	    0x82 //チェックサム
	]));
    }

    power_off()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する
	    0x01, //GPIOの入出力設定をするコマンド(イベント)である
	    0x00, //デジタル入力がLからHになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x00, //デジタル入力がHからLになったと時にイベントを通知するピン 0x01 DIN1, 0x02 DIN2, 0x04 DIN3
	    0x00,//デジタル出力をHigh Levelにするピン 0x01 DOUT1, 0x02 DOUT2, 0x04 DOUT3
	    0x00,//アナログ出力のレベル(PWM) 0から255
	    0x02,//電源 2 OFF, 1 ON
	    0x7f, //アナログ入力のイベントのしきい値 上限は 0x7f (1.5v)
	    0x00, //アナログ入力のイベントのしきい値 下限は 0x00 (0.0v)
	    0x00,//イベント通知設定の条件(0x00通知しない, 0x11 上限下限の外なら通知，0x22 上限下限の内なら通知)
	    0x83 //チェックサム
	]));
    }


    




    request_brightness()
    {
	Scratch3NewBlocks.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する
	    0x03, //アナログ入力の状態通知設定をする
	    0x01, //リクエストID 任意のID0x01, 今回は特に意味はない
	    0x01, //通知モード(現在のデータを1回通知)
	    0x06 //チェックサム
	]));
    }

    powerOnOff(args) {
	
        const text = Cast.toString(args.TEXT);

//	this.led_on();
	console.log(text);
        log.log(text);
	if(text== "オン"){
		this.power_on()
	}else{
		this.power_off()
	}

    }
    
}

module.exports = Scratch3NewBlocks;
