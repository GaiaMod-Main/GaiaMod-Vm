const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const AvrgirlArduino = require('./avrgirl-arduino.global.js');

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'display_setGroveSocketLed': {
            'en': '(LED) contrôler la LED sur la broche [PIN] à l\'état [STATE]',
            'fr': '(LED) set LED on pin [PIN] to state [STATE]'
        },
        'display_lcdSetText': {
            'en': '(lcd) show text [TEXT] on line [LINE] position [POS]',
            'fr': '(lcd) afficher le texte [TEXT] sur la ligne [LINE] position [POS]'
        },
        'display_lcdClear': {
            'en': '(lcd) clear screen',
            'fr': '(lcd) nettoyer l\'écran'
        },
        'io_readDigitalPin': {
            'en': 'read digital pin [PIN]',
            'fr': 'lire la broche numérique [PIN]'
        },
        'io_writeDigitalPin': {
            'en': 'write state [STATE] on digital pin [PIN]',
            'fr': 'écrire l\'état [STATE] sur la broche numérique [PIN]'
        },
        'io_readAnalogPin': {
            'en': 'read analog pin [PIN]',
            'fr': 'lire la broche analogique [PIN]'
        },
        'io_writeAnalogPin': {
            'en': 'write value [VALUE] on analog pin [PIN]',
            'fr': 'écrire la valeur [VALUE] sur la broche analogique [PIN]'
        },
        'sensors_getBmp280Data': {
            'en': '(BMP280) [DATA]',
            'fr': '(BMP280) [DATA]'
        },
        'sensors_getBmp280Data-temperature': {
            'en': 'température (°C)',
            'fr': 'temperature (°C)'
        },
        'sensors_getBmp280Data-pressure': {
            'en': 'pression (Pa)',
            'fr': 'pressure (Pa)'
        },
        'sensors_getBmp280Data-altitude': {
            'en': 'altitude (m)',
            'fr': 'altitude (m)'
        },
        'actuators_setServoAngle': {
            'en': '(Servomotor) set angle to [ANGLE] on pin [PIN]',
            'fr': '(Servomoteur) contrôler l\'angle à [ANGLE] on pin [PIN]'
        },
        'uart_sendData': {
            'en': '(uart) send command [DATA]',
            'fr': '(uart) envoyer la commande [DATA]'
        },
        'uart_sendDataAndGetResultAsString': {
            'en': '(uart) result of command [DATA]',
            'fr': '(uart) réponse de la commande [DATA]'
        },
        'uart_sendDataAndGetResultAsBoolean': {
            'en': '(uart) result of command [DATA]',
            'fr': '(uart) réponse de la commande [DATA]'
        }
    }
};

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAARCAYAAAAougcOAAAABmJLR0QA/wD/AP+gvaeTAAABxElEQVQ4jaWSP0hVYRjGf893jkVW1NQfaLB7ixAhkmhJaqmI0qFanAqigpaGMAkXZ4MsaIloLKEhHEylJSGQu0RLw12sbG8IVIILnu9p6N6LiKdz0mf8eJ/n95z3PaKprumhi0HMAqH5ZJm7Fi/YpASvvvWP3wjtB7FvDQBAFrc3CwAwHGBd6EY6tRVIS2nl3fBR5GvGvaUcZgI4gegpC1Fl+sFD5LGS80uRcCxx1m1prkT8T6XxZHBwUrYROA3EK1YYBDJgJHWsAo2c+VFnXAiKpIV9xBTmA6gT2AveDyRYxmGJ/NuOEnUoDYG3MaphuVcwuGEf+6UCO22dWwe/lMEvoCMHchAppF8vj9eB+uGZoevkQCAM2HY73NQd+LIaV98kSp79awtQ/Au3vqVbCq+BOaEMmLTVlSipAeeL3IX3aOqsnT1Cet5YySa37dKEzNWS3tIQQH2Y0x2dWsZaKO8rva6WPL848GTq+6fdI+DfZV0pQPX9/SPOfAdUMK7j1dnhvujlCmjHf0GUJT3GZ0rM77HjfFGVdiV8M0Kavy6zAiyWzMuJ0JgVF/4eXo2a2P7Y9q01NT4japh7W6DM/Oh/+vEPHTKb4lGhDqsAAAAASUVORK5CYII=';
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAcCAYAAAATFf3WAAAABmJLR0QA/wD/AP+gvaeTAAACXUlEQVRYhc3XT6gWVRzG8c95fcsMK0FKLW/ojUhUhFCCIAii1fUiFLVwF0FtK4iLq9yIG3HjQglqIeRKQTdBgq0yaNcfk6CN2j9cBHUxNbx6HxczL9jlTrxzZxS/MMyZc84855k58/vNOdxBkpeS/J3FmUtyIMnFhvY+mUuyBwb+yw48ZnF+xQw+b2jvkyFeHhXGZSP+wJq74aiJNgZh7V1x8T8snOL7jkGSFUkmk0xidQ+aH+FqDzqopvgcnulJ72vsw03s76j1MJQks3i0oxjcwo5SyndJHsQPeK6D3g3sGmgfKE38htfq8uuqtASXsac+xk1R8/gUByT5t8cEOwtJPruj7vvRqEk+HFPnl7r/oSGWLfGNzeM0Nqly5DiUMftNJLmAiQGuL8EcHC2lTOEFVVA0MZnkzSRP4p0W+huwbIgXsbmunMJbYwo8Up+HqgBp+pZXYl19fraFwUq8lHIe5yHJUy3ufSPJRuzG8oY+sziOY3i1rTm6R/BDeGCR+pP4RJUXYScOLWWArr+6LTiBr1RBM+KUyvzHqjRzEk90HIsk77dMK5eSbKvvXZ/k3bq8v6VOI13f4NP4NsmXmFZ9b6P6XuhjNTPAKziCs3XdfHP39uJ9cQPv1eUZ1SKkM30a/KKUcgZKKZdxsA/RPg2uWnDdtLdpT5KS5OckVzoG3d4kE0mmk/zZUStJUmqDQ8z19sTduYa38cH9uie5im9wqY3BW5a+8mnL47iIf0ZTXPB73dD0f96tSh0/3gOD8BO2DaGUkiRb8TyOqjcsC9iF7fjrHpibx+FSys3bhdaxMBqiRugAAAAASUVORK5CYII=';

const ARDUINO_UNO = {
    'usbProductId': 0x43,
    'usbVendorId': 0x2341
};

class Serial {
    /**
     * Creates an instance of Serial.
     * @private
     */
    constructor(baudRate, boardsFilter = null) {
        this.baudRate = baudRate;
        this.boardsFilter = boardsFilter;
        this.port = null;
        this.reader = null;
        this.readableStreamClosed = null;
        this.writer = null;
        this.dataReceived = null;
        this.isConnected = false;
        this.hasToClose = false;
        this.isLoopClosed = true;
        this.hasFirmware = true;
        this._dtr = true;
        this._rts = true;
        return this;
    };

    /**
     * Open serial port by serial API (navigator.serial).
     * @public
     * @return {void}
     */
    async open(callback) {
        if (this.boardsFilter !== null) {
            this.port = await navigator.serial.requestPort({
                filters: this.boardsFilter
            });
        } else {
            this.port = await navigator.serial.requestPort();
        }
        await this.port.open({
            baudRate: this._getBaudrate()
        });
        this.isConnected = true;
        if (callback) {
            this.dataReceived = this._loop_reader(callback);
        }
    };
    /**
     * Close serial port from navigator.
     * @public
     * @return {void}
     */
    async close() {
        try { this.reader.cancel(); } catch (e) { };
        await this.readableStreamClosed.catch(() => { });
        await this.port.close();
        this.reset();
    };
    /**
     * Reset serial.
     * @public
     */
    reset() {
        this.reader = null;
        this.readableStreamClosed = null;
        this.writer = null;
        this.dataReceived = null;
        this.port = null;
        this.isConnected = false;
        this.hasToClose = false;
    };
    /**
     * Get the defined baudrate.
     * @returns {int|function}
     */
    _getBaudrate() {
        if (typeof this.baudRate === 'function') {
            return this.baudRate();
        } else {
            return this.baudRate;
        }
    };
    /**
     * Get informations about board.
     * @public
     * @return {object} {usbVendorId, usbProductId}
     */
    async getInfo() {
        return await this.port.getInfo();
    };
    /**
     * Get serial input signals.
     * @public
     * @return {object} {dataCarrierDetect, clearToSend, ringIndicator, dataSetReady}
     */
    async getSignals() {
        return await this.port.getSignals();
    };
    /**
     * Write buffer to serial port.
     * @public
     * @param {Uint8Array} buffer
     * @param {int} delay
     * @return {void}
     */
    async write(buffer, delay = 0) {
        if (this.port !== null) {
            this.writer = this.port.writable.getWriter();
            await this.writer.write(buffer);
            this.writer.releaseLock();
            if (delay) {
                await this.sleep(delay);
            }
        }
    };
    /**
     * Create generator for reading packet from serial port.
     * @private
     * @yield {string}
     * @return {void}
     */
    async* _loop_reader(callback) {
        while (this.port && this.port.readable !== null && !this.port.readable.locked && !this.hasToClose) {
            const decoder = new TextDecoderStream();
            this.readableStreamClosed = this.port.readable.pipeTo(decoder.writable);
            this.reader = decoder.readable.getReader();
            try {
                while (true) {
                    const { value, done } = await this.reader.read();
                    if (done || !value) {
                        break;
                    }
                    if (value) {
                        yield value;
                    }
                }
            } catch (error) {
                error = String(error);
                console.error(error);
                callback(error);
            } finally {
                if (this.reader) {
                    this.reader.releaseLock();
                }
            }
        }
    };
    /**
     * Get next read packet from serial port.
     * @public
     * @return {string}
     * @memberof Serial
     */
    async read() {
        return await this.dataReceived.next();
    };
    /**
     * Waiting function in milliseconds.
     * @public
     * @param {int}
     * @return {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
};

/**
 * Manage communication with a Arduino peripheral over a Scrath Link client socket.
 */
class Arduino {

    /**
     * Construct a Arduino communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor(runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        this._runtime.registerPeripheralExtension(extensionId, this);

        this._serialMonitorConnected = false;
        this.waitingResponse = false;
        this.response = false;
        this.info = {};
        this.avrgirl = null;

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */
        this._led13 = false;

        // Create a new Serial instance
        this._serial = new Serial(9600, [ARDUINO_UNO]);

        this.reset = this.reset.bind(this);
        this.ready = false;
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    async connect() {
        try {
            await this._serial.open();
            this.info.lastConnection = {
                id: await this._serial.getInfo(),
                signals: await this._serial.getSignals(),
                port: this._serial.port
            };
            this._serialMonitorConnected = true;
            this._runtime.emit(this._runtime.constructor.PERIPHERAL_CONNECTED);
            this._readingLoop();
        } catch (e) {
            const err = String(e);
            console.log(err)
            if (err.match(/(DOMException|NotFoundError): No port selected by the user/)) {
                this._serial.reset();
            } else if (err.match(/NetworkError: Failed to open serial port/)) {
                this._serial.reset();
            }
        }
    }

    /**
     * Reset board parameters.
     */
    reset() {
        this._serialMonitorConnected = false;
        this.hasToClose = false;
        this._serial.reset();
        this.avrgirl = null;
    }

    async uploadFile() {
        if (this._serialMonitorConnected) {
            this.hasToClose = true;
            await this._serial.reader.cancel();
            await this._serial.close()
            this.reset();
            console.log(jsonPath('code.serialAPI.boardDisconnected'), 'warning');
            console.log('code.serialAPI.serialPortClosed', 'success');
        }
        const response = await fetch('https://vittascience.com/public/bin/arduino-extension/vitta_arduino_extension.hex');
        console.log(response)
        if (response.status !== 200) {
            console.log(await response.text());
            throw new Error(`Unexpected status code: ${response.status}`);
        } else {
            const hex = await response.text();
            try {
                console.log('code.successMsg.uploading');
                this.avrgirl = new AvrgirlArduino({
                    board: 'uno',
                    debug: true
                });
                var _this = this;
                await this.avrgirl.flash(hex, function (error, info) {
                    if (error) {
                        console.log(error)
                        const err = String(error);
                        if (err.match(/(DOMException|NotFoundError): No port selected by the user/)) {
                            console.log('code.serialAPI.noPortSelected', 'warning');
                            _this.reset();
                        } else if (err.match(/NetworkError: Failed to open serial port/)) {
                            console.log('code.serialAPI.serialPortOpeningFail', 'warning');
                            _this.reset();
                        } else if (err.match(/(DOMException|NetworkError): The device has been lost/)) {
                            console.log('code.serialAPI.boardDisconnected', 'warning');
                            _this.reset();
                        } else if (err.match(/ProductError: connected board is not/)) {
                            console.log("Carte détectée: <b>Carte Arduino UNO</b>.");
                            const errorMsg = jsonPath('code.serialAPI.badBoard') + '<b>' + _this.avrgirl.connection.board.name + '</b>. ' + jsonPath('code.serialAPI.checkBoardSettings');
                            console.log(errorMsg, 'warning');
                            _this.reset();
                        } else if (err.match(/(DOMException|ParityError|BufferOverrunError)\: A ((framing|parity) error|buffer overrun|break condition) has been detected\./)) {
                            console.log('code.serialAPI.flashFailed', 'warning');
                            _this.doDisconnect();
                        }
                    } else {
                        console.log('code.serialAPI.fileDownloadedArduino', 'success');
                        this.peripheral.ready = true;
                        alert('Arduino program uploaded !')
                    }
                    if (info && typeof info === 'object') {
                        _this.info.lastConnection = info;
                    }
                }, true);
            } catch (e) {
                console.error(e)
            }
        }
        return Promise.resolve(0);
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset() {
        return this._serial.reset();
    }

    /**
     * Return true if connected to the arduino.
     * @return {boolean} - whether the arduino is connected.
     */
    isConnected() {
        return this._serial.isConnected;
    }

    /**
     * Send a message to the peripheral.
     * @param {Uint8Array} command - the message to write
     */
    async send(command) {
        if (!this.isConnected()) return;
        await this.waitBoardResponse();
        this.waitingResponse = true;
        console.log("sending:" + command)
        const buffer = new TextEncoder('utf-8').encode(command);
        await this._serial.write(buffer);
    }

    async waitBoardResponse() {
        const waitFor = function (conditionFunction) {
            const poll = resolve => {
                if (conditionFunction()) resolve();
                else setTimeout(_ => poll(resolve), 0);
            }
            return new Promise(poll);
        };
        var _this = this;
        await waitFor(_ => _this.waitingResponse === false);
        return _this.response;
    }

    /**
     * Start the asynchronous reading loop.
     */
    async _readingLoop() {
        const decoder = new TextDecoderStream();
        this._serial.readableStreamClosed = this._serial.port.readable.pipeTo(decoder.writable);
        this._serial.reader = decoder.readable.getReader();
        this.hasToClose = false;
        try {
            while (!this.hasToClose && this._serial.reader) {
                await this.sleep(50);
                if (this._serial.reader !== null) {
                    const { value, done } = await this._serial.reader.read();
                    if (done || !value) {
                        break;
                    } else {
                        this.buffer += value;
                        const parsedRep = this._parseResponse(this.buffer);
                        if (parsedRep.textToPrint != "") {
                            console.log(parsedRep.textToPrint);
                        }
                        this.buffer = parsedRep.buffer;
                    }
                } else {
                    break;
                }
            }
        } catch (error) {
            const err = String(error);
            console.log(err)
            if (err.match(/(DOMException|NetworkError): The device has been lost/)) {
                console.log(jsonPath('code.serialAPI.boardDisconnected'), 'warning');
                this.reset();
            } else if (err.match(/(ParityError|FramingError|BreakError|BufferOverrunError): A ((framing|parity) error|buffer overrun|break condition) has been detected\./)) {
                console.log(jsonPath('code.serialAPI.baudrateError'), 'warning');
                await this._serial.close();
                this.reset();
            }
        } finally {
            this.hasToClose = true;
        }
    }

    /**
     * Parse buffer received by serial to get some informations.
     * @param {string} buffer
     * @returns {object}
     */
    _parseResponse(buffer) {
        let linesToPrint = new Array();
        while (true) {
            if (/\n/.test(buffer)) {
                const strSplitted = buffer.split('\n');
                buffer = "";
                // Check first item
                if (strSplitted[0] != "") {
                    buffer += strSplitted[0];
                }
                const data = {
                    'str': strSplitted[0],
                    'buffer': strSplitted.join('\n'),
                    'push': buffer,
                    'resetBuf': true
                };
                const dataParsed = this._parseCase(data, buffer);
                buffer = dataParsed.buffer;
                if (dataParsed.line !== null) {
                    linesToPrint.push(dataParsed.line);
                }
                // Loop
                const lastIndex = strSplitted.length - 1;
                for (var s = 1; s < lastIndex; s++) {
                    const data = {
                        'str': strSplitted[s],
                        'buffer': strSplitted.slice(s).join('\n'),
                        'push': strSplitted[s]
                    };
                    const dataParsed = this._parseCase(data, buffer);
                    buffer = dataParsed.buffer;
                    if (dataParsed.line !== null) {
                        linesToPrint.push(dataParsed.line);
                    }
                }
                // Check last item
                if (strSplitted[lastIndex] == "") {
                    if (buffer != "") {
                        const data = {
                            'str': "",
                            'buffer': "",
                            'push': buffer
                        }
                        const dataParsed = this._parseCase(data, buffer);
                        buffer = dataParsed.buffer;
                        if (dataParsed.line !== null) {
                            linesToPrint.push(dataParsed.line);
                        }
                    }
                    buffer = "";
                } else if (lastIndex) {
                    buffer += strSplitted[lastIndex];
                }
            }
            break;
        }
        let textToPrint = "";
        for (var i = 0; i < linesToPrint.length; i++) {
            if (linesToPrint[i].indexOf("{\"cmd\":") > -1) {
                this.response = JSON.parse(linesToPrint[i]);
                this.waitingResponse = false;
                console.log(this.response)
            } else {
                textToPrint += linesToPrint[i] + "\n";
            }
        }
        return { textToPrint, buffer };
    }

    /**
     * Parse switching case.
     * @param {Object} data
     * @param {string} buf
     * @returns
     */
    _parseCase(data, buf) {
        let line = data.push;
        if (data.resetBuf) {
            buf = "";
        }
        return { 'buffer': buf, 'line': line };
    }

    /**
 * Waiting function in milliseconds.
 * @public
 * @param {int}
 * @return {Promise}
 */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Scratch3VittaArduinoBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'Arduino';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'vittaarduino';
    }

    /**
     * Construct a set of Arduino blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new Arduino peripheral instance
        this._peripheral = new Arduino(this.runtime, Scratch3VittaArduinoBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        this._locale = this.setLocale();
        return {
            id: 'vittaarduino',
            name: 'arduino',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // FIXME:
            blocks: [
                {
                    opcode: 'display_setGroveSocketLed',
                    text: this.getMessage('display_setGroveSocketLed'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATE: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: 1,
                            menu: 'state'
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2,
                            menu: 'digital_pins'
                        },
                    }
                },
                {
                    opcode: 'display_lcdSetText',
                    text: this.getMessage('display_lcdSetText'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Bonjour Vittabot'
                        },
                        LINE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        POS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                    }
                },
                {
                    opcode: 'display_lcdClear',
                    text: this.getMessage('display_lcdClear'),
                    blockType: BlockType.COMMAND,
                },
                '---',
                {
                    opcode: 'io_readDigitalPin',
                    text: this.getMessage('io_readDigitalPin'),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2,
                            menu: 'digital_pins'
                        },
                    }
                },
                {
                    opcode: 'io_writeDigitalPin',
                    text: this.getMessage('io_writeDigitalPin'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATE: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: 1,
                            menu: 'state'
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2,
                            menu: 'digital_pins'
                        },
                    }
                },
                {
                    opcode: 'io_readAnalogPin',
                    text: this.getMessage('io_readAnalogPin'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            menu: 'analog_pins'
                        },
                    }
                },
                {
                    opcode: 'io_writeAnalogPin',
                    text: this.getMessage('io_writeAnalogPin'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3,
                            menu: 'analog_write_pins'
                        },
                    }
                },
                '---',
                {
                    opcode: 'sensors_getBmp280Data',
                    text: this.getMessage('sensors_getBmp280Data'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Temperature',
                            menu: 'bmp280'
                        },
                    }
                },
                '---',
                {
                    opcode: 'actuators_setServoAngle',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('actuators_setServoAngle'),
                    arguments: {
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
                        },
                        PIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 4,
                            menu: 'servo_pins'
                        }
                    }
                },
                '---',
                {
                    opcode: 'uart_sendData',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('uart_sendData'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'digitalWrite(2, 1)'
                        }
                    }
                },
                {
                    opcode: 'uart_sendDataAndGetResultAsString',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('uart_sendDataAndGetResultAsString'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'analogRead(0)'
                        }
                    }
                },
                {
                    opcode: 'uart_sendDataAndGetResultAsBoolean',
                    blockType: BlockType.BOOLEAN,
                    text: this.getMessage('uart_sendDataAndGetResultAsBoolean'),
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'digitalRead(4)'
                        }
                    }
                }
            ],
            menus: {
                temperature_unit: {
                    acceptReporters: false,
                    items: [{
                        text: '(°C)',
                        value: 'CELSIUS'
                    }, {
                        text: '(K)',
                        value: 'KELVIN'
                    }, {
                        text: '(°F)',
                        value: 'FAHRENHEIT'
                    }]
                },
                state: {
                    acceptedReporters: false,
                    items: [{
                        text: 'HIGH (1)',
                        value: 1
                    }, {
                        text: 'LOW (0)',
                        value: 0
                    }]
                },
                bmp280: {
                    acceptReporters: false,
                    items: [{
                        text: this.getMessage('sensors_getBmp280Data-temperature'),
                        value: 'Temperature'
                    }, {
                        text: this.getMessage('sensors_getBmp280Data-pressure'),
                        value: 'Pressure'
                    }, {
                        text: this.getMessage('sensors_getBmp280Data-altitude'),
                        value: 'Altitude'
                    }]
                },
                digital_pins: {
                    acceptReporters: false,
                    items: [{
                        text: 'D2',
                        value: 2
                    }, {
                        text: 'D3',
                        value: 3
                    }, {
                        text: 'D4',
                        value: 4
                    }, {
                        text: 'D5',
                        value: 5
                    }, {
                        text: 'D6',
                        value: 6
                    }, {
                        text: 'D7',
                        value: 7
                    }, {
                        text: 'D8',
                        value: 8
                    }, {
                        text: 'D9',
                        value: 9
                    }, {
                        text: 'D10',
                        value: 10
                    }, {
                        text: 'D11',
                        value: 11
                    }, {
                        text: 'D12',
                        value: 12
                    }]
                },
                analog_pins: {
                    acceptReporters: false,
                    items: [{
                        text: 'A0',
                        value: 0
                    }, {
                        text: 'A1',
                        value: 1
                    }, {
                        text: 'A2',
                        value: 2
                    }, {
                        text: 'A3',
                        value: 3
                    }, {
                        text: 'A4',
                        value: 4
                    }, {
                        text: 'A5',
                        value: 5
                    }]
                },
                analog_write_pins: {
                    acceptReporters: false,
                    items: [{
                        text: 'D3',
                        value: 3
                    }, {
                        text: 'D5',
                        value: 5
                    }, {
                        text: 'D6',
                        value: 6
                    }, {
                        text: 'D9',
                        value: 9
                    }, {
                        text: 'D10',
                        value: 10
                    }, {
                        text: 'D11',
                        value: 11
                    }]
                },
                servo_pins: {
                    acceptReporters: false,
                    items: [{
                        text: 'D4',
                        value: 4
                    }, {
                        text: 'D5',
                        value: 5
                    }]
                }
            }
        };
    }

    // *** Common blocks utils functions *** //

    async getResponse(command) {
        await this._peripheral.waitBoardResponse();
        this._peripheral.send(command);
        return await this._peripheral.waitBoardResponse();
    }

    async uart_sendDataAndGetResult(args) {
        const response = await this.getResponse(args.DATA);
        return response.value;
    }

    // *** Blocks extension functions *** //

    async display_setGroveSocketLed(args) {
        await this._peripheral.send(`digitalWrite(${args.PIN},${args.STATE})`);
    }

    async display_lcdSetText(args) {
        await this._peripheral.send(`lcdRgb.setCursor(${args.LINE},${args.POS})`);
        await this._peripheral.send(`lcdRgb.print(\"${args.TEXT}\")`);
    }

    async display_lcdClear() {
        await this._peripheral.send(`lcdRgb.clear()`);
    }

    async io_writeDigitalPin(args) {
        await this._peripheral.send(`digitalWrite(${args.PIN},${args.STATE})`);
    }

    async io_readDigitalPin(args) {
        const response = await this.getResponse(`digitalRead(${args.PIN})`);
        return response.value;
    }

    async io_writeAnalogPin(args) {
        await this._peripheral.send(`analogWrite(${args.PIN},${args.VALUE})`);
    }

    async io_readAnalogPin(args) {
        const response = await this.getResponse(`analogRead(${args.PIN})`);
        return response.value;
    }

    async sensors_getBmp280Data(args) {
        const response = await this.getResponse(`bmp280.read${args.DATA}()`);
        return response.value;
    }

    async actuators_setServoAngle(args) {
        await this._peripheral.send(`servos.write(${args.PIN},${args.ANGLE})`);
    }

    async uart_sendData(args) {
        await this._peripheral.send(args.DATA);
    }

    async uart_sendDataAndGetResultAsString(args) {
        const response = await this.getResponse(args.DATA);
        if (isNaN(parseInt(response.value))) {
            return response.value;
        } else {
            return parseInt(response.value);
        }
    }

    async uart_sendDataAndGetResultAsBoolean(args) {
        const response = await this.getResponse(args.DATA);
        return Boolean(response.value);
    }

    // *** Util extension functions *** //

    setLocale() {
        const locale = formatMessage.setup().locale;
        if (localisation.availableLocales.includes(locale)) {
            return locale;
        } else {
            return 'en';
        }
    }

    getMessage(id) {
        return localisation.messages[id][this._locale];
    }

    reverseString(str) {
        if (str === "") return "";
        return this.reverseString(str.substr(1)) + str.charAt(0);
    }

    toBinString(bytes, size) {
        return bytes.reduce((str, byte) => str + ':' + this.reverseString(byte.toString(2).padStart(size, '0')), '');
    }

}

module.exports = Scratch3VittaArduinoBlocks;
