/*
I want to let you know,
that Gvbvdxx created this extension.

Gvbvdxx did not make JSNes though, because I dont want to
spend time making a JavaScript NES emulator from scratch.

This took a bunch of hours to make. (and a lot of debugging)

So please give credit if you want to use this extension in
your own scratch mod.

By the way, the code for this is pretty large, wich means
that it will take a while to compile.
 */

//I know, this is an insanly large extension.
//But, somebody sugguested it and now I know how to code more
//for scratch.
// funny enough Gvbvdxx suggseted this to be added to Snail IDE
//Scratch stuff.

var ArgumentType = require('../../extension-support/argument-type');
var BlockType = require('../../extension-support/block-type');
var Cast = require('../../util/cast');

//Not sure if there is a better way to get the icon url.
var blockIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwLDAsMTgwLDE4MCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1MCwtOTApIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTE1MCwyNTEuN2MwLC0zNS40NzYzOSAwLC0xMTIuMTI5NSAwLC0xMzVjMCwtMTQuNjczMDQgNy4zMjY5NiwtMjYuNyAyMiwtMjYuN2MyMS40MDQxNywwIDk5LjE0NDY0LDAgMTM3LDBjMTEuODk0MTYsMCAyMSw1LjgwNTgzIDIxLDE3LjdjMCwyMC44MTU2MyAwLDEwNi44MzQ0NiAwLDE0NC41YzAsMTAuODQyNzcgLTYuNjU3MjMsMTcuOCAtMTcuNSwxNy44Yy0yMC4xODIzMSwwIC0xMDIuMzEyNTEsMCAtMTQxLjUsMGMtMTkuMjg1NjUsMCAtMjEsLTE4LjMgLTIxLC0xOC4zeiIgZmlsbD0iI2U4MDAwMCIgc3Ryb2tlLXdpZHRoPSJOYU4iLz48ZyBzdHJva2Utd2lkdGg9IjAiPjxwYXRoIGQ9Ik0xNTYuMDg2MDIsMjExLjY2ODgxdi0xOC40OTg2MWgxNjcuODI3OTZ2MTguNDk4NjF6IiBmaWxsPSIjYzZjZWNkIi8+PHBhdGggZD0iTTE1Ni4wODYwMiwxOTMuNDM4M2wxNS4wMTMzNiwtNjEuOTMwMTNsMTM3LjUzMzE0LC0wLjI2ODFsMTUuMjgxNDYsNjIuMTk4MjJ6IiBmaWxsPSIjZGNlMmUxIi8+PHBhdGggZD0iTTE2Ni40MDMzMSwyMjguMzk3MmwtMTAuMzE3MjksLTE4LjEzNTg5bDE2Ny44Mjc5NiwwLjM2MjcybC0xMi43MjQ2NiwxOC4xMzU4OXoiIGZpbGw9IiM0YTRiNDUiLz48cGF0aCBkPSJNMTg1Ljg0NDY1LDIyMC4zMDgydi0yLjQ4NTcyaDEzLjQwNDc5djIuNDg1NzJ6IiBmaWxsPSIjMTkxOTE5Ii8+PHBhdGggZD0iTTIwNS40MTU2NCwyMjAuMzA4MnYtMi40ODU3aDEzLjQwNDc5djIuNDg1N3oiIGZpbGw9IiMxOTE5MTkiLz48cGF0aCBkPSJNMjc0Ljg1MjQ1LDE5NC43Nzg3OGwtMS4zNDA0OCwtMTQuMjA5MDhoMjYuODA5NThsMi42ODA5NiwxNC4yMDkwOHoiIGZpbGw9IiMyOTJkMmIiLz48cGF0aCBkPSJNMTc5LjQxMDM1LDE4MS45MTAxOHYtMS42MDg1N2g5NC42Mzc4MXYxLjYwODU3eiIgZmlsbD0iI2M0YzZjNiIvPjxwYXRoIGQ9Ik0yNzIuOTc1NzgsMTc5LjA0ODI2di0yLjk0OTA2aDI2LjAwNTI5djIuOTQ5MDZ6IiBmaWxsPSIjOGM4ZDhkIi8+PHBhdGggZD0iTTI3Mi4xNzE1LDE3NS4wMjY4MnYtMi42ODA5NmgyNi44MDk1OHYyLjY4MDk2eiIgZmlsbD0iIzhjOGQ4ZCIvPjxwYXRoIGQ9Ik0yNzEuMDk5MTEsMTcwLjczNzI5di0yLjY4MDk2aDI2LjgwOTU4djIuNjgwOTZ6IiBmaWxsPSIjOGM4ZDhkIi8+PHBhdGggZD0iTTI3MS4zNjcyMSwxNjYuNzE1ODV2LTIuNjgwOTZoMjYuNTQxNDh2Mi42ODA5NnoiIGZpbGw9IiM4YzhkOGQiLz48cGF0aCBkPSJNMjcxLjA5OTExLDE2Mi40MjYzMnYtMi4xNDQ3N2gyNS4yMDF2Mi4xNDQ3N3oiIGZpbGw9IiM4YzhkOGQiLz48cGF0aCBkPSJNMjcwLjAyNjczLDE1OS4yMDkxN3YtMi42ODA5NmgyNi41NDE0OHYyLjY4MDk2eiIgZmlsbD0iIzhjOGQ4ZCIvPjxwYXRoIGQ9Ik0yNzAuMDI2NzMsMTU0LjkxOTY0di0yLjY4MDk2aDI1LjIwMXYyLjY4MDk2eiIgZmlsbD0iIzhjOGQ4ZCIvPjxwYXRoIGQ9Ik0yNjkuMjIyNDQsMTUwLjYzMDExdi0xLjYwODU3aDI1LjIwMXYxLjYwODU3eiIgZmlsbD0iIzhjOGQ4ZCIvPjxwYXRoIGQ9Ik0yNjguOTU0MzQsMTQ2LjM0MDU3di0xLjM0MDQ4aDI0LjY2NDgxdjEuMzQwNDh6IiBmaWxsPSIjOGM4ZDhkIi8+PHBhdGggZD0iTTI2OC40MTgxNSwxNDMuNjU5NjJsLTEuMzQwNDgsLTEwLjk5MTkzbDIzLjMyNDMzLC0wLjI2ODFsMi42ODA5NiwxMC43MjM4M3oiIGZpbGw9IiM4YzhkOGQiLz48cGF0aCBkPSJNMTc2LjUzNzg5LDE5My41NjY2bDIuODcyNDYsLTEzLjAyMThoMS4wMzQwOWwtMS43MjM0NywxMy4yMTMyOXoiIGZpbGw9IiNjNGM2YzYiLz48cGF0aCBkPSJNMTc2LjQyMjk5LDIwNy4zNTQzOWwwLjE5MTUsLTE0LjE3MDc4bDIuMTA2NDYsLTAuMTkxNWwwLjc2NTk5LDE0LjM2MjI3eiIgZmlsbD0iI2M0YzZjNiIvPjxwYXRoIGQ9Ik0xNzcuMTg4OTksMjA3LjczNzM4di0zLjI1NTQ1aDk2LjUxNDQ4djMuMjU1NDV6IiBmaWxsPSIjYzRjNmM2Ii8+PHBhdGggZD0iTTI3MC44MzEwMSwyMjUuMzQxN2w0LjAyMTQ0LC0zMC41NjI5MmgyOC4xNTAwNmwtNC44MjU3MywzMC41NjI5MnoiIGZpbGw9IiMxYTFhMWEiLz48L2c+PC9nPjwvZz48L3N2Zz4=";

//Load JSNes emulator libary.
var jsnes = require("./jsnes.js");

//Debugging some stuff here.
console.log("Gvbvdxx Nes Extension V1.0");
console.log("jsnes:", jsnes);

//

var constants = require("./constants.js");

var audioRuntime = require("./audio-player.js");
var audio = new audioRuntime(); //Moving this over to when its created, so we can give it the scratch audio engine context.

var emulationPaused = true;
var timerMode = "internalClock";

var screenConverter = require("./screen-converter.js");

//Audio processor code:

var volume = 100;

function processAudio(left, right) {
    var volumeReal = volume / 100;
    audio.processAudioSamples(left * volumeReal, right * volumeReal); //Amplify it by it's volume.
}
//This seems to fix the cannot process audio issue:
processAudio(0, 0);

//Some stuff for the JSNes libary to use.

var updateCanvasEventThing = [];

function getSampleRate() {
    try {
        if (!window.AudioContext) {
            return 44100;
        }
        let myCtx = new window.AudioContext();
        let sampleRate = myCtx.sampleRate;
        myCtx.close();
        return sampleRate;
    } catch (e) {
        window.alert(e);
    }
}

function updateSkins () {
	updateCanvasEventThing.forEach((f) => {
		f();
	});
}

//Easily remake the JSNes libary object using a function.

function makeNESObj () {
	return new jsnes.NES({
		onFrame: function (frameBuffer) {
			screenConverter.convertToCanvas(frameBuffer);
			updateSkins();
		},
		onAudioSample: function (left, right) {
			processAudio(left, right);
		},
		sampleRate: getSampleRate()
	});
}

var nes = makeNESObj();

//Timer code:

function framePassed() {
    if (!emulationPaused) {
        try {
            nes.frame();
        } catch (e) {
            //Do nothing for now.
            //Usally means an error processing the frame.
        }
    } else {
		//Stop playing audio (put left and right audio samples left 0 right 0). This is used when the game emulation is paused.
        processAudio(0, 0);
    }
}
//Got this stuff from stack overflow.
var fps, fpsInterval, startTime, now, then, elapsed;
function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}
function animate() {
    // request another frame

    setTimeout(animate, 1);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        if (timerMode == "internalClock") {
            framePassed();
        }
    }
}
startAnimating(60);
//Has some syncing issues with set interval,
//but still use it if there are any issues with the time based clock.
setInterval(() => {
    if (timerMode == "interval") {
        framePassed();
    }
    if (emulationPaused) {
        processAudio(0, 0);
    }
}, 1000 / 60);

//To load the roms.

var loadedROMData = null;

function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function loadURL(url) {
    var f = await fetch(url);
    var data = await f.arrayBuffer();
	loadedROMData = atob(_arrayBufferToBase64(data));
    nes.loadROM(loadedROMData);
    emulationPaused = false; //start ticking time.
}

//Extension code:

var nesSkin = null;
var nesSkinCons = null;

class NesEmulator {
    constructor(runtime) {
        this.runtime = runtime;

        var BitmapSkin = runtime.renderer.exports.BitmapSkin;
        class NESSkin extends BitmapSkin {
            constructor(id, renderer) {
                super(id, renderer);

                this.videoError = false;

                this.readyPromise = new Promise((resolve) => {
                    resolve();
                });

                this.videoElement = screenConverter.cvs;
                this.videoElement.crossOrigin = "anonymous";

                this.videoDirty = true;
                updateCanvasEventThing.push(() => {
                    this.markVideoDirty();
                    this.reuploadVideo();
                });
                this.reuploadVideo();
                this.emitWasAltered();
            }

            reuploadVideo() {
                this.videoDirty = false;
                this.setBitmap(this.videoElement);
            }

            markVideoDirty() {
                this.videoDirty = true;
                this.emitWasAltered();
            }

            get size() {
                if (this.videoDirty) {
                    this.reuploadVideo();
                }
                return super.size;
            }

            getTexture(scale) {
                if (this.videoDirty) {
                    this.reuploadVideo();
                }
                return super.getTexture(scale);
            }

            dispose() {
                super.dispose();
            }
        }
        var skinId = runtime.renderer._nextSkinId++;
        var skin = new NESSkin(skinId, runtime.renderer);
        runtime.renderer._allSkins[skinId] = skin;
        nesSkin = skin;

        this.classNESSkin = NESSkin;

        runtime.on("PROJECT_STOP_ALL", () => this.resetEverything());
        runtime.on("PROJECT_START", () => this.resetEverything());

        runtime.on("BEFORE_EXECUTE", () => {
            for (const skin of renderer._allSkins) {
                if (skin instanceof NESSkin) {
                    skin.markVideoDirty();
                }
            }
        });

        this.latestError = "";
        var audioEngine = runtime.audioEngine;
        audio.audioCtx = audioEngine.audioContext;
		audio.inputNode = audioEngine.getInputNode();
        setInterval(() => {
            audio.audioCtx = audioEngine.audioContext;
			audio.inputNode = audioEngine.getInputNode();
        }, 1000 / 60)
    }
	
	cleanVars () {
		nes = makeNESObj();
		
		//Basicly reset all values to defaults.
		
		this.latestError = ""; //Remove the latest error.
		
		volume = 100; //100% volume.
		
		timerMode = "internalClock"; //Set the clock back to internal clock.
		
		screenConverter.resetToDefaults(); //Clear the screen.
		
		emulationPaused = true; //Pause the emulation.
		
		updateSkins(); //Since we are changing the screen to black, we need to update the skins to reflect it.
		
		//I dont think making a new audio player object will be easy,
		//so just make the sample data empty.
		processAudio(0, 0);
	}

    resetEverything() {
        emulationPaused = true;
        for (const target of this.runtime.targets) {
            const drawable = this.runtime.renderer._allDrawables[target.drawableID];
            if (drawable.skin instanceof this.classNESSkin) {
                target.setCostume(target.currentCostume);
            }
        }
    }

    async loadrom(args) {
        try {
            await loadURL(Cast.toString(args.datauri));
        } catch (e) {
            this.setError(e);
        }
    }
	
	reset(args) {
        try {
			//This is sort of like buying a new NES every time you want to reset the game,
			//but I still think this is nessasary though.
			nes = makeNESObj();
			//Reload the rom.
            nes.loadROM(loadedROMData);
        } catch (e) {
            this.setError(e);
        }
    }

    startEmulation() {
        emulationPaused = false;
    }

    pauseEmulation() {
        emulationPaused = true;
    }

    processFrame() {
        try {
            nes.frame();
        } catch (e) {
            this.setError(e);
        }
    }

    processFrames(args) {
        var amountFrames = Cast.toNumber(args.FRAMES);
        if (Number(amountFrames)) {
            var countFrames = 0;
            while ((countFrames < amountFrames) || (countFrames > 1515)) { //Max skip frames is 1515, for saftey crash checking.
                try {
                    nes.frame();
                } catch (e) {
                    this.setError(e);
                }
                countFrames += 1;
            }
        }
    }

    setVolume(args) {
        var toVolume = Cast.toNumber(args.VOLUME);
        if (toVolume) {
            volume = Number(toVolume);
        } else {
            volume = 0;
        }
    }

    getVolume() {
        return volume.toString(); //Just in case scratch uses if () to check if value is undefined or something.
    }

    isPaused() {
        return emulationPaused.toString();
    }

    setTimerMode(args) {
        var mode = args.TIMER.toString();
        if (mode == "internalClock") {
            timerMode = "internalClock";
        }
        if (mode == "interval") {
            timerMode = "interval";
        }
        if (mode == "custom") {
            timerMode = "custom";
        }
    }

    getTimeMethodsMenu() {
        return {
            acceptReporters: false,
            items: [{
                    text: "Internal PC clock",
                    value: "internalClock",
                }, {
                    text: "Set interval",
                    value: "interval",
                }, {
                    text: "Custom (manually program the clock)",
                    value: "custom",
                }
            ]
        };
    }

    getInfo() {
        return {
            id: "nesemulator",
            name: "NES Emulator",
            color1: "#ff6b6b",
            color2: "#fa5252",
            color3: "#e03131",
            blockIconURI: blockIconURI,
            blocks: [
				{
                    opcode: "cleanVars",
                    text: "Reset everything.",
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
                "---", {
                    opcode: "loadrom",
                    text: "Load ROM from URL: [datauri]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        datauri: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data:application/octet-stream;base64,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jQYgpWuNBiCldI0HIKV3jQcgqQCFYqVj8CqNBiClZo0GIKVvjQcgpXKNByClaY0GIKVsjQYgpXWNByCleI0HIKkAhWOlZPAqjQYgpWeNBiClcI0HIKVzjQcgpWqNBiClbY0GIKV2jQcgpXmNByCpAIVkLAIgqQCNBSCNBSCpiI0AIGhAQP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////j7CzsKO7///////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///h3gBAwMDAweHeAEDAwMDA8Ag/CYmJiYnwCDM/v7+/v7///////////+71+/Xu///qlWqVapVqlWqVapVqlWqVf////////////////////9VqlWqVapVqv//////////AAAAAAAAAAD//////////6pVqlWqVapVVapVqlWqVar//////////wAAAAAAAAAAAAAPHz8/PDwAAAAPHxgYGAAA/////wAAAAAA//8AAAAAAPD4/Pw8PAAAAPD4GBgYPDw/Px8PAAAYGBgfDwAAAAAA/////wAAAAAA//8AAAA8PPz8+PAAABgYGPjwAAAAPDw8PDw8PDwYGBgYGBgYGAcHBwcHBwMBAwICAgICAwH////////+/P4CAgICAnZ0AAAAABg8fv8AAAAAGDx+/8Dw/P//////wPD8//////8AAAAAwPD8/wAAAADA8Pz/AQMHDx8/f/8BAwcPHz9//4DA4PD4/P7/gMDg8Pj8/v//fz8fDwcDAf9/Px8PBwMB//78+PDgwID//vz48ODAgAAAAAAAAAAAAAAAAAAAAAAYGBgYABgYABgYGBgAGBgAJCQkAAAAAAAkJCQAAAAAADb/Zv9sAAAANv9m/2wAAAAIHCoYDCocCAgcKhgMKhwIRKRICBASJSJEpEgIEBIlInDIwW7MzHgAcMjBbszMeAAYCBAAAAAAABgIEAAAAAAADBgwMDAwGAwMGDAwMDAYDDAYDAwMDBgwMBgMDAwMGDAIKhwqCAAAAAgqHCoIAAAAAAgIPggIAAAACAg+CAgAAAAAAAAAGAgQAAAAAAAYCBAAAAB+AAAAAAAAAH4AAAAAAAAAAAAYGAAAAAAAABgYAAQECAgQECAgBAQICBAQICA8Zm52ZmY8ADxmbnZmZjwAGDgYGBgYGAAYOBgYGBgYADxGBhwwYH4APEYGHDBgfgB+DBg8BkY8AH4MGDwGRjwADhYmRn8GBgAOFiZGfwYGAH5gfAYGRjwAfmB8BgZGPAAcMGB8ZmY8ABwwYHxmZjwAfgYGDBgYGAB+BgYMGBgYADxmZjxmZjwAPGZmPGZmPAA8ZmY+Bgw4ADxmZj4GDDgAABgYAAAYGAAAGBgAABgYAAAYGAAAGAgQABgYAAAYCBAADBgwGAwAAAAMGDAYDAAAAAB+AH4AAAAAAH4AfgAAAAAwGAwYMAAAADAYDBgwAAA8RgYMGAAYADxGBgwYABgAPEKZpaWaQDw8QpmlpZpAPDxmZn5mZmYAPGZmfmZmZgB8ZmZ8ZmZ8AHxmZnxmZnwAPGJgYGBiPAA8YmBgYGI8AHxmZmZmZnwAfGZmZmZmfAB+YGB8YGB+AH5gYHxgYH4AfmBgfGBgYAB+YGB8YGBgADxiYG5mZjwAPGJgbmZmPABmZmZ+ZmZmAGZmZn5mZmYAGBgYGBgYGAAYGBgYGBgYAAYGBgZmZjwABgYGBmZmPABmbHhweGxmAGZseHB4bGYAYGBgYGBgfgBgYGBgYGB+AIPH77uTg4MAg8fvu5ODgwBhcXldT0dDAGFxeV1PR0MAPGZmZmZmPAA8ZmZmZmY8AHxmZnxgYGAAfGZmfGBgYAA8ZmZmZmY8BjxmZmZmZjwGfGZmfGZmZgB8ZmZ8ZmZmABwyOBwOJhwAHDI4HA4mHAB+GBgYGBgYAH4YGBgYGBgAZmZmZmZmPABmZmZmZmY8AGZmZmZmZHgAZmZmZmZkeADb29vb29r8ANvb29vb2vwAZmZmPGZmZgBmZmY8ZmZmAGZmZjwYGBgAZmZmPBgYGAB+BgwYMGB+AH4GDBgwYH4AHBgYGBgYGBwcGBgYGBgYHCAgEBAICAQEICAQEAgIBAQ4GBgYGBgYODgYGBgYGBg4CBQiAAAAAAAIFCIAAAAAAAAAAAAAAAD/AAAAAAAAAP8QIDAAAAAAABAgMAAAAAAAAAA8Bj5mPgAAADwGPmY+AGBgfGZmZnwAYGB8ZmZmfAAAADxiYGI8AAAAPGJgYjwABgY+ZmZmPgAGBj5mZmY+AAAAPGZ+YDwAAAA8Zn5gPAAOGDwYGBgYAA4YPBgYGBgAAAA+ZmY+BjwAAD5mZj4GPGBgfGZmZmYAYGB8ZmZmZgAYABgYGBgYABgAGBgYGBgABgAGBgYGJhwGAAYGBgYmHGBgZmx4bGYAYGBmbHhsZgA4GBgYGBgYADgYGBgYGBgAAAD+29vb2wAAAP7b29vbAAAAfGZmZmYAAAB8ZmZmZgAAADxmZmY8AAAAPGZmZjwAAAB8ZmZmfGAAAHxmZmZ8YAAAPmZmZj4GAAA+ZmZmPgYAADY+MDAwAAAANj4wMDAAAAA+YDwGfAAAAD5gPAZ8ABgYPBgYGAwAGBg8GBgYDAAAAGZmZmY+AAAAZmZmZj4AAABmZmZkeAAAAGZmZmR4AAAA29vb2vwAAADb29va/AAAAGZmPGZmAAAAZmY8ZmYAAABmZmY+BjwAAGZmZj4GPAAAfgwYMH4AAAB+DBgwfgAcMDDgMDAcABwwMOAwMBwAGBgYGBgYGBgYGBgYGBgYGOAwMBwwMOAA4DAwHDAw4AAyTAAAAAAAADJMAAAAAAAAPEKZhYWZQjw8QpmFhZlCPP//wMDAwMDAAH9/f39/f3///wMBAwEDAQD+/P78/vz+///A1cDVwNUAf39/f39/f///A1UDVQNVAP78/vz+/P7z/8TAQGPHxgBze38/HHt7z/8hAQLG4SEAzt7+/Dje3v///////////7vX79e7//////////////+71+/Xu////4D/fwAAAAAAfwAAAAAAAP8B//4AAAAAAP4AAAAAAAD//////////wB/d2trXV1c//////////8A/u7W1rq6Ov//////////AH9zbV5eX2///////////wD+zrZ6evr2//////////8Af39/f399e///////////AP6GelJ6aobAwMDAwMDq/39/f39/f1UAAwEDAQMBq//8/vz+/P5UAMDVwNXA1er/f39/f39/VQADVQNVA1Wr//z+/P78/lQAxsZjQMDEzPN7exw/f3tzACEhxgIBITHP3t44/P7ezgD///////////+71+/Xu///////////////u9fv17v///8A//8AAAAAAP8AAAAAAADB2f3l5dnBwX5+ZkJCZn5+//////////9dXV1dXEF/AP//////////urq6ujqC/gD//////////293d3t9fn8A///////////27u7evn7+AP//////////dm1bdm17fwD///////////6+fv7+/v4ABwgQI0QIEGAABw8fPHhwYOAQCMQiEAgGAODw+DweDgYACREiRIiQkAAHDx48eHBwAJCIRCIRCQkA4PB4PB4ODv///////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//2AQCEQjEAgHYHB4PB8PBwAGCBAixAgQ4AYOHjz48OAAkJCIRCIRCQBwcHg8Hg8HAAkJESJEiJAADg4ePHjw4AD///////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///AAEPHz9/Pw8AAQ8fP38/DwDA8fv/////AMDx+/////8AAADA4OD4+AAAAMDg4Pj4////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//3+AgICAiM//AH9/f393ME//AAAAAIjP/wD/////d7DP/gEBAQGJz/8A/v7+/nawzh9//38/HwAAH3//fz8fAAD/////348DAP/////fjwMA8PDw8OCAAADw8PDw4IAAAP///////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7/////////////38+b39/ez9/////////////vu////u//////////////r7u/v76vv4AAAAIEAAAAAAAAAgQAAAA/4GBgYGBgf/+/v7+/v7+gP+Bq4Grgav//v7+/v7+/oDbpYFaWoGl2wBafiQkfloA/4H/AAAAAAAAfgAAAAAAAP//////////AFpaGAAYfgD///////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////////////u9fv17v//////////////7vX79e7//////////////+71+/Xu///////f38/Hwd/Pi8fPxsHAP///////////77v///7vwD////+/vz44P6+7vz8+KAABxggTk6OjoAABx8xM3Nzf4CQiEdAIBgHf293OD8fBwDgGARycnFxAQDg+Iycnp7+AQkR4gIEGOD+9u4c/PjgAA8/fHBAQFxdAAADDz8/IzZcQEF/ezw/Hzc/PgAEAwAA8Px8DAQEdHQAAIDw+PiI2PSEBPzcPPjwWHj4ACDAAAAHGCBOTo6OgAAHHzEzc3N/v//wd3g/HwdAAA8IBwAAAOAYBHJycXEBAOD4jJyenv79/w/uHvz44AIA8BDgAAAABxggQECAgIAABx8/P39/f4CAgEBAIBgHf39/Pz8fBwDgGAQCAgEBAQDg+Pz8/v7+AQEBAgIEGOD+/v78/PjgAAAAAAADBAgIAAAAAAMECAgAAAMMEBAgIAAAAwwQECAgDzBAQICAgIAPMEBAgICAgD9/f///f38/AAA1IjIiNQD8/v7///7+/AAAXEhISEgAAAAAAAAAAACqVapVqlWqVcDg4PDw+Pj8AEBAYGBwcHj8/P7+Hg4AAHhwbAwMAAAADD5/f39/PQIMAiEhAQEBAgA8fn5/f758AAAgIAEBgnxAvP7+/v58MECAoKCAgEAwPn3+/n5+PAA+QaCgAAAAAIFCAAAAAEKBPAC9paW9ADw8QoGBgYFCPDxCgYGBgUI8GGZCgYFCZhgAGDx+fjwYAAAAAAAAAAAA/////////////////////wB/d2trXV1c//////////9dXV1dXEF/AP//////////AH9zbV5eX2///////////293d3t9fn8A//////////8Af39/f399e///////////dm1bdm17fwD//////////wD+hnpSemqG///////////+vn7+/v7+AP//////////AH9/f3x7dHD//////////3BweHx/f38A/4+P//////8A/v72NhYODv//////////Dg4ePv7+/gD//////////wB/f39/f39///////////9/f39/f39/AP//////////AP7+/v7+/v7///////////7+/v7+/v4A//////////8Af39/f39/f///////////f39/f39/fwD//////////wD+/v7+/v7+///////////+/v7+/v7+ABg8f35+PRgQEDh9fHw5EAA8fn9+PD0YEChsfXw4ORAAAD5/f39/fz4APGZudmY8AAA8HBwcHBwcADgYGBgYGAAAfH9nP35/fwB8ZgY8YH4AAH5/fx93f34AfGYcBmZ8AAAOHj5+f34MAAwcPGx+DAAAf39/f3d/fgB+YH4GZnwAAD5+f393fz4APGB+ZmY8AAB+fh4cPDg4AHwMGBgwMAAAPn9/f39/PgA8ZjxmbjwAAD5/d39/Pz4APGZmfgY8AAMHBwsQYPDwAAMDBA8fb2/w8GAQCwcHA29vHw8EAwMAABw/eHBgICAAABg3Lx8fHyAgYHB4PxwAHx8fLzcYAAAAAw8/f3///wAAAw87P299/4+A8P//fw8PcH8PcH8PAADA8Pz+/v//AADA8Lz0/t7/8QEP///+8PAO/vAO/vAAAAMONW5VutcAAAMPOz9vffqPgPCv1XoPD3B/D3B/DwAAwLBc6l6rdQAAwPC89P7er/EBD/tVrvDwDv7wDv7wAAADDDBEQJCCAAADDzs/b33w////j4BwDw8gVQpwfw8AAMAwDEIKASEAAMDwvPT+3g/////xAQ7w8ApUoA7+8ADk5O/v//9/fwMDAAMHBgcAP39///////8AHx8PAwAAABMT+/v///7+4OAAMHBgcAD+/////////wD4+PDAAAAAg4yQkOCgr28AAw8PH19QEPsFBQVFZfX9APr6+rqaCgKDjJCQ4KCvbwADDw8fX1AX+wUFBUVl9f0A+vr6uppq8gAAABMTNzcHDx8fP3////8HBIDA4ODw+P//fz8fHw8HAAAA+Pz8/P3+//8Pv6P39/wcwOAAAAYP//8/H/78+PDz/8TAQGPHxgBze38/HHt7xsZjQMDEzPN7exw/f3tzAM//IQECxuEhAM7e/vw43t4hIcYCASExz97eOPz+3s4ADxAgIEBElZUADx8fPztqap+OREQkJBAPYHE7OxsbDwDwCAQEAhIyMQDw+Pj87MzOMTESEhQUCPDOzuzs6OjwAAcYIEBEhISAAAcfPzt7e3+AgP8ICAgIeH9/AAAAAAAA4BgEAiIhIQEA4Pj83N7e/gEB/xAQHwAA/v4AAAAAAAAAAAAAAB8ODgQcPn//4Pv7Dv///38fDwP/AH9mHw8DHAAAAAAA+HBwIDh8/v8H399w/////vjwwP8A/mb48M4AAAAAAAAADAwAAAAABA4PCzBDQGADAH8ADwwPDwB/1X8AAAAAAAAwMAAAAAAgcPDgDssAAMAA/gDwMPDwAP5V/gAAAAAAAAwMAAAAAAQODwswIyBgAwB/AA8MDw8Af6p/AAAAAAAAMDAAAAAAIHDw4AnPAADAAP4A8DDw8AD+q/4DAAcAEADwAAAAAwAPAG8A8ABgAAsABwBvAB8ABAADAAAcAHgAYAAgAAAANwAfAB8AIABwAD8AAAAfAC8AGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAowEEALEgABnlIAZHIBwLHSBD6SACSSAc/gsCHSBJ6yACQiAc/AsCHSBU6yAAHPoLAh0gWc4gDFMgTCBJIEQgSSBOIEfWIAULCxobIAv+IAccCx0gHAsLIP4LACD+CwMgCwsd/SAFCyAcHyAL/iAECyALIAv9IAMLICAL/iACCyAL/SAFCyAeHSAL/iD+CwggHgsdICALICD+CwMgCwsf/SAFCyAcHyAL/iACCyAL/iAGCyAgCyAgC/4gAgseHf0gBAsLHyAg/gsMIAsgCyALCx8gIAsgIP4LAyALIAufIAGAgeUgA4KDkJH5IApQcmVzcyBTdGFydPggBZKTgIGCg+kgB4CBgIGQkZKT6SAJkJGQkYCBgIGAge0gC4CBgoOAgZCRkJGQke0gC5CRkpOQkYKDgIGAge0gC4CBgIGAgZKTkJGQke0gC5CRkJGQkYCBgIGAge0gLYCBgIGCg5CRkJGQkSB/MjAxNCBOb3ZhU3F1aXJyZWwgkJGQkZKTgIGAgYKDIIjxmA2JIIKDgIGAgZCRkJGSk+0gBZKTkJGQkcIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
                        }
                    }
                }, {
                    opcode: "reset",
                    text: "Reset game",
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
                "---", {
                    opcode: "showScreen",
                    text: "Show NES screen on [TARGET]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TARGET: {
                            type: ArgumentType.STRING,
                            menu: "targets",
                        }
                    }
                }, {
                    opcode: "stopShowingScreen",
                    text: "Stop showing NES screen on [TARGET]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TARGET: {
                            type: ArgumentType.STRING,
                            menu: "targets",
                        }
                    }
                },
                "---", {
                    opcode: "startEmulation",
                    text: "Resume emulation",
                    blockType: BlockType.COMMAND,
                    arguments: {}
                }, {
                    opcode: "pauseEmulation",
                    text: "Pause emulation",
                    blockType: BlockType.COMMAND,
                    arguments: {}
                }, {
                    opcode: "isPaused",
                    text: "Emulation Paused?",
                    blockType: BlockType.BOOLEAN,
                    arguments: {}
                }, {
                    opcode: "processFrame",
                    text: "Run a single frame.",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TARGET: {
                            type: ArgumentType.STRING,
                            menu: "targets",
                        }
                    }
                }, {
                    opcode: "processFrames",
                    text: "Process [FRAMES] frame(s).",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FRAMES: {
                            defaultValue: 10,
                            type: ArgumentType.NUMBER
                        }
                    }
                }, {
                    opcode: "setTimerMode",
                    text: "Set frame timing method to [TIMER]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TIMER: {
                            type: ArgumentType.STRING,
                            menu: "timer",
                        }
                    }
                },
                "---", {
                    opcode: "pressButton",
                    text: "Press button [BUTTON]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BUTTON: {
                            type: ArgumentType.STRING,
                            menu: "controller",
                        }
                    }
                }, {
                    opcode: "releaseButton",
                    text: "Release buttton [BUTTON]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BUTTON: {
                            type: ArgumentType.STRING,
                            menu: "controller",
                        }
                    }
                },
                "---", {
                    opcode: "setVolume",
                    text: "Set volume to [VOLUME]%",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VOLUME: {
                            defaultValue: 50,
                            type: ArgumentType.NUMBER,
                        }
                    }
                }, {
                    opcode: "getVolume",
                    text: "NES Volume",
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                "---", {
                    opcode: "saveState",
                    text: "Get current state.",
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }, {
                    opcode: "loadState",
                    text: "Load current state [DATA]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING
                        }
                    }
                },
                "---", {
                    opcode: "catchedErrors",
                    text: "Latest error",
                    blockType: BlockType.REPORTER,
                    arguments: {}
                }, {
                    opcode: "clearCatchedErrors",
                    text: "Clear latest error",
                    blockType: BlockType.COMMAND,
                    arguments: {}
                }
            ],
            menus: {
                targets: this.getTargetsMenu(),
                controller: this.getGameControllerMenu(),
                timer: this.getTimeMethodsMenu()
            },
        };
    }

    setError(error) {
        this.latestError = error.toString();
    }

    clearCatchedErrors() {
        this.latestError = "";
    }

    catchedErrors() {
        return this.latestError.toString();
    }

    saveState() {
        try {
            return JSON.stringify(nes.toJSON());
        } catch (e) {
            this.setError(e);
            return "";
        }
    }

    loadState(args) {
        var data = Cast.toString(args.DATA);
        try {
            nes.fromJSON(JSON.parse(data));
        } catch (e) {
            this.setError(e);
        }
    }

    getTargetsMenu() {
        return {
            acceptReporters: true,
            items: "_getTargets",
        };
    }

    getGameControllerMenu() {
        var cnt = constants.controller;
        var cnt2 = constants.controllerP2;
        return {
            acceptReporters: true,
            items: [{
                    text: "(Player 1) Depad Up",
                    value: cnt.up,
                }, {
                    text: "(Player 1) Depad Down",
                    value: cnt.down,
                }, {
                    text: "(Player 1) Depad Left",
                    value: cnt.left,
                }, {
                    text: "(Player 1) Depad Right",
                    value: cnt.right,
                }, {
                    text: "(Player 1) Start",
                    value: cnt.start,
                }, {
                    text: "(Player 1) Select",
                    value: cnt.select,
                }, {
                    text: "(Player 1) A",
                    value: cnt.a,
                }, {
                    text: "(Player 1) B",
                    value: cnt.b,
                }, {
                    text: "(Player 2) Depad Up",
                    value: cnt2.up,
                }, {
                    text: "(Player 2) Depad Down",
                    value: cnt2.down,
                }, {
                    text: "(Player 2) Depad Left",
                    value: cnt2.left,
                }, {
                    text: "(Player 2) Depad Right",
                    value: cnt2.right,
                }, {
                    text: "(Player 2) Start",
                    value: cnt2.start,
                }, {
                    text: "(Player 2) Select",
                    value: cnt2.select,
                }, {
                    text: "(Player 2) A",
                    value: cnt2.a,
                }, {
                    text: "(Player 2) B",
                    value: cnt2.b,
                }
            ],
        };
    }

    getNesPadMap(btn) {
        var cnt = constants.controller;
        var cnt2 = constants.controllerP2;

        var output = {
            player: null,
            button: null
        };

        //Player 1 Buttons.

        if (btn == cnt.up) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_UP;
        }
        if (btn == cnt.down) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_DOWN;
        }
        if (btn == cnt.left) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_LEFT;
        }
        if (btn == cnt.right) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_RIGHT;
        }

        if (btn == cnt.a) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_A;
        }
        if (btn == cnt.b) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_B;
        }

        if (btn == cnt.start) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_START;
        }
        if (btn == cnt.select) {
            output.player = 1;
            output.button = jsnes.Controller.BUTTON_SELECT;
        }

        //Player 2 Buttons.

        if (btn == cnt2.up) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_UP;
        }
        if (btn == cnt2.down) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_DOWN;
        }
        if (btn == cnt2.left) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_LEFT;
        }
        if (btn == cnt2.right) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_RIGHT;
        }

        if (btn == cnt2.a) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_A;
        }
        if (btn == cnt2.b) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_B;
        }

        if (btn == cnt2.start) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_START;
        }
        if (btn == cnt2.select) {
            output.player = 2;
            output.button = jsnes.Controller.BUTTON_SELECT;
        }

        return output;
    }

    pressButton(args) {
        var buttonItem = args.BUTTON;
        var realBTN = this.getNesPadMap(buttonItem);
        if (realBTN.player) {
            nes.buttonDown(realBTN.player, realBTN.button);
        }
    }

    releaseButton(args) {
        var buttonItem = args.BUTTON;
        var realBTN = this.getNesPadMap(buttonItem);
        if (realBTN.player) {
            nes.buttonUp(realBTN.player, realBTN.button);
        }
    }

    showScreen(args, util) {
        const targetName = Cast.toString(args.TARGET);
        const target = this._getTargetFromMenu(targetName, util);
        if (!target) {
            return;
        }
        vm.renderer.updateDrawableSkinId(target.drawableID, nesSkin._id);
        nesSkin.markVideoDirty();
    }
    stopShowingScreen(args, util) {
        const targetName = Cast.toString(args.TARGET);
        const target = this._getTargetFromMenu(targetName, util);
        if (!target) {
            return;
        }
        target.setCostume(target.currentCostume);
    }

    _getTargetFromMenu(targetName, util) {
        if (targetName === "_myself_")
            return util.target;
        if (targetName === "_stage_")
            return runtime.getTargetForStage();
        return this.runtime.getSpriteTargetByName(targetName);
    }

    _getTargets() {
        let spriteNames = [{
                text: "myself",
                value: "_myself_"
            }, {
                text: "Stage",
                value: "_stage_"
            },
        ];
        const targets = this.runtime.targets
            .filter((target) => target.isOriginal && !target.isStage)
            .map((target) => target.getName());
        spriteNames = spriteNames.concat(targets);
        return spriteNames;
    }

}

module.exports = NesEmulator;