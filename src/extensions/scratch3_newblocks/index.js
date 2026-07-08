const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const axios = require('axios');

var http = require('http')
var test_message = null

class Scratch3NewBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'newblocks',
            name: 'TEST Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "log"
                        }
                    }
                },
                {
                    opcode: 'post_test',
                    blockType: BlockType.COMMAND,
                    text: 'post [NAME][DESCRIPTION][PRICE][TAX]',
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "TEST"
                        },
                        DESCRIPTION: {
                            type: ArgumentType.STRING,
                            defaultValue: "post test"
                        },
                        PRICE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 45.34
                        },
                        TAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 4
                        }
                    }
                },
                {
                    opcode: 'send_joke',
                    blockType: BlockType.REPORTER,
                    text: 'JOKE',
                },
                {
                    opcode: 'getBrowser',
                    text: 'browser',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'testAsync',
                    text: 'Async/Await tester',
                    blockType: BlockType.COMMAND
                },
            ],
            menus: {
            }
        };
    }

    myFirstPromise(message) {
        console.log('一秒遅延しています...');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(message);
            }, 1000);
        })
    }

    //👇クラス内にasyncメンバ関数を定義
    async myFirstAsync() {
        const result = await this.myFirstPromise('はじめてのAsync/Awaitへようこそ！');
        return result;
    }

    testAsync () {
        //👇スクラッチブロックからでもasync関数が呼び出せるようになる
        this.myFirstAsync().then(result => {
            console.log(result);
        });
    }
    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }
    send_line_message(args){
        const message = {
            message: Cast.toString(args.MESSGAGE),
            user_id: Cast.toString(args.USERID)
        };
        axios.post(' https://jaguar-curious-conversely.ngrok-free.app/send_line/', message)
            .then(response => {
                log.log(response);
            });
    }


    async get_json(api_url){
        const json = await axios.get(api_url);
        // var test = JSON.stringify(json.data)
        // log.log(typeof test)
        // log.log(test.setup)
        return json.data;
    }

    post_test(args){
        const data = {
              name: Cast.toString(args.NAME),
              description: Cast.toString(args.DESCRIPTION),
              price: Cast.toNumber(args.PRICE),
              tax: Cast.toNumber(args.TAX)
        };
        axios.post('http://127.0.0.1:8000/items/', data)
            .then(response => {
                log.log(response);
            });
    }

    getBrowser () {
        return navigator.userAgent;
    }
    // Get Api response

    async get_json(api_url){
        const json = await axios.get(api_url);
        // var test = JSON.stringify(json.data)
        // log.log(typeof test)
        // log.log(test.setup)
        return json.data;
    }

    async send_joke () {
        const result = await this.get_json('https://official-joke-api.appspot.com/jokes/random');
        // log.log(result)
        return result.setup + "\n" + result.punchline;
    }


    async send_line_notify (args) {
        const text = Cast.toString(args.TEXT);
        const result = await this.get_json(`http://127.0.0.1:8000/items/${text}`);
        return result.item_id;
    }




}
module.exports = Scratch3NewBlocks;
