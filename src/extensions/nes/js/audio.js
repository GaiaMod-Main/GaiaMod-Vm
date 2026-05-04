try {
    var samples = {left:[],right:[],normalsize:0};
    var savedSamples = {left:[],right:[]};
      //most of this code, i reused from some other thing, however i first
      //thought that i needed to use node js libaries to make this work..., but in
      //reality i did not.
    window.NESAudio = class NESAudio {
  
      constructor() {
        try {
          
          var thisobj = this;
            this.pitchpatch = true;
            this.audioadd = false;
          this.setup();
          setInterval(() => {
            if (!(thisobj.audioCtx.state == "running")) {
              //if not running, then keep creating it until it is.
              thisobj.setup();
            } else {
            } 
          }, 1);
          this.samplesL = [];
          this.samplesR = [];
          setInterval(() => {
            thisobj.tickSampleErase();
          },2);
        } catch (e) {
          window.alert(e);
        }
      }
      tickSampleErase() {
      }
      setup() {
          this.audioCtx = new AudioContext();
          var t = this;
          this.scriptNode = this.audioCtx.createScriptProcessor(16384/2, 0, 2);
          this.scriptNode.onaudioprocess = function(e){t.onaudioprocess(e);};
          this.scriptNode.connect(this.audioCtx.destination);
      }
      
      onaudioprocess (e) {
        var left = e.outputBuffer.getChannelData(0);
        var right = e.outputBuffer.getChannelData(1);
        var size = left.length;
        if (window.samples.left.length > (0)) {
          window.savedSamples.left = [];
          window.savedSamples.right = [];
          var lastsam = 0;
          var i = 0;
          while (i < size) {
            var sam = window.samples.left[i];
            if ((Math.abs(sam)*1000)>10) {
              lastsam = sam;
              savedSamples.left.push(sam);
            } else {
              savedSamples.left.push(lastsam);
            }
            i += 1;
          }
          lastsam = 0;
          i = 0;
          while (i < size) {
            var sam = window.samples.right[i];
            if ((Math.abs(sam)*1000)>10) {
              lastsam = sam;
              savedSamples.right.push(sam);
            } else {
              savedSamples.right.push(lastsam);
            }
            i += 1;
          }
          samples.left = [];
          samples.right = [];
        }
        samples.normalsize = size;
       
        for (var i = 0; i < window.savedSamples.left.length; i++) {
          //try to "fix" the sound by lowering the speed.
            var pitchPatch = 1;
            if (this.pitchpatch) {
              pitchPatch = 0.9;
            }
          var samplec = Math.round(i*pitchPatch);
          left[i] = savedSamples.left[samplec];  
          right[i] = savedSamples.right[samplec];
          
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
  
      proccessAudio(left, right) {
        try {
          //when we get audio, add it to the samples
            var audioAdd = 8000;
            if (!(this.audioadd)) {
               audioAdd = 0;
            }
          samples.left.push((left*-7));
          samples.right.push((right*-7));
        } catch (e) {
          window.alert(e);
        }
      }
    };
  } catch (e) {
    window.alert(e);
  }