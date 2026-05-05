const Cast = require('../../util/cast');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

// import p5 from './noise'
const P5 = require('p5');
const p5 = new P5();

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'set noise seed': {
            'en': 'set noise seed to [SEED]',
            'fr': 'mettre la graine du bruit à [SEED]'
        },
        'noise 1D': {
            'en': 'Perlin noise [X]',
            'fr': 'bruit de Perlin [X]'
        },
        'noise 1D in range': {
            'en': 'Perlin noise [X] between [MIN] and [MAX]',
            'fr': 'bruit de Perlin [X] entre [MIN] et [MAX]'
        },
        'noise 2D': {
            'en': 'Perlin noise [X] [Y]',
            'fr': 'bruit de Perlin [X] [Y]'
        },
        'noise 2D in range': {
            'en': 'Perlin noise [X] [Y] between [MIN] and [MAX]',
            'fr': 'bruit de Perlin [X] [Y] entre [MIN] et [MAX]'
        },
        'noise 3D': {
            'en': 'Perlin noise [X] [Y] [Z]',
            'fr': 'bruit de Perlin [X] [Y] [Z]'
        },
        'noise 3D in range': {
            'en': 'Perlin noise [X] [Y] [Z] between [MIN] and [MAX]',
            'fr': 'bruit de Perlin [X] [Y] [Z] entre [MIN] et [MAX]'
        },
        'map value': {
            'en': 'map [VALUE] from [MIN1] ⟺ [MAX1] to [MIN2] ⟺ [MAX2]',
            'fr': 'transformer [VALUE] depuis [MIN1] ⟺ [MAX1] vers [MIN2] ⟺ [MAX2]'
        }
    }
};
  


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNlYTI3NWU7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iUDVKUyI+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNy4yMiw5LjExYzEuMzYuNDQsMi42Mi44MywzLjg2LDEuMjQuODcuMjksMSwuMTksMS4wNS0uNzUsMC0xLjA5LDAtMi4xOSwwLTMuMjksMC0uNTcuMi0uNzguNzktLjc5LDIsMCwyLS4wNiwyLDIsMCwuNzMsMCwxLjQ2LDAsMi4xOXMuMjYsMSwxLC43NGMxLjI1LS40LDIuNTItLjc4LDMuODYtMS4xOWExOSwxOSwwLDAsMSwuNjksMi4xYzAsLjIxLS4yNy42NC0uNTIuNzRhMzEuMTIsMzEuMTIsMCwwLDEtMy4yNCwxLjE0Yy0uOTIuMjYtLjYuNzEtLjI5LDEuMTcuNzYsMS4xMSwxLjU1LDIuMjEsMi4zOSwzLjQxLS42Ny41MS0xLjI3LDEtMS45MiwxLjQyLS4xMy4wOC0uNTctLjExLS43Mi0uM0MxNS40OCwxOCwxNC43NSwxNywxNC4wNSwxNmMtLjQyLS41OC0uNzItLjU5LTEuMTQsMC0uNzgsMS4xLTEuNjEsMi4xNi0yLjQ5LDMuMzMtLjY1LS41MS0xLjI3LS45NC0xLjgxLTEuNDVhLjg1Ljg1LDAsMCwxLC4wNS0uNzdjLjY0LTEsMS4zNC0xLjg4LDItMi44MS4zOC0uNTMuNDgtLjg5LS4zNS0xLjE0LTEuMTUtLjM0LTIuMjYtLjg1LTMuNC0xLjI1LS40Ni0uMTYtLjU0LS4zOC0uMzctLjgyQzYuOCwxMC40OCw3LDkuODQsNy4yMiw5LjExWiIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iUDVKUyI+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNy4yMiw5LjExYzEuMzYuNDQsMi42Mi44MywzLjg2LDEuMjQuODcuMjksMSwuMTksMS4wNS0uNzUsMC0xLjA5LDAtMi4xOSwwLTMuMjksMC0uNTcuMi0uNzguNzktLjc5LDIsMCwyLS4wNiwyLDIsMCwuNzMsMCwxLjQ2LDAsMi4xOXMuMjYsMSwxLC43NGMxLjI1LS40LDIuNTItLjc4LDMuODYtMS4xOWExOSwxOSwwLDAsMSwuNjksMi4xYzAsLjIxLS4yNy42NC0uNTIuNzRhMzEuMTIsMzEuMTIsMCwwLDEtMy4yNCwxLjE0Yy0uOTIuMjYtLjYuNzEtLjI5LDEuMTcuNzYsMS4xMSwxLjU1LDIuMjEsMi4zOSwzLjQxLS42Ny41MS0xLjI3LDEtMS45MiwxLjQyLS4xMy4wOC0uNTctLjExLS43Mi0uM0MxNS40OCwxOCwxNC43NSwxNywxNC4wNSwxNmMtLjQyLS41OC0uNzItLjU5LTEuMTQsMC0uNzgsMS4xLTEuNjEsMi4xNi0yLjQ5LDMuMzMtLjY1LS41MS0xLjI3LS45NC0xLjgxLTEuNDVhLjg1Ljg1LDAsMCwxLC4wNS0uNzdjLjY0LTEsMS4zNC0xLjg4LDItMi44MS4zOC0uNTMuNDgtLjg5LS4zNS0xLjE0LTEuMTUtLjM0LTIuMjYtLjg1LTMuNC0xLjI1LS40Ni0uMTYtLjU0LS4zOC0uMzctLjgyQzYuOCwxMC40OCw3LDkuODQsNy4yMiw5LjExWiIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';

class Scratch3AdaP5Blocks {
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
            id: 'adap5',
            name: 'p5.js',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            docsURI: 'https://adacraft.notion.site/0700acf8e5984aab918fbf5a12c28f4d',
            color1: '#ff273b',
            blocks: [
                {
                    opcode: 'setNoiseSeed',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('set noise seed'),
                    arguments: {
                        SEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '76207459'
                        }
                    }
                },
                {
                    opcode: 'getNoise1D',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('noise 1D'),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '33'
                        }
                    }
                },
                {
                    opcode: 'getNoise1DInRange',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('noise 1D in range'),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '33'
                        },
                        MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'getNoise2D',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('noise 2D'),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '33'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '9'
                        }
                    }
                },
                {
                    opcode: 'getNoise2DInRange',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('noise 2D in range'),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '33'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '9'
                        },
                        MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'getNoise3D',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('noise 3D'),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '33'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '9'
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '57'
                        }
                    }
                },
                {
                    opcode: 'getNoise3DInRange',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('noise 3D in range'),
                    arguments: {
                        X: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '33'
                        },
                        Y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '9'
                        },
                        Z: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '57'
                        },
                        MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'mapValue',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('map value'),
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0.75
                        },
                        MIN1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        MAX1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        MIN2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: -240
                        },
                        MAX2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 240
                        }
                    }
                }
            ]
        };
    }

    setNoiseSeed(args) {
        return p5.noiseSeed(args.SEED)
    }

    getNoise1D(args) {
        return p5.noise(args.X)
    }

    getNoise1DInRange(args) {
        if (Cast.toNumber(args.MIN) === 0 && Cast.toNumber(args.MAX) === 1) {
            return p5.noise(args.X)
        } else {
            return p5.map(
                p5.noise(args.X),
                0,
                1,
                Cast.toNumber(args.MIN),
                Cast.toNumber(args.MAX)
            )    
        }
    }

    getNoise2D(args) {
        return p5.noise(args.X, args.Y)
    }

    getNoise2DInRange(args) {
        if (Cast.toNumber(args.MIN) === 0 && Cast.toNumber(args.MAX) === 1) {
            return p5.noise(args.X, args.Y)
        } else {
            return p5.map(
                p5.noise(args.X, args.Y),
                0,
                1,
                Cast.toNumber(args.MIN),
                Cast.toNumber(args.MAX)
            )    
        }
    }

    getNoise3D(args) {
        return p5.noise(args.X, args.Y, args.Z)
    }

    getNoise3DInRange(args) {
        if (Cast.toNumber(args.MIN) === 0 && Cast.toNumber(args.MAX) === 1) {
            return p5.noise(args.X, args.Y, args.Z)
        } else {
            return p5.map(
                p5.noise(args.X, args.Y, args.Z),
                0,
                1,
                Cast.toNumber(args.MIN),
                Cast.toNumber(args.MAX)
            )    
        }
    }

    mapValue(args) {
        return p5.map(
            Cast.toNumber(args.VALUE),
            Cast.toNumber(args.MIN1),
            Cast.toNumber(args.MAX1),
            Cast.toNumber(args.MIN2),
            Cast.toNumber(args.MAX2)
        )
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

module.exports = Scratch3AdaP5Blocks;
