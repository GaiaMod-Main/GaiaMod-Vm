// for cross browser compatibility
var blockIconURI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAkdEVYdERlc2NyaXB0aW9uAEdhbWVwYWQuIG1vbm9jaHJvbWUgaWNvbhGLVc0AAANlSURBVHhe7dxRbuIwGIVRmAV0/+vsBhhQkRh1gCTEjn9fnSNVzSNKP67sl54v36fLCUL8uf+GCIImiqCJImiiCJoogiaKoIkiaKIImiiCntT56/HDg6An9DtiUT8IejLifU/QExHzMkFPQszrCHoCYl5P0MWJeRtBFybm7QRdlJg/I+iC3sV8+b4/8JSgixHzPoIuRMz7CboIMbch6ALE3I6gBxNzW4IeSMztCXoQMfch6AHE3I+gDybmvgR9IDH3J+iDiPkYgj6AmI8j6M7EfCxBdyTm4wm6EzGPIegOxDyOoBsT81iCbkjM4wm6ETHXIOgGxFyHoHcScy2C3kHM9Qj6Q2KuSdAfEHNdgt5IzLUJegMx1yfolcQ8B0GvIOZ5CHqBmOci6DfEPB9BvyDmOQn6CTHPS9C/iHlu5+sf6XJ/HuJdQJVUivnZO/Nl+zF0ocVMa44cC8Q8F0G/Ieb5CPoFMc9p6KWwyuVmtkuWS+FrFpoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJoqgiSJoogiaKIImiqCJImiiCJoogiaKoIkiaKIImiiCJoqgiXK+fJ8u9+fDnb/uDwVd30tZz95b5c97pGELXTlm5uXIQRRBE2VY0NXPfLcjkWPRfIZeCqtYCrfal8+l8DVHjqulGKz1PAR9t2bhRF2foP9xi9paz03QT1jreQn6BWs9J0EvsNZzEfQKa9ea8QS9gSNIfYLeyFrXJugPWeuaBL2Dta5H0A1Y6zoE3chS1Dei7k/QDa09ggi7H0F3YK3HEXQn1noMQXdmrY8l6AOsXWv2E/SBHEH6E/TBrHVfgh7EWvch6IGsdXuCLsBatyPoIpaivhH1MkEX4giyn6ALWrPWPCfootasNf8TdHGi3kbQE1iz1s7WPwQ9EWu9TNCTEfV7gg4h9B+CntDveMX84D/4E8VCE0XQRBE0UQRNFEETRdBEETRRBE0UQRNF0EQRNFEETRRBE0XQBDmd/gKDn9ES1n9HXQAAAABJRU5ErkJggg==";
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
window.audioctxExtensionData = {
	volume:100
};
class audioctx {
    constructor (runtime) {
        this.runtime = runtime;
		
		this._playNoteForPicker = this._playNoteForPicker.bind(this);
		this.runtime.on('PLAY_NOTE', this._playNoteForPicker);
    }

    getInfo () {
        return {
            id: 'audioctx',
            name: 'Audio Context',
			blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'playWave',
                    blockType: BlockType.COMMAND,
                    text: 'Play wave frequency [frequency] with [sharp] for [sec]',
                    arguments: {
						sharp: {
							type:ArgumentType.NUMBER,
							defaultValue:100
						},
						sec: {
							type:ArgumentType.NUMBER,
							defaultValue:0.5
						},
						frequency: {
							type:ArgumentType.NUMBER,
							defaultValue:5000
						}
                    }
                },
				{
                    opcode: 'playWaveNote',
                    blockType: BlockType.COMMAND,
                    text: 'Play wave note [note] with [sharp] for [sec]',
                    arguments: {
						sharp: {
							type:ArgumentType.NUMBER,
							defaultValue:100
						},
						sec: {
							type:ArgumentType.NUMBER,
							defaultValue:0.5
						},
						note: {
							type:ArgumentType.NOTE,
							defaultValue:60
						}
                    }
                },
				{
                    opcode: 'setVolume',
                    blockType: BlockType.COMMAND,
                    text: 'Set Volume To [volume]',
                    arguments: {
						volume: {
							type:ArgumentType.NUMBER,
							defaultValue:100
						}
                    }
                }
            ],
            menus: {
            }
        };
    }
	_playNoteForPicker (noteNum, category) {
		if (category !== this.getInfo().name) return;
		if (this.playnoteosc) {
			//so when you slide to the next note, it wont play over the last note.
			var audiocxtobj = this.runtime.audioEngine.audioContext;
			this.playnoteosc.stop(audiocxtobj.currentTime);
		}
		this.playnoteosc = this.playWaveNoteFunct(noteNum,100,0.3);
	}
	capAudioOutput (out) {
		var a = out;
		if (a > 1) {
			a = 1;
		}
		if (a < -1) {
			a = -1;
		}
		return a;
	}
	
	playWave (args) {
		try {
			function mtof(m) {
			  return Math.pow(2, (m - 69) / 12) * 440;
			}
			var audiocxtobj = this.runtime.audioEngine.audioContext;
			var real = new Float32Array(2);
			var imag = new Float32Array(2);
			var osc = audiocxtobj.createOscillator();
			var gain = audiocxtobj.createGain();
			gain.gain.value = window.audioctxExtensionData.volume / 100;

			real[0] = 0;
			imag[0] = 0;
			real[1] = this.capAudioOutput(Number(Cast.toString(args.sharp)));
			imag[1] = this.capAudioOutput(Number(Cast.toString(args.sharp)));
			osc.frequency.value = (Number(Cast.toString(args.frequency)));

			var wave = audiocxtobj.createPeriodicWave(real, imag, {disableNormalization: false});

			osc.setPeriodicWave(wave);

			osc.connect(this.runtime.audioEngine.getInputNode());

			osc.start(audiocxtobj.currentTime);
			osc.stop(Number(Cast.toString(args.sec))+audiocxtobj.currentTime);
			
		} catch(e) {
			console.error(e);
		}
    }
	playWaveNoteFunct (note,sharp,sec) {
		try{
			function mtof(m) {
			  return Math.pow(2, (m - 69) / 12) * 440;
			}
			var audiocxtobj = this.runtime.audioEngine.audioContext;
			var real = new Float32Array(2);
			var imag = new Float32Array(2);
			var osc = audiocxtobj.createOscillator();
			var gain = audiocxtobj.createGain();
			gain.gain.value = window.audioctxExtensionData.volume / 100;

			real[0] = 0;
			imag[0] = 0;
			real[1] = this.capAudioOutput(sharp);
			imag[1] = this.capAudioOutput(sharp);
			osc.frequency.value = mtof(note);

			var wave = audiocxtobj.createPeriodicWave(real, imag, {disableNormalization: false});

			osc.setPeriodicWave(wave);

			osc.connect(this.runtime.audioEngine.getInputNode());

			osc.start(audiocxtobj.currentTime);
			osc.stop(sec+audiocxtobj.currentTime);
			return osc;
		}catch(e){}
	}
    playWaveNote (args) {
		try {
			this.playWaveNoteFunct(Number(Cast.toString(args.note)),Number(Cast.toString(args.sharp)),Number(Cast.toString(args.sec)))
		} catch(e) {
			console.error(e);
		}
    }
	setVolume (args) {
		window.audioctxExtensionData.volume = Number(Cast.toString(args.volume));
	}
}

module.exports = audioctx;