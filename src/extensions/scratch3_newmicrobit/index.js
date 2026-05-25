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

const    IO_PIN_SERVICE_UUID =    'e95d127b-251d-470a-a062-fa1922dfa9a8';
const    IO_PIN_DATA_UUID =       'e95d8d00-251d-470a-a062-fa1922dfa9a8';
const    IO_PIN_AD_CONFIG_UUID =  'e95d5899-251d-470a-a062-fa1922dfa9a8';
const    IO_PIN_IO_CONFIG_UUID =  'e95db9fe-251d-470a-a062-fa1922dfa9a8';

const    ACCELEROMETER_SERVICE_UUID  = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
const    ACCELEROMETER_DATA__UUID   = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';
const    ACCELEROMETER_PERIOD_UUID   = 'e95dfb24-251d-470a-a062-fa1922dfa9a8';

const    MAGNETOMETER_SERVICE_UUID  =   'e95df2d8-251d-470a-a062-fa1922dfa9a8';
const    MAGNETOMETER_PERIOD_UUID =     'e95d386c-251d-470a-a062-fa1922dfa9a8';
const    MAGNETOMETER_CALIBRATION_UUID ='e95db358-251d-470a-a062-fa1922dfa9a8';


function sleep(time) {
	return new Promise((resolve, reject) => setTimeout(resolve, time));
}


class Scratch3NewMicrobit {
    static gatt_server = 0;      //GATT Sever
    static gpio_device = 0; //GPIOを保持するクラス変数
    static core_service = 0; //サービスを保持するクラス変数
    static characteristic_led_matrix_state = 0; //LED Matrix State CHARACTERRISTICSを格納
    static characteristic_led_text = 0; //LED Text State CHARACTERRISTICSを格納
    static io_pin_svc = 0; // IO_PIN_SERVICEを格納
    static chara_io_pin_data = 0; //特性IO_PIN_DATAを格納
    static chara_io_pin_ad_cfg = 0; //特性IO_PIN_AD_CONFIGを格納
    static chara_io_pin_io_cfg = 0; //特性IO_PIN_AD_CONFIGを格納

    static accelerometer_svc = 0; // ACCELEROMETER_SERVICEを格納
    static chara_accelerometer_data = 0; //特性 ACCELEROMETER_DATAを格納
    static chara_accelerometer_period = 0; //特性CCELEROMETER_PERIODを格納

    accelerometer_x = 0; // 加速度のx成分
    accelerometer_y = 0; // 加速度のy成分
    accelerometer_z = 0; // 加速度のz成分
    static accelerometer_event = 0;


    
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
	    optionalServices: [LED_SERVICE_UUID, IO_PIN_SERVICE_UUID,
			       ACCELEROMETER_SERVICE_UUID]
	})
	    .then(device => { //デバイス(ブロック)がみつかる
		Scratch3NewMicrobit.gpio_device = device;
		console.log("device", device);
		return device.gatt.connect(); //みつかったデバイスのGATTサーバに接続
	    })
	//MESH
	    .then(server =>{
		console.log("server", server) //接続したデバイスのMESHのサービス
		Scratch3NewMicrobit.gatt_server = server;
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

		return Scratch3NewMicrobit.gatt_server.getPrimaryService(IO_PIN_SERVICE_UUID); //IO_PIN_SERVICEの取得
	    })
	    .then(io_pin_svc => {
		//IO_PIN_SERVICEの取得    
		console.log("IO PIN SERVICE", io_pin_svc)
		alert("IO_PIN_SERVICEが完了しました。");
		Scratch3NewMicrobit.io_pin_svc = io_pin_svc;
		return io_pin_svc.getCharacteristic(IO_PIN_DATA_UUID); //IO_PIN_DATAの取得
	
	    })
	    .then(chara_io_pin_data => {
		//特性IO_PIN_SERVICEの取得    
		console.log("IO PIN DATA", chara_io_pin_data)
		alert("IO_PIN_DATAが完了しました。");
		Scratch3NewMicrobit.chara_io_pin_data = chara_io_pin_data;
		return Scratch3NewMicrobit.io_pin_svc.getCharacteristic(IO_PIN_AD_CONFIG_UUID); //IO_PIN_AD_CONFIGの取得
	    })
	    .then(chara_io_pin_ad_cfg => {
		//特性IO_PIN_SERVICEの取得    
		console.log("IO PIN AD CONFIG", chara_io_pin_ad_cfg)
		alert("IO_PIN_AD_CONFIGが完了しました。");
		Scratch3NewMicrobit.chara_io_pin_ad_config = chara_io_pin_ad_cfg;
		return Scratch3NewMicrobit.io_pin_svc.getCharacteristic(IO_PIN_IO_CONFIG_UUID);
	    })
	    .then(chara_io_pin_io_cfg => {
		//特性IO_PIN_SERVICEの取得    
		console.log("IO PIN IO CONFIG", chara_io_pin_io_cfg)
		alert("IO_PIN_IO_CONFIGが完了しました。");
		Scratch3NewMicrobit.chara_io_pin_io_config = chara_io_pin_io_cfg;
		return Scratch3NewMicrobit.gatt_server.getPrimaryService(ACCELEROMETER_SERVICE_UUID); //ACCELEROMETER SERVICEの取得
	    })
	    .then(accelerometer_svc => {
		//ACCELEROMETER SERVICEの取得    
		console.log("ACCELEROMETER SERVICE", accelerometer_svc)
		alert("ACCELEROMETER_SERVICEが完了しました。");
		Scratch3NewMicrobit.accelerometer_svc = accelerometer_svc;
		return accelerometer_svc.getCharacteristic(ACCELEROMETER_DATA__UUID); //ACCELEROMETER_DATAの取得	
	    })
	    .then(chara_accelerometer_data => {
		//特性ACCELEROMETER_DATAの取得    
		console.log("ACCELEROMETER DATA", chara_accelerometer_data)
		alert("ACCELEROMETER_DATAが完了しました。");
		Scratch3NewMicrobit.chara_accelerometer_data
		    = chara_accelerometer_data;
		chara_accelerometer_data.startNotifications();
		chara_accelerometer_data.addEventListener('characteristicvaluechanged', this.onAccelerometerValueChanged);

		
		return Scratch3NewMicrobit.accelerometer_svc.getCharacteristic(ACCELEROMETER_PERIOD_UUID); //ACCELEROMETER_PERIODの取得
	    })
	    .then(chara_accelerometer_period => {
		//特性ACCELEROMETER_PERIODの取得    
		console.log("ACCELEROMETER PERIOD", chara_accelerometer_period)
		alert("ACCELEROMETER_PERIODAが完了しました。");
		Scratch3NewMicrobit.chara_accelerometer_period
		    = chara_accelerometer_period;
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
                    opcode: 'getAccelerometerValues',
                    blockType: BlockType.REPORTER,
                    text: '加速度',
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

    

    getAccelerometerValues() {
	let acc = 0;
	acc = sleep(150).then(() => {
	    
	let accx = Scratch3NewMicrobit.accelerometer_x;
	let accy = Scratch3NewMicrobit.accelerometer_y;
	let accz = Scratch3NewMicrobit.accelerometer_z;
	//let accx = this.accelerometer_x;
	//let accy = this.accelerometer_y;
	//let accz = this.accelerometer_z;
	//let accx = Scratch3NewMicrobit.accelerometer_event.target.value.getInt16(0,true)/1000.0;
	//let accy = Scratch3NewMicrobit.accelerometer_event.target.value.getInt16(2,true)/1000.0;
	//let accz = Scratch3NewMicrobit.accelerometer_event.target.value.getInt16(4,true)/1000.0;
	
	//let acc = 0;

	let acc = Math.sqrt(accx ** 2 + accy ** 2 + accz ** 2);  
	
	    //console.log('accelerometer:', acc)
	    return String(acc);
	});
	    //console.log('accelerometer:', acc)
	
	return acc;
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

    onAccelerometerValueChanged(event) {
	//console.log('event', event);
	
	//let accelerometer_x = event.target.value.getInt16(0,true)/1000.0;
	//console.log('x:' + accelerometer_x);
	//Scratch3NewMicrobit.accelerometer_x = accelerometer_x;
	Scratch3NewMicrobit.accelerometer_x
	    =  event.target.value.getInt16(0,true)/1000.0;
	//this.accelerometer_x
	//    =  event.target.value.getInt16(0,true)/1000.0;


	//let accelerometer_y = event.target.value.getInt16(2,true)/1000.0;
	//console.log('y:' + accelerometer_y);
	//Scratch3NewMicrobit.accelerometer_y = accelerometer_y;
	Scratch3NewMicrobit.accelerometer_y
	    = event.target.value.getInt16(2,true)/1000.0; 
	//this.accelerometer_y
	//    = event.target.value.getInt16(2,true)/1000.0; 

	
	//let accelerometer_z = event.target.value.getInt16(4,true)/1000.0;
	//console.log('z:' + accelerometer_z);
	//Scratch3NewMicrobit.accelerometer_z = accelerometer_z;
	Scratch3NewMicrobit.accelerometer_z
	    = event.target.value.getInt16(4,true)/1000.0;
	//this.accelerometer_z
	//    = event.target.value.getInt16(4,true)/1000.0;


    }
    
    

}
module.exports = Scratch3NewMicrobit;
