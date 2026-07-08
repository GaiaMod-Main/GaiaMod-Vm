/**
 * @fileoverview
 * A utility for accurately measuring time.
 * To use:
 * ---
 * var timer = new Timer();
 * timer.start();
 * ... pass some time ...
 * var timeDifference = timer.timeElapsed();
 * ---
 * Or, you can use the `time` and `relativeTime`
 * to do some measurement yourself.
 */

class Convert2ArrayBuffer {

    Convertbase64(base64String){
        const buffer = Buffer.from(base64String, 'base64');
        // const arrayBuffer = buffer.buffer;
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        return arrayBuffer
    }

}
module.exports = Convert2ArrayBuffer;
