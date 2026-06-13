const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
let bgm = document.createElement("audio");
let bgmPlaying = false;
bgm.preservesPitch = false;
bgm.volume = 1;
try {
	document.getElementsByClassName("stop-all_stop-all_15h2t")[0].addEventListener("click",function () {
		bgmPlaying = false;
		bgm.volume = 1;
	});
	document.getElementsByClassName("green-flag_green-flag_mk1Vo")[0].addEventListener("click",function () {
		bgmPlaying = false;
		bgm.volume = 1;
	});
}catch(e){}

class betteraudio {
	

    getInfo () {
        return {
            id: 'betteraudio',
            name: 'Better Audio',
			blockIconURI:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAIAAACyr5FlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAbOSURBVHhe7dPblttGDATA/P9PO85RwbGTIbUXSg2SqMdeiORgev/6McaGKcfYNOUYm6YcY9OUo4u/fiNKm3K0oBS/8YeoKUeYLvyPP0dNOWK0YIOhqClHhgpsMxc15Xg3l/+M6agpx1u5+Q/wg6gpx5u485XlwCPMmnK8gwtfMTHluCFXvWKiSIs0asrxKi55g6Hf+EORRk05XsINr5j4H38u0qgpx8Hc7YqJDYaKNGrKcSQXu2Jim7kijZpyHMOVrph4xnSRRk05DuA+V0x8gB8UadSU41vc5IqJD/OzIo2acnyRO9xg6DP8skijphxf4QJXTHye3xdp1JTjc1zdiomv8pQijZpyfIJ7WzHxDR5UpFFTjg9xYysmvs3jijRqyvGc61oxcQRPLNKoKcceF7Vi4jieW6RRU441V7TB0KE8ukijphwL7mfFxAt4QZFGTTn+4GZWTLyM1xRp1JTjX65lxcQreVORRk05/uFCVky8nvcVadSUo0UzfvLKIo26dTncw4qJN/LiIo26aTncwAZD7+XdRRp1x3JY/4qJBF9QpFH3KofFr5jI8R1FGnWjctj6iokon1KkUbcoh32vmGjABxVp1PXLYdkrJnrwTUUadeVyWPOKiU58WZFGXbMcFrzBUDM+rkijLlgO210x0ZJPLNKoS5XDXldMNOZDizTqOuWw1BUTvfnWIo26Qjmsc8XEGfjiIo06fTnscsXESfjoIo06cTlsccXEqfj0Io26wh7/w9DZ+PoijTrfKi1vxcQ5OUORRp1poda2YuLMnKRIo06zVjtbMXFyDlOkUSfYrG2tmLgERyrSqO77taoVE1fhVEUa1XfFlrRi4lqcrUijOi7aejYYuhzHK9Kodru2mxUTF+WQRRrVaOO2smLi0hy1SKOO+QgHeg3vuDqnLdKoAz7CaV7AC+7BmYs06rsf4Sgv4AW34dhFGtWxHB59Mw5fpFHtyuG59+P8RRp1cDmkH+ZnRXpLVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoKUcXVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoKUcXVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoKUcXVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoKUcXVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoKUcXVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoKUcXVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoKUcXVlCkUVOOLqygSKOmHF1YQZFGTTm6sIIijZpydGEFRRo15ejCCoo0asrRhRUUadSUowsrKNKoXuV48LebcfgijTq4HMfyjntw5iKNal2OB2+6Oqct0qgTlOPB+67LOYs06jTlePDWK3LCIo06WTkevPtanK1Iow74CKc59Dye+IzpS3CkIo3qvl+r2mX05BymSKPOsVkL22X0tByjSKPOtFNr22X0hBygSKPOt03L22X0VHx6kUad9V/NCp8xfQa+uEijzlqOX+xyl9HefGuRRp2+HA82ustoV76ySKMuUo4He91ltB/fV6RRlyrHg+3uMtqJLyvSqAuW48GOnzHdgA8q0qjLluMXy95lNMqnFGnU9cvxYOW7jIb4iCKNuks5Hix+l9G38/oijbpXOR6sf5fRN/LiIo26YzkeXMIzpl/P+4o06r7l+MVt7DL6St5UpFFTDtzJLqOv4R1FGjXl+IOb2WX0aJ5epFFTjgX3s8vocTy3SKOmHJvc0jOmv83jijRqyvGc69pl9Bs8qEijphwf5dJ2Gf0SjyjSqCnH57i6XUY/yY+LNGrK8RUucJfRD/OzIo2acnyda3zG9DOmizRqynEA97nL6DZzRRo15TiMW91ldMVEkUZNOQ7mbncZ/ZO/FWnUlOMl3PAuo0VapFFTjhdyz88shx9h1pTjHVz4Z/hl1JTjfVz7x/hN1JTj3Vz+M6ajphwZKrDNXNSUI0kRVkxETTla0Ijf+EPUlKMRvejRjJ+mHGPTlGNsmnKMTVOOsWnKMTZNOcamKcfYNOUYG378+BtpCLhHdxiAEgAAAABJRU5ErkJggg==',
            blocks: [
                {
                    opcode: 'playmusic',
                    blockType: BlockType.COMMAND,
                    text: 'Play Music At URL [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "https://coderman64.github.io/motobug-engine/res/music/Dig3.ogg"
                        }
                    }
                },
                {
                    opcode: 'playmusicnour',
                    blockType: BlockType.COMMAND,
                    text: 'Play Music',
                    arguments: {
						
                    }
                },
                {
                    opcode: 'pausemusic',
                    blockType: BlockType.COMMAND,
                    text: 'Pause Music',
                    arguments: {
						
                    }
                },
                {
                    opcode: 'setmusicspeed',
                    blockType: BlockType.COMMAND,
                    text: 'Set music pitch to [pitch]',
                    arguments: {
                        pitch: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setmusicvolume',
                    blockType: BlockType.COMMAND,
                    text: 'Set Volume To [volume]',
                    arguments: {
						volume: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
						}
                    }
                },
                {
                    opcode: 'getmusicinfo',
                    blockType: BlockType.REPORTER,
                    text: 'Music [bgmset]',
                    arguments: {
						bgmset: {
							menu: 'bgmvol'
						}
                    }
                }
				
            ],
            menus: {
				bgmvol: {
					acceptReporters: false,
					items: [
					{
						text:"Volume",
						value:"vol"
					},
					{
						text:"Pitch",
						value:"pitch"
					}
					]
				}
            }
        };
    }

    playmusic (args) {
		try{
			bgm.src = Cast.toString(args.URL);
			bgmPlaying = true;
		}catch(e){}
    }
	pausemusic () {
		try {
			bgmPlaying = false;
		}catch(e){}
	}
	setmusicspeed (args) {
		try{
			bgm.playbackRate = (Number(Cast.toString(args.pitch)) / 100) + 1;
		}catch(e){}
	}
	setmusicvolume (args) {
		try{
			bgm.volume = Number(Cast.toString(args.volume)) / 100;
		}catch(e){}
	}
	getmusicinfo (args) {
		if (Cast.toString(args.bgmset) == "vol") {
			return (bgm.volume * 100);
		} else {
			if (Cast.toString(args.bgmset) == "pitch") {
				return Math.round((bgm.playbackRate * 100) - 100);
			}
		}
	}
	playmusicnour (args) {
		try{
			bgmPlaying = true;
		}catch(e){}
	}
}

function ensurePlaying() {
	if (bgmPlaying) {
		bgm.play();
	} else {
		bgm.pause();
	}
	setTimeout(ensurePlaying,1);
}
ensurePlaying();
module.exports = betteraudio;