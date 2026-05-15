const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Scratch3RobotBase = require('../scratch3_ros/RobotUtil');
const icon = require('./icon');

var Scratch3Go1RobotFirstConnect = true;

class Scratch3Go1RobotBlocks extends Scratch3RobotBase {

    constructor(runtime, extensionId) {
        super('Go1', extensionId ? extensionId : 'go1Robot',
              '/sound_play', '/robotsound_jp', runtime,
              'sparky', Scratch3Go1RobotFirstConnect);
        Scratch3Go1RobotFirstConnect = false;
        this.icon = icon;
        this.mode = 0;
        this.gaitType = 0;
        this.speedLevel = 0;
        this.mode_menu = [
            "idle",                     // 0
            "force stand",              // 1
            "target velocity walking",  // 2
            "target position walking",  // 3
            "path mode walking",        // 4
            "sit",                      // 5
            "stand",                    // 6
            "damping state",            // 7
            "recovery stand",           // 8
            "backflip",                 // 9
            "jump",                     // 10
            "straight hand",            // 11
            "dance1",                   // 12
            "dance2",                   // 13
            "two leg stand",            // 14
        ];
        this.gaitType_menu = [
            "idle",           // 0
            "trot",           // 1
            "running",        // 2
            "climb stair",    // 3
        ];
        this.speedLevel_menu = [
            "low",            // 0
            "medium",         // 1
            "high",           // 2
        ];
    }

    _makeHighCmd () {
        var arr = new Uint8Array(3);
        arr[0] = this.mode;
        arr[1] = this.gaitType;
        arr[2] = this.speedLevel;
        return {
            mode: arr[0],
            gaitType: arr[1],
            speedLevel: arr[2],
        };
    }

    // act ({ACTION}) {
    //     if (ACTION === 'stand') {
    //         return this.ros.callService('/go1/stand', {});
    //     }
    //     if (ACTION === 'sit') {
    //         return this.ros.callService('/go1/sit', {});
    //     }
    //     return false;
    // }

    act ({ACTION}) {
        let val = this.mode_menu.indexOf(ACTION);
        if (val == -1) { return(false); }
        this.mode = val;
        let msg = this._makeHighCmd();
        return this.ros.publishTopic('/high_cmd', msg).
            catch(err => this._reportError(err));
    }

    setMode ({MODE}) {
        let val = this.mode_menu.indexOf(MODE);
        if (val == -1) { return(false); }
        this.mode = val;
        let msg = this._makeHighCmd();
        return this.ros.publishTopic('/high_cmd', msg).
            catch(err => this._reportError(err));
    }

    setGaitType ({TYPE}) {
        let val = this.gaitType_menu.indexOf(TYPE);
        if (val == -1) { return(false); }
        this.gaitType = val;
        let msg = this._makeHighCmd();
        return this.ros.publishTopic('/high_cmd', msg).
            catch(err => this._reportError(err));
    }

    setSpeedLevel ({LEVEL}) {
        let val = this.speedLevel_menu.indexOf(LEVEL);
        if (val == -1) { return(false); }
        this.speedLevel = val;
        let msg = this._makeHighCmd();
        return this.ros.publishTopic('/high_cmd', msg).
            catch(err => this._reportError(err));
    }

    getInfo () {
        return {
            id: this.extensionId,
            name: this.extensionName,
            showStatusButton: true,

            color1: this._randomizedColor(0xC3A5B5),
            menuIconURI: this.icon,
            
            blocks: [
                {
                    opcode: 'query',
                    blockType: BlockType.BOOLEAN,
                    text: 'query [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Proceed?'
                        }
                    }
                },
                {
                    opcode: 'act',
                    blockType: BlockType.COMMAND,
                    text: 'make robot [ACTION]',
                    arguments: {
                        ACTION: {
                            type: ArgumentType.STRING,
                            menu: 'actionMenu',
                            defaultValue: 'stand'
                        }
                    }
                },
                {
                    opcode: 'setMode',
                    blockType: BlockType.COMMAND,
                    text: 'set mode to [MODE]',
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'modeMenu',
                            defaultValue: 'idle'
                        }
                    }
                },
                {
                    opcode: 'setGaitType',
                    blockType: BlockType.COMMAND,
                    text: 'set gait type to [TYPE]',
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'gaitTypeMenu',
                            defaultValue: 'idle'
                        }
                    }
                },
                {
                    opcode: 'setSpeedLevel',
                    blockType: BlockType.COMMAND,
                    text: 'set speed level to [LEVEL]',
                    arguments: {
                        LEVEL: {
                            type: ArgumentType.STRING,
                            menu: 'speedLevelMenu',
                            defaultValue: 'low'
                        }
                    }
                },
            ],
            menus: {
                modeMenu: this.mode_menu.slice(0,5),
                actionMenu: this.mode_menu.slice(5),
                gaitTypeMenu: this.gaitType_menu,
                speedLevelMenu: this.speedLevel_menu,
            }
        };
    }
}

module.exports = Scratch3Go1RobotBlocks;
