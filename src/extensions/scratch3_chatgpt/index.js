const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const axios = require('axios');
const api_url = require('../../util/original-util/env');

const SERVER_HOST = api_url.GPT_URL;

class Scratch3ChatGpt {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'chatgpt',
            name: 'Chat Gpt',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },
                {
                    opcode: 'return_gpt',
                    blockType: BlockType.REPORTER,
                    // blockType: BlockType.COMMAND,
                    text: 'ASK_GPT[MESSGAGE][PROMPT][LANG]',
                    arguments: {
                        MESSGAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: '自己紹介をしてください'
                        },
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'あなたはVOICEVOXの「ずんだもん」です。返答の語尾に「なのだ」をついけてください'
                        },
                        LANG: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ja'
                        }
                    }
                },
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }
    async ask_gpt(data){
        // const data = {
        //       content: Cast.toString(args.MESSGAGE),
        //       prompt: Cast.toString(args.PROMPT),
        //       lang: Cast.toString(args.LANG)
        // };
        // content = Cast.toString(args.toString(args.MESSAGE))
        // prompt = Cast.toString(args.toString(args.PROMPT))

        // const data = {
        //     content: "今日は12月8日です。何の日ですか?",
        //     prompt: "あなたは賢い",
        //     lang: 'ea'
        // };
        // const response =  await axios.post('http://localhost:8000/gpt_ask', data, {
        const response =  await axios.post('${SERVER_HOST}/gpt_ask', data, {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
            }
        });
        return response.data;
        // log.log(response)
        // return data
//        .then(response => {
//             // console.log(response.data);
//             return response.data;
        // })
        // .catch(error => {
        //     log.error(error);
        // });
    }
    async return_gpt(args){
        const data = {
              content: Cast.toString(args.MESSGAGE),
              prompt: Cast.toString(args.PROMPT),
              lang: Cast.toString(args.LANG)
        };
        const json = await this.ask_gpt(data)
        // return json.content
        log.log(json)
        return json.response
    }
}

module.exports = Scratch3ChatGpt;
