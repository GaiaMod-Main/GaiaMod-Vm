const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');


const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'get svg': {
            'en': 'vector content as SVG',
            'fr': 'SVG du contenu vectoriel'
        },
        'get image': {
            'en': 'stage content as image',
            'fr': 'image du contenu de la scene'
        }
    }
};
  


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmNmUwNWU7fS5jbHMtM3tmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iQWRhY3JhZnRfcnVudGltZSIgZGF0YS1uYW1lPSJBZGFjcmFmdCBydW50aW1lIj48ZyBpZD0ibG9nb19BZGFjcmFmdCIgZGF0YS1uYW1lPSJsb2dvIEFkYWNyYWZ0Ij48Y2lyY2xlIGNsYXNzPSJjbHMtMiIgY3g9IjEzLjUiIGN5PSIxMi40MiIgcj0iNi45MSIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE1LDkuNzlsMS40NiwzLjQ4cy42LDIuMTgtMS41NSwybC0zLjctLjUyYTEuNCwxLjQsMCwwLDEtLjg4LTIuNGwyLjM1LTNBMS4zNiwxLjM2LDAsMCwxLDE1LDkuNzZaIi8+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMy41LDUuNTFhNi45Miw2LjkyLDAsMSwwLDYuOTEsNi45MUE2LjkxLDYuOTEsMCwwLDAsMTMuNSw1LjUxWk0xNSwxNS4zbC0zLjctLjUyYTEuNCwxLjQsMCwwLDEtLjg4LTIuNGwyLjM1LTNBMS4zNiwxLjM2LDAsMCwxLDE1LDkuNzZ2MGwxLjQ2LDMuNDhTMTcuMSwxNS40NSwxNSwxNS4zWiIvPjwvZz48L2c+PC9zdmc+';

class Scratch3AdaRuntimeBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        this._locale = this.setLocale();
        return {
            id: 'adaruntime',
            name: 'adacraft runtime',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            docsURI: 'https://adacraft.notion.site/403b5189c60b41d894c00249f6c9c4c9',
            color1: '#ffcf17',
            blocks: [
                {
                    opcode: 'getVectorContentAsSvg',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('get svg')
                },
                {
                    opcode: 'getSceneContentAsImage',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('get image')
                },
            ]
        };
    }

    getVectorContentAsSvg (args) {
        try {
            return this.runtime.renderer.getVectorContentAsSvg();
        } catch (error) {
            console.log(`error in getVectorContentAsSvg block`);
            console.log(error);
        }
    }

    getSceneContentAsImage (args) {
        try {
            return new Promise((resolve, reject) => {
                this.runtime.renderer.requestSnapshot((snapshot) => {
                    resolve(snapshot);
                })
            });
        } catch (error) {
            console.log(`error in getSceneContentAsImage block`);
            console.log(error);
        }
    }

    setLocale() {
        let locale = formatMessage.setup().locale;
        if (localisation.availableLocales.includes(locale)) {
          return locale;
        } else {
          return 'en';
        }
      }

      getMessage(id) {
        return localisation.messages[id][this._locale];
      }
    }

module.exports = Scratch3AdaRuntimeBlocks;
