//THIS IS NOT USED ANYMORE

//Some basic support for the turbowarp update for extensions.
//So I dont have to modify the extension to work with gvbvdxx mod 2, just a slight modification, nothing that takes a long time.
const ArgumentType = require('../extension-support/argument-type');
const BlockType = require('../extension-support/block-type');
const Cast = require('../util/cast');
const TargetType = require('../extension-support/target-type');
const vm = window.LatestVirtualMachine;
var Scratch = {
	vm:vm,
	renderer:vm.renderer,
	storage:vm.storage,
	audioEngine:vm.audioEngine,
	audio:vm.audioEngine,
	canEmbed: async function () {
		//basicly is a function that prompts if you can use embedding, like a confirm dialog.
		return true; //force true, no dialog, im to lazy!
	},
	canFetch: async function () {
		//basicly is a function that prompts if you can use fetching, like a confirm dialog.
		return true; //force true, no dialog, im to lazy!
	},
	fetch: window.fetch,
	ArgumentType:ArgumentType,
	BlockType:BlockType,
	Cast:Cast,
	TargetType:TargetType,
	extensions: {
		unsandboxed:true, //Some extensions require this.
		register: function (ext) {
			console.log("Replace Scratch.extensions.register with a return statement, and also remove the constructor for the extension.");
		}
	}
};
module.exports = function (ext) {
	return ext(Scratch);
};