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


class scratch3MotionSensor {
    static motion = 0; //明るさを保持するクラス変数
    static gpio_device = 0; //GPIOを保持するクラス変数
    static core_service = 0; //サービスを保持するクラス変数
    static characteristic_write = 0; //書くときに使うもの(関数?)を保持する変数
    
    constructor (runtime) {

	this.motionEvent = 0;

	//一度も接続していなければ接続する
	if (scratch3MotionSensor.gpio_device == 0){
	    this.connect();
	}

        this.runtime = runtime;
    }


    connect() { //MESHとの接続
	navigator.bluetooth.requestDevice({ //名前がMESH-100GPから始まり，かつ，
	    filters: [{namePrefix: 'MESH-100MD', // MESHのサービスのUUIDを
		      }],//持っているデバイスを探す
	    optionalServices: [CORE_SERVICE_UUID]
	})
	    .then(device => { //デバイス(ブロック)がみつかる
		scratch3MotionSensor.gpio_device = device;
		console.log("device", device);
		return device.gatt.connect(); //みつかったデバイスのGATTサーバに接続
	    })
	//MESH
	    .then(server =>{
		console.log("server", server) //接続したデバイスのMESHのサービス
		return server.getPrimaryService(CORE_SERVICE_UUID); //取得
	    })
	    .then(service => { // 特性とキャラクリスティックは同義語
		scratch3MotionSensor.core_service = service;    
		console.log("service", service) // 特性INDICATEの取得
		return scratch3MotionSensor.core_service.getCharacteristic(CORE_INDICATE_UUID)
	    })
	    .then(chara_indicate => {
		//特性INCIDATEの設定	    
		console.log("MESH INDICATE:", chara_indicate)
		alert("MESH INDICATEが完了しました。");
		this.characteristic_indicate = chara_indicate;
		this.characteristic_indicate.startNotifications();
		this.characteristic_indicate.addEventListener('characteristicvaluechanged',this.on_receive);
		//特性NOTIFYの取得
		return scratch3MotionSensor.core_service.getCharacteristic(CORE_NOTIFY_UUID)
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
		return scratch3MotionSensor.core_service.getCharacteristic(CORE_WRITE_WO_RESPONSE_UUID)   
	    })
	    .then(chara_write => {
		// ブロック機能の有効化
		// 0x00020103 を送る。
		// Indicate イベントが来れば、いろいろと MESH にお願いができるようになる。
		// 参考
		// 全部ブロック共通の処理
		// https://developer.meshprj.com/hc/ja/articles/8286379681945	                // 00020103という命令のデータ送って，MESHブロック機能を有効化する
		console.log("MESH WRITE", chara_write)

		scratch3MotionSensor.characteristic_write = chara_write;
		scratch3MotionSensor.characteristic_write.writeValue(new Uint8Array([0x00,0x02,0x01,0x03]));
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
            id: 'meshmotionsensor',
            name: 'MESH_MOTION_SENSER',
            blocks: [
                
                {
                    opcode: 'getMotion',
                    blockType: BlockType.BOOLEAN,
                    text: '人の動きを感知',
                }

		
            ],
            menus: {
            }
        };
    }





    getMotion(){
		let motion = 0;
		motion = sleep(2000).then(() =>{
		this.request_motion_sensor();
		return scratch3MotionSensor.motion
		});
		return scratch3MotionSensor.motion == 0X01;
    }
			

    

    on_receive(event) { 	
	this.motionEvent = event.target.value;
	this.motionEvent = new Uint8Array(this.motionEvent.buffer);
	if(this.motionEvent[0]== 0x01 && this.motionEvent[1] == 0x00){
		scratch3MotionSensor.motion = this.motionEvent[3]
		
	}
	console.log('receive:',scratch3MotionSensor.motion)

    } 
    






    request_motion_sensor()
	{
	scratch3MotionSensor.characteristic_write.writeValue(new Uint8Array([
	    0x01, //各ブロックの機能を設定する（固定値）
		0x00,//イベントタイプID（固定値）
		0x01,//リクエストID　任意のID
		0x10,//通知モード（現在の検知状態を1回通知）
		0xE8,//検知時の保持時間(LSB)
		0x03,//検知時の保持時間(MSB)
		0xE8,//応答時の検知判断時間(LSB)
		0x03,//応答時の検知判断時間(MSB)
		0xE8 //チェックサム
	]));
	console.log('request:',scratch3MotionSensor.motion)
    } 
}

module.exports = scratch3MotionSensor;

