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
            'fr': 'image du contenu de la scène'
        },
        'get size': {
            'en': 'get stage [dimension]',
            'fr': '[dimension] de la scène'
        },
        'size width': {
            'en': 'width',
            'fr': 'largeur'
        },
        'size height': {
            'en': 'height',
            'fr': 'hauteur'
        },
        'get sprite': {
            'en': 'name of selected sprite',
            'fr': 'nom du sprite sélectionné'
        },
        'get sprite name': {
            'en': 'name of this sprite',
            'fr': 'nom de ce sprite'
        },
        'restart': {
          'en': 'restart [IMAGE]',
          'fr': 'recommencer [IMAGE]'
        },
        'costumeSVG': {
          'en': 'costume [COSTUME] content as image',
          'fr': 'image du contenu du costume [COSTUME]'
        },
        'in editor?': {
            'en': 'in editor?',
            'fr': 'dans l\'éditeur?'
        },
        'set FPS': {
            'en': 'set theoretical FPS to [FPS]',
            'fr': 'mettre le FPS théorique à [FPS]'
        },
        'get theoretical FPS': {
            'en': 'theoretical FPS',
            'fr': 'FPS théorique'
        },
        'get current FPS': {
            'en': 'real FPS',
            'fr': 'FPS réel'
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
const greenFlag = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJncmVlbmZsYWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNDU5OTNEO30NCgkuc3Qxe2ZpbGw6IzRDQkY1Njt9DQo8L3N0eWxlPg0KPHRpdGxlPmdyZWVuZmxhZzwvdGl0bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjAuOCwzLjdjLTAuNC0wLjItMC45LTAuMS0xLjIsMC4yYy0yLDEuNi00LjgsMS42LTYuOCwwYy0yLjMtMS45LTUuNi0yLjMtOC4zLTFWMi41YzAtMC42LTAuNS0xLTEtMQ0KCXMtMSwwLjQtMSwxdjE4LjhjMCwwLjUsMC41LDEsMSwxaDAuMWMwLjUsMCwxLTAuNSwxLTF2LTYuNGMxLTAuNywyLjEtMS4yLDMuNC0xLjNjMS4yLDAsMi40LDAuNCwzLjQsMS4yYzIuOSwyLjMsNywyLjMsOS44LDANCgljMC4zLTAuMiwwLjQtMC41LDAuNC0wLjlWNC43QzIxLjYsNC4yLDIxLjMsMy44LDIwLjgsMy43eiBNMjAuNSwxMy45QzIwLjUsMTMuOSwyMC41LDEzLjksMjAuNSwxMy45QzE4LDE2LDE0LjQsMTYsMTEuOSwxNA0KCWMtMS4xLTAuOS0yLjUtMS40LTQtMS40Yy0xLjIsMC4xLTIuMywwLjUtMy40LDEuMVY0QzcsMi42LDEwLDIuOSwxMi4yLDQuNmMyLjQsMS45LDUuNywxLjksOC4xLDBjMC4xLDAsMC4xLDAsMC4yLDANCgljMCwwLDAuMSwwLjEsMC4xLDAuMUwyMC41LDEzLjl6Ii8+DQo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjAuNiw0LjhsLTAuMSw5LjFjMCwwLDAsMC4xLDAsMC4xYy0yLjUsMi02LjEsMi04LjYsMGMtMS4xLTAuOS0yLjUtMS40LTQtMS40Yy0xLjIsMC4xLTIuMywwLjUtMy40LDEuMVY0DQoJQzcsMi42LDEwLDIuOSwxMi4yLDQuNmMyLjQsMS45LDUuNywxLjksOC4xLDBjMC4xLDAsMC4xLDAsMC4yLDBDMjAuNSw0LjcsMjAuNiw0LjcsMjAuNiw0Ljh6Ii8+DQo8L3N2Zz4='

/* FPS code is from the TheShovel's ShovelUtils extension,
from the link https://extensions.turbowarp.org/TheShovel/ShovelUtils.js */

const times = [];
let currentfps = vm.runtime.framerate;
const oldStep = vm.runtime._step;
vm.runtime._step = function () {
    oldStep.call(this);
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    currentfps = times.length;
};

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

                {
                    opcode: 'getSvgOfCostume',
                    text: this.getMessage('costumeSVG'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        COSTUME: {
                            type: ArgumentType.STRING,
                            menu: 'costumes'
                        }
                    }
                },
                '---',
                {
                    opcode: 'getDimension',
                    text: this.getMessage('get size'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        dimension: {
                            type: ArgumentType.STRING,
                            defaultValue: 'width',
                            menu: 'dimension'
                        }
                    }
                },

                {
                    opcode: 'getTargetSprite',
                    text: this.getMessage('get sprite'),
                    blockType: BlockType.REPORTER
                },

                {
                    opcode: 'getSpriteName',
                    text: this.getMessage('get sprite name'),
                    blockType: BlockType.REPORTER,
                    disableMonitor: true
                },
                '---',
                {
                    opcode: 'inEditor',
                    text: this.getMessage('in editor?'),
                    blockType: BlockType.BOOLEAN
                },
                '---',
                {
                    opcode: 'restart',
                    text: this.getMessage('restart'),
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    arguments: {
                        IMAGE: {
                          type: ArgumentType.IMAGE,
                          dataURI: greenFlag
                        }
                    }
                },
                '---',
                {
                    opcode: 'setFPS',
                    text: this.getMessage('set FPS'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FPS: {
                          type: ArgumentType.NUMBER,
                          defaultValue: 60
                        }
                    }
                },

                {
                    opcode: 'getFPS',
                    text: this.getMessage('get theoretical FPS'),
                    blockType: BlockType.REPORTER,
                },
                {
                    opcode: 'getCurrentFPS',
                    text: this.getMessage('get current FPS'),
                    blockType: BlockType.REPORTER,
                },

            ],

            menus: {
                dimension: {
                    acceptReporters: true,
                    items: [
                    {
                        text: this.getMessage('size width'),
                        value: 'width'
                    },
                    {
                        text: this.getMessage('size height'),
                        value: 'height'
                    }
                    ]
                },
                costumes: {
                    acceptReporters: true,
                    items: 'costumesList'
                }
            }
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

    setLocale () {
        let locale = formatMessage.setup().locale;
        if (localisation.availableLocales.includes(locale)) {
            return locale;
        } else {
            return 'en';
        }
    }

    getMessage (id) {
        return localisation.messages[id][this._locale];
    }

    restart () {
        setTimeout(() => { // added a latency for the compatibility with the 'pause' addon and the stop button.
            vm.greenFlag();
        }, 1)
    }
  
      
    getDimension ({ dimension }) {
        if (dimension === 'width') {
            return vm.runtime.stageWidth;
        } else if (dimension === 'height') {
            return vm.runtime.stageHeight;
        }
        return 0;
    }

    getTargetSprite () {
        return vm.editingTarget.getName();
    }

    getSpriteName (args, util) {
        return util.target.getName();
    }

    inEditor () {
        return document.getElementsByClassName('monitor-overlay')[0].style.width !== document.querySelector('[class*=stage-header_stage-menu-wrapper]').style.width;
    }

    getSvgOfCostume (args, util) {
        const costumesList = util.target.sprite.costumes;
        let costume = costumesList.find((element) => element.name === args.COSTUME)
        return vm.getCostume(costumesList.indexOf(costume));
    }
      
    costumesList () {
        const costumes = vm.editingTarget.getCostumes();
        return costumes.map(costume => costume.name);
    }

    setFPS (args) {
        if (args.FPS >= 1) {
            vm.setFramerate(args.FPS);
        } else {
            vm.setFramerate(1);
        }
    }

    getFPS () {
        return vm.runtime.framerate
    }

    getCurrentFPS () {
        return currentfps;
    }

}


module.exports = Scratch3AdaRuntimeBlocks;
