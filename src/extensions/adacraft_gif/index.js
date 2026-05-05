const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const gifenc = require('gifenc');
const {default: fpsValues} = require('./fps-values');

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'add image from URL': {
            en: 'add image from [URL] in current GIF',
            fr: 'ajouter une image depuis [URL] dans le GIF courant'
        },
        'number of images in current GIF': {
            en: 'number of images in current GIF',
            fr: 'nombre d\'images dans le GIF courant'
        },
        'remove images from current GIF': {
            en: 'remove images from current GIF',
            fr: 'supprimer les images du GIF courant'
        },
        'get GIF content': {
            en: 'get GIF content',
            fr: 'obtenir le contenu du GIF'
        },
        'get GIF content with FPS': {
            en: 'get GIF content with [FPS] FPS',
            fr: 'obtenir le contenu du GIF avec [FPS] FPS'
        }
    }
};

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMDBweCIgaGVpZ2h0PSIzMDBweCIgdmlld0JveD0iMCwwLDI1NiwxNzcuNDg0MzgiPjxnIGZpbGw9IiNkM2QzZDMiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAzMjIsLTAuMDA3MTMpIHNjYWxlKDAuNTY4ODksMC41Njg4OSkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMzEyKSBzY2FsZSgwLjEsLTAuMSkiPjxwYXRoIGQ9Ik0xNzI1LDI3NjRjLTUwNSwtMjYgLTkzNSwtODAgLTEwNDQsLTEyOWMtMTEwLC01MSAtMjA4LC0xNTggLTI1MiwtMjc3bC0yNCwtNjNsLTMsLTY5NWMtMiwtNDgwIDAsLTcxNSA4LC03NjBjMjUsLTE0NCAxMzQsLTI5MCAyNjEsLTM1MGM5OCwtNDUgMzMxLC04MSA3NzQsLTExN2MzMDMsLTI1IDEzMTksLTI1IDE2MTUsMGM0NTYsMzkgNjc0LDcyIDc3MCwxMTljMTMxLDY0IDIzNywyMDkgMjYwLDM1NWM3LDQ1IDEwLDMwNiA4LDc1OGwtMyw2OTBsLTI0LDYwYy03NiwxOTIgLTIwMCwyODcgLTQyMSwzMjRjLTM2NSw2MiAtNjc4LDgyIC0xMzEwLDg2Yy0zMDAsMSAtNTc2LDEgLTYxNSwtMXpNMTY2NywyMTI0Yzc3LC0xOSAxNzIsLTY2IDIwNiwtMTAyYzcyLC03NSAzOSwtMTg2IC02MSwtMTk5Yy0zNCwtNCAtNDksMSAtMTA4LDM2Yy04Niw1MiAtMTI5LDY0IC0yMjQsNjVjLTkxLDAgLTE2NiwtMzAgLTIyOSwtOTNjLTEzNywtMTM3IC0xNDUsLTM4NSAtMTcsLTUyOGMxMDUsLTExNiAyOTQsLTE0NSA0NDYsLTY4bDUwLDI1djkwdjkwaC0xMTVjLTExMiwwIC0xMTUsMSAtMTQ3LDI5Yy0yNywyNCAtMzMsMzYgLTMzLDcwYzAsMzMgNyw0NyAzMiw3M2wzMywzMmwxNzcsLTJjOTgsLTEgMTg2LC0yIDE5NywtMmMxMCwwIDMzLC0xNSA1MiwtMzRsMzQsLTM0di0xODhjMCwtMTYwIC0zLC0xOTQgLTE4LC0yMjRjLTIzLC00NiAtMTA2LC0xMDIgLTIwOSwtMTM5Yy00MjcsLTE1NiAtODMzLDEwNCAtODMzLDUzNGMwLDE2OSA1MywyOTkgMTcwLDQxNmMxNTUsMTU2IDM2OSwyMTEgNTk3LDE1M3pNMjQyMywyMDkwbDI3LC0zMHYtNDk5di00OTlsLTI2LC0zMWMtNDgsLTU3IC0xMjUsLTU4IC0xNzYsLTFsLTI4LDMwdjQ5OXY0OTlsMjYsMzFjNDgsNTcgMTI1LDU4IDE3Nywxek0zNTQ4LDIxMTBjNjIsLTM4IDcwLC0xMTQgMTgsLTE2NmwtMzQsLTM0aC0yODFoLTI4MmwzLC0xMjRsMywtMTI1bDI0MCwtNGMyNjEsLTMgMjc4LC03IDMwMywtNjNjMjMsLTQ5IDUsLTEyMSAtMzUsLTE0MGMtMTAsLTUgLTEyOCwtMTEgLTI2MywtMTRsLTI0NSwtNWwtNSwtMTkwYy0zLC0xMDQgLTksLTE5OCAtMTMsLTIwN2MtMTUsLTI5IC01NSwtNDggLTEwMSwtNDhjLTM2LDAgLTUyLDYgLTc4LDI5bC0zMywyOWwtMyw1MDBsLTMsNTAwbDI3LDMyYzE1LDE3IDM3LDM2IDQ4LDQwYzEyLDUgMTc0LDkgMzYxLDljMzIzLDEgMzQyLDAgMzczLC0xOXoiPjwvcGF0aD48L2c+PC9nPjwvZz48L3N2Zz4=';
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMDBweCIgaGVpZ2h0PSIzMDBweCIgdmlld0JveD0iMCwwLDI1NiwxNzcuNDg0MzgiPjxnIGZpbGw9IiNkM2QzZDMiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAzMjIsLTAuMDA3MTMpIHNjYWxlKDAuNTY4ODksMC41Njg4OSkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMzEyKSBzY2FsZSgwLjEsLTAuMSkiPjxwYXRoIGQ9Ik0xNzI1LDI3NjRjLTUwNSwtMjYgLTkzNSwtODAgLTEwNDQsLTEyOWMtMTEwLC01MSAtMjA4LC0xNTggLTI1MiwtMjc3bC0yNCwtNjNsLTMsLTY5NWMtMiwtNDgwIDAsLTcxNSA4LC03NjBjMjUsLTE0NCAxMzQsLTI5MCAyNjEsLTM1MGM5OCwtNDUgMzMxLC04MSA3NzQsLTExN2MzMDMsLTI1IDEzMTksLTI1IDE2MTUsMGM0NTYsMzkgNjc0LDcyIDc3MCwxMTljMTMxLDY0IDIzNywyMDkgMjYwLDM1NWM3LDQ1IDEwLDMwNiA4LDc1OGwtMyw2OTBsLTI0LDYwYy03NiwxOTIgLTIwMCwyODcgLTQyMSwzMjRjLTM2NSw2MiAtNjc4LDgyIC0xMzEwLDg2Yy0zMDAsMSAtNTc2LDEgLTYxNSwtMXpNMTY2NywyMTI0Yzc3LC0xOSAxNzIsLTY2IDIwNiwtMTAyYzcyLC03NSAzOSwtMTg2IC02MSwtMTk5Yy0zNCwtNCAtNDksMSAtMTA4LDM2Yy04Niw1MiAtMTI5LDY0IC0yMjQsNjVjLTkxLDAgLTE2NiwtMzAgLTIyOSwtOTNjLTEzNywtMTM3IC0xNDUsLTM4NSAtMTcsLTUyOGMxMDUsLTExNiAyOTQsLTE0NSA0NDYsLTY4bDUwLDI1djkwdjkwaC0xMTVjLTExMiwwIC0xMTUsMSAtMTQ3LDI5Yy0yNywyNCAtMzMsMzYgLTMzLDcwYzAsMzMgNyw0NyAzMiw3M2wzMywzMmwxNzcsLTJjOTgsLTEgMTg2LC0yIDE5NywtMmMxMCwwIDMzLC0xNSA1MiwtMzRsMzQsLTM0di0xODhjMCwtMTYwIC0zLC0xOTQgLTE4LC0yMjRjLTIzLC00NiAtMTA2LC0xMDIgLTIwOSwtMTM5Yy00MjcsLTE1NiAtODMzLDEwNCAtODMzLDUzNGMwLDE2OSA1MywyOTkgMTcwLDQxNmMxNTUsMTU2IDM2OSwyMTEgNTk3LDE1M3pNMjQyMywyMDkwbDI3LC0zMHYtNDk5di00OTlsLTI2LC0zMWMtNDgsLTU3IC0xMjUsLTU4IC0xNzYsLTFsLTI4LDMwdjQ5OXY0OTlsMjYsMzFjNDgsNTcgMTI1LDU4IDE3Nywxek0zNTQ4LDIxMTBjNjIsLTM4IDcwLC0xMTQgMTgsLTE2NmwtMzQsLTM0aC0yODFoLTI4MmwzLC0xMjRsMywtMTI1bDI0MCwtNGMyNjEsLTMgMjc4LC03IDMwMywtNjNjMjMsLTQ5IDUsLTEyMSAtMzUsLTE0MGMtMTAsLTUgLTEyOCwtMTEgLTI2MywtMTRsLTI0NSwtNWwtNSwtMTkwYy0zLC0xMDQgLTksLTE5OCAtMTMsLTIwN2MtMTUsLTI5IC01NSwtNDggLTEwMSwtNDhjLTM2LDAgLTUyLDYgLTc4LDI5bC0zMywyOWwtMyw1MDBsLTMsNTAwbDI3LDMyYzE1LDE3IDM3LDM2IDQ4LDQwYzEyLDUgMTc0LDkgMzYxLDljMzIzLDEgMzQyLDAgMzczLC0xOXoiPjwvcGF0aD48L2c+PC9nPjwvZz48L3N2Zz4=';

class AdacraftGifBlocks {
    constructor (runtime, config = {}) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.data = null;
        this.width = null;
        this.height = null;
        this.imageDataArray = [];
        this._corsProxyBaseUrl = config.corsProxyBaseUrl || '/cors-proxy';
    }
    
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        this._locale = this.setLocale();
        return {
            id: 'adagif',
            name: 'Gif',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            docsURI: 'https://adacraft.notion.site/Gif-91909910b04e499188c3060713005c84',
            color1: '#8053bb',
            blocks: [
                {
                    opcode: 'addImage',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('add image from URL'),
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'URL'
                        }
                    }
                },
                {
                    opcode: 'getNumberOfImages',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('number of images in current GIF')
                },
                {
                    opcode: 'removeImages',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('remove images from current GIF')
                },
                {
                    opcode: 'getGifContent',
                    func: 'getGifContent',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('get GIF content')
                },
                {
                    opcode: 'getGifContentWithFps',
                    func: 'getGifContent',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('get GIF content with FPS'),
                    arguments: {
                        FPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '15',
                            menu: 'FPSValue'
                        }
                    }
                }
            ],
            menus: {
                FPSValue: {
                    acceptReporters: true,
                    items: this.getFPSValue()
                }
            }
        };
    }

    addImage (args, util, blockInfo) {
        let imageUrl = args.URL;

        // The URL for the image can be a http(s): or a data: URL. Both will
        // work. But in the case of http, we need to use a CORS proxy because we
        // don't know if the origin includes the CORS headers.
        try {
            if (new URL(imageUrl).protocol.startsWith('http')) {
                imageUrl = `${this._corsProxyBaseUrl}/${imageUrl}`;
            }
        } catch (error) {
            // eslint-disable-next-line max-len
            this.error(`abort "${blockInfo.text}" (opcode: ${blockInfo.opcode}, blockId: ${util.thread.peekStack()}): URL argument is not a valid URL "${args.URL}"`);
            return;
        }
       
        const img = new Image();
        img.src = imageUrl;
        img.crossOrigin = 'Anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            this.data = context.getImageData(0, 0, canvas.width, canvas.height).data;
            this.width = img.width;
            this.height = img.height;
            this.imageDataArray.push({data: this.data, width: this.width, height: this.height});
        };
    }

    getNumberOfImages () {
        return this.imageDataArray.length;
    }

    removeImages () {
        this.data = null;
        this.width = null;
        this.height = null;
        this.imageDataArray = [];
    }
   
    getGifContent (args, util, blockInfo) {
        const gif = gifenc.GIFEncoder();

        for (const imageData of this.imageDataArray) {
            const palette = gifenc.quantize(imageData.data, 256);

            const index = gifenc.applyPalette(imageData.data, palette);

            // Convert args.FPS string to number to calculate delay
            args.FPS = Number(args.FPS);

            let delay;

            if (blockInfo.opcode === 'getGifContentWithFps') {
                if (args.FPS && typeof args.FPS === 'number' && args.FPS >= 0 && args.FPS <= 65) {
                    delay = 1000 / args.FPS;
                } else {
                    // eslint-disable-next-line max-len
                    this.error(`abort "${blockInfo.text}" (opcode: ${blockInfo.opcode}, blockId: ${util.thread.peekStack()}): FPS argument expected must be a number between 1 and 65, recieved: "${args.FPS}"`);
                }
            } else {
                delay = 1000 / 15;
            }

            gif.writeFrame(index, imageData.width, imageData.height, {palette, delay});
        }
        
        gif.finish();

        const output = gif.bytes();

        // source: https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string
        // eslint-disable-next-line arrow-parens
        const Uint8ToString = (u8a) => {
            const CHUNK_SZ = 0x8000;
            const c = [];
            for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
                c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
            }
            return c.join('');
        };

        const gifBase64 = btoa(Uint8ToString(output));

        const gifImage = `data:image/gif;base64,${gifBase64}`;
        
        return gifImage;
    }

    getFPSValue () {
        return fpsValues;
    }

    setLocale () {
        const locale = formatMessage.setup().locale;
        if (localisation.availableLocales.includes(locale)) {
            return locale;
        // eslint-disable-next-line no-else-return
        } else {
            return 'en';
        }
    }

    getMessage (id) {
        return localisation.messages[id][this._locale];
    }

    error (message) {
        // eslint-disable-next-line no-console
        console.error(`Error in extension "${this.getInfo().name}" (id: ${this.getInfo().id}): ${message}`);
    }
}

module.exports = AdacraftGifBlocks;
