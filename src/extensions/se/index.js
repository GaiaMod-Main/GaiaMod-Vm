// Dummy Extension For SE!'s Custom Blocks

const BlockType = require('../../extension-support/block-type');

/**
 * Class for Scratch Everywhere! Blocks
 * @constructor
 */
class ScratchEverywhereBlocks {
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
        return {
            id: 'se',
            name: 'Scratch Everywhere! Blocks',
            color1: '#764476',
            color2: '#704070',
            color3: '#683868',
            blocks: [
                {
                    blockType: BlockType.XML,
                    xml: '<block type="argument_reporter_boolean"><field name="VALUE">is Scratch Everywhere!?</field></block>'
                },
                {
                    blockType: BlockType.XML,
                    xml: '<block type="argument_reporter_string_number"><field name="VALUE">Scratch Everywhere! platform</field></block>'
                },
                {
                    blockType: BlockType.XML,
                    xml: '<block type="argument_reporter_string_number"><field name="VALUE">Scratch Everywhere! controller</field></block>'
                },
                {
                    blockType: BlockType.XML,
                    xml: '<block type="argument_reporter_boolean"><field name="VALUE">is New 3DS?</field></block>'
                },
                {
                    blockType: BlockType.XML,
                    xml: '<block type="argument_reporter_boolean"><field name="VALUE">is DSi?</field></block>'
                }
            ],
        };
    }
}

module.exports = ScratchEverywhereBlocks;
