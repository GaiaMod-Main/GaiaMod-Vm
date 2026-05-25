//第2版 2025.1.18

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');


//MESH UUID
// MESH Service UUID と Characteristics UUID
// https://developer.meshprj.com/hc/ja/articles/8286360648089-%E9%80%9A%E4%BF%A1%E4%BB%95%E6%A7%98%E3%81%AE%E6%A6%82%E8%A6%81

const    LED_SERVICE_UUID =      'e95dd91d-251d-470a-a062-fa1922dfa9a8';
const    LED_MATRIX_STATE_UUID = 'e95d7b77-251d-470a-a062-fa1922dfa9a8';
const    LED_TEXT_UUID =         'e95d93ee-251d-470a-a062-fa1922dfa9a8';



const    CORE_INDICATE_UUID = '72c90005-57a9-4d40-b746-534e22ec9f9e';
const    CORE_NOTIFY_UUID = '72c90003-57a9-4d40-b746-534e22ec9f9e';
const    CORE_WRITE_UUID = '72c90004-57a9-4d40-b746-534e22ec9f9e'; 
const    CORE_WRITE_WO_RESPONSE_UUID = '72c90002-57a9-4d40-b746-534e22ec9f9e';


class Scratch3NewMicrobit {
    static gpio_device = 0; //GPIOを保持するクラス変数
    static core_service = 0; //サービスを保持するクラス変数
    static characteristic_led_matrix_state = 0; //LED Matrix State CHARACTERRISTICSを格納
    static characteristic_led_text = 0; //LED Text State CHARACTERRISTICSを格納
    
    constructor (runtime) {

	this.brightnessEvent = 0;

	//一度も接続していなければ接続する
	if (Scratch3NewMicrobit.gpio_device == 0){
	    this.connect();
	}

        this.runtime = runtime;
    }


    connect() { //Microbitとの接続
	navigator.bluetooth.requestDevice({ //名前がMESH-100GPから始まり，かつ，
	    filters: [{namePrefix: 'BBC micro:bit', // MESHのサービスのUUIDを
		      }],//持っているデバイスを探す
	    optionalServices: [LED_SERVICE_UUID]
	})
	    .then(device => { //デバイス(ブロック)がみつかる
		Scratch3NewMicrobit.gpio_device = device;
		console.log("device", device);
		return device.gatt.connect(); //みつかったデバイスのGATTサーバに接続
	    })
	//MESH
	    .then(server =>{
		console.log("server", server) //接続したデバイスのMESHのサービス
		return server.getPrimaryService(LED_SERVICE_UUID); //取得
	    })
	    .then(service => { // 特性とキャラクリスティックは同義語
		Scratch3NewMicrobit.core_service = service;    
		console.log("service", service) // 特性LED Matrix Stateの取得
		return Scratch3NewMicrobit.core_service.getCharacteristic(LED_MATRIX_STATE_UUID)
	    })
	    .then(chara_led_matrix_state => {
		//特性 LED Matrix Stateの設定	    
		console.log("micro:bit LED Matrix State:", chara_led_matrix_state)
		alert("LED Matrix Stateが完了しました。");
		Scratch3NewMicrobit.characteristic_led_matrix_state = chara_led_matrix_state;
		//特性LED Textの取得
		return Scratch3NewMicrobit.core_service.getCharacteristic(LED_TEXT_UUID)
	    })
	    .then(chara_led_text => {
		//特性LED Textの設定    
		console.log("LED Text", chara_led_text)
		alert("LED Textが完了しました。");
		Scratch3NewMicrobit.characteristic_led_text = chara_led_text;
	    })    
	    .catch(error => {
		alert("BLE接続に失敗しました。もう一度試してみてください");
		console.log(error);
	    });    
    }


    
    
    getInfo () {
        return {
            id: 'newmicrobit',
            name: 'New Microbit',
            blocks: [
                {
                    opcode: 'led_text',
                    blockType: BlockType.COMMAND,
                    text: 'LEDテキスト[TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },
                {
                    opcode: 'led_matrix_state',
                    blockType: BlockType.COMMAND,
                    text: 'LED Matrix State [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "11111 11111 11111 11111 11111"
                        }
                    }
                },
                {
                    opcode: 'getBrightness',
                    blockType: BlockType.REPORTER,
                    text: '明るさ',
                }

		
            ],
            menus: {
            }
        };
    }



    

    ledOnOff (args) {
	
        const text = Cast.toString(args.TEXT);

//	this.led_on();
	console.log(text);
        log.log(text);

	if (text == 'on'){
	    this.led_text()
	}else{
    	    this.led_off()
	}

    }


    getBrightness () {
	this.led_off(); //フォトトランジトランジスタの電源をオン	
	this.request_brightness();
	console.log('event:',Scratch3NewMicrobit.brightness)
	return String(Scratch3NewMicrobit.brightness);
    }
    

    on_receive(event) { //通知(要求していたアナログ入力値など)が到達時に呼び出される関数
	this.brightnessEvent = event.target.value;
	//0番目，1番目, 4番目の意味はPythonの時と同じ
	this.brightnessEvent = new Uint8Array(this.brightnessEvent.buffer)
	if (this.brightnessEvent[0] == 0x01 && this.brightnessEvent[1] == 0x03){
	    Scratch3NewMicrobit.brightness = this.brightnessEvent[4];
//	    console.log('event:',this.brightness);
//	    console.log('event:',this.brightnessEvent[4]);
	}
	//console.log('event:', event);
    }




    led_on()
    {
	Scratch3NewMicrobit.characteristic_write.writeValue(new Uint8Array([
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
	Scratch3NewMicrobit.characteristic_write.writeValue(new Uint8Array([
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


    request_brightness()
    {
	Scratch3NewMicrobit.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する
	    0x03, //アナログ入力の状態通知設定をする
	    0x01, //リクエストID 任意のID0x01, 今回は特に意味はない
	    0x01, //通知モード(現在のデータを1回通知)
	    0x06 //チェックサム
	]));
    }


    led_text(args)
    {
	const text = Cast.toString(args.TEXT);
	var arrayBuffe = new TextEncoder().encode(text);
	console.log('characteristic:', arrayBuffe);
	Scratch3NewMicrobit.characteristic_led_text.writeValue(arrayBuffe);
    }


    led_matrix_state(args)
    {

	let text = Cast.toString(args.TEXT);

	let buffer = new ArrayBuffer(5);
	let dataview = new DataView(buffer);
	
	let five_bit = 0;
	let mp = 0; //matrix_position

	

	for(let i = 0; i< 5; ++i){
	    for(let j = 0; j < 5; ++j){
		if (text[mp] == '1'){
		    five_bit += 1
		}
		mp += 1;
		if (j != 4){
		    five_bit <<= 1;
		}
	    }
	    dataview.setUint8(i,five_bit);
	    mp += 1; // skip space
	    five_bit = 0;
	}

	// dataview.setUint8(1,0x1f)
	// dataview.setUint8(1,0x1f)
	//dataview.setUint8(2,0x0e)
	//dataview.setUint8(3,0x1f)
	//dataview.setUint8(4,0x1f)
	Scratch3NewMicrobit.characteristic_led_matrix_state.writeValue(buffer);
    }
    

    
}

module.exports = Scratch3NewMicrobit;
