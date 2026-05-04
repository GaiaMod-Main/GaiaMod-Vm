const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'display_stm32_controlColorLed': {
            'en': 'control [LED] to state [STATE]',
            'fr': 'contrôler la [LED] à l\'état [STATE]'
        },
        'display_stm32_toggleColorLed': {
            'en': 'toggle state of [LED]',
            'fr': 'inverser l\'état de la [LED]'
        },
        'display_lcdSetText': {
            'en': '(lcd) show text [TEXT] on line [LINE] position [POS]',
            'fr': '(lcd) afficher le texte [TEXT] sur la ligne [LINE] position [POS]'
        },
        'display_lcdClear': {
            'en': '(lcd) clear screen',
            'fr': '(lcd) nettoyer l\'écran'
        },
        'io_stm32_getSwitchState': {
            'en': 'read state of switch [SWITCH]',
            'fr': 'lire l\'état du bouton [SWITCH]'
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
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAkCAMAAAA96dOpAAABAlBMVEUAAAAA/wAAgIAAqlUgv4AcqnEas4Aktm0ornkktm0juXQms3EktnYis3chtXMfsnQjuHEktnMjtHQhs3Iks3UgtnIjtnUhtXMjtHIjtnQitXIjtnIitXMitXQitnMhtHIjtnIhtHQitnIjtHMitXIitHQitXMitnMitnIitXMitXMitHIitHQitXQjtHIitXIitHMitXMhtnMitXQitHMitHMitXIitXMitHMitXMitXIjtXMitXMitXMitXMitHMitXMitXMhtXMitXMitXIitXMitXMhtnMitXMitXMitXMitXMitHMitXMitXMitXMitXMitXMitXMitXMitXP///8U/uXtAAAAVHRSTlMAAQIDCAkKDhMVFhscHh8hJCosLzI4Oz5BQkxXWVpbXF5jaW1yd3iBiImOj5aYmpydn6CjpKu5u7y9xMfMz9HU1djd4OHn6Ozt7u/x8/T2+fv8/f5/HxnwAAAAAWJLR0RVkwS4MwAAAOdJREFUOMtjUA9BBsHKDDiAP4q6EAcqqwtUIE5dSKClOSYwE8ZQhx24EqnOfxCpc9AiTp0EmzMx6kwYGKSJUWckyqHhE2KoqupPwF4lASAhxcDgjVudrbYXQp0HTnVBHAyKUHWODGoBuM0TZFCDqvNl0MXjD30mX4g6W1lGGzzqjJlB/uBS4mPgM8AXLnYMmn4hSgw8KtbB+MNPm5VdTpzdl3A4u+tJMvATF78yvESpM2VhkA8mQp0QMHPZE6FOjIGByYUIdXYi3DqDOh/RR52uEwh4YpFzc0IAfWjpxmnliQ4sWJGLPwCBMIpoo1wC0gAAAABJRU5ErkJggg==';
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAkCAYAAAAKNyObAAAABmJLR0QA/wD/AP+gvaeTAAAB9klEQVRYhe3XT4hOYRTH8c+ZBgv/oiYLMpRSRPmzsBY7s7JTLCwUZUFCsmEpZRayUmyUhcxCWZosJBvNYpqUoqGEUgjTTDNzLOadmsYwvc/7vDVpvnW79z733N/5dc597nOvzLySZUxm5mltJDJzFEsL7x+KiO01Dc2ko13CNWjV3NbMPFbFyRy02laYwFNM1rFEQ+t8DXPt4uNCfubWLmRz//dsbSs1zQ3hRkW9Kq+SafbjhSmT3RX0xmpV7l5E9EfEL1yopKmzks54Zu7Da+zCD6zAXbxqxFzVbIcyc7Twq2Q2JzNzy6yxQzPyfGtSb7S0rQPoxdcm7hlvNkmJuUkciIgzODdP7HXIzItY1WyiEnMdWNc47pondkNjv0nB813a1rOZ2YHL/4gZwInMDOwtSVI6W5chsHzW+HecwuOIGM7MbtzGnpIkpZXbGRETuIaR6cGI+IxHOJyZz/EWxwtztLRC9OISlqAH70218oM/K1rCWKvL1xc8xP2IeJKZm/GmgrEq5mZyBM8wXEGLimvrA/RFxDscRdYQrVW5HRExOH2SmYNo9X+2WuVWTx803n8ra4jWMncrM3dn5nrcxMYaogv517BaW9vCorlSFs2V0ok7ODjHtTWNrRaf8LOJ+P7425XM7EIftrXqCi/RExEj80bO4Deq8F7axskU7QAAAABJRU5ErkJggg==';

const STM32_NUCLEO_WB55 = {
    'usbProductId': 0x9800,
    'usbVendorId': 0xf055
};

/**
 * @class Serial
 */
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
        this.writer = null;
        this.dataReceived = null;
        this.isConnected = false;
        this.isClosing = false;
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
    async open() {
        if (this.boardsFilter !== null) {
            this.port = await navigator.serial.requestPort({
                filters: this.boardsFilter
            });
        } else {
            this.port = await navigator.serial.requestPort();
        }
        await this.port.open({
            baudRate: this.baudRate
        });
        this.isConnected = true;
        this.dataReceived = this._loop_reader();
    };
    /**
     * Close serial port from navigator.
     * @public
     * @return {void}
     */
    async close() {
        return await this.port.close();
    };
    /**
     * Reset serial.
     * @public
     */
    reset() {
        this.reader = null;
        this.writer = null;
        this.dataReceived = null;
        this.port = null;
        this.isConnected = false;
        this.isClosing = false;
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
     * @return {void}
     */
    async write(buffer) {
        this.writer = this.port.writable.getWriter();
        await this.writer.write(buffer);
        this.writer.releaseLock();
    };
    /**
     * Create generator for reading packet from serial port.
     * @private
     * @yield {Uint8Array}
     * @return {void}
     */
    async *_loop_reader() {
        this.isLoopClosed = false;
        let dataClosing = "";
        const decoder = new TextDecoder('utf-8');
        try {
            this.reader = this.port.readable.getReader();
            while (true) {
                const {
                    value,
                    done
                } = await this.reader.read();
                if (done || !value) {
                    this.reader.releaseLock();
                    break;
                }
                if (value) {
                    if (this.isClosing) {
                        dataClosing += decoder.decode(value);
                        if (/exec\(open\(\'main\.py\'\)\.read\(\),globals\(\)\)/.test(dataClosing) || !this.hasFirmware) {
                            this.reader.releaseLock();
                            break;
                        }
                    } else {
                        yield value;
                    }
                }
                await this.sleep(40);
            }
        } catch (error) {
            error = String(error);
            console.log(error);
            if (error.match(/(DOMException|ParityError|BufferOverrunError): A ((framing|parity) error|buffer overrun) has been detected\./)) {
                this.dataReceived = null;
                this.dataReceived = this._loop_reader();
            } else if (error.match(/(DOMException|BreakError): A break condition has been detected\./)) {
                console.log('Dlease refresh page.')
            } else if (error.match(/(DOMException|NetworkError): The device has been lost\./)) {
                this.reset();
            }
        } finally {
            this.isLoopClosed = true;
        }
    };
    /**
     * Get next read packet from serial port.
     * @public
     * @return {Uint8Array}
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
 * @class MicropythonRepl
 */
class MicropythonRepl {
    /**
     * Creates an instance of Micropythonthis.
     * @private
     */
    constructor(peripheral, serial) {
        this.OPEN_REPL = '\x03';
        this.END_MPY_CMD = '\r\n';
        this.serial = serial;
        this.peripheral = peripheral;
        this.buffer = "";
        this.hasFirmware = true;
        this.Queue = new Queue();
        return this;
    };
    /**
     * Open REPL by sending [0x03] to serial port.
     * @public
     * @return
     */
    async open() {
        return await this.serial.write(new TextEncoder('utf-8').encode(this.OPEN_REPL));
    };
    /**
     * Send micropython command to serial port.
     * @public
     * @param {string} cmd
     * @return
     */
    async sendCommand(cmd) {
        return await this.serial.write(new TextEncoder('utf-8').encode(cmd + this.END_MPY_CMD));
    };
    /**
     * Add Micropython command in Queue.
     * @public
     * @param {string} cmd
     */
    enqueueCommand(cmd) {
        this.Queue.enqueue(cmd);
    };
    /**
     * Send list of Micropython command to this.
     * @public
     * @param {Array<string>} commands
     * @returns {void}
     */
    enqueueCommandList(commands) {
        for (let i = 0; i < commands.length; i++) {
            this.enqueueCommand(commands[i]);
        }
    };
    /**
     * Check if line found at the end of serial buffer.
     * @private
     * @param {string} buffer
     * @param {string} line
     * @param {int} index
     * @returns {boolean}
     * @memberof MicropythonRepl
     */
    _isEndOf(buffer, line, index) {
        const strSplitted = buffer.split('\n');
        if (strSplitted[strSplitted.length - index] === line) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * Parse buffer received by serial to get some informations.
     * @private
     * @param {string} buffer
     * @returns {object}
     * @memberof MicropythonRepl
     */
    _parseResponse(buffer) {
        let linesToPrint = new Array();
        let isError = false;
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
                const dataParsed = this._parseCase(data, buffer, isError);
                buffer = dataParsed.buffer;
                isError = dataParsed.isError;
                if (dataParsed.line !== null) {
                    linesToPrint.push(dataParsed.line);
                }
                if (isError) {
                    break;
                }
                // Loop
                const lastIndex = strSplitted.length - 1;
                for (var s = 1; s < lastIndex; s++) {
                    const data = {
                        'str': strSplitted[s],
                        'buffer': strSplitted.slice(s).join('\n'),
                        'push': strSplitted[s]
                    };
                    const dataParsed = this._parseCase(data, buffer, isError);
                    buffer = dataParsed.buffer;
                    isError = dataParsed.isError;
                    if (dataParsed.line !== null) {
                        linesToPrint.push(dataParsed.line);
                    }
                    if (isError) {
                        break;
                    }
                }
                if (isError) {
                    break;
                }
                // Check last item
                if (strSplitted[lastIndex] == "") {
                    if (buffer != "") {
                        const data = {
                            'str': "",
                            'buffer': "",
                            'push': buffer
                        }
                        const dataParsed = this._parseCase(data, buffer, isError);
                        buffer = dataParsed.buffer;
                        isError = dataParsed.isError;
                        if (dataParsed.line !== null) {
                            linesToPrint.push(dataParsed.line);
                        }
                        if (isError) {
                            break;
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
                const cleanedLine = this.convert(linesToPrint[i]);
                this.peripheral.response = JSON.parse(cleanedLine);
                this.peripheral.waitingResponse = false;
                console.log(this.peripheral.response)
            } else {
                textToPrint += linesToPrint[i] + "\n";
            }
        }
        return {
            textToPrint,
            buffer,
            isError
        };
    };
    /**
     * Parse switching case.
     * @param {Object} data
     * @param {string} buffer
     * @param {boolean} isError
     * @returns
     */
    _parseCase(data, buffer, isError) {
        let line = null;
        if (/Traceback/.test(data.str)) {
            isError = true;
            buffer = data.buffer;
        } else if (/rst\:0x3 \(SW\_RESET\)/.test(data.str) || /rst\:0x10 \(RTCWDT\_RTC\_RESET\)/.test(data.str) || /esp\_image\: checksum failed\./.test(data.str)) {
            this.hasFirmware = false;
        } else {
            line = data.push;
            if (data.resetBuf) {
                buffer = "";
            }
        }
        return { 'isError': isError, 'buffer': buffer, 'line': line };
    };
    /**
     * Set REPL state and update its button style.
     * @public
     * @param {boolean} state
     * @returns {void}
     */
    setRepl(state) {
        if (this.isOpen != state) {
            this.isOpen = state;
        }
    };
    /**
     * Reading loop for printing data read by serial 'dataReceived' yield on console.
     * @public
     * @param {boolean} state
     * @returns {void}
     */
    async readingLoop() {
        const utf8Decoder = new TextDecoder('utf-8');
        while (true) {
            if (!this.serial.isConnected) {
                break;
            }
            const { value, done } = await this.serial.read();
            if (done || !value) {
                if (this.serial.isClosing) {
                    break;
                }
                continue;
            } else {
                this.buffer += utf8Decoder.decode(value);
                if (this._isEndOf(this.buffer, '>>> ', 1)) {
                    this._parseResponse(this.buffer);
                    this.setRepl(true);
                    this.buffer = "";
                    if (!this.Queue.isEmpty()) {
                        await this.sendCommand(this.Queue.dequeue());
                    } else {
                        this.Queue.reset();
                    }
                } else {
                    this.setRepl(false);
                }
                const parsedRep = this._parseResponse(this.buffer);
                this.buffer = parsedRep.buffer;
                if (parsedRep.textToPrint) {
                    // TO DO : where go user data from serial (errors or print())
                    console.log(parsedRep.textToPrint);
                }
            }
        }
    };

    convert (line) {
        line = line.replace(/True/gi, "true");
        line = line.replace(/False/gi, "false");
        line = line.replace(/None/gi, "null");
        return line;
    };

}

class Queue {
    constructor() {
        this.data = [];
        this.rear = 0;
    }
    enqueue(element) {
        this.data[this.rear] = element;
        this.rear = this.rear + 1;
    };
    length() {
        return this.rear;
    }
    isEmpty() {
        return this.rear === 0;
    }
    dequeue() {
        if (this.isEmpty() === false) {
            this.rear = this.rear - 1;
            return this.data.shift();
        }
    };
    reset() {
        this.data = [];
        this.rear = 0;
    };
}

/**
 * Manage communication with a MicroBit peripheral over a Scrath Link client socket.
 */
class STM32 {

    /**
     * Construct a MicroBit communication object.
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

        this.waitingResponse = false;
        this.response = false;

        // Create a new Serial instance
        this._serial = new Serial(115200, [STM32_NUCLEO_WB55]);

        // Create a new MicropythonRepl instance
        this._repl = new MicropythonRepl(this, this._serial);

        this.reset = this.reset.bind(this);
        this.ready = false;
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    async connect() {
        try {
            await this._serial.open();
            console.log(await this._serial.getInfo());
            console.log(await this._serial.getSignals());
            console.log(this._serial.port);
            this.ready = true;
            this._repl.readingLoop();
        } catch (e) {
            let err = String(e);
            console.log(err)
            if (err.match(/(DOMException|NotFoundError): No port selected by the user/)) {
                this._serial.reset();
            }
            if (err.match(/NetworkError: Failed to open serial port/)) {
                this._serial.reset();
            }
        }
    }

    downloadFile() {
        let fileName = 'vitta_stm32.py';

        const a = window.document.createElement('a');
        // TODO Warning this static file must be present at this very specific
        // path of the target website. For now, the .hex file is manualy added
        // in the "static" dir of "scratch-gui" which introduces a strong
        // coupling between the path below and the "scratch-gui" package
        // organization. But this is better than a very big hex string in this
        // JavaScript file.
        a.href = `extensions/vittaSTM32/${fileName}`;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        return Promise.resolve(0);
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset() {
        return this._serial.reset();
    }

    /**
     * Return true if connected to the micro:bit.
     * @return {boolean} - whether the micro:bit is connected.
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
        if (!this._repl.isOpen) {
            this.toggleReplOverture();
        }
        await this.waitRepl();
        this._repl.sendCommand(command);
    }

    /**
     * Get a response value from the peripheral by enqueuing commands.
     * @param {Array<string>} commands
     */
    async get(commands) {
        if (!this.isConnected()) return;
        this._repl.enqueueCommandList(commands);
        this.waitingResponse = true;
        if (!this._repl.isOpen) {
            this.toggleReplOverture();
        } else {
            this._repl.sendCommand(this._repl.Queue.dequeue());
        }
    }

    waitFor(conditionFunction) {
        const poll = resolve => {
            if (conditionFunction()) {
                resolve();
            } else {
                setTimeout(_ => poll(resolve), 0);
            }
        }
        return new Promise(poll);
    };

    async waitRepl() {
        var that = this;
        await this.waitFor(_ => that._repl.isOpen === true);
    }

    async waitBoardResponse() {
        var that = this;
        await this.waitFor(_ => that.waitingResponse === false);
        return this.response;
    }

    async toggleReplOverture() {
        var that = this;
        const openRepl = async function () {
            if (that._repl && that._serial.hasFirmware) {
                if (!that._repl.isOpen) {
                    await that._repl.open();
                }
            }
        };
        if (this._serial.isConnected) {
            await openRepl();
        } else {
            await this.connect();
            if (this._serial.isConnected) {
                await openRepl();
            }
        }
    };
}

class Scratch3VittaSTM32Blocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return 'stm32';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return 'vittaSTM32';
    }

    /**
     * Construct a set of MicroBit blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new MicroBit peripheral instance
        this._peripheral = new STM32(this.runtime, Scratch3VittaSTM32Blocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        this._locale = this.setLocale();
        return {
            id: 'vittaSTM32',
            name: 'stm32',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'display_stm32_controlColorLed',
                    text: this.getMessage('display_stm32_controlColorLed'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LED: {
                            type: ArgumentType.STRING,
                            defaultValue: 'pyb.LED(1)',
                            menu: 'led'
                        },
                        STATE: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: 1,
                            menu: 'state'
                        }
                    }
                },
                {
                    opcode: 'display_stm32_toggleColorLed',
                    text: this.getMessage('display_stm32_toggleColorLed'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LED: {
                            type: ArgumentType.STRING,
                            defaultValue: 'pyb.LED(1)',
                            menu: 'led'
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
                    opcode: 'io_stm32_getSwitchState',
                    text: this.getMessage('io_stm32_getSwitchState'),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        SWITCH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'SW1',
                            menu: 'switch'
                        },
                    }
                },
                {
                    opcode: 'io_readDigitalPin',
                    text: this.getMessage('io_readDigitalPin'),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            defaultValue: 'D0',
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
                            type: ArgumentType.STRING,
                            defaultValue: 'D0',
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
                            type: ArgumentType.STRING,
                            defaultValue: 'A0',
                            menu: 'analog_pins'
                        },
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
                            defaultValue: 'pyb.LED(2).on()'
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
                            defaultValue: 'getGroveTemperature(pyb.ADC(\'A0\'))'
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
                            defaultValue: 'pyb.Pin(\'SW1\').value()'
                        }
                    }
                }
            ],
            menus: {
                led: {
                    acceptedReporters: false,
                    items: [{
                        text: 'LED1 (blue)',
                        value: 'pyb.LED(3)'
                    }, {
                        text: 'LED2 (green)',
                        value: 'pyb.LED(2)'
                    }, {
                        text: 'LED3 (red)',
                        value: 'pyb.LED(1)'
                    }]
                },
                switch: {
                    acceptedReporters: false,
                    items: [{
                        text: 'SW1',
                        value: 'SW1'
                    }, {
                        text: 'SW2',
                        value: 'SW2'
                    }, {
                        text: 'SW3',
                        value: 'SW3'
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
                digital_pins: {
                    acceptReporters: false,
                    items: [{
                        text: 'D0',
                        value: 'D0'
                    }, {
                        text: 'D1',
                        value: 'D1'
                    }, {
                        text: 'D2',
                        value: 'D2'
                    }, {
                        text: 'D3',
                        value: 'D3'
                    }, {
                        text: 'D4',
                        value: 'D4'
                    }, {
                        text: 'D5',
                        value: 'D5'
                    }, {
                        text: 'D6',
                        value: 'D6'
                    }, {
                        text: 'D7',
                        value: 'D7'
                    }, {
                        text: 'D8',
                        value: 'D8'
                    }, {
                        text: 'D9',
                        value: 'D9'
                    }, {
                        text: 'D10',
                        value: 'D10'
                    }, {
                        text: 'D11',
                        value: 'D11'
                    }, {
                        text: 'D12',
                        value: 'D12'
                    }, {
                        text: 'D13',
                        value: 'D13'
                    }]
                },
                analog_pins: {
                    acceptReporters: false,
                    items: [{
                        text: 'A0',
                        value: 'A0'
                    }, {
                        text: 'A1',
                        value: 'A1'
                    }, {
                        text: 'A2',
                        value: 'A2'
                    }, {
                        text: 'A3',
                        value: 'A3'
                    }, {
                        text: 'A4',
                        value: 'A4'
                    }, {
                        text: 'A5',
                        value: 'A5'
                    }]
                }
            }
        };
    }

    // *** Common blocks utils functions *** //

    async getResponse(command) {
        await this._peripheral.waitBoardResponse();
        const commands = [
            `value = ${command}`,
            `response = respond("${command}", status = 1, value=value)`,
            'print(response)'
        ]
        this._peripheral.get(commands);
        return await this._peripheral.waitBoardResponse();
    }

    async uart_sendDataAndGetResult(args) {
        const response = await this.getResponse(`${args.DATA}`);
        return response.value;
    }

    // *** Blocks extension functions *** //

    async display_stm32_controlColorLed(args) {
        const state = args.STATE == 1 ? 'on' : 'off';
        await this._peripheral.send(`${args.LED}.${state}()`);
    }

    async display_stm32_toggleColorLed(args) {
        await this._peripheral.send(`${args.LED}.toggle()`);
    }

    async display_lcdSetText(args) {
        await this._peripheral.send(`lcd.setCursor(${args.LINE}, ${args.POS})`);
        await this._peripheral.send(`lcd.writeTxt(\"${args.TEXT}\")`);
    }

    async display_lcdClear() {
        await this._peripheral.send(`lcd.clear()`);
    }

    async io_stm32_getSwitchState(args) {
        const response = await this.getResponse(`pyb.Pin('${args.SWITCH}').value()`);
        return response.value;
    }

    async io_writeDigitalPin(args) {
        const state = args.STATE == 1 ? 'on' : 'off';
        await this._peripheral.send(`machine.Pin('${args.PIN}', machine.Pin.OUT).${state}()`);
    }

    async io_readDigitalPin(args) {
        const response = await this.getResponse(`machine.Pin('${args.PIN}', machine.Pin.IN).value()`);
        return response.value;
    }

    async io_readAnalogPin(args) {
        const response = await this.getResponse(`pyb.ADC('${args.PIN}').value()`);
        return response.value;
    }

    async uart_sendData(args) {
        await this._peripheral.send(args.DATA);
    }

    async uart_sendDataAndGetResultAsString(args) {
        return String(await this.uart_sendDataAndGetResult(args));
    }

    async uart_sendDataAndGetResultAsBoolean(args) {
        return Boolean(await this.uart_sendDataAndGetResult(args));
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

}

module.exports = Scratch3VittaSTM32Blocks;
