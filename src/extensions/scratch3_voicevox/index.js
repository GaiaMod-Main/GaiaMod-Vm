const formatMessage = require('format-message');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const fetchWithTimeout = require('../../util/fetch-with-timeout');
const Clone = require('../../util/clone');

const axios = require('axios');
const { arrayBufferToBase64, base64ToUint8Array } = require('../../util/base64-util');
const Base64Util = require('../../util/base64-util');
const Base64toArrayBuffer = require('../../util/original-util/base64-2-bufarray');
const { buffer } = require('js-md5');
const api_url = require('../../util/original-util/env');


const SERVER_HOST = api_url.VOICE_VOX_URL;
const SERVER_TIMEOUT = 10000; // 10 seconds
const SPEECH_VOLUME = 20
const ALTO_ID = 'ALTO';


class Scratch3VoiceVox {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * Map of soundPlayers by sound id.
         * @type {Map<string, SoundPlayer>}
         */
        this._soundPlayers = new Map();

        this._stopAllSpeech = this._stopAllSpeech.bind(this);
        if (this.runtime) {
            this.runtime.on('PROJECT_STOP_ALL', this._stopAllSpeech);
        }
    }

    get VOICE_INFO () {
        return {
            [ALTO_ID]: {
                name: formatMessage({
                    id: 'voicevox.zundamon',
                    default: 'ずんだもん',
                    description: 'Name for a voice with ambiguous gender.'
                }),
                gender: 'female',
                playbackRate: 1
            },
        };
    }

    getInfo () {
        return {
            id: 'voicevox',
            name: 'VoiceVox',
            blocks: [
                {
                    opcode: 'speak_character',
                    blockType: BlockType.COMMAND,
                    text: 'Speak[TEXT][SPEAKER][STYLE]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ずんだもんなのだ'
                        },
                        SPEAKER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        STYLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                    }
                },
//                {
//                    opcode: 'setVoice',
//                    text: formatMessage({
//                        id: 'text2speech.setVoiceBlock',
//                        default: 'set voice to [VOICE]',
//                        description: 'Set the voice for speech synthesis.'
//                    }),
//                    blockType: BlockType.COMMAND,
//                    arguments: {
//                        VOICE: {
//                            type: ArgumentType.STRING,
//                            menu: 'voices',
//                            defaultValue: ALTO_ID
//                        }
//                    }
//                },
                {
                    opcode: 'voice_data',
                    blockType: BlockType.REPORTER,
                    text: 'Voiceデータ[TEXT][SPEAKER][STYLE]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ずんだもんなのだ'
                        },
                        SPEAKER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        STYLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                    }
                },
                {
                    opcode: 'play_voice',
                    blockType: BlockType.COMMAND,
                    text: '音声データの再生[SOURCE]',
                    arguments: {
                        SOURCE: {
                            type: ArgumentType.STRING,
                            defaultValue: '音声データ'
                        },
                    }
                },
            ],
            menus: {
                voices: {
                    acceptReporters: true,
                    items: this.getVoiceMenu()
                },
            }
        };
    }
    _stopAllSpeech () {
        this._soundPlayers.forEach(player => {
            player.stop();
        });
    }

    static get DEFAULT_VOICEVOX_STATE () {
        return {
            voiceId: ALTO_ID
        };
    }

    static get STATE_KEY () {
        return 'Scratch.voicevox';
    }
    async voice_data(args){
        const speak_text = Cast.toString(args.TEXT)
        const speaker = Cast.toNumber(args.SPEAKER)
        const style = Cast.toNumber(args.STYLE)
        const voice_array = await this.GetVoice(speak_text, style, speaker)
        const voice_data_base64 = arrayBufferToBase64(voice_array)
        // console.log(voice_data_base64)
        const data_list = {
            data: voice_data_base64,
            type: "music"
        }
        return data_list
        // return voice_array
    }

    _getState (target) {
        let state = target.getCustomState(Scratch3VoiceVox.STATE_KEY);
        if (!state) {
            state = Clone.simple(Scratch3VoiceVox.DEFAULT_VOICEVOX_STATE);
            target.setCustomState(Scratch3VoiceVox.STATE_KEY, state);
        }
        console.log(state)
        return state;
    }

    setVoice (args, util) {
        const state = this._getState(util.target);

        let voice = args.VOICE;

        // If the arg is a dropped number, treat it as a voice index
        let voiceNum = parseInt(voice, 10);
        if (!isNaN(voiceNum)) {
            voiceNum -= 1; // Treat dropped args as one-indexed
            voiceNum = MathUtil.wrapClamp(voiceNum, 0, Object.keys(this.VOICE_INFO).length - 1);
            voice = Object.keys(this.VOICE_INFO)[voiceNum];
        }

        // Only set the voice if the arg is a valid voice id.
        if (Object.keys(this.VOICE_INFO).includes(voice)) {
            state.voiceId = voice;
        }
    }

    getVoiceMenu () {
        return Object.keys(this.VOICE_INFO).map(voiceId => ({
            text: this.VOICE_INFO[voiceId].name,
            value: voiceId
        }));
    }

    /*
     * Get voice data from SERVER_HOST
     * return data is ArrayBuffer
     */
    async GetVoice(text, style_id, speaker) {
        const rpc = axios.create({ baseURL: SERVER_HOST , proxy: false });

        const audio_query = await rpc.post('audio_query?text=' + encodeURI(text) + '&speaker=' + speaker);

        const synthesis = await rpc.post("synthesis?style_id="+ style_id, JSON.stringify(audio_query.data), {
            responseType: 'arraybuffer',
            headers: {
                "accept": "audio/wav",
                "Content-Type": "application/json"
            }
        });
        // return arraybuffer
        const data = synthesis.data
        // console.log(data)
        return data
    }

    /*
     * Play sound data(data-type:arraybuffer)
     */
    async _play_voice(buffer){
        /*
         *@type(buffer): ArrayBuffer
         */
        const sound = {
            data: {
                buffer
            }
        }

        // Create audio engine client
        soundPlayer = await this.runtime.audioEngine.decodeSoundPlayer(sound);
        // set colume
        const engine = this.runtime.audioEngine;
        const chain = engine.createEffectChain();
        chain.set('volume', SPEECH_VOLUME);
        soundPlayer.connect(chain);

        // play sound
        soundPlayer.play();

        // Waite end of audio
        return new Promise(resolve => {
            soundPlayer.on('stop', () => {
                resolve();
            });
        });
    }


    /*
     * Get & Play sound data(data-type:arraybuffer)
     */
    async speak_character(args){
        const speak_text = Cast.toString(args.TEXT)
        const speaker = Cast.toNumber(args.SPEAKER)
        const style = Cast.toNumber(args.STYLE)

        // Get vice data
        const buffer = await this.GetVoice(speak_text, style, speaker)
        // play voice
        await this._play_voice(buffer)
    }

    /*
     * Play sound data(data-type:base64)
     */
    async play_voice(args){
        // console.log(args.SOURCE)
        // const base64_binary = Cast.toString(args.SOURCE)
        const data_list =  args.SOURCE
        if(data_list.type === "music"){
            const base64_binary = data_list.data

            // convert base64 to arraybuffer
            const Base2array = new Base64toArrayBuffer // const buffer = array_buffer
            const buffer = Base2array.Convertbase64(base64_binary)
            await this._play_voice(buffer)
        }
        else{
            return "音声データを引数にしてください"
        }
    }



}
module.exports = Scratch3VoiceVox;
