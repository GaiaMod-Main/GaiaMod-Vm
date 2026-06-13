//This one is by UchiwaFuujinn so credit to Him/Her

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzOS43NjU3MSIgaGVpZ2h0PSIzOS40Nzc0MyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIxNi4yNTkzMiwtMTYwLjM3NjE0KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjE3LjI1OTMyLDE5OC44NTM1N3YtMzcuNDc3NDNoMzcuNzY1NzF2MzcuNDc3NDN6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtvcmlnUG9zJnF1b3Q7Om51bGx9IiBmaWxsPSIjOTk2NmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMy4wMjUwOCwxODYuODMzKSBzY2FsZSgwLjUsMC41KSIgZm9udC1zaXplPSI0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7b3JpZ1BvcyZxdW90OzpudWxsfSIgZmlsbD0iI2RmZDllOSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+R1A8L3RzcGFuPjwvdGV4dD48L2c+PC9nPjwvc3ZnPg==';

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
/*
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzOS43NjU3MSIgaGVpZ2h0PSIzOS40Nzc0MyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIxNi4yNTkzMiwtMTYwLjM3NjE0KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48Zz48cGF0aCBkPSJNMjE3LjI1OTMyLDE5OC44NTM1N3YtMzcuNDc3NDNoMzcuNzY1NzF2MzcuNDc3NDN6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtvcmlnUG9zJnF1b3Q7Om51bGx9IiBmaWxsPSIjZmY2Njk3IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMy4wMjUwOCwxODYuODMzKSBzY2FsZSgwLjUsMC41KSIgZm9udC1zaXplPSI0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7b3JpZ1BvcyZxdW90OzpudWxsfSIgZmlsbD0iI2RmZDllOSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+R1A8L3RzcGFuPjwvdGV4dD48L2c+PC9nPjwvZz48L3N2Zz4=';
*/

const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzOS43NjU3MSIgaGVpZ2h0PSIzOS40Nzc0MyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIxNi4yNTkzMiwtMTYwLjM3NjE0KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBmb250LWZhbWlseT0ibm9uZSIgZm9udC13ZWlnaHQ9Im5vbmUiIGZvbnQtc2l6ZT0ibm9uZSIgdGV4dC1hbmNob3I9Im5vbmUiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjE3LjI1OTMyLDE5OC44NTM1N3YtMzcuNDc3NDNoMzcuNzY1NzF2MzcuNDc3NDN6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtvcmlnUG9zJnF1b3Q7Om51bGx9IiBmaWxsPSIjOTk2NmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMy4wMjUwOCwxODYuODMzKSBzY2FsZSgwLjUsMC41KSIgZm9udC1zaXplPSI0MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7b3JpZ1BvcyZxdW90OzpudWxsfSIgZmlsbD0iI2RmZDllOSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjx0c3BhbiB4PSIwIiBkeT0iMCI+R1A8L3RzcGFuPjwvdGV4dD48L2c+PC9nPjwvc3ZnPg==';

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

var mPad=null;

function mStartGamePad()
{
	window.requestAnimationFrame(mStartGamePad);
    var gamepad_info = '';
	var gamepads = navigator.getGamepads();
	var gamepad_num =gamepads.length;
	mPad = new Array(gamepad_num);

	for (var i=0; i<gamepad_num; i++) {
		if(gamepads[i]!=null) mPad[i] = gamepads[i];
	}
}

const ButtonList = {
    HVAL:	'h-val',
    VVAL:	'v-val',
    XBUT:	'x-but',
    YBUT:	'Y-but',
    ABUT:	'a-but',
    BBUT:	'b-but',
    L1BUT:	'l1-but',
    L2BUT:	'l2-but',
    R1BUT:	'r1-but',
    R2BUT:	'r2-but',

};

class Scratch3GamePad {

    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

		window.requestAnimationFrame(mStartGamePad);
	
		this.hval=0;
		this.vval=0;

        //this._onTargetCreated = this._onTargetCreated.bind(this);
        //this.runtime.on('targetWasCreated', this._onTargetCreated);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
	getInfo () {
		return {
			id: 'gamepad',

            name: formatMessage({
                id: 'Game Pad for Scratch3',
                default: 'Game Pad',
                description: 'Label for the game pad extension category'
            }),

			menuIconURI: menuIconURI,
			blockIconURI: blockIconURI,

			blocks: [
				{
					opcode: 's_X_Button',
					text: 'X Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_Y_Button',
					text: 'Y Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_A_Button',
					text: 'A Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_B_Button',
					text: 'B Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_L1_Button',
					text: 'L1 Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_L2_Button',
					text: 'L2 Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_R1_Button',
					text: 'R1 Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_R2_Button',
					text: 'R2 Button',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_getHbtn',
					text: 'Horizontal',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_getVbtn',
					text: 'Vartical',
					blockType: BlockType.HAT,
				},
				{
					opcode: 's_Hval',
					text: 'Hval',
					blockType: BlockType.REPORTER
				},
				{
					opcode: 's_Vval',
					text: 'Vval',
					blockType: BlockType.REPORTER
				},

				{
					 opcode: 'sButtonValue',
						text: formatMessage({
							id: 'gamepad.sButtonValue',
							default: 'Button [n_button]',
							description: 'buton value?'
						}),
					blockType: BlockType.REPORTER,
					arguments: {
						n_button: {
							type: ArgumentType.STRING,
							menu: 'buttonlist',
							defaultValue: ButtonList.HVAL
						}
					}
				},


			],
             menus: {
                buttonlist: {
                    acceptReporters: true,
                    items: this._initButtonList()
                }
            }
		};
	}

/* ================================	*/
   /**
     * Initialize event parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
    _initButtonList () {
        return [
            {
                text: formatMessage({
                    id: 'gamepad.buttonlist.h-val',
                    default: 'h-val',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.HVAL
            },
            {
                text: formatMessage({
                    id: 'gamepad.buttonlist.v-val',
                    default: 'v-val',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.VVAL
            },
            {
                text: formatMessage({
                    id: 'gamepad.buttonlist.x-but',
                    default: 'x-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.XBUT
            },
			{
                text: formatMessage({
                    id: 'gamepad.buttonlist.y-but',
                    default: 'y-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.YBUT
            },
            { 
			   text: formatMessage({
                    id: 'gamepad.buttonlist.a-but',
                    default: 'a-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.ABUT
            },
            {
			    text: formatMessage({
                    id: 'gamepad.buttonlist.b-but',
                    default: 'b-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.BBUT
            },
            {
                text: formatMessage({
                    id: 'gamepad.buttonlist.l1-but',
                    default: 'l1-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.L1BUT
            },
			{
                text: formatMessage({
                    id: 'gamepad.buttonlist.l2-but',
                    default: 'l2-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.L2BUT
            },
            { 
			   text: formatMessage({
                    id: 'gamepad.buttonlist.r1-but',
                    default: 'r1-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.R1BUT
            },
            {
			    text: formatMessage({
                    id: 'gamepad.buttonlist.r2-but',
                    default: 'r2-but',
                    description: 'label for buttons for gamepad extension'
                }),
                value: ButtonList.R2BUT
            },      
		];
    }

/* ================================	*/
	/**
		* Write log.
		* @param {object} args - the block arguments.
		* @property {number} TEXT - the text.
	*/
	writeLog (args) {
		const text = Cast.toString(args.TEXT);
		log.log(text);
	}

	/**
		* Get the browser.
		* @return {number} - the user agent.
	*/
	getBrowser () {
		return navigator.userAgent;
	}

/* ================================	*/
// BUTTON X- Y- A- B-
	s_X_Button() {
		return mPad[0].buttons[2].pressed;
	}

	s_Y_Button() {
		return mPad[0].buttons[3].pressed;
	}

	s_A_Button() {
		return mPad[0].buttons[0].pressed;
	}

	s_B_Button() {
		return mPad[0].buttons[1].pressed;
	}

/* -------------------------------------------------------------------------	*/
// BUTTON L1- L2- R1- R2-
	s_L1_Button() {
		return mPad[0].buttons[4].pressed;
	}

	s_L2_Button() {
		return mPad[0].buttons[5].pressed;
	}

	s_R1_Button() {
		return mPad[0].buttons[6].pressed;
	}

	s_R2_Button() {
		return mPad[0].buttons[7].pressed;
	}

/* -------------------------------------------------------------------------	*/
// BUTTON L1- L2- R1- R2-

	s_getHbtn() {
		var fh=Math.floor(mPad[0].axes[0]);
		if(this.hval!=fh){
			this.hval=fh;
			return true;
		}
		else return false;
	}

	s_getVbtn() {
		var fv=Math.floor(mPad[0].axes[1]);
		if(this.vval!=fv){
			this.vval=fv;
			return true;
		}
		else return false;
	}

//Set Value
	s_Hval() {
		return (Math.floor(mPad[0].axes[0]));
	}

	s_Vval() {
		return (Math.floor(mPad[0].axes[1]));
	}

/* ================================	*/
//Event
	sButtonValue(args) {
		var n_bv=0;

		switch(args.n_button){
			case ButtonList.HVAL:
			{
				n_bv = Math.floor(mPad[0].axes[0]);
			}
			break;

			case ButtonList.VVAL:
			{
				n_bv = Math.floor(mPad[0].axes[1]);
			}
			break;

			case ButtonList.XBUT:
			{
				n_bv = Math.floor(mPad[0].buttons[2].value);
			}
			break;

			case ButtonList.YBUT:
			{
				n_bv = Math.floor(mPad[0].buttons[3].value);
			}
			break;

			case ButtonList.ABUT:
			{
				n_bv = Math.floor(mPad[0].buttons[0].value);
			}
			break;

			case ButtonList.BBUT:
			{
				n_bv = Math.floor(mPad[0].buttons[1].value);
			}
			break;

			case ButtonList.L1BUT:
			{
				n_bv = Math.floor(mPad[0].buttons[4].value);
			}
			break;

			case ButtonList.L2BUT:
			{
				n_bv = Math.floor(mPad[0].buttons[5].value);
			}
			break;

			case ButtonList.R1BUT:
			{
				n_bv = Math.floor(mPad[0].buttons[6].value);
			}
			break;

			case ButtonList.R2BUT:
			{
				n_bv = Math.floor(mPad[0].buttons[7].value);
			}			
			break;

		}
		return n_bv;
	}

}
module.exports = Scratch3GamePad;
