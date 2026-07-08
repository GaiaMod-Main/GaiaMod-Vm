const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const axios = require('axios');
const api_url = require('../../util/original-util/env');
const Timer = require('../../util/timer');

var test_message = null

class Scratch3Line {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'line',
            name: 'Line',
            blocks: [
                {
                    opcode: 'send_line_message',
                    blockType: BlockType.COMMAND,
                    text: 'メッセージ送信[MESSGAGE][USERID]',
                    arguments: {
                        MESSGAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'これはテストメッセージ'
                        },
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'USERID'
                        }
                    }
                },
                {
                    opcode: 'send_audio_message',
                    blockType: BlockType.COMMAND,
                    text: '音声の送信[AUDIO_URL][TIME][USERID]',
                    arguments: {
                        AUDIO_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://ahahahaha.blob.core.windows.net/line-png-test/hare.mp3'
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1900
                        },
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'USERID'
                        }
                    }
                },
                {
                    opcode: 'send_image_message',
                    blockType: BlockType.COMMAND,
                    text: '画像の送信[IMAGE_URL][PRE_IMAGE_URL][USERID]',
                    arguments: {
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'USERID'
                        },
                        IMAGE_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://ahahahaha.blob.core.windows.net/line-png-test/zennketugou2.png'
                        },
                        PRE_IMAGE_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://ahahahaha.blob.core.windows.net/line-png-test/zennketugou2.png'
                        },
                    }
                },
                {
                    opcode: 'send_video_message',
                    blockType: BlockType.COMMAND,
                    text: '動画の送信[VIDEO_URL][PRE_VIDEO_URL][USERID]',
                    arguments: {
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'USERID'
                        },
                        VIDEO_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://ahahahaha.blob.core.windows.net/line-png-test/scratch-test.mp4'
                        },
                        PRE_VIDEO_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://ahahahaha.blob.core.windows.net/line-png-test/scratch-test.jpg'
                        }
                    }
                },
                {
                    opcode: 'get_message',
                    blockType: BlockType.BOOLEAN,
                    text: 'GetMessage[USERID]',
                    arguments: {
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'メッセージを受け取りたいユーザーのidを入力してください'
                        },
                        MESSAGE:{
                            type: ArgumentType.STRING,
                        }
                    }
                },
                {
                    opcode: 'get_wait_message',
                    blockType: BlockType.COMMAND,
                    text: 'メッセージを待つ[USERID]',
                    arguments: {
                        USERID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'メッセージを受け取りたいユーザーのidを入力してください'
                        },
                        MESSAGE:{
                            type: ArgumentType.STRING,
                        }
                    }
                },
                {
                    opcode: 'message_index',
                    blockType: BlockType.REPORTER,
                    text: 'Message',
                },
            ],
            menus: {
            }
        };
    }

    send_line_message(args){
        const message = {
            message: Cast.toString(args.MESSGAGE),
            user_id: Cast.toString(args.USERID)
        };
        axios.post(api_url.BASE_API_URL + '/line/text', message)
            .then(response => {
                log.log(response);
            });
    }

    send_audio_message(args){
        const message = {
              "user_id": Cast.toString(args.USERID),
              "audio_url": Cast.toString(args.AUDIO_URL),
              "duration": 1900
        };
        axios.post(api_url.BASE_API_URL + '/line/audio', message)
            .then(response => {
                log.log(response);
            });
    }

    send_image_message(args){
        const message = {
              "user_id": Cast.toString(args.USERID),
              "image_url": Cast.toString(args.IMAGE_URL),
              "preview_image_url": Cast.toString(args.PRE_IMAGE_URL)
        };
        axios.post(api_url.BASE_API_URL + '/line/image', message)
            .then(response => {
                log.log(response);
            });
    }

    send_video_message(args){
        const message = {
              "user_id": Cast.toString(args.USERID),
              "video_url": Cast.toString(args.VIDEO_URL) ,
              "preview_video_url": Cast.toString(args.PRE_VIDEO_URL)
        };
        axios.post(api_url.BASE_API_URL + '/line/video', message)
            .then(response => {
                log.log(response);
            });
    }

    // Get Api response

    async get_json(api_url){
        const json = await axios.get(api_url);
        // var test = JSON.stringify(json.data)
        // log.log(typeof test)
        // log.log(test.setup)
        return json.data;
    }




    message_index(){
        return test_message
    }

    async get_wait_message(args) {
        const message = await this.get_message_post(Cast.toString(args.USERID))
        // log.log(message.message)
        if (message.length === 0) {
            await this.get_wait_message(args)
        }
        else {
            for (let i = 0; i < message.length; i++){
                test_message = message[i].message
            }
        }
    }
    async get_message(args) {
        const message = await this.get_message_post(Cast.toString(args.USERID))
        // log.log(message.message)
        if (message.length === 0) {
            return 0
        }
        else {
            for (let i = 0; i < message.length; i++){
                test_message = message[i].message
            }
            return 1
        }
    }
    async get_message_post(user_id) {
    try {
        const data = {
            user_id: user_id
        };
        // const response = await axios.post('https://4a82-133-106-35-39.ngrok-free.app/line-db/get', data, {
        const response = await axios.post(api_url.DB_API_URL + '/line-db/get', data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        return response.data
    } catch (error) {
        console.error("Error in get_message_post:", error);
        // エラーのハンドリングを追加する（例: デフォルトのエラーメッセージを返すなど）
        throw error;
        }
    }



}
module.exports = Scratch3Line;
