const Serial = require('../../io/serial.js')

class PlayIoT {
    constructor(runtime, extensionId) {
        try {
            this._runtime = runtime;
            this._extensionId = extensionId;
            this._serial = null;
            this._runtime.registerPeripheralExtension(extensionId, this);
            this.reset = this.reset.bind(this);
            this._onConnect = this._onConnect.bind(this);
            this._onMessage = this._onMessage.bind(this);
            this._pollValues = this._pollValues.bind(this);
            this._messageJSON = null;
        } catch (error) {
            console.error("Error in constructor:", error);
        }
    }
        
    scan() {
        try {
            if (this._serial) this._serial.disconnectPeripheral();
            this._serial = new Serial(
                this._runtime,
                this._extensionId,
                this._onConnect,
                this._onMessage
            );
        } catch (error) {
            console.error("Error in scan():", error);
        }
    }
    
    connect(id) {
        try {
            if (this._serial) this._serial.connectPeripheral(id);
        } catch (error) {
            console.error("Error in connect():", error);
        }
    }
    
    disconnect() {
        try {
            if (this._serial) {
                this._serial.disconnectPeripheral();
                // this.reset();
            }
        } catch (error) {
            console.error("Error in disconnect():", error);
        }
    }
    
    reset() {
        try {
            // Add reset logic here if needed
        } catch (error) {
            console.error("Error in reset():", error);
        }
    }
    
    isConnected() {
        try {
            if (this._serial) {
                return this._serial.connected;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error in isConnected():", error);
            return false;
        }
    }    
    _onConnect () { }
    _pollValues () { }
    
    _onMessage (value) {
        try {
            this._messageJSON = JSON.parse(value)
            this.pot = this._messageJSON.potentiometer
            this.buttonA = this._messageJSON.button14
            this.buttonB = this._messageJSON.button15
            this.joyx = this._messageJSON.joyx
            this.joyy = this._messageJSON.joyy
        } catch (error) {            
            console.error("Error reading and parsing json:", error);
            return false; // Default fallback value
        }
    }
    isBtnPressedA = () => {
        try {
            return this.buttonA === 1;
        } catch (error) {
            console.error("Error checking buttonA:", error);
            return false; // Default fallback value
        }
    };

    isBtnPressedB = () => {
        try {
            return this.buttonB === 1;
        } catch (error) {
            console.error("Error checking buttonB:", error);
            return false; // Default fallback value
        }
    };
}
module.exports = PlayIoT
