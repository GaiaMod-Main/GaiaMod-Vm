/* eslint-disable no-undef */
const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const { 
    validateJSON, 
    validateArray, 
    stringToEqivalint, 
    valueToString,
    validateRegex 
} = require('../../util/json-block-utilities');

// const Cast = require('../../util/cast');

// Credits to JeremyGamer13 for Original JSON ext in jg_JSON

/**
 * Class for JSON blocks
 * @constructor
 */
class emJSONBlocks {
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
            id: 'emJSON',
            name: 'JSON',
            color1: '#5755D4',
            blocks: [
                {
                    opcode: 'json_validate',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        json: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        }
                    },
                    text: 'is json [json] valid?'
                }, 
                "---",
                {
                    opcode: 'getValueFromJSON',
                    text: formatMessage({
                        id: 'emJSON.blocks.getValueFromJSON',
                        default: 'get [VALUE] from [JSON]',
                        description: 'Gets a value from a JSON object.'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.getValueFromJSON_value',
                                default: 'key',
                                description: 'The name of the item you want to get from the JSON.'
                            })
                        },
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"key": "value"}'
                        }
                    }
                },
                {
                    opcode: 'getTreeValueFromJSON',
                    text: 'get path [VALUE] from [JSON]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'first/second'
                        },
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"first": {"second": 2, "third": 3}}'
                        }
                    }
                },
                {
                    opcode: 'setValueToKeyInJSON',
                    text: formatMessage({
                        id: 'emJSON.blocks.setValueToKeyInJSON',
                        default: 'set [KEY] to [VALUE] in [JSON]',
                        description: 'Returns the JSON with the key set to the value.'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.OBJECT,
                    arguments: {
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_value',
                                default: 'value',
                                description: 'The value of the key you are setting.'
                            })
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_key',
                                default: 'key',
                                description: 'The key you are setting in the JSON.'
                            })
                        },
                        JSON: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        }
                    }
                }, 
                {
                    opcode: 'json_delete',
                    blockType: BlockType.OBJECT,
                    arguments: {
                        json: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        },
                        key: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_key',
                                default: 'key',
                                description: 'The key you are setting in the JSON.'
                            })
                        }
                    },
                    text: 'in json [json] delete key [key]'
                }, 
                {
                    opcode: 'json_values',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        json: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        }
                    },
                    text: 'get all values from json [json]'
                }, 
                {
                    opcode: 'json_keys',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        json: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        }
                    },
                    text: 'get all keys from json [json]'
                }, 
                {
                    opcode: 'json_has',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        json: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        },
                        key: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_key',
                                default: 'key',
                                description: 'The key you are setting in the JSON.'
                            })
                        }
                    },
                    text: 'json [json] has key [key] ?'
                },
                {
                    opcode: 'json_combine',
                    blockType: BlockType.OBJECT,
                    arguments: {
                        one: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        },
                        two: {
                            type: ArgumentType.OBJECT,
                            defaultValue: "{}"
                        }
                    },
                    text: 'combine json [one] and json [two]'
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Arrays"
                },
                {
                    opcode: 'json_array_validate',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        array: {
                            type: ArgumentType.ARRAY,
                            defaultValue: "[]"
                        }
                    },
                    text: 'is array [array] valid?'
                }, 
                {
                    opcode: 'json_array_split',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        text: {
                            type: ArgumentType.STRING,
                            defaultValue: "A, B, C"
                        },
                        delimeter: {
                            type: ArgumentType.STRING,
                            defaultValue: ', '
                        }
                    },
                    text: 'create an array from text [text] with delimeter [delimeter]'
                }, 
                {
                    opcode: 'json_array_join',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        delimeter: {
                            type: ArgumentType.STRING,
                            defaultValue: ', '
                        }
                    },
                    text: 'create text from array [array] with delimeter [delimeter]'
                }, 
                "---",
                {
                    opcode: 'json_array_push',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        item: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_value',
                                default: 'value',
                                description: 'The value of the key you are setting.'
                            })
                        }
                    },
                    text: 'in array [array] add [item]'
                },
                "---",
                {
                    opcode: 'json_array_concatLayer1',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array1: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        array2: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"D\", \"E\", \"F\"]"
                        }
                    },
                    text: 'add items from array [array2] to array [array1]'
                },
                {
                    opcode: 'json_array_concatLayer2',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array1: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        array2: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"D\", \"E\", \"F\"]"
                        },
                        array3: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"G\", \"H\", \"I\"]"
                        }
                    },
                    text: 'add items from array [array2] and array [array3] to array [array1]'
                }, 
                "---",
                {
                    opcode: 'json_array_delete',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        index: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    text: 'in array [array] delete [index]'
                },
                {
                    opcode: 'json_array_reverse',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        }
                    },
                    text: 'reverse array [array]'
                }, 
                {
                    opcode: 'json_array_insert',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        index: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        },
                        value: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_value',
                                default: 'value',
                                description: 'The value of the key you are setting.'
                            })
                        }
                    },
                    text: 'in array [array] insert [value] at [index]'
                },
                {
                    opcode: 'json_array_set',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        index: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        },
                        value: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_value',
                                default: 'value',
                                description: 'The value of the key you are setting.'
                            })
                        }
                    },
                    text: 'in array [array] set [index] to [value]'
                },  
                "---",
                {
                    opcode: 'json_array_get',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        index: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    text: 'in array [array] get [index]'
                },
                {
                    opcode: 'json_array_indexofNostart',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        value: {
                            type: ArgumentType.STRING,
                            defaultValue: "value"
                        }
                    },
                    text: 'in array [array] get index of [value]'
                }, 
                {
                    opcode: 'json_array_indexof',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        number: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        },
                        value: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_value',
                                default: 'value',
                                description: 'The value of the key you are setting.'
                            })
                        }
                    },
                    text: 'in array [array] from [number] get index of [value]'
                }, 
                {
                    opcode: 'json_array_length',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        }
                    },
                    text: 'length of array [array]'
                }, 
                {
                    opcode: 'json_array_contains',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        value: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'emJSON.setValueToKeyInJSON_value',
                                default: 'value',
                                description: 'The value of the key you are setting.'
                            })
                        }
                    },
                    text: 'array [array] contains [value] ?'
                },
                "---",
                {
                    opcode: 'json_array_flat',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[[\"A\", \"B\"], [\"C\", \"D\"]]"
                        },
                        layer: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    text: 'flatten nested array [array] by [layer] layers'
                },
                "---",
                {
                    opcode: 'json_array_getrange',
                    blockType: BlockType.ARRAY,
                    arguments: {
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        },
                        index1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        },
                        index2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2
                        }
                    },
                    text: 'in array [array] get all items from [index1] to [index2]'
                }, 
                "---",
                {
                    opcode: 'json_array_isempty',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        array: {
                            type: ArgumentType.ARRAY,
                            defaultValue: "[]"
                        }
                    },
                    text: 'is array [array] empty?'
                }, 
                "---",
                {
                    opcode: 'json_array_listtoarray',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        list: {
                            type: ArgumentType.STRING,
                            defaultValue: 'select a list',
                            menu: 'lists'
                        }
                    },
                    hideFromPalette: true,
                    text: 'get contents of list [list] as array'
                },
                {
                    opcode: 'json_array_tolist',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        list: {
                            type: ArgumentType.STRING,
                            defaultValue: 'select a list',
                            menu: 'lists'
                        },
                        array: {
                            type: ArgumentType.STRING,
                            defaultValue: "[\"A\", \"B\", \"C\"]"
                        }
                    },
                    hideFromPalette: true,
                    text: 'set contents of list [list] to contents of array [array]'
                }
            ],
            menus: {
                lists: 'getAllLists'
            }
        };
    }

    getAllLists () {
        const variables = [].concat(
            Object.values(vm.runtime.getTargetForStage().variables),
            Object.values(vm.editingTarget.variables)
        );
        const lists = variables.filter(i => i.type === 'list');
        if (lists.length === 0) {
            return [
                {
                    text: 'select a list',
                    value: 'select a list'
                }
            ];
        }
        return lists.map(i => ({
            text: i.name,
            value: JSON.stringify({
                id: i.id,
                name: i.name
            })
        }));
    }

    getValueFromJSON (args) {
        const key = args.VALUE;
        const json = validateJSON(args.JSON).object;

        return valueToString(json[key]);
    }
    getTreeValueFromJSON (args) {
        const tree = Cast.toString(args.VALUE);
        let _json;
        if (Cast.toString(args.JSON).startsWith('[')) {
            _json = validateArray(args.JSON).array;
        } else {
            _json = validateJSON(args.JSON).object;
        }
        const json = _json;

        if (!tree.includes('/')) {
            // if we dont have a slash, treat it like
            // the get value block
            if (Array.isArray(json)) {
                return this.json_array_get({
                    array: Cast.toString(args.JSON),
                    index: Cast.toNumber(args.VALUE)
                });
            }
            return this.getValueFromJSON(args);
        }

        let value = '';
        let currentObject = json;
        const treeSplit = tree.split('/');
        for (const key of treeSplit) {
            value = '';
            // check for array so we can do "object/array/3/value"
            if (Array.isArray(currentObject)) {
                currentObject = currentObject[Cast.toNumber(key)];
                value = currentObject;
                continue;
            }

            if (typeof currentObject === 'object') {
                currentObject = currentObject[key];
                value = currentObject;
            } else {
                value = currentObject;
            }
        }

        if (typeof value === "undefined") return '';

        return valueToString(value);
    }
    setValueToKeyInJSON (args) {
        const json = validateJSON(args.JSON).object;
        const key = args.KEY;
        const value = args.VALUE;

        json[key] = stringToEqivalint(value);

        return JSON.stringify(json);
    }

    json_has (args) {
        const json = validateJSON(args.json).object;
        const key = args.key;

        return json.hasOwnProperty(key);
    }

    json_delete (args) {
        const json = validateJSON(args.json).object;
        const key = args.key;

        if (!json.hasOwnProperty(key)) return JSON.stringify(json);

        delete json[key];

        return JSON.stringify(json);
    }

    json_values (args) {
        const json = validateJSON(args.json).object;

        return JSON.stringify(Object.values(json));
    }

    json_keys (args) {
        const json = validateJSON(args.json).object;

        return JSON.stringify(Object.keys(json));
    }

    json_array_length (args) {
        const array = validateArray(args.array).array;

        return array.length;
    }

    json_array_isempty (args) {
        const array = validateArray(args.array).array;

        return !array.length;
    }

    json_array_contains (args) {
        const array = validateArray(args.array).array;
        const value = args.value;

        return array.includes(stringToEqivalint(value));
    }

    json_array_reverse (args) {
        const array = validateArray(args.array).array;

        return JSON.stringify(array.reverse());
    }

    json_array_indexof (args) {
        const array = validateArray(args.array).array;
        const number = args.number;
        const value = args.value;

        return array.indexOf(stringToEqivalint(value), number);
    }
    
    json_array_indexofNostart (args) {
        const array = validateArray(args.array).array;
        const value = args.value;

        return array.indexOf(stringToEqivalint(value));
    }

    json_array_set (args) {
        const array = validateArray(args.array).array;
        const index = args.index;
        const value = args.value;

        array[index] = stringToEqivalint(value);

        return JSON.stringify(array);
    }

    json_array_insert (args) {
        const array = validateArray(args.array).array;
        const index = args.index;
        const value = args.value;

        array.splice(index, 0, stringToEqivalint(value));

        return JSON.stringify(array);
    }

    json_array_get (args) {
        const array = validateArray(args.array).array;
        const index = args.index;

        return valueToString(array[index]);
    }

    json_array_getrange (args) {
        const array = validateArray(args.array).array;
        const index1 = args.index1;
        const index2 = args.index2;

        return JSON.stringify(array.slice(index1, index2));
    }

    json_array_push (args) {
        const array = validateArray(args.array).array;
        const value = args.item;

        array.push(stringToEqivalint(value));

        return JSON.stringify(array);
    }

    json_array_concatLayer1 (args) {
        const array1 = validateArray(args.array1).array;
        const array2 = validateArray(args.array2).array;

        const array = array1.concat(array2);

        return JSON.stringify(array);
    }

    json_array_concatLayer2 (args) {
        const array1 = validateArray(args.array1).array;
        const array2 = validateArray(args.array2).array;
        const array3 = validateArray(args.array3).array;

        const array = array1.concat(array2, array3);

        return JSON.stringify(array);
    }

    json_array_flat (args) {
        const array = validateArray(args.array).array;
        const depth = Cast.toNumber(args.layer);

        const flattened = array.flat(depth);

        return JSON.stringify(flattened);
    }

    json_array_tolist (args, util) {
        let list;
        try {
            list = JSON.parse(args.list);
        } catch {
            return;
        }
        const array = validateArray(args.array).array;
        const content = util.target.lookupOrCreateList(list.id, list.name);

        content.value = array.map(x => valueToString(x));
    }

    json_array_listtoarray (args, util) {
        let list;
        try {
            list = JSON.parse(args.list);
        } catch {
            return;
        }
        const content = util.target.lookupOrCreateList(list.id, list.name).value;

        return JSON.stringify(content.map(x => stringToEqivalint(x)));
    }

    json_array_delete (args) {
        const array = validateArray(args.array).array;
        const index = args.index;

        array.splice(index, 1);

        return JSON.stringify(array);
    }

    json_array_split (args) {
        return JSON.stringify(args.text.split(args.delimeter));
    }
    json_array_join (args) {
        return validateArray(args.array).array.join(args.delimeter);
    }

    json_validate (args) {
        return validateJSON(args.json).isValid;
    }
    json_array_validate (args) {
        return validateArray(args.array).isValid;
    }

    json_combine (args) {
        const one = validateJSON(args.one).object;
        const two = validateJSON(args.two).object;

        return JSON.stringify(Object.assign(one, two));
    }
}

module.exports = emJSONBlocks;
