//This is a modified version of my NES emulator's audio processor.
//Its designed to process the audio data and play it to your speakers.
//Not to play the instruments or music playing in the NES game,
//JSNes does that part.

var sometempstuff = {
    samples: {
        left: [],
        right: [],
        normalsize: 0
    },
    savedSamples: {
        left: [],
        right: []
    }
};
class NesExtensionAudioProcessor {

    constructor(audioContext, inputNode) {
        try {
            this.audioCtx = audioContext;
            this.inputNode = inputNode;
            var thisobj = this;
            this.pitchpatch = false;
            this.audioadd = false;
            this.setup();
            var lastContext = this.audioCtx;
            setInterval(() => {
                if (lastContext !== this.audioCtx) { //Make sure we update to our new audio context.
                    thisobj.setup();
                    lastContext = this.audioCtx;
                }
                if (this.audioCtx) {
                    if (!(thisobj.audioCtx.state == "running")) {
                        //if not running, then keep creating it until it is.
                        thisobj.setup();
                    } else {}
                }
            }, 1000 / 60);
            this.samplesL = [];
            this.samplesR = [];
            setInterval(() => {
                thisobj.tickSampleErase();
            }, 1000 / 60);

        } catch (e) {
            window.alert(e);
        }
    }
    tickSampleErase() {}
    setup() {
        if (this.audioCtx && this.inputNode) {
            var t = this;
            if (this.scriptNode) {
                //Remove out the previous one, to advoid issues with sound.
                this.scriptNode.onaudioprocess = function () {};
            }
            this.scriptNode = this.audioCtx.createScriptProcessor(16384 / 2, 0, 2);
            this.scriptNode.onaudioprocess = function (e) {
                t.onaudioprocess(e);
            };
            this.scriptNode.connect(this.inputNode);
        }
    }

    onaudioprocess(e) {
        var left = e.outputBuffer.getChannelData(0);
        var right = e.outputBuffer.getChannelData(1);
        var size = left.length;
        if (sometempstuff.samples.left.length > (0)) {
            sometempstuff.savedSamples.left = [];
            sometempstuff.savedSamples.right = [];
            var lastsam = 0;
            var i = 0;
            while (i < size) {
                var sam = sometempstuff.samples.left[i];
                if ((Math.abs(sam) * 1000) > 10) {
                    lastsam = sam;
                    sometempstuff.savedSamples.left.push(sam);
                } else {
                    sometempstuff.savedSamples.left.push(lastsam);
                }
                i += 1;
            }
            lastsam = 0;
            i = 0;
            while (i < size) {
                var sam = sometempstuff.samples.right[i];
                if ((Math.abs(sam) * 1000) > 10) {
                    lastsam = sam;
                    sometempstuff.savedSamples.right.push(sam);
                } else {
                    sometempstuff.savedSamples.right.push(lastsam);
                }
                i += 1;
            }
            sometempstuff.samples.left = [];
            sometempstuff.samples.right = [];
        }
        sometempstuff.samples.normalsize = size;

        for (var i = 0; i < sometempstuff.savedSamples.left.length; i++) {
            //try to "fix" the sound by lowering the speed.
            var pitchPatch = 1;
            if (this.pitchpatch) {
                pitchPatch = 0.9;
            }
            var samplec = Math.round(i * pitchPatch);
            left[i] = sometempstuff.savedSamples.left[samplec];
            right[i] = sometempstuff.savedSamples.right[samplec];

        }
        //originaly i used a limiter, to limit the thing. but after some relization, i should not, instead,
        //play the samples, then clear the samples.

    }

    updateAudioFrame() {
        //window.alert(this.samplesL);
    }

    getSampleRate() {
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

    processAudioSamples(left, right) {
        try {
            //when we get audio, add it to the samples
            var audioAdd = 8000;
            if (!(this.audioadd)) {
                audioAdd = 0;
            }
            sometempstuff.samples.left.push((left * 5));
            sometempstuff.samples.right.push((right * 5));
        } catch (e) {
            window.alert(e);
        }
    }
}

module.exports = NesExtensionAudioProcessor;