var wsURI = "ws://localhost:7423"; 
var blockIconURI = "data:image/png;base64,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";
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
//where the blocks start
class roku {
    constructor (runtime) { 
		this.ws = null;
		this.connected = false;
        this.runtime = runtime;
		this.rokuXML = null;
		this.waitid = 0; //used to identify waits by ids
		this.rokuInfoXML = null;
		this.connectHelper();
		this.waitends = {}; //function list to call a wait.
		this.rokuAppsXML = null;
		this.updateFinishedCount = 0;
    }
	removeWSListeners (ws) {
		function emptyFunction() {}
		ws.onclose = emptyFunction;
		ws.onopen = emptyFunction;
		ws.onerror = emptyFunction;
		ws.onmessage = emptyFunction;
	}
	connectHelper () {
		if (this.ws) {
			this.removeWSListeners(this.ws);
		}
		var ext = this;
		this.ws = new WebSocket(wsURI);
		this.ws.onclose = function () {
			//try to reconnect again.
			ext.connected = false;
			ext.connectHelper();
			ext.stopAllWaits();
		};
		this.ws.onerror = function () {
			//try to reconnect again.
			ext.connected = false;
			ext.connectHelper();
		};
		this.ws.onmessage = function (e) {
			var data = JSON.parse(e.data);
			//console.log(data);
			if (data.type == "CheckConnectionResponse") {
				ext.updateFinishedCount += 1;
				if (ext.waitends[data.id]) {
					ext.waitends[data.id](data.val);
					ext.waitends[data.id] = null;
				}
			}
			if (data.type == "UpdateXML") {
				ext.rokuXML = data.xml;
			}
			if (data.type == "UpdateInfoXML") {
				ext.rokuInfoXML = data.xml;
			}
			if (data.type == "UpdateAppsXML") {
				ext.rokuAppsXML = data.xml;
			}
			if (data.type == "UpdateFinished") {
				ext.updateFinishedCount += 1;
				if (ext.waitends[data.id]) {
					ext.waitends[data.id]();
					ext.waitends[data.id] = null;
				}
			}
		};
		this.ws.onopen = function () {
			/*
				Successful connection,
				tell the extension that we connected to the helper,
				and can send messages to it.
				
				also tell the helper that we are using the roku extension.
			*/
			ext.ws.send(JSON.stringify({
				cmd:"setup",
				type:"roku"
			}))
			ext.connected = true;
		};
	}
	
	getRokuButtons () {
		return [
						{
							text:"Home",
							value:"home"
						},
						{
							text:"Play",
							value:"play"
						},
						{
							text:"Reverse",
							value:"rev"
						},
						{
							text:"Forward",
							value:"fwd"
						},
						{
							text:"Info",
							value:"info"
						},
						{
							text:"Select (OK)",
							value:"select"
						},
						{
							text:"Back",
							value:"back"
						},
						{
							text:"Up",
							value:"up"
						},
						{
							text:"Down",
							value:"down"
						},
						{
							text:"Left",
							value:"left"
						},
						{
							text:"Right",
							value:"right"
						},
						
						{
							text:"Volume Up",
							value:"volumeup"
						},
						{
							text:"Volume Down",
							value:"volumedown"
						},
						{
							text:"Power Off",
							value:"poweroff"
						},
						{
							text:"Power On",
							value:"poweron"
						}
		];
	}
	setTimeoutAsync (resolve) {
		return new Promise((resolve) => {
			setTimeout(resolve,ms);
		});
	}
    getInfo () {
        return {
            id: 'roku',
            name: 'Roku',
			blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: 'connectToRoku',
                    blockType: BlockType.COMMAND,
                    text: 'Connect to roku by ip: [ip]',
                    arguments: {
						ip: {
							acceptReporters: true,
							type:ArgumentType.STRING,
							defaultValue:"192.168.1.2"
						}
                    }
                },
				{
                    opcode: 'pressButton',
                    blockType: BlockType.COMMAND,
                    text: 'Press button [key] on remote',
                    arguments: {
						key: {
							acceptReporters: false,
							menu: 'remoteButtons'
						}
                    }
                },
				{
                    opcode: 'buttonDown',
                    blockType: BlockType.COMMAND,
                    text: 'Hold [key] on remote',
                    arguments: {
						key: {
							acceptReporters: false,
							menu: 'remoteButtons'
						}
                    }
                },
				{
                    opcode: 'buttonUp',
                    blockType: BlockType.COMMAND,
                    text: 'Release [key] on remote',
                    arguments: {
						key: {
							acceptReporters: false,
							menu: 'remoteButtons'
						}
                    }
                },
				{
                    opcode: 'getRokuData',
                    blockType: BlockType.REPORTER,
                    text: 'Get [whatToGet]',
                    arguments: {
						whatToGet: {
							acceptReporters: false,
							menu: 'rokuGetTypes'
						}
                    }
                },
				{
                    opcode: 'updateData',
                    blockType: BlockType.COMMAND,
                    text: 'Update Roku data',
                    arguments: {
                    }
                },
				{
                    opcode: 'checkConnectionWorks',
                    blockType: BlockType.BOOLEAN,
                    text: 'Is roku availiable on ip [ipadress]',
                    arguments: {
						ipadress: {
							acceptReporters: true,
							type:ArgumentType.STRING,
							defaultValue:"192.168.1.2"
						}
                    }
                },
				{
                    opcode: 'getAppLength',
                    blockType: BlockType.REPORTER,
                    text: 'Number of apps and inputs installed',
                    arguments: {
                    }
                },
				{
                    opcode: 'getAppFromNumber',
                    blockType: BlockType.REPORTER,
                    text: 'Get app [appNumber] [appInfo]',
                    arguments: {
						appNumber: {
							acceptReporters: true,
							type:ArgumentType.NUMBER,
							defaultValue:1 //first app installed.
						},
						appInfo: {
							acceptReporters: false,
							menu:"appInfo"
						}
                    }
                },
				{
                    opcode: 'launchAppById',
                    blockType: BlockType.COMMAND,
                    text: 'Launch app by app id: [appNumber]',
                    arguments: {
						appNumber: {
							acceptReporters: true,
							type:ArgumentType.STRING, //Figured it can be a string as well (for tv inputs!)
							defaultValue:""
						}
                    }
                }
            ],
            menus: {
				appInfo:{
					acceptReporters: false,
					items: [
						{
							text:"Name",
							value:"name"
						},
						{
							text:"ID",
							value:"id"
						},
						{
							text:"Type",
							value:"type"
						},
						{
							text:"Version",
							value:"version"
						}
					]
				},
				remoteButtons:{
					acceptReporters: false,
					items:this.getRokuButtons()
				},
				rokuGetTypes:{
					acceptReporters: false,
					items:[
						{
							text:"Model Discription",
							value:"modelDescription"
						},
						{
							text:"Name",
							value:"friendlyName"
						},
						{
							text:"Device Type",
							value:"deviceType"
						},
						{
							text:"Manufacturer",
							value:"manufacturer"
						},
						{
							text:"Manufacturer URL",
							value:"manufacturerURL"
						},
						{
							text:"User's Device Location",
							value:"user-device-location"
						},
						{
							text:"Software Version",
							value:"software-version"
						},
						{
							text:"Power Mode",
							value:"power-mode"
						},
						{
							text:"Supports private listening?",
							value:"supports-private-listening"
						},
						{
							text:"Headphones connected?",
							value:"headphones-connected"
						},
						{
							text:"Language",
							value:"language"
						},
						{
							text:"Country",
							value:"country"
						},
						{
							text:"Network Name",
							value:"network-name"
						}
					]
				}
            }
        };
    }
	stopAllWaits () {
		for (var id of Object.keys(this.waitends)) {
			try{
				this.waitends[id]();
			}catch(e){}
			this.waitid -= 1;
		}
		this.waitends = {};
	}
	launchAppById (args) {
		try{
			if (this.connected) {
				this.ws.send(JSON.stringify({
					funct:"launchAppById",
					id:Number(args.appNumber)
				}))
			} else {
			}
		}catch(e){
		}
	}
	getAppFromNumber (args) {
		try{
			if (this.connected) {
				var parsedXML = document.createElement("div");
				parsedXML.innerHTML = this.rokuAppsXML;
				
				var apps = parsedXML.getElementsByTagName("apps")[0];
				if (apps) {
					var appData = apps.children;
					var app = appData[Number(args.appNumber)-1]; //javascript arrays are zero-indexed.
					if (app) {
						if (args.appInfo.toString() == "name") {
							return app.textContent;
						}
						if (args.appInfo.toString() == "id") {
							return app.getAttribute("id");
						}
						if (args.appInfo.toString() == "type") {
							return app.getAttribute("type");
						}
						if (args.appInfo.toString() == "version") {
							return app.getAttribute("version");
						}
					}
				}
				return "";
			} else {
				return "";
			}
		}catch(e){
			return "";
		}
	}
	getAppLength () {
		try{
			if (this.connected) {
				var parsedXML = document.createElement("div");
				parsedXML.innerHTML = this.rokuAppsXML;
				
				var apps = parsedXML.getElementsByTagName("apps")[0];
				return apps.children.length.toString();
			} else {
				return "0";
			}
		}catch(e){
			return "0";
		}
	}
	checkConnectionWorks (args) {
		try{
			if (this.connected) {
				
				var t = this;
				this.waitid += 1;
				var id = this.waitid;
				this.ws.send(JSON.stringify({
					funct:"checkConnectionWorks",
					id:id,
					ip:args.ipadress
				}))
				return new Promise(async (a) => {
					t.waitends[id] = function (val) {
						t.waitids -= 1; //dont stack up on "null" waitend functions, by removing a waitid.
						a(val); //dont forget to return the value!
					};
				})
			} else {
				return false; //no helper connection should result into a false output.
			}
		}catch(e){
			return false; //I don't know what happened here, but still return false.
		}
	}
	
	updateData () {
		try {
			if (this.connected) {
				
				var t = this;
				this.waitid += 1;
				var id = this.waitid;
				this.ws.send(JSON.stringify({
					funct:"updateXML",
					id:id
				}))
				return new Promise(async (a) => {
					t.waitends[id] = function (val) {
						t.waitids -= 1; //dont stack up on "null" waitend functions, by removing a waitid.
						a();
					};
				})
			}
		}catch(e){}
	}
	
	pressButton (args) {
		try {
			if (this.connected) {
				this.ws.send(JSON.stringify({
					funct:"pressKey",
					key:args.key
				}));
				return setTimeoutAsync(50); //Half of 0.1 seconds
			}
		} catch(e) {
		}
    }
	
	buttonDown (args) {
		try {
			if (this.connected) {
				this.ws.send(JSON.stringify({
					funct:"buttonDown",
					key:args.key
				}));
				return setTimeoutAsync(50); //Half of 0.1 seconds
			}
		} catch(e) {
		}
    }
	buttonUp (args) {
		try {
			if (this.connected) {
				this.ws.send(JSON.stringify({
					funct:"buttonUp",
					key:args.key
				}));
				return setTimeoutAsync(50); //Half of 0.1 seconds
			}
		} catch(e) {
		}
    }
	
    connectToRoku (args) {
		try {
			if (this.connected) {
				var t = this;
				this.waitid += 1;
				var id = this.waitid;
				this.ws.send(JSON.stringify({
					funct:"connectToRoku",
					ip:args.ip,
					id:id
				}))
				return new Promise(async (a) => {
					t.waitends[id] = function () {
						t.waitids -= 1;
						a();
					};
				})
			}
		} catch(e) {
		}
    }
	tickAsync(){
		return new Promise((a)=>{
			setTimeout(a,1);
		});
	}
	getRokuData (args) {
		try {
			if (this.connected) {
				var parsedXML = document.createElement("div");
				parsedXML.innerHTML = this.rokuXML;
				
				var device = parsedXML.getElementsByTagName("device")[0];
				
				//search the xml for the target
				if (args.whatToGet.toString() == "friendlyName") {
					return device.getElementsByTagName("friendlyName")[0].textContent;
				}
				if (args.whatToGet.toString() == "modelDescription") {
					return device.getElementsByTagName("modelDescription")[0].textContent;
				}
				if (args.whatToGet.toString() == "deviceType") {
					return device.getElementsByTagName("deviceType")[0].textContent;
				}
				if (args.whatToGet.toString() == "manufacturer") {
					return device.getElementsByTagName("manufacturer")[0].textContent;
				}
				if (args.whatToGet.toString() == "manufacturerURL") {
					return device.getElementsByTagName("manufacturerURL")[0].textContent;
				}
				//for the "advanced" much more in detal information
				var parsedXMLAdvanced = document.createElement("div");
				parsedXMLAdvanced.innerHTML = this.rokuInfoXML;
				if (args.whatToGet.toString() == "user-device-location") {
					return parsedXMLAdvanced.getElementsByTagName("user-device-location")[0].textContent;
				}
				if (args.whatToGet.toString() == "software-version") {
					return parsedXMLAdvanced.getElementsByTagName("software-version")[0].textContent;
				}
				if (args.whatToGet.toString() == "power-mode") {
					return parsedXMLAdvanced.getElementsByTagName("power-mode")[0].textContent;
				}
				if (args.whatToGet.toString() == "supports-private-listening") {
					return parsedXMLAdvanced.getElementsByTagName("supports-private-listening")[0].textContent;
				}
				if (args.whatToGet.toString() == "headphones-connected") {
					return parsedXMLAdvanced.getElementsByTagName("headphones-connected")[0].textContent;
				}
				if (args.whatToGet.toString() == "language") {
					return parsedXMLAdvanced.getElementsByTagName("language")[0].textContent;
				}
				if (args.whatToGet.toString() == "country") {
					return parsedXMLAdvanced.getElementsByTagName("country")[0].textContent;
				}
				if (args.whatToGet.toString() == "network-name") {
					return parsedXMLAdvanced.getElementsByTagName("network-name")[0].textContent;
				}
				
				return "";
			} else {
				return ""; //no helper connection, return empty string.
			}
		} catch(e) {
		}
	}
	
}

module.exports = roku;
