const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i44Os44Kk44Ok44O8XzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTt9DQo8L3N0eWxlPg0KPGc+DQoJPHJlY3QgeD0iNC42IiB5PSIxNS44NCIgY2xhc3M9InN0MCIgd2lkdGg9IjcuODUiIGhlaWdodD0iNS41OSIvPg0KCTxyZWN0IHg9IjE5LjMxIiB5PSI4LjIyIiBjbGFzcz0ic3QwIiB3aWR0aD0iMTMuOTIiIGhlaWdodD0iMTIuMTkiLz4NCgk8cmVjdCBjbGFzcz0ic3QxIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz4NCjwvZz4NCjwvc3ZnPg0K';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i44Os44Kk44Ok44O8XzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCINCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTt9DQo8L3N0eWxlPg0KPGc+DQoJPHJlY3QgeD0iNC42IiB5PSIxNS44NCIgY2xhc3M9InN0MCIgd2lkdGg9IjcuODUiIGhlaWdodD0iNS41OSIvPg0KCTxyZWN0IHg9IjE5LjMxIiB5PSI4LjIyIiBjbGFzcz0ic3QwIiB3aWR0aD0iMTMuOTIiIGhlaWdodD0iMTIuMTkiLz4NCgk8cmVjdCBjbGFzcz0ic3QxIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiLz4NCjwvZz4NCjwvc3ZnPg0K';


let msg = 0;
let gloabalRPort = 4444;
let gloabalSPort = 4445;
const ws = new WebSocket("ws://127.0.0.1:8080");
ws.onmessage = function(event){
	msg = event.data;
};
ws.onopen = function(e){
    ws.send("r_port,4444");
    ws.send("s_port,4445");
};


/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3OSC {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'OSC',
            name: 'OSC',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
				{
                    opcode: 'oscReceive',
                    blockType: BlockType.REPORTER,
                    text: 'OSCReceiver Port[PORT] Address[ADRESS]',
                    arguments: {
						PORT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 4444
						},
						ADRESS: {
							type: ArgumentType.STRING,
							defaultValue: "/test"
						}
                    }
                },
                {
                    opcode: 'oscSender',
                    blockType: BlockType.COMMAND,
                    text: 'OSCSender Port[PORT] Address[ADRESS] Value[VALUE]',
                    arguments: {
						PORT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 4445
						},
						ADRESS: {
							type: ArgumentType.STRING,
							defaultValue: "/test"
                        },
                        VALUE: {
							type: ArgumentType.STRING,
							defaultValue: 0
						}
                    }
                }
            ],
            menus: {
            }
        };
    }

	oscReceive(args){
		const port = Cast.toNumber(args.PORT)
		if(gloabalRPort != port){
			ws.send("r_port,"+port.toString());
			gloabalRPort = port;
		}
		const array = msg.split(',');
		const ad = Cast.toString(args.ADRESS);
		for(let i = 0; i < array.length; i+=2){
			if(array[i] == ad) return array[i + 1];
		}
		return 0;
    }

    oscSender(args){
		const port = Cast.toNumber(args.PORT);
		if(gloabalSPort != port){
			ws.send("s_port,"+port.toString());
			gloabalSPort = port;
		}
        const ad = Cast.toString(args.ADRESS);
        const val = Cast.toString(args.VALUE);
		ws.send(ad + "," + val);
	}
}

module.exports = Scratch3OSC;