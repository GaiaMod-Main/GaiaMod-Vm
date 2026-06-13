const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

var smallIcon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwLDAsMTgwLDE4MCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1MCwtOTApIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMTUwLDI3MHYtMTgwaDE4MHYxODB6IiBmaWxsPSJub25lIi8+PGc+PHBhdGggZD0iTTE5My4xNzg3Myw5OC43OTIzOGg3LjI5NnY3LjIzMjU1aDYuNzI1MDF2LTcuMjMyNTVoNy4yOTZ2MjEuODg3OTloLTcuMjk2di03LjI5NmgtNi42NjE1NnY3LjI5NmgtNy4zNTk0NE0yMjQuMTM5MTMsMTA2LjA4ODM4aC02LjQzOTUxdi03LjI5NTk5aDIwLjIwNjc0djcuMjk1OTloLTYuNDcxMjN2MTQuNTkyaC03LjI5Nk0yNDEuMTEwMjYsOTguNzkyMzhoNy42NDQ5NGw0LjY5NDgxLDcuNzA4MzhsNC42OTQ4MiwtNy43MDgzOGg3LjY0NDk0djIxLjg4Nzk5aC03LjI5NnYtMTAuODQ4ODRsLTUuMTA3Miw3Ljg2N2wtNS4xMDcyLC03Ljg2N3YxMC44NDg4NGgtNy4xNjkxMU0yNjkuNDA2MDQsOTguNzkyMzhoNy4yOTZ2MTQuNjU1NDRoMTAuMzQxMjh2Ny4yMzI1NWgtMTcuNjM3MjgiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMTkyLjkyNDk1LDI0OC4yMDE3MWwtMTAuNDY4MTYsLTExNy40OTcyN2gxMTUuMDg2NDNsLTEwLjQ2ODE3LDExNy40MzM4M2wtNDcuMTcwMjEsMTMuMDY5MzUiIGZpbGw9IiNlNDRkMjYiLz48cGF0aCBkPSJNMjQwLDI1MS4yMTUyOHYtMTEwLjg2NzQzaDQ3LjA0MzMybC04Ljk3NzI1LDEwMC4yNDA2NiIgZmlsbD0iI2YxNjUyOSIvPjxwYXRoIGQ9Ik0yMDMuODM3MjMsMTU0LjcxNzc4aDM2LjE2Mjc3djE0LjQwMTY3aC0yMC4zNjUzNWwxLjMzMjMxLDE0Ljc1MDZoMTkuMDMzMDR2MTQuMzY5OTVoLTMyLjIyOTI4TTIwOC40MDUxNiwyMDUuNDcyNTRoMTQuNDY1MTFsMS4wMTUxLDExLjUxNDk4bDE2LjExNDYzLDQuMzE0MTV2MTUuMDM2MWwtMjkuNTY0NjUsLTguMjQ3NjUiIGZpbGw9IiNlYmViZWIiLz48cGF0aCBkPSJNMjc0LjcwMzU3LDE2OS4xMTk0NWgtMzQuNzY3MDF2LTE0LjQwMTY2aDM2LjA5OTMyTTI2OS40Mzc3NiwyMjguMDkwMTRsLTI5LjUwMTIsOC4xODQyMXYtMTQuOTcyNjZsMTYuMDgyOTEsLTQuMzE0MTVsMS42ODEyNSwtMTguNzE1ODJoLTE3Ljc2NDE3di0xNC40MDE2NmgzMy40NjY0MiIgZmlsbD0iI2ZmZmZmZiIvPjwvZz48L2c+PC9nPjwvc3ZnPg==";

const turnSkinIntoImageData = (skin) => {
    const svgSkin = /** @type {RenderWebGL.SVGSkin} */(skin);
    if (svgSkin._svgImage) {
        // This is an SVG skin
        return null;
    }

    // It's probably a bitmap skin.
    // The most reliable way to get the bitmap in every runtime is through the silhouette.
    // This is very slow and could involve reading the texture from the GPU.
    const silhouette = skin._silhouette;
    // unlazy() only exists in TW
    if (silhouette.unlazy) {
        silhouette.unlazy();
    }
    const colorData = silhouette._colorData;
    const width = silhouette._width;
    const height = silhouette._height;
    const imageData = new ImageData(
            colorData,
            silhouette._width,
            silhouette._height);
    return {
        img: imageData,
        width: silhouette._width,
        height: silhouette._height
    };
};

class Scratch3NewBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.vm = runtime.vm;
        this.canvases = {};
    }

    getInfo() {
        return {
            id: 'html5',
            name: 'HTML5',
            color1: "#ff5500",
            color2: "#ba562b",
            color3: "#853e20",
			blockIconURI: smallIcon,
            blocks: [{
                    opcode: 'showspritecanvas',
                    blockType: BlockType.COMMAND,
                    text: 'Show current costume at x: [x] y: [y] with id: [id]',
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        id: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                }, {
                    opcode: 'hidespritecanvas',
                    blockType: BlockType.COMMAND,
                    text: 'Remove costume on page by id: [id]',
                    arguments: {
                        id: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                }, {
                    opcode: 'movespritecanvas',
                    blockType: BlockType.COMMAND,
                    text: 'Move costume on page to x: [x] y: [y] using id: [id]',
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                        id: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                }
            ],
            menus: {}
        };
    }

    showspritecanvas(args, util) {
        try {
            var id = Cast.toString(args.id);
            var x = Cast.toNumber(args.x);
            var y = Cast.toNumber(args.y);
            if (this.canvases[id]) {
                this.canvases[id].cvs.remove();
            }
            var costume = util.target.getCostumes()[util.target.currentCostume];
            var skin = this.vm.renderer._allSkins[costume.skinId];
            var imgData = turnSkinIntoImageData(skin);
            if (imgData) {
                var cvs = document.createElement("canvas");
                var ctx = cvs.getContext("2d");
                cvs.width = imgData.width;
                cvs.height = imgData.height;
                ctx.putImageData(imgData.img, 0, 0);

                cvs.style.zIndex = "495938586395868";
                cvs.style.position = "fixed";
				this.useCostumeRotationToAlignPos(costume,cvs,x,y);

                document.body.appendChild(cvs);

                this.canvases[id] = {cvs:cvs,cos:costume};
            }
        } catch (e) {
            console.error("HTML5 extension error", e);
        }
    }
	
	useCostumeRotationToAlignPos(cos,cvs,x2,y2) {
		var x = x2;
		x += (cos.rotationCenterX*-1);
		var y = y2;
		y += (cos.rotationCenterY*-1);
		cvs.style.left = x + "px"; //allways gets me, why dont they make a second css property that replaces that.
        cvs.style.top = y + "px";
	}

    hidespritecanvas(args, util) {
        try {
            var id = Cast.toString(args.id);
            var x = Cast.toNumber(args.x);
            var y = Cast.toNumber(args.y);
            if (this.canvases[id]) {
                var cvs = this.canvases[id].cvs;
                cvs.remove();
            }
        } catch (e) {
            console.error("HTML5 extension error", e);
        }
    }

    movespritecanvas(args, util) {
        try {
            var id = Cast.toString(args.id);
            var x = Cast.toNumber(args.x);
            var y = Cast.toNumber(args.y);
            if (this.canvases[id]) {
                var cvs = this.canvases[id].cvs;
				var costume = this.canvases[id].cos;
                cvs.style.position = "fixed";
                this.useCostumeRotationToAlignPos(costume,cvs,x,y);
            }
        } catch (e) {
            console.error("HTML5 extension error", e);
        }
    }
}

module.exports = Scratch3NewBlocks;
