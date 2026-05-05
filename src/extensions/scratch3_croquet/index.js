const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Croquet = require('@croquet/croquet');

const convertBlock = require('./cps');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZjM0MzE7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xOC4zNywxOS4zNGMtMS0uNDEtMS44OC0uNzktMi44LTEuMTNhMS41OSwxLjU5LDAsMCwwLS44MS0uMDcsNi4zNCw2LjM0LDAsMCwxLTcuNjQtNS4wOSw2LjI4LDYuMjgsMCwwLDEsNi42Mi03LjUzLDYuMTYsNi4xNiwwLDAsMSw2LjEsNS4wNiw2LjIsNi4yLDAsMCwxLTEuMDksNS4wNiwxLjk0LDEuOTQsMCwwLDAtLjMxLjk0Yy0uMDUuNzEsMCwxLjQyLDAsMi4xM0MxOC40MiwxOC44OSwxOC4zOSwxOS4wOCwxOC4zNywxOS4zNFptLTIuNTgtNy40OEEyLjE3LDIuMTcsMCwwLDAsMTMuNSw5LjU4YTIuMiwyLjIsMCwwLDAtMi4zLDIuMjksMi4xOSwyLjE5LDAsMCwwLDIuMjksMi4zNEEyLjI0LDIuMjQsMCwwLDAsMTUuNzksMTEuODZaIi8+PC9nPjwvZz48L3N2Zz4='
const iconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xOC4zNywxOS4zNGMtMS0uNDEtMS44OC0uNzktMi44LTEuMTNhMS41OSwxLjU5LDAsMCwwLS44MS0uMDcsNi4zNCw2LjM0LDAsMCwxLTcuNjQtNS4wOSw2LjI4LDYuMjgsMCwwLDEsNi42Mi03LjUzLDYuMTYsNi4xNiwwLDAsMSw2LjEsNS4wNiw2LjIsNi4yLDAsMCwxLTEuMDksNS4wNiwxLjk0LDEuOTQsMCwwLDAtLjMxLjk0Yy0uMDUuNzEsMCwxLjQyLDAsMi4xM0MxOC40MiwxOC44OSwxOC4zOSwxOS4wOCwxOC4zNywxOS4zNFptLTIuNTgtNy40OEEyLjE3LDIuMTcsMCwwLDAsMTMuNSw5LjU4YTIuMiwyLjIsMCwwLDAtMi4zLDIuMjksMi4xOSwyLjE5LDAsMCwwLDIuMjksMi4zNEEyLjI0LDIuMjQsMCwwLDAsMTUuNzksMTEuODZaIi8+PC9nPjwvZz48L3N2Zz4=';

class ScratchCode extends Croquet.Model {
    init () {
        this.$functions = {};
        this.$vars = {};
    }

    setModel (model) {
        this.scratchModel = model;
        return this;
    }

    addCode (functions) {
        const keys = Object.keys(functions);
        keys.forEach(k => {
            const f = functions[k];
            const func = new Function('Cast', f);
            this.$functions[k] = func;
        });
    }

    invoke (name) {
        const func = this.$functions[name];
        if (!func) {
            console.log(`function named ${name} not found`);
            return;
        }
        func.call(this, Cast);
    }

    futureInvoke (name) {
        this.future(1).invoke(name);
    }
    
    log () {
        console.log(17);
    }

    addOp (a, b) {
        return Cast.toNumber(a) + Cast.toNumber(b);
    }

    minusOp (a, b) {
        return Cast.toNumber(a) - Cast.toNumber(b);
    }

    mulOp (a, b) {
        return Cast.toNumber(a) * Cast.toNumber(b);
    }

    divOp (a, b) {
        return Cast.toNumber(a) / Cast.toNumber(b);
    }
    
    equalsOp (a, b) {
        return Cast.compare(a, b) === 0;
    }

    ltOp (a, b) {
        return Cast.compare(a, b) < 0;
    }

    gtOp (a, b) {
        return Cast.compare(a, b) > 0;
    }
    
    joinOp (a, b) {
        return [a, b].join('');
    }

    letterOfOp (a, b) {
        const index = Cast.toNumber(a) - 1;
        const str = Cast.toString(b);
        if (index < 0 || index >= str.length) {
            return '';
        }
        return str.charAt(index);
    }

    containsOp (a, b) {
        const aStr = Cast.toString(a);
        const bStr = Cast.toString(b);

        const format = function (string) {
            return Cast.toString(string).toLowerCase();
        };
        return format(aStr).includes(format(bStr));
    }

    lengthOp (str) {
        return Cast.toString(str).length;
    }

    modOp (a, b) {
        const n = Cast.toNumber(a);
        const modulus = Cast.toNumber(b);
        let result = n % modulus;
        // Scratch mod uses floored division instead of truncated division.
        if (result / modulus < 0) result += modulus;
        return result;
    }

    roundOp (a) {
        return Math.round(Cast.toNumber(a));
    }

    mathOp (op, arg) {
        const operator = Cast.toString(op).toLowerCase();
        const n = Cast.toNumber(arg);

        const tan = angle => {
            angle = angle % 360;
            switch (angle) {
            case -270:
            case 90:
                return Infinity;
            case -90:
            case 270:
                return -Infinity;
            default:
                return parseFloat(Math.tan((Math.PI * angle) / 180).toFixed(10));
            }
        };
        
        switch (operator) {
        case 'abs': return Math.abs(n);
        case 'floor': return Math.floor(n);
        case 'ceiling': return Math.ceil(n);
        case 'sqrt': return Math.sqrt(n);
        case 'sin': return parseFloat(Math.sin((Math.PI * n) / 180).toFixed(10));
        case 'cos': return parseFloat(Math.cos((Math.PI * n) / 180).toFixed(10));
        case 'tan': return tan(n);
        case 'asin': return (Math.asin(n) * 180) / Math.PI;
        case 'acos': return (Math.acos(n) * 180) / Math.PI;
        case 'atan': return (Math.atan(n) * 180) / Math.PI;
        case 'ln': return Math.log(n);
        case 'log': return Math.log(n) / Math.LN10;
        case 'e ^': return Math.exp(n);
        case '10 ^': return Math.pow(10, n);
        }
        return 0;
    }

    randomOp (a, b) {
        const nFrom = Cast.toNumber(a);
        const nTo = Cast.toNumber(b);
        const low = nFrom <= nTo ? nFrom : nTo;
        const high = nFrom <= nTo ? nTo : nFrom;
        if (low === high) return low;
        // If both arguments are ints, truncate the result to an int.
        if (Cast.isInt(a) && Cast.isInt(b)) {
            return low + Math.floor(Math.random() * ((high + 1) - low));
        }
        return (Math.random() * (high - low)) + low;
    }

    setValue (info) {
        // info is {name, value}
        this.scratchModel.setValue(info);
    }

    getValue (name) {
        return this.scratchModel.getValue(name);
    }
}

ScratchCode.register();
        
class ScratchModel extends Croquet.Model {
    init () {
        this.resetCode();
        this.subscribe(this.id, 'setValue', 'setValue');
        this.subscribe(this.id, 'resetCode', 'resetCode');
        this.subscribe(this.id, 'addCode', 'addCode');
    }

    setValue ({name, value}) {
        this.values[name] = value;
        this.publish(this.id, 'newValue', {name, value});
    }

    getValue (name) {
        return this.values[name];
    }

    resetCode () {
        this.values = {};
        if (this.code) {
            this.code.destroy();
        }
        this.code = ScratchCode.create().setModel(this);
    }

    addCode (info) {
        // call to this should be always preceeded by resetCode()
        const {functions, entryPoint} = info;
        this.code.addCode(functions);
        this.code.invoke(entryPoint);
    }
}

ScratchModel.register();

class ScratchView extends Croquet.View {
    constructor (model) {
        super(model);
        this.model = model;
        this.subscribe(this.model.id, 'newValue', this.newValue);
        this.cache = {};
        this.changed = {};
    }

    setValue (name, value) {
        this.publish(this.model.id, 'setValue', {name, value});
    }

    getValue (name) {
        return this.model.getValue(name) || 0;
    }

    newValue ({name, value}) {
        this.changed[name] = this.changed[name] || this.cache[name] !== value;
        this.cache[name] = value;
    }
}

/**
 * Scratch 3.0 blocks to interact with Croquet.
 */
class Scratch3CroquetBlocks {

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'croquet';
    }

    /**
     * @return {number} - the tilt sensor counts as "tilted" if its tilt angle meets or exceeds this threshold.
     */

    /**
     * Construct a set of WeDo 2.0 blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3CroquetBlocks.EXTENSION_ID,
            name: 'Croquet',
            menuIconURI: menuIconURI,
            blockIconURI: iconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'start',
                    text: formatMessage({
                        id: 'Croquet.start',
                        default: 'start [SESSION]',
                        description: 'start a session with the given name'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SESSION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'croquet'
                        }
                    }
                },
                {
                    opcode: 'setValue',
                    text: formatMessage({
                        id: 'Croquet.setValue',
                        default: 'set [NAME] to [VALUE]',
                        description: 'set a value of the variable'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '42'
                        }
                    }
                },
                {
                    opcode: 'executeModelCode',
                    text: formatMessage({
                        id: 'Croquet.executeModelCode',
                        default: 'execute model code',
                        description: 'search for all modelCode hat blocks and create model side expanders'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
                {
                    opcode: 'getValue',
                    text: formatMessage({
                        id: 'Croquet.getValue',
                        default: 'get [NAME]',
                        description: 'turn a motor off'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x'
                        }
                    }
                },
                {
                    opcode: 'whenValue',
                    text: formatMessage({
                        id: 'Croquet.whenValue',
                        default: 'when [NAME] changed',
                        description: 'receives the change notification'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x'
                        }
                    }
                },
                {
                    opcode: 'modelCode',
                    text: formatMessage({
                        id: 'Croquet.modelCode',
                        default: 'model code',
                        description: 'Code that is executed in the model'
                    }),
                    blockType: BlockType.HAT,
                    arguments: {
                    }
                }
            ],
            menus: {
                NAME: {
                    acceptReporters: true,
                    items: []

                }
            }
        };
    }

    /**
     * Start a Croquet session with the name
     * @param {object} args - the block's arguments.
     * @property {string} NAME - the name of the session
     * @return {Promise} - a promise which will resolve at the end of the duration.
     */
    start (args) {
        if (this.creatingSession) return Promise.resolve(null);

        const createSession = () => {
            this.creatingSession = true;
            this.sessionName = args.SESSION;
            const promise = Croquet.Session.join(this.sessionName, ScratchModel, ScratchView, {tps: 30})
                .then(session => {
                    this.model = session.model;
                    this.view = session.view;
                    console.log(session.id);
                    this.sessionId = session.id;
                    this.creatingSession = false;
                    return `session ${args.SESSION} started`;
                });
            return promise;
        };
        
        if (this.sessionName) {
            if (args.SESSION !== this.sessionName) {
                console.log('leaving: ', this.sessionId);
                return Croquet.Session.leave(this.sessionId).then(createSession);
            }
            return Promise.resolve(`session ${args.SESSION} continues`);
        }
        return createSession();
    }

    /**
     * Set a value of a property
     * @param {object} args - the block's arguments.
     * @property {string} NAME - the name of the property
     * @property {number} VALUE - the new value of the property
     * @return {number} - a promise which will resolve to the VALUE
     */
    setValue (args) {
        if (!this.view) {
            return Promise.resolve(null);
        }
        this.view.setValue(args.NAME, args.VALUE);
        return Promise.resolve(args.VALUE);
        // it returns a promise so that the Scratch execution engine yields.
    }

    /**
     * Get a value of property
     * @param {object} args - the block's arguments.
     * @property {string} NAME - the name of the property
     * @return {number} - The VALUE
     */
    getValue (args) {
        if (!this.view) {
            return null;
        }
        return this.view.getValue(args.NAME);
    }

    /**
     * A hat block to receive a value change
     * @param {object} args - the block's arguments.
     * @return {boolean} - whether the hat block should fire or not
     */
    whenValue (args) {
        if (!this.view) {
            return false;
        }
        const name = args.NAME;
        if (this.view.changed[name]) {
            this.view.changed[name] = false;
            return true;
        }
        return false;
    }

    modelCode () {
        // no op, but the block 'execute model code' will look for all blocks with
        // this hat block and send it to the model.
        return false;
    }

    executeModelCode () {
        const that = this;
        if (that.view) {
            that.view.publish(that.view.model.id, 'resetCode');
        }
        that.runtime.targets.forEach(t => {
            const keys = Object.keys(t.blocks._scripts);
            keys.forEach(k => {
                const id = t.blocks._scripts[k];
                const block = t.blocks._blocks[id];
                if (block.opcode !== 'croquet_modelCode') return;
                const result = convertBlock(block, t.blocks._blocks);
                if (that.view && result.entryPoint) {
                    that.view.publish(that.view.model.id, 'addCode', result);
                } else {
                    console.log('result', result);
                }
            });
        });
    }
}

module.exports = Scratch3CroquetBlocks;
