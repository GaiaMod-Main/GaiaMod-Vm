const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');

class Scratch3Controller {
    constructor(runtime) {
        this.runtime = runtime;

        // Cache last state
        this._gamepadIndex = 0; // First controller by default
        this._axes = [0, 0, 0, 0];
        this._buttons = [];
		//this._gamepad = null;

        // Start polling
        this._pollGamepad();
    }

    /**
     * Poll gamepad state continuously
     */
    _pollGamepad() {
        const poll = () => {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[this._gamepadIndex];
            if (gp) {
				//this._gamepad = gp;
                this._axes = gp.axes.slice(0, 4); // left X, left Y, right X, right Y
                this._buttons = gp.buttons.map(b => b.pressed);
            }
            requestAnimationFrame(poll);
        };
        poll();
    }

    getInfo() {
        return {
            id: 'controller',
            name: 'Controller',
            color1: '#33CC33',
			color2: '#29A329',
			color3: '#1F7A1F',
            blocks: [
                {
                    opcode: 'getAxis',
                    blockType: BlockType.REPORTER,
                    text: '[AXIS] axis',
                    arguments: {
                        AXIS: {
                            type: ArgumentType.STRING,
                            menu: 'axes'
                        }
                    }
                },
                {
                    opcode: 'buttonPressed',
                    blockType: BlockType.BOOLEAN,
                    text: 'button [BTN] pressed?',
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons'
                        }
                    }
                },
                {
                    opcode: 'whenButtonPressed',
                    blockType: BlockType.HAT,
                    text: 'when button [BTN] pressed',
                    arguments: {
                        BTN: {
                            type: ArgumentType.STRING,
                            menu: 'buttons'
                        }
                    }
                }
            ],
            menus: {
                axes: {
                    acceptReporters: true,
                    items: [
                        { text: 'left stick X', value: '0' },
                        { text: 'left stick Y', value: '1' },
                        { text: 'right stick X', value: '2' },
                        { text: 'right stick Y', value: '3' }
                    ]
                },
                buttons: {
                    acceptReporters: true,
                    items: [
                        { text: 'A', value: '0' },
                        { text: 'B', value: '1' },
                        { text: 'X', value: '2' },
                        { text: 'Y', value: '3' },
                        { text: 'Left Bumper (LB)', value: '4' },
                        { text: 'Right Bumper (RB)', value: '5' },
                        { text: 'Left Trigger (LT)', value: '6' },
                        { text: 'Right Trigger (RT)', value: '7' },
                        { text: 'Back / View', value: '8' },
                        { text: 'Start / Menu', value: '9' },
                        { text: 'Left Stick Click', value: '10' },
                        { text: 'Right Stick Click', value: '11' },
                        { text: 'D-pad Up', value: '12' },
                        { text: 'D-pad Down', value: '13' },
                        { text: 'D-pad Left', value: '14' },
                        { text: 'D-pad Right', value: '15' }
                    ]
                }
            }
        };
    }

    /**
     * Reporter block - get axis value
     */
    getAxis(args) {
        const index = Cast.toNumber(args.AXIS);
        return this._axes[index] || 0;
    }

    /**
     * Boolean block - button pressed
     */
    buttonPressed(args) {
        const index = Cast.toNumber(args.BTN);
        return this._buttons[index] || false;
    }

    /**
     * Hat block - triggers when button is pressed
     */
    whenButtonPressed(args) {
        const index = Cast.toNumber(args.BTN);
        return this._buttons[index] || false;
    }
}

module.exports = Scratch3Controller;