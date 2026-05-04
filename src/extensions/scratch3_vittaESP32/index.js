const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'display_controlBuiltInLED': {
            'en': '(esp32) control built-in LED to state [STATE]',
            'fr': '(esp32) contrôler la LED intégrée à l\'état [STATE]',
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
        'network_connectStation': {
            'en': '(network) connect station: essid [ESSID] password [PWD] static IP [IP]',
            'fr': '(network) connecter la station : nom du réseau [ESSID] mot de passe [PWD] IP fixe [IP]'
        },
        'network_configureAccessPoint': {
            'en': '(network) configure access point: ssid [SSID] static IP [IP]',
            'fr': '(network) créer un point d\'accès : ssid [SSID] IP fixe [IP]'
        },
        'network_client_sendData': {
            'en': '(client) send data [DATA] to server IP [IP]',
            'fr': '(client) envoyer données [DATA] au serveur IP [IP]'
        },
        'network_client_getServerData': {
            'en': '(client) data received from server IP [IP]',
            'fr': '(client) données reçues du serveur IP [IP]'
        },
        'network_client_clearBufferData': {
            'en': '(client) fermer la connexion avec le serveur',
            'fr': '(client) close server socket'
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
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOS40IDI3Ljk1Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzIyYjU3Mzt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9IkNhbHF1ZV8yIiBkYXRhLW5hbWU9IkNhbHF1ZSAyIj48ZyBpZD0iQ2FscXVlXzEtMiIgZGF0YS1uYW1lPSJDYWxxdWUgMSI+PGcgaWQ9IkVTUDMyIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0uODEsMEEuODEuODEsMCwwLDAsMCwuODFWMjcuMTRBLjgxLjgxLDAsMCwwLC44MSwyOEgxOC41OWEuODIuODIsMCwwLDAsLjgxLS44MVYuODFBLjgxLjgxLDAsMCwwLDE4LjU5LDBaTTE2Ljg2LjY4YS4yNS4yNSwwLDAsMSwuMjQuMjVWNS43MmEuMjUuMjUsMCwwLDEtLjQ5LDBWMS4xN0gxNC42NlY1LjcyYS4yNS4yNSwwLDAsMS0uNDksMFYxLjE3SDEyLjNWMy4zMmEuMjUuMjUsMCwwLDEtLjI1LjI1SDkuNDZhLjI1LjI1LDAsMCwxLS4yNS0uMjVWMS4xN0g3LjA2VjMuMzJhLjI0LjI0LDAsMCwxLS4yNC4yNUg0LjI4QS4yNS4yNSwwLDAsMSw0LDMuMzJWMS4xN0gyVjUuNzJhLjI1LjI1LDAsMCwxLS40OSwwVi45M0EuMjUuMjUsMCwwLDEsMS43Ni42OEg0LjI4YS4yNS4yNSwwLDAsMSwuMjUuMjVWMy4wOGgyVi45M0EuMjUuMjUsMCwwLDEsNi44Mi42OEg5LjQ2QS4yNS4yNSwwLDAsMSw5LjcuOTNWMy4wOGgyLjExVi45M2EuMjUuMjUsMCwwLDEsLjI0LS4yNWg0LjgxWm0tLjU3LDEyLjVoLS42OGMwLC4wOCwwLC4xNCwwLC4ydjEuMTdhMi4yNSwyLjI1LDAsMCwxLTEuMzIsMi4xMiwxMC44NCwxMC44NCwwLDAsMS0yLjE1LjcxLDE0LjUzLDE0LjUzLDAsMCwwLTEuNDUuNDkuOTIuOTIsMCwwLDAtLjYzLjk0YzAsLjY4LDAsMS4zNiwwLDIsMCwuMTIuMDguMTQuMTUuMTdhMi4wOCwyLjA4LDAsMSwxLTEuNjcsMCwuMi4yLDAsMCwwLC4xMy0uMjEsMSwxLDAsMCwwLS44LTFjLS40My0uMTgtLjg4LS4zMS0xLjMzLS40NWE1LjQ0LDUuNDQsMCwwLDEtMS43OC0uNzcsMi4xNSwyLjE1LDAsMCwxLS45My0xLjc1YzAtLjUsMC0xLDAtMS41MUEuNC40LDAsMCwwLDMuNjQsMTVhMS4yOSwxLjI5LDAsMCwxLS41LTEuMzQsMS4zMiwxLjMyLDAsMCwxLDEtMS4wNkExLjM3LDEuMzcsMCwwLDEsNS40LDE0LjkxYS41My41MywwLDAsMC0uMjIuNDljMCwuMzcsMCwuNzQsMCwxLjExQTEuMDcsMS4wNywwLDAsMCw2LDE3LjdjLjM0LjE0LjcuMjUsMSwuMzZsMS42Mi41M1YxMC40MUg3LjI4TDkuMzUsN2wyLjA3LDMuNDVIMTAuMDZ2Ni4yMmEzLjI1LDMuMjUsMCwwLDEsLjQzLS4xOGwyLjExLS42MWExMCwxMCwwLDAsMCwxLS4zOS45NC45NCwwLDAsMCwuNTktLjk1YzAtLjQzLDAtLjg1LDAtMS4zaC0uNjlWMTAuNDNoMi43NVoiLz48L2c+PC9nPjwvZz48L3N2Zz4=';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii00IDAgMjggMjcuOTUiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDojZmZmO308L3N0eWxlPjwvZGVmcz48ZyBpZD0iQ2FscXVlXzIiIGRhdGEtbmFtZT0iQ2FscXVlIDIiPjxnIGlkPSJDYWxxdWVfMS0yIiBkYXRhLW5hbWU9IkNhbHF1ZSAxIj48ZyBpZD0iRVNQMzIiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTS44MSwwQS44MS44MSwwLDAsMCwwLC44MVYyNy4xNEEuODEuODEsMCwwLDAsLjgxLDI4SDE4LjU5YS44Mi44MiwwLDAsMCwuODEtLjgxVi44MUEuODEuODEsMCwwLDAsMTguNTksMFpNMTYuODYuNjhhLjI1LjI1LDAsMCwxLC4yNC4yNVY1LjcyYS4yNS4yNSwwLDAsMS0uNDksMFYxLjE3SDE0LjY2VjUuNzJhLjI1LjI1LDAsMCwxLS40OSwwVjEuMTdIMTIuM1YzLjMyYS4yNS4yNSwwLDAsMS0uMjUuMjVIOS40NmEuMjUuMjUsMCwwLDEtLjI1LS4yNVYxLjE3SDcuMDZWMy4zMmEuMjQuMjQsMCwwLDEtLjI0LjI1SDQuMjhBLjI1LjI1LDAsMCwxLDQsMy4zMlYxLjE3SDJWNS43MmEuMjUuMjUsMCwwLDEtLjQ5LDBWLjkzQS4yNS4yNSwwLDAsMSwxLjc2LjY4SDQuMjhhLjI1LjI1LDAsMCwxLC4yNS4yNVYzLjA4aDJWLjkzQS4yNS4yNSwwLDAsMSw2LjgyLjY4SDkuNDZBLjI1LjI1LDAsMCwxLDkuNy45M1YzLjA4aDIuMTFWLjkzYS4yNS4yNSwwLDAsMSwuMjQtLjI1aDQuODFabS0uNTcsMTIuNWgtLjY4YzAsLjA4LDAsLjE0LDAsLjJ2MS4xN2EyLjI1LDIuMjUsMCwwLDEtMS4zMiwyLjEyLDEwLjg0LDEwLjg0LDAsMCwxLTIuMTUuNzEsMTQuNTMsMTQuNTMsMCwwLDAtMS40NS40OS45Mi45MiwwLDAsMC0uNjMuOTRjMCwuNjgsMCwxLjM2LDAsMiwwLC4xMi4wOC4xNC4xNS4xN2EyLjA4LDIuMDgsMCwxLDEtMS42NywwLC4yLjIsMCwwLDAsLjEzLS4yMSwxLDEsMCwwLDAtLjgtMWMtLjQzLS4xOC0uODgtLjMxLTEuMzMtLjQ1YTUuNDQsNS40NCwwLDAsMS0xLjc4LS43NywyLjE1LDIuMTUsMCwwLDEtLjkzLTEuNzVjMC0uNSwwLTEsMC0xLjUxQS40LjQsMCwwLDAsMy42NCwxNWExLjI5LDEuMjksMCwwLDEtLjUtMS4zNCwxLjMyLDEuMzIsMCwwLDEsMS0xLjA2QTEuMzcsMS4zNywwLDAsMSw1LjQsMTQuOTFhLjUzLjUzLDAsMCwwLS4yMi40OWMwLC4zNywwLC43NCwwLDEuMTFBMS4wNywxLjA3LDAsMCwwLDYsMTcuN2MuMzQuMTQuNy4yNSwxLC4zNmwxLjYyLjUzVjEwLjQxSDcuMjhMOS4zNSw3bDIuMDcsMy40NUgxMC4wNnY2LjIyYTMuMjUsMy4yNSwwLDAsMSwuNDMtLjE4bDIuMTEtLjYxYTEwLDEwLDAsMCwwLDEtLjM5Ljk0Ljk0LDAsMCwwLC41OS0uOTVjMC0uNDMsMC0uODUsMC0xLjNoLS42OVYxMC40M2gyLjc1WiIvPjwvZz48L2c+PC9nPjwvc3ZnPgo=';

// USB-SERIAL CH340
const WEMOS_D1R32 = {
    'usbProductId': 0x7523,
    'usbVendorId': 0x1a86
};
// Silicon Labs CP210x USB to UART Bridge
const ESP32_BASIC = {
    'usbProductId': 0xea60,
    'usbVendorId': 0x10c4
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
     * Split large string in chunks.
     * @public
     * @param {string} str
     * @param {int} size
     * @return {Array<string>}
     */
    chunk(str, size) {
        const numChunks = Math.ceil(str.length / size);
        const chunks = new Array(numChunks);
        for (var i = 0, o = 0; i < numChunks; ++i, o += size) {
            chunks[i] = str.substr(o, size);
        }
        return chunks;
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
                console.log('Please refresh page.')
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
    constructor(peripheral, serial, options) {
        this.MAIN_FILENAME = 'vitta_cmd.py';
        this.OPEN_REPL = '\x03';
        this.END_MPY_CMD = '\r\n';
        this.serial = serial;
        this.peripheral = peripheral;
        this.buffer = "";
        this.hasFirmware = true;
        this.isError = false;
        this.error = "";
        this.Queue = new Queue();
        if (options.chunkSize !== null || options.chunkSize !== undefined) {
            this.chunkSize = options.chunkSize;
        } else {
            this.chunkSize = 1024;
        }
        if (options.libraries !== null || options.libraries !== undefined) {
            this._CUSTOM_LIB = options.libraries;
        } else {
            this.libraries = Object.create(null);
        }
        this._MPY_CMD = {
            fs: {
                execute: (filename) => {
                    return "exec(open('" + filename + "').read(),globals())"
                },
                open: (filename, mode) => {
                    return "f = open('" + filename + "', '" + mode + "')"
                },
                close: () => {
                    return "f.close()"
                },
                read: () => {
                    return "f.read()"
                },
                write: (code) => {
                    return "f.write(" + code + ")"
                },
                remove: (filename) => {
                    return "os.remove('" + filename + "')"
                },
                os_list_files: () => {
                    return "os.listdir()"
                },
                os_uname: () => {
                    return "os.uname()"
                }
            },
            import_library: (lib) => {
                return "import " + lib
            },
            import_class: (lib, classe) => {
                return "from " + lib + " import " + classe
            },
            setPwm: (pin) => {
                return "pwm_p" + pin + " = machine.PWM(machine.Pin(" + pin + "), freq=10, duty=512)"
            },
            stopPwm: (pin) => {
                return "pwm_p" + pin + ".deinit()"
            },
            getFreeMemory: () => {
                return "gc.mem_free()"
            },
            sleep_ms: (millis) => {
                return "utime.sleep_ms(" + millis + ")"
            },
            print: (str) => {
                return "print(\"" + str + "\")"
            }
        };
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
     * Send Micropython command for resetting board.
     */
    resetBoard() {
        const runCmds = [
            this._MPY_CMD.import_library('machine'),
            'machine.reset()',
            this._MPY_CMD.import_library('machine'),
            this._MPY_CMD.import_class('vitta_cmd', "AdacraftExtension"),
            'ExtensionLib = AdacraftExtension()',
            'ExtensionLib.init("[ESP32] extension ready!")'
        ];
        this.enqueueCommandList(runCmds);
    };
    /**
     * Download code in 'vitta_cmd.py' file.
     * @private
     * @param {string} code
     */
    _downloadMainCode(code) {
        return this._downloadScript(this.MAIN_FILENAME, code);
    };
    /**
     * Download a script into board filesystem.
     * @private
     * @param {string} filename
     * @param {string} code
     */
    _downloadScript(filename, code) {
        const chunks = this.serial.chunk(code, this.chunkSize);
        let commands = new Array();
        if (chunks !== null) {
            commands.push(this._MPY_CMD.fs.open(filename, 'w'));
            for (var i = 0; i < chunks.length; i++) {
                let adaptedCode = this._getAdaptedCode(chunks[i]);
                if (adaptedCode[adaptedCode.length - 1] == "\\") {
                    adaptedCode += "\\";
                }
                commands.push("buffer = \"\"\"" + adaptedCode + "\"\"\"");
                commands.push(this._MPY_CMD.fs.write("buffer"));
            }
            commands.push(this._MPY_CMD.fs.close());
            this.enqueueCommandList(commands);
        }
    };
    /**
     * Download python user code.
     */
    downloadUserCode(code) {
        // Download python code from workspace.
        const bootFile = 'vitta_boot.py';
        let bootCode = "import os\n"
            + "os.uname()\n"
            + "scripts = ['vitta_cmd.py','main.py',";
        bootCode += "'vitta_script.js','vitta_style.css','client.js',";
        bootCode = bootCode.slice(0, -1);
        bootCode += "]\n"
            + "for i in scripts:\n"
            + "  if i in os.listdir():\n"
            + "    print('Removing ' + i)\n"
            + "    os.remove(i)\n";
        bootCode += "print(os.listdir())\n";
        this._downloadScript(bootFile, bootCode);
        const bootCmds = [
            this._MPY_CMD.fs.execute(bootFile),
            this._MPY_CMD.import_library('os'),
            this._MPY_CMD.fs.remove(bootFile)
        ];
        this.enqueueCommandList(bootCmds);
        if (this._getRequestedLibraries(code).length > 0) {
            this._downloadExternalLibraries(code);
        }
        this._downloadMainCode(code);
        const memoryCmds = [
            this._MPY_CMD.import_library('gc'),
            this._MPY_CMD.getFreeMemory()
        ];
        this.enqueueCommandList(memoryCmds);
    };
    /**
     * Get adapted code for Micropython this.
     * @private
     * @param {string} code
     * @returns {string} code
     * @memberof MicropythonRepl
     */
    _getAdaptedCode(code) {
        code = code.replace(/\\"/g, '\\\\"').replace(/"/g, '\\"').replace(/\r\n/g, "\\r").replace(/\n/g, "\\r");
        code = code.replace(/\\t/g, '\\\\t').replace(/\\n/g, '\\\\n').replace(/\t/g, '  ').replace(/\\x/g, "\\\\x");
        return code;
    };
    /**
     * Download python external libraries requested in code.
     * @private
     * @param {string} code
     * @returns {void}
     */
    _downloadExternalLibraries(code) {
        const requestedLib = this._getRequestedLibraries(code);
        for (let i = 0; i < requestedLib.length; i++) {
            this._downloadScript(requestedLib[i].filename, requestedLib[i].code);
        }
    };
    /**
     * Get list of libraries requested by code.
     * @private
     * @param {string} code
     * @returns {Array<Object>} requestedLibs
     * @memberof MicropythonRepl
     */
    _getRequestedLibraries(code) {
        let requestedLibs = new Array();
        for (var lib in this._CUSTOM_LIB) {
            const regExp1 = new RegExp('from ' + lib + ' import');
            const regExp2 = new RegExp('import ' + lib);
            if (regExp1.test(code) || regExp2.test(code)) {
                requestedLibs.push({
                    filename: lib + ".py",
                    code: this._CUSTOM_LIB[lib]
                });
                const requestedDependencies = this._getRequestedLibraries(this._CUSTOM_LIB[lib]);
                requestedLibs = requestedLibs.concat(requestedDependencies);
            }
        }
        return requestedLibs;
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
        if (buffer && buffer.length > 0) {
            if (buffer.match(/\[ESP32\] extension ready!/g)) {
                this.peripheral.ready = true;
            }
            const bufSplit = buffer.split('\r')
            if (bufSplit.length > 1) {
                const lastIndex = bufSplit.length - 1;
                let textToPrint = "";
                if (bufSplit[lastIndex] == '\n') {
                    textToPrint = bufSplit.join('');
                    this.buffer = "";
                } else {
                    textToPrint = bufSplit.slice(0, lastIndex).join('');
                    this.buffer = bufSplit[lastIndex];
                }
                const linesToPrint = textToPrint.split('\n');
                for (var i = 0; i < linesToPrint.length; i++) {
                    if (linesToPrint[i].indexOf("{\"cmd\":") > -1) {
                        const cleanedLine = this.convert(linesToPrint[i]);
                        this.peripheral.response = JSON.parse(cleanedLine);
                        this.peripheral.waitingResponse = false;
                        console.log(this.peripheral.response)
                    }
                    if (!this.isError && linesToPrint[i].indexOf("Traceback") > -1) {
                        this.isError = true;
                    }
                    if (this.isError) {
                        this.error += linesToPrint[i];
                    }
                    if (linesToPrint[i].indexOf('KeyboardInterrupt') > -1) {
                        this.isError = false;
                    }
                }
                return textToPrint;
            }
        }
        return null;
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
                    this.waitingResponse = false;
                    this.isOpen = true;
                    if (!this.Queue.isEmpty() && !this.isError) {
                        this.waitingResponse = true;
                        await this.sendCommand(this.Queue.dequeue());
                    } else {
                        this.Queue.reset();
                    }
                } else {
                    this.isOpen = false;
                }
                const lines = this._parseResponse(this.buffer);
                if (lines) {
                    if (this.isOpen) {
                        console.log(this.error)
                        if (this.isError && this.error.indexOf('Error') > -1) {
                            console.log("ERROR")
                        }
                        console.log(lines + '\n>>>\r')
                        this.buffer = "";
                    } else {
                        console.log(lines)
                    }
                }
            }
        }
    };

    convert(line) {
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
class ESP32 {

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
        this._serial = new Serial(115200, [WEMOS_D1R32, ESP32_BASIC]);

        // Create a new MicropythonRepl instance
        const boardOptions = {
            "chunkSize": 1024,
            "libraries": {}
        };
        this._repl = new MicropythonRepl(this, this._serial, boardOptions);

        this.reset = this.reset.bind(this);
        this.ready = false;
    }

    /**
     * Fetch file and return response.
     * @param {string} url
     * @returns {string} response
     */
    async fetchDir(url) {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(response.statusText + "\nlib: " + url);
        }
        return response.text();
    }

    /**
     * Load python libraries for extension.
     */
    loadLibraries() {
        var _this = this;
        return new Promise(async function (resolve, reject) {
            const LIBRARIES = ['vitta_client', 'esp32_lcd_i2c'];
            for (var lib in LIBRARIES) {
                const url = `https://raw.githubusercontent.com/leomlr/arduino-extension-adacraft/main/${LIBRARIES[lib]}.py`;
                await _this.fetchDir(url).then(function (content) {
                    if (content !== "404: Not Found") {
                        _this._repl._CUSTOM_LIB[LIBRARIES[lib]] = content;
                    }
                });
            }
            resolve();
        });
    };

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    async connect() {
        if (!this._serial.isConnected) {
            try {
                await this._serial.open();
                console.log(await this._serial.getInfo());
                console.log(await this._serial.getSignals());
                console.log(this._serial.port);
                this._repl.readingLoop();
                if (!this._repl.isOpen) {
                    await this._repl.open();
                }
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
    }

    async uploadFile() {
        const fetchFile = async function (origin) {
            try {
                return await fetch(`https://${origin ? origin : ""}vittascience.com/public/bin/esp32-extension/vitta_esp32.py`);
            } catch (e) {
                console.log(e)
                if (/Failed to fetch/.test(String(e))) {
                    if (origin == "viota.") {
                        return {
                            status: 404
                        };
                    } else {
                        return await fetchFile("viota.");
                    }
                }
            }
        };
        const response = await fetchFile();
        if (response.status !== 200) {
            throw new Error(`Unexpected status code: ${response.status}`);
        } else {
            const code = await response.text();
            console.log(code)
            var _this = this;
            await this.loadLibraries()
            const upload = async function () {
                if (_this._repl && _this._repl.hasFirmware) {
                    _this._repl.Queue.reset();
                    const commands = [
                        _this._repl._MPY_CMD.import_library('machine'),
                        _this._repl._MPY_CMD.setPwm("2")
                    ];
                    _this._repl.enqueueCommandList(commands);
                    _this._repl.downloadUserCode(code);
                    _this._repl.enqueueCommand(_this._repl._MPY_CMD.stopPwm("2"));
                    _this._repl.resetBoard();
                    _this._repl.isDownloading = true;
                    if (!_this._repl.isOpen) {
                        await _this._repl.open();
                    } else {
                        _this._repl.sendCommand(_this._repl.Queue.dequeue());
                    }
                }
                else {
                    console.log('Micropython firmware has to be flashed before downloading Python code. <a href=\"https://fr.vittascience.com/learn/tutorial.php?id=341/flasher-le-firmware-micropython-dans-la-carte-esp32\" style="color:var(--vitta-blue-dark);" target=\"_blank\" rel=\"noopener noreferrer\">Flashing Esp32 firmware</a>', 'warning');
                }
            };
            if (this._serial.isConnected) {
                await upload();
            } else {
                await this.connect();
                if (this._serial.isConnected) {
                    await upload();
                } else {
                    console.log('code.serialAPI.boardMustBeConnectedForDownload', 'warning');
                }
            }
        }
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
        this._repl.enqueueCommand(command);
        if (!this.waitingResponse) {
            await this._repl.sendCommand(this._repl.Queue.dequeue());
        }
    }

    /**
     * Get a response value from the peripheral by enqueuing commands.
     * @param {Array<string>} commands
     */
    async get(commands) {
        if (!this.isConnected()) return;
        this._repl.enqueueCommandList(commands);
        if (!this.waitingResponse) {
            await this._repl.sendCommand(this._repl.Queue.dequeue());
        }
        this.waitingResponse = true;
    }

    waitFor(conditionFunction) {
        const poll = resolve => {
            console.log(conditionFunction())
            if (conditionFunction()) {
                resolve();
            } else {
                setTimeout(_ => poll(resolve), 10);
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

class Scratch3vittaESP32Blocks {
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
        return 'vittaESP32';
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
        this._peripheral = new ESP32(this.runtime, Scratch3vittaESP32Blocks.EXTENSION_ID);
        this.ESP32_PINS = {
            "D2": "26",
            "D3": "25",
            "D4": "17",
            "D5": "16",
            "D6": "27",
            "D7": "14",
            "D8": "12",
            "D9": "13",
            "D10": "5",
            "D11": "23",
            "D12": "19",
            "D13": "18",
            "A2": "35",
            "A3": "34",
            "A4": "36",
            "A5": "39"
        };
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        this._locale = this.setLocale();
        return {
            id: 'vittaESP32',
            name: 'esp32',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'display_controlBuiltInLED',
                    text: this.getMessage('display_controlBuiltInLED'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATE: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: 1,
                            menu: 'state'
                        }
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
                    opcode: 'network_connectStation',
                    text: this.getMessage('network_connectStation'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ESSID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ssid',
                        },
                        PWD: {
                            type: ArgumentType.STRING,
                            defaultValue: 'password'
                        },
                        IP: {
                            type: ArgumentType.STRING,
                            defaultValue: '192.168.1.100'
                        }
                    }
                },
                {
                    opcode: 'network_configureAccessPoint',
                    text: this.getMessage('network_configureAccessPoint'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SSID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'VittaAP',
                        },
                        IP: {
                            type: ArgumentType.STRING,
                            defaultValue: '192.168.1.100'
                        }
                    }
                },
                {
                    opcode: 'network_client_sendData',
                    text: this.getMessage('network_client_sendData'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Message d\'adacraft!',
                        },
                        IP: {
                            type: ArgumentType.STRING,
                            defaultValue: '192.168.1.10',
                        }
                    }
                },
                {
                    opcode: 'network_client_getServerData',
                    text: this.getMessage('network_client_getServerData'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        IP: {
                            type: ArgumentType.STRING,
                            defaultValue: '192.168.1.10',
                        }
                    }
                },
                {
                    opcode: 'network_client_clearBufferData',
                    text: this.getMessage('network_client_clearBufferData'),
                    blockType: BlockType.COMMAND,
                    arguments: {}
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
                            defaultValue: 'machine.Pin(26, machine.Pin.IN).value()'
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
            `response = ExtensionLib.respond("${command}", status = 1, value=value)`,
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

    async display_controlBuiltInLED(args) {
        const state = args.STATE == 1 ? 'on' : 'off';
        await this._peripheral.send(`machine.Pin(2, machine.Pin.OUT).${state}()`);
    }

    async display_lcdSetText(args) {
        await this._peripheral.send(`ExtensionLib.lcd.setCursor(${args.LINE}, ${args.POS})`);
        await this._peripheral.send(`ExtensionLib.lcd.writeTxt(\"${args.TEXT}\")`);
    }

    async display_lcdClear() {
        await this._peripheral.send(`ExtensionLib.lcd.clear()`);
    }

    async io_writeDigitalPin(args) {
        const state = args.STATE == 1 ? 'on' : 'off';
        await this._peripheral.send(`machine.Pin(${this.ESP32_PINS[args.PIN]}, machine.Pin.OUT).${state}()`);
    }

    async io_readDigitalPin(args) {
        const response = await this.getResponse(`machine.Pin(${this.ESP32_PINS[args.PIN]}, machine.Pin.IN).value()`);
        return response.value;
    }

    async io_readAnalogPin(args) {
        const response = await this.getResponse(`ExtensionLib.pinADC(${this.ESP32_PINS[args.PIN]}).read()`);
        return response.value;
    }

    async network_connectStation(args) {
        await this._peripheral.send(`ExtensionLib.boardIP='${args.IP}'`);
        await this._peripheral.send(`ExtensionLib.serverInit = False`);
        await this._peripheral.send(`ExtensionLib.connect_station(ssid='${args.ESSID}', password='${args.PWD}', ip=ExtensionLib.boardIP)`);
        await this._peripheral.send(`ExtensionLib.client.init(sta=ExtensionLib.station)`);
    }

    async network_configureAccessPoint(args) {
        await this._peripheral.send(`ExtensionLib.configure_access_point(ssid='${args.ESSID}', ip='${qrgs.IP}')`);
    }

    async network_client_sendData(args) {
        await this._peripheral.send(`ExtensionLib.client.sendDataToServer("${args.DATA}", ip='${args.IP}')`);
    }

    async network_client_getServerData(args) {
        const response = await this.getResponse(`ExtensionLib.client.getServerData('${args.IP}')`);
        return response.value;
    }

    async network_client_clearBufferData(args) {
        await this._peripheral.send(`ExtensionLib.client.clearBufferData()`);
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

module.exports = Scratch3vittaESP32Blocks;
