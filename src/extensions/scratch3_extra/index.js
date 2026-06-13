/*
util.stackFrame.timer = new Timer();
util.stackFrame.timer.start();
util.stackFrame.duration = duration;
util.yield();
*/



const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const Timer = require('../../util/timer');
let readtextresult = "";
let readresultedbool = false;
var blockIconURI = "data:image/png;base64,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";
let msg = new SpeechSynthesisUtterance();
var connectedToHelper = false;
var wsData = {};
var extaudio = null
function reconnectHelper() {
	window.extensionHelper = new WebSocket("ws://localhost:4857");
	connectedToHelper = false;
	window.extensionHelper.addEventListener("close",() => {
		reconnectHelper();
	})
	window.extensionHelper.addEventListener("open",() => {
		connectedToHelper = true;
	})
	window.extensionHelper.addEventListener("message",(event) => {
		var json = JSON.parse(event.data);
		if (json.cmd == "updateData") {
			wsData = json;
		}
		if (json.cmd == "dataAudio") {
			var audio = new Audio(json.data.value);
			audio.play();
		}
	})
}
reconnectHelper();
class extra {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'extra',
            name: 'Extra',
			blockIconURI: blockIconURI,
            blocks: [
				{
                    opcode: 'logIntoConsole',
                    blockType: BlockType.COMMAND,
                    text: 'Log Into Helper Console [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello World!"
                        }
                    }
                },
				{
                    opcode: 'moveMouse',
                    blockType: BlockType.COMMAND,
                    text: 'Move Mouse To x:[X] y:[Y]',
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
				{
                    opcode: 'setMouseState',
                    blockType: BlockType.COMMAND,
                    text: 'Set Mouse State [ms]',
                    arguments: {
						ms: {
							menu:"mouseState"
						}
                    }
                },
				/*{
                    opcode: 'audioPlay',
                    blockType: BlockType.COMMAND,
                    text: 'Play Audio File [file]',
                    arguments: {
                        file: {
                            type: ArgumentType.STRING,
                            defaultValue: "file.mp3"
                        }
                    }
                },
				{
                    opcode: 'audioStop',
                    blockType: BlockType.COMMAND,
                    text: 'Stop Audio File',
                    arguments: {
						
                    }
                },*/
				/*{
                    opcode: 'dialog',
                    blockType: BlockType.COMMAND,
                    text: 'Do Dialog title:[title] message:[message]',
                    arguments: {
						title: {
                            type: ArgumentType.STRING,
                            defaultValue: "Windows Dialog"
						},
						message: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello World!"
						}
                    }
                },*/
				{
                    opcode: 'mouseWinX',
                    blockType: BlockType.REPORTER,
                    text: 'PC Mouse X',
                    arguments: {
                    }
                },
				{
                    opcode: 'mouseWinY',
                    blockType: BlockType.REPORTER,
                    text: 'PC Mouse Y',
                    arguments: {
                    }
                }
                /*{
                    opcode: 'speak',
                    blockType: BlockType.COMMAND,
                    text: 'Speak [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "Hello World!"
                        }
                    }
                }*/
            ],
            menus: {
				mouseState: {
					items: [
					{
						text:"Down",
						value:"down"
					},
					{
						text:"Up",
						value:"up"
					}
					]
				}
            }
        };
    }
	logIntoConsole (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		var text = Cast.toString(props.TEXT);
		extensionHelper.send(JSON.stringify({
			command:"logConsole",
			options:{
				text:text
			}
		}))
		}catch(e){}
	}
	moveMouse (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		var x = Number(Cast.toString(props.X));
		var y = Number(Cast.toString(props.Y));
		extensionHelper.send(JSON.stringify({
			command:"mouseMove",
			options:{
				x:x,
				y:y
			}
		}))
		}catch(e){}
	}
	mouseWinX (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		return wsData.mouse.x;
		}catch(e){return "0";}
	}
	mouseWinY (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		return wsData.mouse.y;
		}catch(e){return "0";}
	}
	setMouseState (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		extensionHelper.send(JSON.stringify({
			command:"mouseToggle",
			options:{
				down:Cast.toString(props.ms)
			}
		}))
		}catch(e){return "0";}
	}
	dialog (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		extensionHelper.send(JSON.stringify({
			command:"dialog",
			options:{
				text:Cast.toString(props.message),
				title:Cast.toString(props.title)
			}
		}))
		}catch(e){return "0";}
	}
	audioPlay (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		extensionHelper.send(JSON.stringify({
			command:"playSound",
			options:{
				file:Cast.toString(props.file)
			}
		}))
		}catch(e){return "0";}
	}
	audioStop (props,util) {
		try{
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = 0.1;
		extensionHelper.send(JSON.stringify({
			command:"stopSound",
			options:{
				
			}
		}))
		}catch(e){return "0";}
	}
}

module.exports = extra;