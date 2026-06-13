const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Runtime = require('../../../src/engine/runtime');
const Sprite = require('../../../src/sprites/sprite.js');
const Motion = require('../../../src/blocks/scratch3_motion');
//the icon of the block
var blockIconURI = "data:image/png;base64,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";
let gamepadsConnected = [];
//start block scripts
class gamepad {
    constructor (runtime) {
		if (runtime.userdata.onextensionadded) {
			try{
				runtime.userdata.onextensionadded(runtime);
			}catch(e){console.error(e)}
		}
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'userdata',
            name: 'User Data',
			blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'getUserdataIP',
					name: 'IPAdress',
                    blockType: BlockType.REPORTER,
                    text: 'IP Adress',
                    arguments: {
                    }
                },
                {
                    opcode: 'countryName',
					name: 'countryName',
                    blockType: BlockType.REPORTER,
                    text: 'Country Name',
                    arguments: {
                    }
                },
                {
                    opcode: 'city',
					name: 'city',
                    blockType: BlockType.REPORTER,
                    text: 'City',
                    arguments: {
                    }
                }
            ],
            menus: {
				gamepadnum:{
					acceptReporters: true,
					items: [
					
					]
				}
            }
        };
    }
	getUserdataIP (args) {
		try{return this.runtime.userdata.ipAdress;}catch(e){}
		return "Error";
	}
	countryName (args) {
		try{return this.runtime.userdata.countryName;}catch(e){}
		return "Error";
	}
	city (args) {
		try{return this.runtime.userdata.city;}catch(e){}
		return "Error";
	}
}
module.exports = gamepad;