const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class Scratch3BluetoothController {
    constructor(runtime) {
        this.runtime = runtime
        window.addEventListener('gamepadconnected', (event) => {
            console.log('Gamepad connected:', event.gamepad);
            console.log(`Index: ${event.gamepad.index}`);
            console.log(`ID: ${event.gamepad.id}`);
            console.log(`Axes: ${event.gamepad.axes.length}`);
            console.log(`Buttons: ${event.gamepad.buttons.length}`);
        });

        window.addEventListener('gamepaddisconnected', (event) => {
            console.log('Gamepad disconnected:', event.gamepad);
        });
        this.pollGamepads = this.pollGamepads.bind(this);
        this.pollGamepads();
        this.up = this.down = this.left = this.right = this.l1 = this.l2 = this.r1 = this.r2 = this.triangle = this.square = this.cross = this.circle = this.select = this.start = this.ly = this.lx = this.ry = this.rx = 0
    }

    // 定期检查手柄状态
    pollGamepads() {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (gamepad) {
                this.up = gamepad.buttons[12].pressed
                this.down = gamepad.buttons[13].pressed
                this.left = gamepad.buttons[14].pressed
                this.right = gamepad.buttons[15].pressed
                this.l1 = gamepad.buttons[4].pressed
                this.l2 = gamepad.buttons[6].pressed
                this.r1 = gamepad.buttons[5].pressed
                this.r2 = gamepad.buttons[7].pressed
                this.triangle = gamepad.buttons[3].pressed
                this.square = gamepad.buttons[2].pressed
                this.cross = gamepad.buttons[0].pressed
                this.circle = gamepad.buttons[1].pressed
                this.select = gamepad.buttons[8].pressed
                this.start = gamepad.buttons[9].pressed
                // this.PS = gamepad.buttons[9].pressed
                this.ly = gamepad.axes[1]
                this.lx = gamepad.axes[0]
                this.ry = gamepad.axes[3]
                this.rx = gamepad.axes[2]
            }
        }
        requestAnimationFrame(this.pollGamepads);
    }

    getInfo() {
        return {
            id: "bluetoothController",
            name: formatMessage({ id: 'carMotor.bluetoothController.expansion.name'}),
            blockIconURL: iconURI,
            // showStatusButton: true,
            blocks: [
                {
                    func:"aabutton",
                    text:formatMessage({ id: 'carMotor.bluetoothController.online'}),
                    blockType:BlockType.BUTTON
                },
                {
                    opcode: "handShankButtons",
                    text: formatMessage({ id: 'carMotor.bluetoothControllerRealTime.buttons' }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "Buttons",
                            defaultValue: "l1"
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "Buttons_ACTION",
                            defaultValue: "down"
                        }
                    }
                },
                {
                    opcode: "getHandShankRockerData",
                    text: formatMessage({ id: 'carMotor.bluetoothControllerRealTime.getData' }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ROCKER",
                            defaultValue: "left"
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "AXIS",
                            defaultValue: "x"
                        }
                    }
                },
                {
                    func:"aabutton",
                    text:formatMessage({ id: 'carMotor.bluetoothController.offline'}),
                    blockType:BlockType.BUTTON
                },
                {
                    opcode: "connectHandShank",
                    text: formatMessage({ id: 'carMotor.bluetoothController.connect'}),
                    blockType: BlockType.COMMAND,
                    colour:"#000000",
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: '20:00:00:00:14:51'
                        }
                    }
                },
                {
                    opcode: "isConnectHandShank",
                    text: formatMessage({ id: 'carMotor.bluetoothController.isConnect'}),
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: "handShankButtons",
                    text: formatMessage({ id: 'carMotor.bluetoothController.buttons'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "Buttons",
                            defaultValue: "l1"
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            menu: "Buttons_ACTION",
                            defaultValue: "down"
                        }
                    }
                },
                {
                    opcode: "HandShankDisconnect",
                    text: formatMessage({ id: 'carMotor.bluetoothController.disConnect'}),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "handShankIsMove",
                    text: formatMessage({ id: 'carMotor.bluetoothController.move'}),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ROCKER",
                            defaultValue: "left"
                        }
                    }
                },
                {
                    opcode: "getHandShankRockerData",
                    text: formatMessage({ id: 'carMotor.bluetoothController.getData'}),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            menu: "ROCKER",
                            defaultValue: "left"
                        },
                        TWO:{
                            type: ArgumentType.STRING,
                            menu: "AXIS",
                            defaultValue: "x"
                        }
                    }
                },
                {
                    opcode: "multithreading",
                    text: formatMessage({ id: 'carMotor.bluetoothController.multithreading'}),
                    blockType: BlockType.CONDITIONAL,
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'callback'
                        },
                    }
                },
            ],
            menus: {
                Buttons:{
                    items:[
                        {text: "L1",value:"l1"},
                        {text: "L2",value:"l2"},
                        {text: "R1",value:"r1"},
                        {text: "R2",value:"r2"},
                        {text: "UP",value:"up"},
                        {text: "DOWN",value:"down"},
                        {text: "LEFT",value:"left"},
                        {text: "RIGHT",value:"right"},
                        {text: "X",value:"square"},
                        {text: "Y",value:"triangle"},
                        {text: "A",value:"cross"},
                        {text: "B",value:"circle"},
                        {text: "SELECT",value:"select"},
                        {text: "START",value:"start"},
                        {text: "PS",value:"ps"}
                    ]
                },
                ROCKER:{
                    items:[
                        {text: formatMessage({ id: 'ROBOT_ARM_LEFT_ROCKER' }),value:"left"},
                        {text: formatMessage({ id: 'ROBOT_ARM_RIGHT_ROCKER' }),value:"right"}
                    ]
                },
                AXIS:{
                    items:[
                        {text: "x",value:"x"},
                        {text: "y",value:"y"}
                    ]
                },
                Buttons_ACTION:{
                    items:[
                        {text:formatMessage({ id: 'carMotor.bluetoothController.pressDown' }),value:"down"},
                        {text:formatMessage({ id: 'carMotor.bluetoothController.undo' }),value:"up"}
                    ]
                }
            }
        }
    }

    carMove() { }

    carRotate() { }

    carStop() { }

    carSetSpeed() { }

    carMode() { }

    carExecute() { }

    aabutton(){}

    aaaaa(){}

    handShankButtons(args){
        let boo = false
        if('down'===args.TWO){
            boo = true
        }
        return this[args.ONE] == boo
    }

    getHandShankRockerData(args){
        let name = ''
        if('left'===args.ONE){
            name='l'
        }else{
            name='r'
        }
        name+=args.TWO
        return this[name]
    }
}

module.exports = Scratch3BluetoothController