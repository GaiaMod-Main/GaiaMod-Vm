const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const { io } = require("socket.io-client");

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,UklGRowDAABXRUJQVlA4TIADAAAvUcAJED/mqJEkR4qaPfM6/lxt0nDURpIkOWu+s/whLoa5KgN2ZNttG10AT0ySnP3nIuz++3ALOQMgDZrvBDsNyL/z4cWLb++D5jUPrO7kWl+/80YONTK6NC63KHp+NJGoaA6iY03Ob5Ho5/eZbjttR81knmgAOAsAMJOzAht/ALiCIURHIGIIwxAiYQgJgNEhhJA6wPwDsOBQnILLrm4MCPGs4BQJ+qOBX4EigUZRx1ASk8AvFVc0Ms2HABSReExndUrE+VEBrJaNAxMHbow4EhUiPWlmnuGfwT7MuuPu2/s5KLkQcYgh3TQrR5PDsg0cmGo6rLG/BhKmSY2kHPt21qnG7ePK3L6Vv3I7nxtBorVthhzVeGLbySgV27aTRpzOGtF6s7Zt27btva8+9VdqqvsCIvrPwG0jRe4x89wbEDX2+CMzje0ixvJI4YYPt/2Q5rF8WNYtYEr6cpd/8tdWwI8qMIU64eI3Hw3ZVw5JmCFSz1ajZv5UCpgx/ZORGnE2YfZIdcGaeNokYW+amhQo9TyZVf9Vv8FB7DKonoGDOEyyVWNahOycvLzuQZHanDMB8ZhMQbrqNSZz3qg6jsmcJp/WWZmit3Tv/RiPJ+7rjhsybYUtgbw9yKAsUfLdikBM7xdQFhiN48xnAi6UtSkUUXNrRT+cdMGHr4/wsmaeNKA54rstA75iX/iQ2i49RAj5lmGSvJnhXfeZhZftmoGHeYciiHuVfBNYwvS832kF5v/z1oGWsx8d6H/SE9VBGfQ/I6a8FUkZj70VFmJEEacaMq+qrmFSuZWNuR6TWe0t04vtFZ1gkQawr32IMRuBWn8vvRFpq+WQshNZvQPagjhuSCR1u1glwicwhSNMyr/Fyo1B0nQoiv9I+y9WCfxG9L1II9jQflZrgWIfjmYwmQkfxkpfBKxDHL2Fb/9LNu9F0sBznmLBDFzjYPF3ESaN/+eG61eU65f+A/xDGNxlmIvfmkz4pX+EuLJUSbDZGU4Xur4Xk6Qpf84V88cAhjPL7/tQvp+viilVOC8acRYwLWCYgYn9CRG3bv18vnsprapLZ8IcRJ4DzbcdDscx4HKow+E4Ae+zw+HrzZ8HTbdCJg9ewzFFUbpg5VbUdALZikLUhHuLJayjXCFmRi7UH/S0WtAdZJsekPQGBfwoE/QGIevR68OiziD0/+6ec+MdotauAA==';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA2GVYSWZNTQAqAAAACAAGARIAAwAAAAEAAQAAARoABQAAAAEAAABWARsABQAAAAEAAABeATEAAgAAAB8AAABmATIAAgAAABQAAACGh2kABAAAAAEAAACaAAAAAAAAADIAAAABAAAAMgAAAAFBZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cykAADIwMjE6MTI6MDIgMDg6NTg6MDAAAAOQBAACAAAAFAAAAMSgAgAEAAAAAQAAACGgAwAEAAAAAQAAACEAAAAAMjAyMToxMjowMiAwODo1NDoyMgDxaK2XAAAACXBIWXMAAAexAAAHsQEGxWGGAAALiWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj41MzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41MzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCAyMi4zIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMS0xMi0wMlQwODo1NDoyMiswNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo1YThiNjZjNC0zYTUxLWU3NGUtYWJmOC1lNTZmNDZlYzRmMDQ8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCAyMi4zIChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAyMS0xMi0wMlQwODo1NjoxMiswNzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpjYTYzMTAyMC02ZGY3LTg5NGItYTY1Mi1iM2ZjN2I4MjU5ZmE8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjEtMTItMDJUMDg6NTgrMDc6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MTBhYTBjZDgtNDFhNS0wMTRmLWFjY2UtYTk5MjY3NmRiYTE5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjVhOGI2NmM0LTNhNTEtZTc0ZS1hYmY4LWU1NmY0NmVjNGYwNDwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjVhOGI2NmM0LTNhNTEtZTc0ZS1hYmY4LWU1NmY0NmVjNGYwNDwv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';

/**
 * The url of the Olli User Management server.
 * @type {string}
 */
const STAGING_HOSTNAME = 'staging.scratch.iviet.com'
const PRODUCTION_HOSTNAME = 'scratch.iviet.com'
const serverURL = 'https://staging.users.iviet.com';
if (window.location.hostname == PRODUCTION_HOSTNAME){
	serverURL = 'https://users.iviet.com'
} else if (window.location.hostname == STAGING_HOSTNAME){
	serverURL = 'https://staging.users.iviet.com'
} else {
	serverURL = 'https://users-dev.jenkins-x-viettel.iviet.com'
}


/**
 * OLLI websocket server
 *
 */
const URL = "https://websocket-jx-staging.jenkins-x-viettel.iviet.com:443";
const socket = io(URL, { autoConnect: false });
let utterance = '';
socket.on('utterances', (data)=>{
    console.log(data)
    utterance = data['payload']['utterance']
})
/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

/**
 * Class for the translate block in Scratch 3.0.
 * @constructor
 */
class MaikaControllerBlocks {
    constructor (runtime) {
        this.runtime = runtime;
        this.token = '';
        this.startTime = null;
    }

    /**
     * The key to load & store a target's translate state.
     * @return {string} The key.
     */
    static get STATE_KEY () {
        return 'Scratch.maika';
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'maika',
            name: formatMessage({
                id: 'maika.categoryName',
                default: 'Control Maika',
                description: 'Name of extension that adds Maika blocks'
            }),
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                {
                    opcode: 'sendMessage',
                    text: formatMessage({
                        id: 'maika.sendMessage',
                        default: 'yêu cầu loa [CALLING_NAME]: [UTTERANCE]',
                        description: 'Yêu cầu maika thực hiện một lệnh gì đó'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        UTTERANCE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'maika.defaultCommand',
                                default: 'mở nhạc',
                                description: 'mở nhạc: yêu cầu mặc định'
                            })
                        },
                        CALLING_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Maika"
                        }
                    }
                },
                {
                    opcode: 'login',
                    text: formatMessage({
                        id: 'maika.login',
                        default: 'email [EMAIL] hoặc số điện thoại [PHONE_NUMBER], mật khẩu: [PASSWORD]',
                        description: 'Đăng nhập vào tài khoản Maika'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        EMAIL: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'maika.email',
                                default: 'example@gmail.com',
                                description: 'Email'
                            })
                        },
                        PHONE_NUMBER: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'maika.phoneNumber',
                                default: '+84...',
                                description: 'Số điện thoại'
                            })
                        },
                        PASSWORD: {
                            type: ArgumentType.STRING,
                            defaultValue: "mật khẩu"
                        }
                    }
                },
                {
                    opcode: 'textToSpeak',
                    text: formatMessage({
                        id: 'maika.textToSpeak',
                        default: 'yêu cầu loa [CALLING_NAME] nói: [TEXT]',
                        description: 'Yêu cầu maika nói'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'maika.defaultTextToSpeak',
                                default: 'xin chào'
                            })
                        },
                        CALLING_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Maika"
                        }
                    }
                },
                {
                    opcode: 'getUserUtterance',
                    text: formatMessage({
                        id: 'maika.getUtterance',
                        default: 'câu nói đã nhận dạng',
                        description: 'last detected utterance'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                {
                    opcode: 'turnOnEchoMode',
                    text: formatMessage({
                        id: 'maika.turnOnEchoMode',
                        default: 'bật chế độ lấy kết quả nhận dạng giọng nói cho loa [CALLING_NAME]',
                        description: 'bật chế độ lấy kết quả nhận dạng giọng nói'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CALLING_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Maika"
                        }
                    }
                },
                {
                    opcode: 'turnOffEchoMode',
                    text: formatMessage({
                        id: 'maika.turnOffEchoMode',
                        default: 'tắt chế độ lấy kết quả nhận dạng giọng nói [CALLING_NAME]',
                        description: 'tắt chế độ lấy kết quả nhận dạng giọng nói'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CALLING_NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "Maika"
                        }
                    }
                },
            ],
        };
    }
    sendMessage(args){
        if (this.startTime && (window.performance.now() - this.startTime)  < 1000){
            console.log('Cannot request more than one time per second')
            this.startTime = window.performance.now()
        } else {
            this.startTime = window.performance.now()
            fetch(serverURL + '/v1/user-device/control', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.token,
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({calling_name: args.CALLING_NAME, utterance: args.UTTERANCE}) // body data type must match "Content-Type" header
              }).then(response => {
                  return response.json().message
              });
        }
    }
    login(args){
        var endpoint = args.EMAIL ? '/v1/auth/login': '/v1/auth/otp/login';
        fetch(serverURL + endpoint, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
              'Content-Type': 'application/json',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: JSON.stringify({email: args.EMAIL, phone_number: args.PHONE_NUMBER, password: args.PASSWORD})
        }).then(response => { response.json().then(data => {
            this.token = data.data.access_token;
            socket.auth = {userId: data.data.id, token: this.token, email: args.EMAIL, phoneNumber: args.PHONE_NUMBER };
            console.log(socket.auth);
            socket.connect();
        })});
    }
    textToSpeak(args){
        if (this.startTime && (window.performance.now() - this.startTime)  < 1000){
            console.log('Cannot request more than one time per second')
            this.startTime = window.performance.now()
        } else {
            this.startTime = window.performance.now()
            fetch(serverURL + '/v1/user-device/control', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.token,
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({calling_name: args.CALLING_NAME, utterance: 'repeat after me ' + args.TEXT}) // body data type must match "Content-Type" header
              }).then(response => {
                  return response.json().message
              });
        }
    }
    getUserUtterance(args){
        return utterance;
    }
    turnOnEchoMode(args){
        if (this.startTime && (window.performance.now() - this.startTime)  < 1000){
            console.log('Cannot request more than one time per second')
            this.startTime = window.performance.now()
        } else {
            this.startTime = window.performance.now()
            fetch(serverURL + '/v1/user-device/control', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.token,
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({calling_name: args.CALLING_NAME, utterance: 'turn on echo mode'}) // body data type must match "Content-Type" header
              }).then(response => {
                  return response.json().message
              });
        }
    }
    turnOffEchoMode(args){
        if (this.startTime && (window.performance.now() - this.startTime)  < 1000){
            console.log('Cannot request more than one time per second')
            this.startTime = window.performance.now()
        } else {
            this.startTime = window.performance.now()
            fetch(serverURL + '/v1/user-device/control', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + this.token,
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({calling_name: args.CALLING_NAME, utterance: 'stop'}) // body data type must match "Content-Type" header
              }).then(response => {
                  return response.json().message
              });
        }
    }
}

module.exports = MaikaControllerBlocks;
