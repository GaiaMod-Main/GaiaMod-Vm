const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');


const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'HTTP get': {
            'en': 'fetch data from URL [URL]',
            'fr': 'télécharger les données depuis l\'URL [URL]'
        },
        'get property of JSON object': {
            'en': 'property [PROPERTY] of JSON object [JSON]',
            'fr': 'propriété [PROPERTY] de l\'objet JSON [JSON]'
        },
        'set property of JSON object': {
            'en': 'set property [PROPERTY] to value [VALUE] in [JSON]',
            'fr': 'mettre la propriété [PROPERTY] à la valeur [VALUE] dans [JSON]'
        },
        'split as JSON array': {
            'en': 'split [STRING] with [SEPARATOR] as JSON array',
            'fr': 'diviser [STRING] avec [SEPARATOR] en tant que tableau JSON'
        }
    }
};



/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiMzZmE5ZjU7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iSHR0cCI+PHBhdGggaWQ9Imljb24iIGNsYXNzPSJjbHMtMiIgZD0iTTE1LjYsNS41MWE0LjQ2LDQuNDYsMCwwLDEsNC41Myw0LDQuNTIsNC41MiwwLDAsMS0uNywzLjE0LDQuMyw0LjMsMCwwLDEtMi41NCwxLjg3QTQuMTIsNC4xMiwwLDAsMSwxNCwxNC4yNWEzLjM0LDMuMzQsMCwwLDEtLjczLS40M2MtLjA5LS4wNy0uMTUtLjA1LS4yMywwbC0uNTQuNTZjLS4wNS4wNS0uMS4wOS0uMDkuMTdhMS41LDEuNSwwLDAsMS0uNTgsMS4yOGMtLjY5LjctMS4zNSwxLjQxLTIsMi4xMS0uMzcuMzgtLjcxLjc4LTEuMTEsMS4xMmExLjEyLDEuMTIsMCwwLDEtMS41Ni0uMTYsMS4yMiwxLjIyLDAsMCwxLC4wNy0xLjYzbDMuMjctMy4zOGExLDEsMCwwLDEsLjg4LS4zNC4zMy4zMywwLDAsMCwuMjktLjEzLDUuOSw1LjksMCwwLDEsLjQ5LS41MS4xOC4xOCwwLDAsMCwuMDYtLjI2bDAsMGE0LjA1LDQuMDUsMCwwLDEtLjYzLTEuNDYsNC41Myw0LjUzLDAsMCwxLDAtMiw0LjQ5LDQuNDksMCwwLDEsMi4xNy0zLjA3LDQuMTYsNC4xNiwwLDAsMSwyLS41N20tMyw0LjU1YTMuMTksMy4xOSwwLDAsMCwyLjg4LDMuMjUsMy4xNSwzLjE1LDAsMCwwLDMuMzgtMi44OXYtLjA1YTMuMTQsMy4xNCwwLDAsMC02LjIzLS44MSw0LjMyLDQuMzIsMCwwLDAsMCwuNSIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iSHR0cCI+PHBhdGggaWQ9Imljb24iIGNsYXNzPSJjbHMtMiIgZD0iTTE1LjYsNS41MWE0LjQ2LDQuNDYsMCwwLDEsNC41Myw0LDQuNTIsNC41MiwwLDAsMS0uNywzLjE0LDQuMyw0LjMsMCwwLDEtMi41NCwxLjg3QTQuMTIsNC4xMiwwLDAsMSwxNCwxNC4yNWEzLjM0LDMuMzQsMCwwLDEtLjczLS40M2MtLjA5LS4wNy0uMTUtLjA1LS4yMywwbC0uNTQuNTZjLS4wNS4wNS0uMS4wOS0uMDkuMTdhMS41LDEuNSwwLDAsMS0uNTgsMS4yOGMtLjY5LjctMS4zNSwxLjQxLTIsMi4xMS0uMzcuMzgtLjcxLjc4LTEuMTEsMS4xMmExLjEyLDEuMTIsMCwwLDEtMS41Ni0uMTYsMS4yMiwxLjIyLDAsMCwxLC4wNy0xLjYzbDMuMjctMy4zOGExLDEsMCwwLDEsLjg4LS4zNC4zMy4zMywwLDAsMCwuMjktLjEzLDUuOSw1LjksMCwwLDEsLjQ5LS41MS4xOC4xOCwwLDAsMCwuMDYtLjI2bDAsMGE0LjA1LDQuMDUsMCwwLDEtLjYzLTEuNDYsNC41Myw0LjUzLDAsMCwxLDAtMiw0LjQ5LDQuNDksMCwwLDEsMi4xNy0zLjA3LDQuMTYsNC4xNiwwLDAsMSwyLS41N20tMyw0LjU1YTMuMTksMy4xOSwwLDAsMCwyLjg4LDMuMjUsMy4xNSwzLjE1LDAsMCwwLDMuMzgtMi44OXYtLjA1YTMuMTQsMy4xNCwwLDAsMC02LjIzLS44MSw0LjMyLDQuMzIsMCwwLDAsMCwuNSIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';

class Scratch3AdaHttpBlocks {
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
            id: 'adahttp',
            name: 'HTTP',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            docsURI: 'https://adacraft.notion.site/171c9cbce7c346b8b6be354f06452117',
            color1: '#11ccff',
            blocks: [
                {
                    opcode: 'httpGet',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('HTTP get'),
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://en.wikipedia.org/api/rest_v1/page/title/Ada_Lovelace'
                        }
                    }
                },
                {
                    opcode: 'getJsonProperty',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('get property of JSON object'),
                    arguments: {
                        PROPERTY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'name'
                        },
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"name": "Ada Lovelace"}'
                        }
                    }
                },
                {
                    opcode: 'setJsonProperty',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('set property of JSON object'),
                    arguments: {
                        PROPERTY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'name'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Ada Lovelace'
                        },
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"name": "Ada"}'
                        }
                    }
                },
                {
                    opcode: 'splitAsJsonArray',
                    blockType: BlockType.REPORTER,
                    text: this.getMessage('split as JSON array'),
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: '1; 2; 3'
                        },
                        SEPARATOR: {
                            type: ArgumentType.STRING,
                            defaultValue: ';'
                        }
                    }
                }
            ]
        };
    }

    httpGet (args) {
        return fetch(args.URL)
            .then(response => response.text())
    }

    getJsonProperty (args) {
        const resultOnError = ''
        if (args.PROPERTY === '') {
            return resultOnError
        }
        let object
        try {
            object = JSON.parse(args.JSON)
        } catch (error) {
            return resultOnError
        }

        // In case the input is not a string (this can happens when
        // args.PROPERTY comes from a computation block that output number for
        // example, like "(2) + (5)" block).
        const propertyAsString = String(args.PROPERTY)

        // The following regexp works both with dots and array indexes. Example:
        // If PROPERTY is a.b[1], this will extract ["a", "b", 1] (before
        // reverse). And as we access values using brackets ("[...]") this works
        // both for property names and array indexes.
        //
        // See: https://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
        const list = propertyAsString.match(/[^\]\[.]+/g)
        if (list === null) {
            // No match. Normally this happens only if PROPERTY is an empty
            // which might has been catch at the beginning of this function.
            // We still check it here to be future proof.
            return resultOnError
        }
        const propertiesAndIndexesList = list.reverse()
        while (propertiesAndIndexesList.length !== 0) {
            const propertyOrIndex = propertiesAndIndexesList.pop()
            if (
                typeof object !== 'object'
                || object === null
                || object[propertyOrIndex] === null
                || object[propertyOrIndex] === undefined
            ) {
                return resultOnError
            } else {
                object = object[propertyOrIndex]
            }
        }
        if (typeof object === 'object') {
            return JSON.stringify(object)
        } else {
            return object
        }
    }

    setJsonProperty (args) {
        let rootObject
        try {
            rootObject = JSON.parse(args.JSON)
        } catch (error) {
            return ''
        }
        const resultOnError = args.JSON
        if (args.PROPERTY === '') {
            return resultOnError
        }
        let object = rootObject
        // The following regexp works both with dots and array indexes. Example:
        // If PROPERTY is a.b[1], this will extract ["a", "b", 1] (before
        // reverse). And as we access values using brackets ("[...]") this works
        // both for property names and array indexes.
        //
        // See: https://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
        const list = args.PROPERTY.match(/[^\]\[.]+/g)
        if (list === null) {
            // No match. Normally this happens only if PROPERTY is an empty
            // which might has been catch at the beginning of this function.
            // We still check it here to be future proof.
            return resultOnError
        }
        const propertiesAndIndexesList = list.reverse()
        while (propertiesAndIndexesList.length !== 0) {
            const propertyOrIndex = propertiesAndIndexesList.pop()
            if (propertiesAndIndexesList.length === 0) {
                object[propertyOrIndex] = args.VALUE
            } else {
                if (
                    typeof object !== 'object'
                    || object === null
                    || object[propertyOrIndex] === null
                    || object[propertyOrIndex] === undefined
                ) {
                    return resultOnError
                } else {
                    object = object[propertyOrIndex]
                }
            }
        }
        // { "a": { "b": 1 } }
        return JSON.stringify(rootObject, null, 2)
    }

    splitAsJsonArray (args) {
        const items = args.STRING.split(args.SEPARATOR)
        return JSON.stringify(items);
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

module.exports = Scratch3AdaHttpBlocks;
