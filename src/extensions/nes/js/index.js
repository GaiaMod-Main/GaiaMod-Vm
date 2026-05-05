try {
    var SCREEN_WIDTH = 256;
    var SCREEN_HEIGHT = 240;
    var info = document.getElementById("info");
    var dragdrop = document.getElementById("drag-drop");
    class Screen {
      constructor(a) {
        this.canvas = a;
      }
      componentDidMount() {
        this.initCanvas();
      }
  
      componentDidUpdate() {
        this.initCanvas();
      }
  
      initCanvas() {
        this.context = this.canvas.getContext("2d");
        this.imageData = this.context.getImageData(
          0,
          0,
          SCREEN_WIDTH,
          SCREEN_HEIGHT
        );
  
        this.context.fillStyle = "black";
        // set alpha to opaque
        //this.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  
        // buffer to write on next animation frame
        this.buf = new ArrayBuffer(this.imageData.data.length);
        // Get the canvas buffer in 8bit and 32bit
        this.buf8 = new Uint8ClampedArray(this.buf);
        this.buf32 = new Uint32Array(this.buf);
  
        // Set alpha
        for (var i = 0; i < this.buf32.length; ++i) {
          this.buf32[i] = 0xff000000;
        }
      }
  
      setBuffer(buffer) {
        var i = 0;
        for (var y = 0; y < SCREEN_HEIGHT; ++y) {
          for (var x = 0; x < SCREEN_WIDTH; ++x) {
            i = y * 256 + x;
            // Convert pixel from NES BGR to canvas ABGR
            this.buf32[i] = 0xff000001 | buffer[i]; // Full alpha
          }
        }
      }
  
      writeBuffer() {
        this.imageData.data.set(this.buf8);
        this.context.putImageData(this.imageData, 0, 0);
      }
  
      fitInParent() {
        let parent = this.canvas.parentNode;
        // @ts-ignore
        let parentWidth = parent.clientWidth;
        // @ts-ignore
        let parentHeight = parent.clientHeight;
        let parentRatio = parentWidth / parentHeight;
        let desiredRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
        if (desiredRatio < parentRatio) {
          this.canvas.style.width = `${Math.round(
            parentHeight * desiredRatio
          )}px`;
          this.canvas.style.height = `${parentHeight}px`;
        } else {
          this.canvas.style.width = `${parentWidth}px`;
          this.canvas.style.height = `${Math.round(
            parentWidth / desiredRatio
          )}px`;
        }
      }
  
      screenshot() {
        var img = new Image();
        img.src = this.canvas.toDataURL("image/png");
        return img;
      }
  
      handleMouseDown(e) {
        if (!this.props.onMouseDown) return;
        // Make coordinates unscaled
        let scale = SCREEN_WIDTH / parseFloat(this.canvas.style.width);
        let rect = this.canvas.getBoundingClientRect();
        let x = Math.round((e.clientX - rect.left) * scale);
        let y = Math.round((e.clientY - rect.top) * scale);
        this.props.onMouseDown(x, y);
      }
    }
  
    var cvs = document.getElementById("game");
    cvs.hidden = true;
    var ctx = cvs.getContext("2d");
    var buf32 = [];
    var setBuffer = (buffer) => {
      var i = 0;
      for (var y = 0; y < 240; ++y) {
        for (var x = 0; x < 256; ++x) {
          i = y * 256 + x;
          // Convert pixel from NES BGR to canvas ABGR
          buf32[i] = 0xff000000 | buffer[i]; // Full alpha
        }
      }
    };
    //var s = new Screen(cvs);
    //s.initCanvas();
    function convertNESToCanvas(buffer, buf32) {
      var i = 0;
      var SCREEN_HEIGHT = 256;
      var SCREEN_WIDTH = 240;
      var scalelines = false;
      var slfx = -1;
      for (var y = 0; y < SCREEN_HEIGHT; ++y) {
        if (scalelines) {
          slfx += 1;
          if (slfx > 1) {
            slfx = -1;
          }
        }
        for (var x = 0; x < SCREEN_WIDTH; ++x) {
          i = y * 256 + x;
          if (slfx < 0) {
            buf32[Math.round(i * 1 - 0)] =
              Math.round((0xff000001 | buffer[i]) / 1) * 1;
          } else {
            buf32[Math.round(i * 1 - 0)] = -1;
          }
        }
      }
    }
    var nesaudio = new window.NESAudio();
    setInterval(() => {
      //nesaudio.audioadd = document.getElementById("audioprob").value;
    });
    var canctx = cvs.getContext("2d");
    var nes = new window.jsnes.NES({
      onStatusUpdate: console.log,
      onFrame: function (frameBuffer) {
        try {
          //code for rendering the screen.
          var imgd = canctx.getImageData(0, 0, 256, 240);
          var bufa = new ArrayBuffer(imgd.data.length);
  
          var bufc = new Uint32Array(bufa);
          var bufb = new Uint8ClampedArray(bufa);
          convertNESToCanvas(frameBuffer, bufc);
  
          imgd.data.set(bufb);
          canctx.putImageData(imgd, 0, 0);
  
          //code for updating audio.
          nesaudio.updateAudioFrame();
        } catch (e) {
          window.alert(e);
        }
      },
      onAudioSample: nesaudio.proccessAudio,
      sampleRate: nesaudio.getSampleRate(),
    });
    setInterval(() => {
      nesaudio.pitchpatch = document.getElementById("audioprob").checked;
    });
    var running = false;
    function startTimer() {
      cvs.addEventListener("touchstart", (e) => {
        window.mobileToggle();
      });
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
  
          // Put your drawing code here
          nes.frame();
        }
      }
      startAnimating(60);
    }
    function handleLoad(file) {
      var reader = new FileReader();
      reader.onload = function () {
        var arrayBuffer = this.result;
        try {
          nes.loadROM(arrayBuffer);
          setTimeout(() => {
            startTimer();
          }, 50);
          info.hidden = true;
          cvs.hidden = false;
        } catch (e) {
          window.alert("failed to load rom: " + e);
        }
      };
      reader.readAsBinaryString(file);
    }
    dragdrop.ondragover = function dragOverHandler(ev) {
      console.log("File(s) in drop zone");
  
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    };
    dragdrop.dragstart = function dragOverHandler(ev) {
      console.log("File(s) in drop zone");
  
      // Prevent default behavior (Prevent file from being opened)
      ev.preventDefault();
    };
    dragdrop.ondrop = function (ev) {
      ev.preventDefault();
      if (ev.dataTransfer.items[0]) {
        const file = ev.dataTransfer.items[0].getAsFile();
        handleLoad(file);
      }
      console.log("File Dragged Over To Div!");
    };
    document.querySelector("input").addEventListener(
      "change",
      function () {
        if (this.files[0]) {
          handleLoad(this.files[0]);
        }
      },
      false
    );
    var mobileControls = document.getElementById("mobile-controls");
    var mobileSettings = document.getElementById("mobile-settings");
    var mc = {
      up: document.getElementById("mobile-up"),
      down: document.getElementById("mobile-down"),
      left: document.getElementById("mobile-left"),
      right: document.getElementById("mobile-right"),
  
      A: document.getElementById("mobile-A"),
      B: document.getElementById("mobile-B"),
  
      start: document.getElementById("mobile-start"),
      select: document.getElementById("mobile-select"),
    };
    window.mobileToggle = function mobileToggle() {
      mobileControls.hidden = !mobileControls.hidden;
      mobileSettings.hidden = mobileControls.hidden;
    };
    var leftarea = document.getElementById("mobile-left-area");
    var rightarea = document.getElementById("mobile-right-area");
    var scalevalue = document.getElementById("mobile-scale");
    
    setInterval(() => {
      var uiscale = Number(scalevalue.value) / 100;
      leftarea.style.transform = `scale(${uiscale})`;
      rightarea.style.transform = `scale(${uiscale})`;
    }, 1000 / 60);
    function isCollide(a, b) {
      var aRect = a;
      var bRect = b.getBoundingClientRect();
  
      return !(
        aRect.top + aRect.height < bRect.top ||
        aRect.top > bRect.top + bRect.height ||
        aRect.left + aRect.width < bRect.left ||
        aRect.left > bRect.left + bRect.width
      );
    }
    
    function releaseTouchButtons(e) {
      //up
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_UP);
      mc.up.removeAttribute("pressed");
      //down
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_DOWN);
      mc.down.removeAttribute("pressed");
      //left
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_LEFT);
      mc.left.removeAttribute("pressed");
      //right
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_RIGHT);
      mc.right.removeAttribute("pressed");
      //start
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_START);
      mc.start.removeAttribute("pressed");
      //select
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_SELECT);
      mc.select.removeAttribute("pressed");
      //A
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_A);
      mc.A.removeAttribute("pressed");
      //B
      nes.buttonUp(1, window.jsnes.Controller.BUTTON_B);
      mc.B.removeAttribute("pressed");
    }
    
    function doDepadTouch(touches,e,touchinfo) {
      var touched = false;
      releaseTouchButtons(e,touchinfo);
      for (var touch of touches) {
        
        var t = {width:2,height:2,left:touch.clientX,top:touch.clientY};
        if (isCollide(t,mc.up)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_UP);
          mc.up.setAttribute("pressed", "");
          e.preventDefault();
        }
        if (isCollide(t,mc.down)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_DOWN);
          mc.down.setAttribute("pressed", "");
          e.preventDefault();
        }
        if (isCollide(t,mc.left)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_LEFT);
          mc.left.setAttribute("pressed", "");
          e.preventDefault();
        }
        if (isCollide(t,mc.right)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_RIGHT);
          mc.right.setAttribute("pressed", "");
          e.preventDefault();
        }
        if (isCollide(t,mc.start)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_START);
          mc.start.setAttribute("pressed", "");
          e.preventDefault();
        }
        if (isCollide(t,mc.select)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_SELECT);
          mc.select.setAttribute("pressed", "");
          e.preventDefault();
        }
        if (isCollide(t,mc.A)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_A);
          mc.A.setAttribute("pressed", "");
          e.preventDefault();
        }
        if (isCollide(t,mc.B)) {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_B);
          mc.B.setAttribute("pressed", "");
          e.preventDefault();
        }
      }
    }
    
    //use collision based code, for touch control sliding between buttons.
    
    mobileControls.addEventListener("touchstart", (e) => {
      doDepadTouch(e.touches,e,"start");
    });
    mobileControls.addEventListener("touchmove", (e) => {
      doDepadTouch(e.touches,e,"move");
    });
    mobileControls.addEventListener("touchend", (e) => {
      doDepadTouch(e.touches,e,"end");
    });
  
    document.onkeydown = function (e) {
      try {
        if (e.key == "ArrowLeft") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_LEFT);
        }
        if (e.key == "ArrowRight") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_RIGHT);
        }
        if (e.key == "ArrowUp") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_UP);
        }
        if (e.key == "ArrowDown") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_DOWN);
        }
        if (e.key == "Enter") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_START);
        }
        if (e.key == "x") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_A);
        }
        if (e.key == "z") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_B);
        }
        if (e.key == "c") {
          nes.buttonDown(1, window.jsnes.Controller.BUTTON_SELECT);
        }
        //window.alert("no input errors.");
      } catch (e) {
        window.alert(e);
      }
    };
    document.onkeyup = function (e) {
      try {
        if (e.key == "ArrowLeft") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_LEFT);
        }
        if (e.key == "ArrowRight") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_RIGHT);
        }
        if (e.key == "ArrowUp") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_UP);
        }
        if (e.key == "ArrowDown") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_DOWN);
        }
        if (e.key == "Enter") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_START);
        }
        if (e.key == "x") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_A);
        }
        if (e.key == "z") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_B);
        }
        if (e.key == "c") {
          nes.buttonUp(1, window.jsnes.Controller.BUTTON_SELECT);
        }
        //window.alert("no input errors.");
      } catch (e) {
        window.alert(e);
      }
    };
    setInterval(() => {
      var scale = window.innerHeight / 240;
      cvs.style.height = scale * 240 + "px";
      cvs.style.width = scale * 256 + "px";
      cvs.style.position = "fixed";
      cvs.style.top = "50%";
      cvs.style.left = "50%";
      cvs.style.imageRendering = "pixelated";
      cvs.style.marginLeft = (scale * 256) / -2 + "px";
      cvs.style.marginTop = (scale * 240) / -2 + "px";
    }, 1);
    //window.alert("test");
    function _arrayBufferToBase64(buffer) {
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }
    window.loadURL = async function loadURL(url) {
      try {
        var f = await fetch(url, { mode: "cors" });
        var data = await f.arrayBuffer();
        nes.loadROM(atob(_arrayBufferToBase64(data)));
        setTimeout(() => {
          startTimer();
        }, 50);
        info.hidden = true;
        cvs.hidden = false;
      } catch (e) {
        window.alert(e);
      }
    };
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      // ... handle error ...
      window.alert(msg);
      return false;
    };
  } catch (e) {
    window.alert(e);
  }