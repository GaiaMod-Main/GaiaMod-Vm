import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './block-icon.png';

import {DEBUG, checkDebugMode} from './dev-util.js';
import {AIAdapter} from './ai-adapter.js';
import {getCostumeByNameOrNumber, costumeToDataURL, insertImageAsSvgCostume} from './costume-util.js';
import {interpretContentPartsText} from './content-directive.js';
import {dotProduct, cosineDistance, euclideanDistance} from './math-util.js';


/**
 * Get all user-defined procedures from the target
 * @param {Target} target - the target to get procedures from
 * @returns {Array} - array of procedure information
 */
const getUserProcedures = target => {
    const procedures = [];
    const blocks = target.blocks._blocks;
    for (const blockId in blocks) {
        const block = blocks[blockId];
        if (block.opcode === 'procedures_definition') {
            // Get the procedure prototype
            const prototypeId = block.inputs.custom_block.block;
            const prototype = blocks[prototypeId];
            if (prototype && prototype.mutation) {
                const inputTypes = Object.values(prototype.inputs)
                    .filter(input => blocks[input.shadow].parent === prototypeId)
                    .map(input => {
                        const inputBlock = blocks[input.shadow];
                        let inputType;
                        switch (inputBlock.opcode) {
                        case 'argument_reporter_string_number':
                            inputType = 'string';
                            break;
                        case 'argument_reporter_boolean':
                            inputType = 'boolean';
                            break;
                        default:
                            inputType = 'string';
                        }
                        return inputType;
                    });
                procedures.push({
                    id: blockId,
                    comment: block.comment,
                    code: prototype.mutation.proccode,
                    argumentNames: JSON.parse(prototype.mutation.argumentnames || '[]'),
                    argumentIds: JSON.parse(prototype.mutation.argumentids || '[]'),
                    argumentTypes: inputTypes,
                    argumentDefaults: JSON.parse(prototype.mutation.argumentdefaults || '[]'),
                    warp: prototype.mutation.warp === 'true'
                });
            }
        }
    }
    
    return procedures;
};

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.default;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'gai';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://yokobond.github.io/xcx-gai/dist/gai.mjs';

/**
 * Xcratch blocks for Generative AI (GAI).
 * This class provides blocks to interact with Generative AI APIs.
 */
class GAIBlocks {
    /**
     * A translation object which is used in this class.
     * @param {FormatObject} formatter - translation object
     */
    static set formatMessage (formatter) {
        formatMessage = formatter;
        if (formatMessage) setupTranslations();
    }

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'gai.name',
            default: 'GAI',
            description: 'name of google generative AI extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for Generative AI.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }

        runtime.on('EXTENSION_ADDED', this.onExtensionAdded.bind(this));

        runtime.on('PROJECT_STOP_ALL', () => {
            this.stopListening();
            AIAdapter.abortAllRequests(`Project stopped`);
        });

        runtime.on('STOP_FOR_TARGET', target => {
            this.abortRequestsForTarget(target, `Request stopped for ${target.sprite.name}`);
        });

        this.functionNamePrefix = 'func_';
        this.functionArgPrefix = 'arg_';

        // Default to Gemini adapter
        this.AIAdapter = AIAdapter;
    }

    onExtensionAdded (extensionInfo) {
        if (extensionInfo.id === 'gai') {
            checkDebugMode();
        }
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: GAIBlocks.EXTENSION_ID,
            name: GAIBlocks.EXTENSION_NAME,
            extensionURL: GAIBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'chat',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.chat',
                        default: 'chat [PROMPT]',
                        description: 'chat block text of GAI'
                    }),
                    func: 'chat',
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'gai.chatDefault',
                                default: 'Hello AI!',
                                description: 'default chat prompt for GAI'
                            })
                        }
                    }
                },
                {
                    opcode: 'chatHistory',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.chatHistory',
                        default: 'chat history',
                        description: 'chat history block text for GAI'
                    }),
                    disableMonitor: true,
                    func: 'chatHistory',
                    arguments: {
                    }
                },
                {
                    opcode: 'startChat',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.startChat',
                        default: 'start chat with history [HISTORY]',
                        description: 'start chat for GAI'
                    }),
                    func: 'startChat',
                    arguments: {
                        HISTORY: {
                            type: ArgumentType.STRING,
                            defaultValue: `{"role":"user","content":"${formatMessage({
                                id: 'gai.startChatDefault',
                                default: 'Hello AI!',
                                description: 'default start chat history for GAI'
                            })}"}`
                        }
                    }
                },
                {
                    opcode: 'generate',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.generate',
                        default: 'generate [PROMPT]',
                        description: 'generate block text of GAI'
                    }),
                    func: 'generate',
                    arguments: {
                        PROMPT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'gai.generateDefault',
                                default: 'What is AI?',
                                description: 'default generate prompt for GAI'
                            })
                        }
                    }
                },
                '---',
                {
                    opcode: 'whenResponseReceived',
                    blockType: BlockType.EVENT,
                    text: formatMessage({
                        id: 'gai.whenResponseReceived',
                        default: 'when response received',
                        description: 'when response received for GAI'
                    }),
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: true
                },
                {
                    opcode: 'responseText',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.responseText',
                        default: 'response text'
                    }),
                    disableMonitor: true,
                    func: 'responseText'
                },
                {
                    opcode: 'responseSafetyRating',
                    hideFromPalette: true, // deprecated cause it's only available in Gemini
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.responseSafetyRating',
                        default: 'response #[CANDIDATE_INDEX] safety rating [HARM_CATEGORY]',
                        description: 'last result text for GAI'
                    }),
                    disableMonitor: true,
                    func: 'responseSafetyRating',
                    arguments: {
                        CANDIDATE_INDEX: {
                            type: ArgumentType.NUMBER,
                            menu: 'responseCandidateIndexMenu'
                        },
                        HARM_CATEGORY: {
                            type: ArgumentType.STRING,
                            menu: 'harmCategoryMenu'
                        }
                    }
                },
                {
                    opcode: 'whenPartialResponseReceived',
                    blockType: BlockType.EVENT,
                    text: formatMessage({
                        id: 'gai.whenPartialResponseReceived',
                        default: 'when partial response received',
                        description: 'when partial response received for GAI'
                    }),
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: true
                },
                {
                    opcode: 'partialResponseText',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.partialResponseText',
                        default: 'partial response text',
                        description: 'partial response text of GAI'
                    }),
                    disableMonitor: true,
                    func: 'partialResponseText',
                    arguments: {
                    }
                },
                {
                    opcode: `getFileDataAtIndex`,
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.getFileDataAtIndex',
                        default: 'generated file data at [INDEX]',
                        description: 'file data at index block text for GAI'
                    }),
                    disableMonitor: true,
                    func: 'getFileDataAtIndex',
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getFileMediaTypeAtIndex',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.getFileMediaTypeAtIndex',
                        default: 'generated file media type at [INDEX]',
                        description: 'file media type at index block text for GAI'
                    }),
                    disableMonitor: true,
                    func: 'getFileMediaTypeAtIndex',
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getMaxFileNumber',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.getMaxFileNumber',
                        default: 'max generated file count',
                        description: 'max generated file count block text for GAI'
                    }),
                    disableMonitor: true,
                    func: 'getMaxFileNumber',
                    arguments: {
                    }
                },
                '---',
                {
                    opcode: 'costumeData',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.costumeData',
                        default: 'costume data [COSTUME]'
                    }),
                    func: 'costumeData',
                    arguments: {
                        COSTUME: {
                            type: ArgumentType.STRING,
                            menu: 'costumeMenu'
                        }
                    }
                },
                {
                    opcode: 'backdropData',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.backdropData',
                        default: 'backdrop data [BACKDROP]'
                    }),
                    func: 'backdropData',
                    arguments: {
                        BACKDROP: {
                            type: ArgumentType.STRING,
                            menu: 'backdropMenu'
                        }
                    }
                },
                {
                    opcode: 'snapshotData',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.snapshotData',
                        default: 'snapshot data',
                        description: 'snapshotData block text for GAI'
                    }),
                    func: 'snapshotData',
                    arguments: {
                    }
                },
                {
                    opcode: 'soundData',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.soundData',
                        default: 'sound data [SOUND]',
                        description: 'soundData block text for GAI'
                    }),
                    func: 'soundData',
                    arguments: {
                        SOUND: {
                            type: ArgumentType.STRING,
                            menu: 'soundMenu'
                        }
                    }
                },
                {
                    opcode: 'startListening',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.startListening',
                        default: 'start listening',
                        description: 'startListening block text for GAI'
                    }),
                    func: 'startListening',
                    arguments: {
                    }
                },
                {
                    opcode: 'stopListening',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.stopListening',
                        default: 'stop listening',
                        description: 'stopListening block text for GAI'
                    }),
                    func: 'stopListening',
                    arguments: {
                    }
                },
                {
                    opcode: 'listenedData',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.listenedData',
                        default: 'listened data',
                        description: 'listenedData block text for GAI'
                    }),
                    func: 'listenedData',
                    arguments: {
                    }
                },
                '---',
                {
                    opcode: 'setSafetyRating',
                    hideFromPalette: true, // deprecated cause it's only available in Gemini
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setSafetyRating',
                        default: 'set [HARM_CATEGORY] to [BLOCK_THRESHOLD]',
                        description: 'set safety rating for GAI'
                    }),
                    disableMonitor: true,
                    func: 'setSafetyRating',
                    arguments: {
                        HARM_CATEGORY: {
                            type: ArgumentType.STRING,
                            menu: 'harmCategorySettingMenu'
                        },
                        BLOCK_THRESHOLD: {
                            type: ArgumentType.STRING,
                            menu: 'harmBlockThresholdMenu'
                        }
                    }
                },
                {
                    opcode: 'setGenerationConfig',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setGenerationConfig',
                        default: 'set generation [CONFIG] to [VALUE]',
                        description: 'set generation config block text for GAI'
                    }),
                    func: 'setGenerationConfig',
                    arguments: {
                        CONFIG: {
                            type: ArgumentType.STRING,
                            menu: 'generationConfigMenu'
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'generationConfig',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.generationConfig',
                        default: 'generation [CONFIG]',
                        description: 'generation config block text for GAI'
                    }),
                    func: 'generationConfig',
                    arguments: {
                        CONFIG: {
                            type: ArgumentType.STRING,
                            menu: 'generationConfigMenu'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setFunctionCallingMode',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setFunctionCallingMode',
                        default: 'set function calling mode [MODE]',
                        description: 'set function calling mode block text for GAI'
                    }),
                    func: 'setFunctionCallingMode',
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'functionCallingModeMenu'
                        }
                    }
                },
                {
                    opcode: 'returnResultToAI',
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    text: formatMessage({
                        id: 'gai.returnResultToAI',
                        default: 'return [RESULT] to AI',
                        description: 'return result to AI block text for GAI'
                    }),
                    arguments: {
                        RESULT: {
                            type: ArgumentType.STRING,
                            defaultValue: ' '
                        }
                    }
                },
                '---',
                {
                    opcode: 'setModel',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setModel',
                        default: 'use model [MODEL_ID]',
                        description: 'model code setting block for GAI'
                    }),
                    func: 'setModel',
                    arguments: {
                        MODEL_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: AIAdapter.DEFAULT_MODEL_ID.generative
                        }
                    }
                },
                {
                    opcode: 'getModel',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getModel',
                        default: 'model',
                        description: 'model block text for GAI'
                    }),
                    func: 'getModel',
                    arguments: {
                    }
                },
                {
                    opcode: 'getModelIDAtIndex',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getModelIDAtIndex',
                        default: 'model ID at [MODEL_INDEX]',
                        description: 'model ID block text for GAI'
                    }),
                    func: 'getModelIDAtIndex',
                    arguments: {
                        MODEL_INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getMaxModelNumber',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getMaxModelNumber',
                        default: 'max model number',
                        description: 'max model number block text for GAI'
                    }),
                    func: 'getMaxModelNumber',
                    arguments: {
                    }
                },
                {
                    opcode: 'setGenerativeModel',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setGenerativeModel',
                        default: 'use model [MODEL_ID] for generative',
                        description: 'generative model code setting block for GAI'
                    }),
                    func: 'setGenerativeModel',
                    arguments: {
                        MODEL_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: AIAdapter.DEFAULT_MODEL_ID.generative
                        }
                    }
                },
                {
                    opcode: 'getGenerativeModel',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getGenerativeModel',
                        default: 'generative model',
                        description: 'generative model block text for GAI'
                    }),
                    func: 'getGenerativeModel',
                    arguments: {
                    }
                },
                {
                    opcode: 'getGenerativeModelID',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getGenerativeModelID',
                        default: 'generative model ID at [MODEL_INDEX]',
                        description: 'generative model ID block text for GAI'
                    }),
                    func: 'getGenerativeModelID',
                    arguments: {
                        MODEL_INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getMaxGenerativeModelNumber',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getMaxGenerativeModelNumber',
                        default: 'max generative model number',
                        description: 'max generative model number block text for GAI'
                    }),
                    func: 'getMaxGenerativeModelNumber',
                    arguments: {
                    }
                },
                '---',
                {
                    opcode: 'getValueFromJson',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.getValueFromJson',
                        default: 'get [PATH] from JSON [JSON]',
                        description: 'get value from JSON block text for GAI'
                    }),
                    func: 'getValueFromJson',
                    arguments: {
                        PATH: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key1.key2'
                        },
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '{"key1":{"key2":"value"}}'
                        }
                    }
                },
                {
                    opcode: 'getItemOfJsonArray',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.getItemOfJsonArray',
                        default: 'item [INDEX] of JSON array [JSON]',
                        description: 'get value from JSON array block text for GAI'
                    }),
                    func: 'getItemOfJsonArray',
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '[1,2,3]'
                        }
                    }
                },
                {
                    opcode: 'lengthOfJsonArray',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.lengthOfJsonArray',
                        default: 'length of JSON array [JSON]',
                        description: 'length of JSON array block text for GAI'
                    }),
                    func: 'lengthOfJsonArray',
                    arguments: {
                        JSON: {
                            type: ArgumentType.STRING,
                            defaultValue: '[1,2,3]'
                        }
                    }
                },
                '---',
                {
                    opcode: 'embeddingFor',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.embeddingFor',
                        default: 'embedding for [CONTENT]',
                        description: 'embed block text for GAI'
                    }),
                    func: 'embeddingFor',
                    arguments: {
                        CONTENT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'gai.embeddingForDefault',
                                default: 'cat',
                                description: 'default embedding content for GAI'
                            })
                        }
                    }
                },
                {
                    opcode: 'embeddingDistanceOf',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'gai.embeddingDistanceOf',
                        default: '[METRIC] of [VECTOR_A] and [VECTOR_B]',
                        description: 'vector distance block text for GAI'
                    }),
                    func: 'embeddingDistanceOf',
                    arguments: {
                        METRIC: {
                            type: ArgumentType.STRING,
                            menu: 'distanceMetricMenu'
                        },
                        VECTOR_A: {
                            type: ArgumentType.STRING,
                            defaultValue: '1,1,1'
                        },
                        VECTOR_B: {
                            type: ArgumentType.STRING,
                            defaultValue: '1,2,3'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setEmbeddingModel',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setEmbeddingModel',
                        default: 'use model [MODEL_ID] for embedding',
                        description: 'embedding model code setting block for GAI'
                    }),
                    func: 'setEmbeddingModel',
                    arguments: {
                        MODEL_ID: {
                            type: ArgumentType.STRING,
                            defaultValue: AIAdapter.DEFAULT_MODEL_ID.embedding
                        }
                    }
                },
                {
                    opcode: 'getEmbeddingModel',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getEmbeddingModel',
                        default: 'embedding model',
                        description: 'embedding model block text for GAI'
                    }),
                    func: 'getEmbeddingModel',
                    arguments: {
                    }
                },
                {
                    opcode: 'getEmbeddingModelID',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getEmbeddingModelID',
                        default: 'embedding model ID at [MODEL_INDEX]',
                        description: 'embedding model ID block text for GAI'
                    }),
                    func: 'getEmbeddingModelID',
                    arguments: {
                        MODEL_INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getMaxEmbeddingModelNumber',
                    hideFromPalette: true, // deprecated cause generative and embedding are unified
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getMaxEmbeddingModelNumber',
                        default: 'max embedding model number',
                        description: 'max embedding model number block text for GAI'
                    }),
                    func: 'getMaxEmbeddingModelNumber',
                    arguments: {
                    }
                },
                '---',
                {
                    opcode: 'askApiKey',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: true,
                    text: formatMessage({
                        id: 'gai.askApiKey',
                        default: 'ask API key with message [MESSAGE]',
                        description: 'ask API key for GAI'
                    }),
                    func: 'askApiKey',
                    arguments: {
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'gai.askApiKeyDefault',
                                default: 'Please enter API key',
                                description: 'default message for ask API key dialog'
                            })
                        }
                    }
                },
                {
                    opcode: 'apiKey',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.apiKey',
                        default: 'API key',
                        description: 'API key for GAI'
                    }),
                    func: 'apiKey',
                    arguments: {
                    }
                },
                {
                    opcode: 'setApiKey',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setApiKey',
                        default: 'set API key to [KEY]',
                        description: 'set API key for GAI'
                    }),
                    func: 'setApiKey',
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: ' ',
                            description: 'API key for GAI'
                        }
                    }
                },
                {
                    opcode: 'setBaseUrl',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setBaseUrl',
                        default: 'set base URL to [URL]',
                        description: 'set base URL for AI service'
                    }),
                    func: 'setBaseUrl',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://generativelanguage.googleapis.com/v1beta',
                            description: 'base URL for AI service'
                        }
                    }
                },
                {
                    opcode: 'baseUrl',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.baseUrl',
                        default: 'base URL',
                        description: 'base URL for GAI'
                    }),
                    func: 'baseUrl',
                    arguments: {
                    }
                },
                {
                    opcode: 'setApiType',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'gai.setApiType',
                        default: 'set API type to [API]',
                        description: 'set API type for GAI'
                    }),
                    func: 'setApiType',
                    arguments: {
                        API: {
                            type: ArgumentType.STRING,
                            menu: 'adapterMenu'
                        }
                    }
                },
                {
                    opcode: 'getApiType',
                    blockType: BlockType.REPORTER,
                    disableMonitor: true,
                    text: formatMessage({
                        id: 'gai.getApiType',
                        default: 'API type',
                        description: 'API type for GAI'
                    }),
                    func: 'getApiType',
                    arguments: {
                    }
                }
            ],
            menus: {
                costumeMenu: {
                    acceptReporters: true,
                    items: 'getCostumeMenu'
                },
                backdropMenu: {
                    acceptReporters: true,
                    items: 'getBackdropMenu'
                },
                soundMenu: {
                    acceptReporters: true,
                    items: 'getSoundMenu'
                },
                responseCandidateIndexMenu: {
                    acceptReporters: true,
                    items: [{text: '1', value: '1'}]
                },
                harmCategorySettingMenu: {
                    acceptReporters: false,
                    items: [{text: 'DEPRECATED', value: 'DEPRECATED'}]
                },
                harmCategoryMenu: {
                    acceptReporters: false,
                    items: [{text: 'DEPRECATED', value: 'DEPRECATED'}]
                },
                harmBlockThresholdMenu: {
                    acceptReporters: false,
                    items: [{text: 'DEPRECATED', value: 'DEPRECATED'}]
                },
                generationConfigMenu: {
                    acceptReporters: false,
                    items: this.getGenerationConfigMenu()
                },
                functionCallingModeMenu: {
                    acceptReporters: false,
                    items: this.getFunctionCallingModeMenu()
                },
                distanceMetricMenu: {
                    acceptReporters: false,
                    items: this.getEmbeddingDistanceMetricMenu()
                },
                adapterMenu: {
                    acceptReporters: false,
                    items: this.getAdapterMenu()
                }
            }
        };
    }

    getCostumeMenu () {
        const menu = [];
        const target = this.runtime.getEditingTarget();
        if (!target) {
            return menu;
        }
        const costumes = target.sprite.costumes;
        for (let i = 0; i < costumes.length; i++) {
            menu.push({
                text: costumes[i].name,
                value: costumes[i].name
            });
        }
        return menu;
    }

    getBackdropMenu () {
        const menu = [];
        const target = this.runtime.getTargetForStage();
        const backdrops = target.sprite.costumes;
        for (let i = 0; i < backdrops.length; i++) {
            menu.push({
                text: backdrops[i].name,
                value: backdrops[i].name
            });
        }
        return menu;
    }

    getSoundMenu () {
        const menu = [];
        const target = this.runtime.getEditingTarget();
        if (!target) {
            return [''];
        }
        const sounds = target.sprite.sounds;
        for (let i = 0; i < sounds.length; i++) {
            menu.push({
                text: sounds[i].name,
                value: sounds[i].name
            });
        }
        if (sounds.length === 0) {
            return [''];
        }
        return menu;
    }

    getGenerationConfigMenu () {
        const menu = [
            {
                text: formatMessage({
                    id: 'gai.generationConfigMenu.temperature',
                    default: 'Temperature',
                    description: 'generation config menu item for temperature in GAI'
                }),
                value: 'temperature'
            },
            {
                text: formatMessage({
                    id: 'gai.generationConfigMenu.topP',
                    default: 'Top P',
                    description: 'generation config menu item for top P in GAI'
                }),
                value: 'topP'
            },
            {
                text: formatMessage({
                    id: 'gai.generationConfigMenu.topK',
                    default: 'Top K',
                    description: 'generation config menu item for top K in GAI'
                }),
                value: 'topK'
            },
            {
                text: formatMessage({
                    id: 'gai.generationConfigMenu.maxOutputTokens',
                    default: 'Max Output Tokens',
                    description: 'generation config menu item for max output tokens in GAI'
                }),
                value: 'maxOutputTokens'
            },
            {
                text: formatMessage({
                    id: 'gai.generationConfigMenu.stopSequences',
                    default: 'Stop Sequences',
                    description: 'generation config menu item for stop sequences in GAI'
                }),
                value: 'stopSequences'
            },
            {
                text: formatMessage({
                    id: 'gai.generationConfigMenu.systemInstruction',
                    default: 'System Instruction',
                    description: 'generation config menu item for system instruction in GAI'
                }),
                value: 'systemInstruction'
            },
            {
                text: formatMessage({
                    id: 'gai.generationConfigMenu.responseSchema',
                    default: 'Response Schema',
                    description: 'generation config menu item for response schema in GAI'
                }),
                value: 'responseSchema'
            }
        ];
        return menu;
    }

    getFunctionCallingModeMenu () {
        const menu = [
            {
                text: formatMessage({
                    id: 'gai.functionCallingModeMenu.auto',
                    default: 'Auto',
                    description: 'function calling mode menu item for auto in GAI'
                }),
                value: 'AUTO'
            },
            {
                text: formatMessage({
                    id: 'gai.functionCallingModeMenu.required',
                    default: 'Required',
                    description: 'function calling mode menu item for function calling mode in GAI'
                }),
                value: 'REQUIRED'
            },
            {
                text: formatMessage({
                    id: 'gai.functionCallingModeMenu.none',
                    default: 'None',
                    description: 'function calling mode menu item for none in GAI'
                }),
                value: 'NONE'
            }
        ];
        return menu;
    }

    getEmbeddingDistanceMetricMenu () {
        const menu = [
            {
                text: formatMessage({
                    id: 'gai.distanceMetricMenu.dotProduct',
                    default: 'Dot Product',
                    description: 'distance metric menu item for dot product in GAI'
                }),
                value: 'dotProduct'
            },
            {
                text: formatMessage({
                    id: 'gai.distanceMetricMenu.cosine',
                    default: 'Cosine Distance',
                    description: 'distance metric menu item for cosine in GAI'
                }),
                value: 'cosine'
            },
            {
                text: formatMessage({
                    id: 'gai.distanceMetricMenu.euclidean',
                    default: 'Euclidean Distance',
                    description: 'distance metric menu item for euclidean in GAI'
                }),
                value: 'euclidean'
            }
        ];
        return menu;
    }

    getAdapterMenu () {
        const menu = [
            {
                text: formatMessage({
                    id: 'gai.adapterMenu.gemini',
                    default: 'Gemini',
                    description: 'Gemini AI adapter'
                }),
                value: 'Gemini'
            },
            {
                text: formatMessage({
                    id: 'gai.adapterMenu.openai',
                    default: 'OpenAI',
                    description: 'OpenAI adapter'
                }),
                value: 'OpenAI'
            },
            {
                text: formatMessage({
                    id: 'gai.adapterMenu.openaiCompatible',
                    default: 'OpenAI Compatible',
                    description: 'OpenAI Compatible adapter'
                }),
                value: 'OpenAICompatible'
            },
            {
                text: formatMessage({
                    id: 'gai.adapterMenu.anthropic',
                    default: 'Anthropic',
                    description: 'Anthropic adapter'
                }),
                value: 'Anthropic'
            }
        ];
        return menu;
    }

    /**
     * Get the AI adapter for the target, with initialization if needed.
     * @param {Target} target - the target to get the AI
     * @return {AIAdapter} - the AI adapter for the target
     */
    getAI (target) {
        return this.aiForTarget(target) || new AIAdapter(target);
    }

    /**
     * Retrieve AI adapter for target if exists.
     * @param {Target} target - the target to get the AI adapter
     * @returns {?AIAdapter} - the AI adapter for the target
     */
    aiForTarget (target) {
        return AIAdapter.ADAPTERS[target.id];
    }

    /**
     * Get partial response text from last result.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - partial response text
     */
    partialResponseText (args, util) {
        const target = util.target;
        const ai = this.aiForTarget(target);
        if (!ai) {
            return '';
        }
        const textPart = ai.getLastPartialText();
        if (!textPart) {
            return '';
        }
        return textPart;
    }

    /**
     * Whether the block is using in the target.
     * @param {string} blockOpcode - block opcode
     * @param {Target} target - the target to check
     * @returns {boolean} - whether the block is using in the target
     */
    blockIsUsingInTarget (blockOpcode, target) {
        const executableBlocks = target.blocks._blocks;
        for (const block in executableBlocks) {
            if (executableBlocks[block].opcode === blockOpcode) {
                return true;
            }
        }
        return false;
    }

    /**
     * Dispatch a function call to the target's procedure definition.
     * @param {FunctionCall} call - the function call to dispatch
     * @param {Target} target - the target to dispatch the call to
     * @param {Runtime} runtime - the runtime instance
     */
    _dispatchFunctionCall (call, target, runtime) {
        // Find the procedure definition
        const functionSpec = call.spec;
        if (!functionSpec) {
            console.error(`Procedure not found: ${call.name}`);
            call.failed();
            return;
        }
        const procedureCode = functionSpec.procedureCode;
        // Get the procedure definition block ID
        const procedureDefinition = target.blocks.getProcedureDefinition(procedureCode);
        if (!procedureDefinition) {
            console.error(`Procedure definition not found: ${procedureCode}`);
            call.failed();
            return;
        }
        try {
            const argumentMap = {};
            Object.entries(call.args).forEach(([key, value]) => {
                const paramName = functionSpec.argumentDict[key];
                if (paramName) {
                    // Type conversion
                    switch (functionSpec.parameters.properties[key].type) {
                    case 'string':
                        value = String(value);
                        break;
                    case 'number':
                        value = Number(value);
                        break;
                    case 'boolean':
                        value = Boolean(value);
                        break;
                    }
                    argumentMap[paramName] = value;
                }
            });

            // Create a new thread for the procedure call
            const procThread = runtime._pushThread(procedureDefinition, target);
            procThread.persistentParams = argumentMap;
            // Hook into the thread's getParam and pushStack methods to handle persistent parameters
            const originalGetParam = procThread.getParam.bind(procThread);
            procThread.getParam = function (paramName) {
                let value = originalGetParam(paramName);
                if (value === null && procThread.persistentParams &&
                    Object.prototype.hasOwnProperty.call(procThread.persistentParams, paramName)) {
                    value = procThread.persistentParams[paramName];
                }
                
                return value;
            };
            const originalPushStack = procThread.pushStack.bind(procThread);
            procThread.pushStack = function (blockId) {
                const result = originalPushStack(blockId);
                if (procThread.persistentParams) {
                    if (procThread.initParams) {
                        procThread.initParams();
                        Object.entries(procThread.persistentParams).forEach(([paramName, value]) => {
                            if (procThread.pushParam) {
                                procThread.pushParam(paramName, value);
                            }
                        });
                    }
                }
                
                return result;
            };

            // Use STATUS_YIELD_TICK to ensure parameter setup happens before actual execution
            procThread.status = 3; // Thread.STATUS_YIELD_TICK

            procThread.functionCall = call;
            call.thread = procThread;
            call.status = 'PROCESSING';
        } catch (e) {
            console.error(e);
            call.failed();
        }
    }

    /**
     * Check if all function calls have completed
     * @param {Array<FunctionCall>} funcCalls - array of function calls
     * @returns {boolean} - true if all completed
     */
    allFunctionCallsFinished (funcCalls) {
        return funcCalls.every(funcCall => funcCall.isStopped());
    }

    /**
     * Stop all ongoing requests for the specific target.
     * @param {Target} target - the target to abort requests for
     * @param {string} reason - reason for aborting
     */
    abortRequestsForTarget (target, reason) {
        const ai = this.aiForTarget(target);
        if (ai) {
            ai.abortRequests(reason);
        }
    }

    /**
     * Request AI to generate content or chat.
     * @param {string} prompt - the prompt to send to the AI.
     * @param {boolean} isChat - whether this is a chat request.
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - a Promise that resolves response text
     * @private
     */
    _requestAI (prompt, isChat, util) {
        const target = util.target;
        const ai = this.aiForTarget(target);
        const stackFrame = util.stackFrame;
        let requestState = stackFrame.generatingState;
        if (!requestState) {
            requestState = stackFrame.generatingState = {};
        }
        requestState.functionCalls?.forEach(funcCall => {
            funcCall.updateStatusOn(util.runtime);
        });

        if (requestState.finished) {
            if (!requestState.functionCalls ||
                requestState.functionCalls.every(funcCall => funcCall.isStopped())) {
                // Request and all function calls finished
                return ai.getLastResponseText();
            }
        }
        if (requestState.error) {
            // Retrieve error message and finish the request
            return requestState.error.message || requestState.error.name;
        }

        if (!requestState.requested) {
            // Start a new request
            requestState.requested = true;
            this.updateFunctionRegistry(target);
            const responseTextHandler = responseText => {
                if (responseText !== '') {
                    this.runtime.startHats('gai_whenResponseReceived', null, target);
                }
            };
            const functionDispatcher = call => {
                requestState.functionCalls = requestState.functionCalls || [];
                requestState.functionCalls.push(call);
                return this._dispatchFunctionCall(call, target, util.runtime);
            };
            let partialTextHandler;
            if (this.blockIsUsingInTarget('gai_whenPartialResponseReceived', target)) {
                partialTextHandler = partialText => {
                    if (partialText !== '') {
                        this.runtime.startHats('gai_whenPartialResponseReceived', null, target);
                    }
                };
            }
            ai.requestGenerate(
                prompt,
                responseTextHandler,
                functionDispatcher,
                partialTextHandler,
                isChat)
                .then(() => {
                    requestState.finished = true;
                })
                .catch(error => {
                    console.error(error);
                    requestState.error = error;
                });
        }
        util.yield();
        return; // Wait for the next step
    }

    /**
     * Request AI to generate content.
     * @param {object} args - the block's arguments.
     * @param {string} args.PROMPT - prompt to AI
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - a Promise that resolves response text
     */
    generate (args, util) {
        if (!this.aiForTarget(util.target)) {
            return Promise.resolve(`AI is not available`);
        }
        const promptText = Cast.toString(args.PROMPT);
        const prompt = interpretContentPartsText(promptText);
        return this._requestAI(prompt, false, util);
    }

    /**
     * Chat to AI. Start chat if not started.
     * @param {object} args - the block's arguments.
     * @param {string} args.PROMPT - message to AI
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - a Promise that resolves response text
     */
    chat (args, util) {
        if (!this.aiForTarget(util.target)) {
            return Promise.resolve(`AI is not available`);
        }
        const promptText = Cast.toString(args.PROMPT);
        const prompt = interpretContentPartsText(promptText);
        return this._requestAI(prompt, true, util);
    }

    /**
     * Return costume data URL.
     * @param {object} args - the block's arguments.
     * @param {string} args.COSTUME - costume name
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - data URL of the costume
     */
    costumeData (args, util) {
        const costumeName = Cast.toString(args.COSTUME);
        const target = util.target;
        const costume = getCostumeByNameOrNumber(target, costumeName);
        if (!costume) {
            return '';
        }
        return costumeToDataURL(costume)
            .then(dataURL => (` ${dataURL} `));
    }

    /**
     * Return backdrop data directive.
     * @param {object} args - the block's arguments.
     * @param {string} args.BACKDROP - backdrop name
     * @returns {string} - backdrop data directive
     */
    backdropData (args) {
        const backdropName = Cast.toString(args.BACKDROP);
        const stage = this.runtime.getTargetForStage();
        const backdrop = getCostumeByNameOrNumber(stage, backdropName);
        if (!backdrop) {
            return '';
        }
        return costumeToDataURL(backdrop)
            .then(dataURL => (` ${dataURL} `));
    }

    /**
     * Return snapshot data directive.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - a Promise that resolves snapshot data URL
     */
    snapshotData (args, util) {
        const runtime = this.runtime;
        const requester = util.target;
        return new Promise(resolve => {
            this.runtime.renderer.requestSnapshot(imageDataURL => {
                if (DEBUG) {
                    insertImageAsSvgCostume(
                        runtime,
                        requester,
                        imageDataURL,
                        null,
                        null,
                        'snapshot',
                        requester.currentCostume + 1
                    ).catch(e => {
                        console.error(e);
                    });
                }
                resolve(` ${imageDataURL} `);
            });
        });
    }

    /**
     * Return sound data directive.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - sound data URL
     */
    soundData (args, util) {
        const soundName = Cast.toString(args.SOUND);
        const target = util.target;
        const sounds = target.sprite.sounds;
        let sound;
        for (let i = 0; i < sounds.length; i++) {
            if (sounds[i].name === soundName) {
                sound = sounds[i];
                break;
            }
        }
        if (!sound) {
            return '';
        }
        return ` ${sound.asset.encodeDataURI()} `;
    }

    /**
     * Start sound recorder.
     * @returns {Promise} - a Promise that resolves when recorder is started
     * or rejects if user denies access to microphone.
     */
    startSoundRecorder () {
        return navigator.mediaDevices.getUserMedia({audio: true})
            .then(stream => {
                this.runtime.emitMicListening(true);
                const mediaRecorder = new MediaRecorder(stream);
                this.soundRecorder = mediaRecorder;
                this.soundRecorderChunks = [];
                mediaRecorder.ondataavailable = event => {
                    this.soundRecorderChunks.push(event.data);
                };
                mediaRecorder.start();
                this.listeningTimeout = setTimeout(() => {
                    this.stopSoundRecorder();
                }, 60 * 1000);
            });
    }

    /**
     * Stop sound recorder.
     * @returns {?Promise<string>} - a Promise that resolves when recorder is stopped
     * and recorded sound data URL is returned
     */
    stopSoundRecorder () {
        if (this.listeningTimeout) {
            clearTimeout(this.listeningTimeout);
            this.listeningTimeout = null;
        }
        if (this.soundRecorder) {
            return new Promise(resolve => {
                this.soundRecorder.onstop = () => {
                    this.runtime.emitMicListening(false);
                    const audioBlob = new Blob(this.soundRecorderChunks, {type: 'audio/wav'});
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const dataURL = reader.result;
                        this.recordedSoundData = dataURL;
                        this.isListening = false;
                        this.soundRecorder = null;
                        resolve(dataURL);
                    };
                };
                this.soundRecorder.stop();
            });
        }
        return null;
    }

    /**
     * Start listening from microphone.
     * @returns {Promise} - a Promise that resolves when recorder is started
     */
    startListening () {
        if (this.isListening) {
            return;
        }
        this.isListening = true;
        return this.startSoundRecorder()
            .catch(e => {
                console.warn('Failed to start listening', e);
                this.isListening = false;
            });
    }

    /**
     * Stop listening from microphone.
     * @returns {?Promise<string>} - a Promise that resolves when recorder is stopped
     */
    stopListening () {
        if (!this.isListening) {
            return;
        }
        if (this.soundRecorder) {
            return this.stopSoundRecorder();
        }
    }

    /**
     * Listened data.
     * @returns {string} - recorded sound data URL
     */
    listenedData () {
        if (this.recordedSoundData) {
            return ` ${this.recordedSoundData} `;
        }
        return '';
    }

    /**
     * Chat history.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - a Promise that resolves chat history
     */
    chatHistory (args, util) {
        const target = util.target;
        const ai = this.aiForTarget(target);
        if (!ai) {
            return '';
        }
        const history = ai.getChatHistory();
        return JSON.stringify(history).slice(1, -1);
    }

    /**
     * Start chat with history.
     * @param {object} args - the block's arguments.
     * @param {string} args.HISTORY - contents of the history of chat
     * @param {object} util - utility object provided by the runtime.
     * @returns {void}
     */
    startChat (args, util) {
        const target = util.target;
        const ai = this.getAI(target);
        const historyText = String(args.HISTORY).trim();
        try {
            const history = JSON.parse(`[${historyText}]`);
            ai.startChat(history);
        } catch (error) {
            console.error(`startChat: ${error.message}`);
            return error.message;
        }
    }

    /**
     * Get response text from last result.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - response text
     */
    responseText (args, util) {
        const target = util.target;
        const ai = this.aiForTarget(target);
        if (!ai) {
            return '';
        }
        let responseText = ai.getLastResponseText();
        // Replace function names with procedureCode and argument names with their codes
        if (responseText && ai.functionRegistry) {
            Object.values(ai.functionRegistry).forEach(functionSpec => {
                if (functionSpec.procedureCode) {
                    const funcName = functionSpec.name;
                    const procedureCode = functionSpec.procedureCode;
                    // Replace function name with procedure code in the response text
                    responseText = responseText.replace(new RegExp(funcName, 'g'), procedureCode);
                        
                    // Replace argument names with their codes
                    if (functionSpec.argumentDict) {
                        Object.entries(functionSpec.argumentDict).forEach(([argName, argCode]) => {
                            // Replace argument name with argument code in the response text
                            responseText = responseText.replace(new RegExp(argName, 'g'), argCode);
                        });
                    }
                }
            });
        }
        return responseText;
    }

    /**
     * Get response safety rating from last result.
     * @returns {string} - error message
     * @deprecated
     */
    responseSafetyRating () {
        return 'DEPRECATED';
    }

    /**
     * Set safety rating.
     * @returns {string} - error message
     * @deprecated
     */
    setSafetyRating () {
        return 'DEPRECATED';
    }

    /**
     * Set generation config.
     * @param {object} args - the block's arguments.
     * @param {string} args.CONFIG - config key
     * @param {string} args.VALUE - config value
     * @param {object} util - utility object provided by the runtime.
     * @returns {void}
     */
    setGenerationConfig (args, util) {
        const target = util.target;
        const ai = this.getAI(target);
        const configKey = args.CONFIG;
        let configValue = args.VALUE;
        switch (configKey) {
        case 'maxOutputTokens':
            configValue = Math.max(1, parseInt(Cast.toString(configValue), 10));
            break;
        case 'stopSequences':
            configValue = Cast.toString(configValue).split(',')
                .map(s => s.trim());
            break;
        case 'temperature':
            configValue = Math.max(0.0, Math.min(1.0, Cast.toNumber(configValue)));
            break;
        case 'topP':
            configValue = Math.max(0.0, Math.min(1.0, Cast.toNumber(configValue)));
            break;
        case 'topK':
            configValue = Math.max(1, parseInt(Cast.toNumber(configValue), 10));
            break;
        case 'systemInstruction':
            configValue = Cast.toString(configValue);
            break;
        case 'responseSchema':
            try {
                configValue = JSON.parse(configValue);
            } catch (error) {
                console.error(`responseSchema: ${error.message}`);
            }
            break;
        default:
            return `unknown config key: ${configKey}`;
        }
        if (configValue === '') {
            delete ai.generationConfig[configKey];
            if (configKey === 'responseSchema') {
                // Also remove responseMimeType when removing schema
                delete ai.generationConfig.responseMimeType;
            }
            return `delete ${configKey}`;
        }
        ai.generationConfig[configKey] = configValue;
        if (configKey === 'responseSchema' && typeof configValue === 'object') {
            // Also set responseMimeType when setting schema
            ai.generationConfig.responseMimeType = 'application/json';
        }
        return;
    }

    /**
     * Get generation config.
     * @param {object} args - the block's arguments.
     * @param {string} args.CONFIG - config key
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - config value
     */
    generationConfig (args, util) {
        const target = util.target;
        const ai = this.getAI(target);
        const configKey = args.CONFIG;
        const configValue = ai.generationConfig[configKey];
        if (configValue === null || typeof configValue === 'undefined') {
            return '';
        }
        if (Array.isArray(configValue)) {
            // Convert array to comma-separated string
            return configValue.join(', ');
        }
        if (typeof configValue === 'object') {
            // Convert object to JSON string
            return JSON.stringify(configValue);
        }
        if (typeof configValue === 'number') {
            // Convert number to string
            return String(configValue);
        }
        if (typeof configValue === 'boolean') {
            // Convert boolean to string
            return configValue ? 'true' : 'false';
        }
        return configValue;
    }

    getValueFromJson (args) {
        const jsonText = args.JSON.trim();
        if (!jsonText) {
            return '';
        }
        let jsonObject;
        try {
            jsonObject = JSON.parse(jsonText);
        } catch (error) {
            return `error: ${error.message}`;
        }
        const path = Cast.toString(args.PATH).trim();
        if (!path) {
            return '';
        }
        try {
            const func = new Function('jsonObj', `return jsonObj.${path}`);
            const value = func.call(this, jsonObject);
            if (typeof value === 'undefined' || value === null) {
                return '';
            }
            if (Array.isArray(value)) {
            // Convert array to JSON string
                return JSON.stringify(value);
            }
            if (typeof value === 'object') {
            // Convert object to JSON string
                return JSON.stringify(value);
            }
            if (typeof value === 'number') {
            // Convert number to string
                return String(value);
            }
            if (typeof value === 'boolean') {
            // Convert boolean to string
                return value ? 'true' : 'false';
            }
            return String(value);
        } catch (error) {
            return `error: ${error.message}`;
        }
    }

    getItemOfJsonArray (args) {
        let jsonText = args.JSON.trim();
        if (!jsonText) {
            return '';
        }
        if (!jsonText.startsWith('[') && !jsonText.endsWith(']')) {
            jsonText = `[${jsonText}]`; // Wrap in array brackets if not already an array
        }
        try {
            const jsonArray = JSON.parse(jsonText);
            if (!Array.isArray(jsonArray)) {
                return 'error: not an array';
            }
            if (jsonArray.length === 0) {
                return '';
            }
            const index = parseInt(Cast.toString(args.INDEX), 10);
            if (isNaN(index) || index < 1 || index > jsonArray.length) {
                return '';
            }
            const value = jsonArray[index - 1];
            if (typeof value === 'undefined' || value === null) {
                return '';
            }
            if (Array.isArray(value)) {
                // Convert array to JSON string
                return JSON.stringify(value);
            }
            if (typeof value === 'object') {
                // Convert object to JSON string
                return JSON.stringify(value);
            }
            if (typeof value === 'number') {
                // Convert number to string
                return String(value);
            }
            if (typeof value === 'boolean') {
                // Convert boolean to string
                return value ? 'true' : 'false';
            }
            return String(value);
        } catch (error) {
            return `error: ${error.message}`;
        }
    }

    lengthOfJsonArray (args) {
        let jsonText = args.JSON.trim();
        if (!jsonText) {
            return 0; // Return 0 for empty JSON
        }
        if (!jsonText.startsWith('[') && !jsonText.endsWith(']')) {
            jsonText = `[${jsonText}]`; // Wrap in array brackets if not already an array
        }
        try {
            const jsonArray = JSON.parse(jsonText);
            if (!Array.isArray(jsonArray)) {
                return 0; // Return 0 if not an array
            }
            return jsonArray.length;
        } catch (error) {
            return 0; // Return 0 if parsing fails
        }
    }

    /**
     * Set the function calling mode for the target
     * @param {object} args - the arguments for the block
     * @param {object} util - the utility object
     */
    setFunctionCallingMode (args, util) {
        const mode = args.MODE;
        const target = util.target;
        const ai = this.getAI(target);
        if (mode === 'NONE') {
            ai.setFunctionCallingMode(AIAdapter.FUNCTION_CALLING_NONE);
        } else if (mode === 'AUTO') {
            ai.setFunctionCallingMode(AIAdapter.FUNCTION_CALLING_AUTO);
        } else if (mode === 'REQUIRED') {
            ai.setFunctionCallingMode(AIAdapter.FUNCTION_CALLING_REQUIRED);
        }
    }

    /**
     * Update function call registry for AI.
     * This will re-register all user-defined functions.
     * @param {Target} target - the target to update the function registry
     * @returns {void}
     */
    updateFunctionRegistry (target) {
        const ai = this.getAI(target);
        ai.clearRegisteredFunctions();
        const procedures = getUserProcedures(target);
        procedures.forEach(proc => {
            const functionDescription = `${proc.code}: ${target.comments[proc.comment]?.text || ''}`;
            const functionArguments = proc.argumentNames.map((name, index) => {
                const reporterBlocks = Object.values(target.blocks._blocks).filter(aBlock =>
                    !aBlock.shadow && (aBlock.fields.VALUE?.value === name));
                const comments = reporterBlocks.reduce((prev, aBlock) => {
                    const comment = target.comments[aBlock.comment];
                    return comment ? `${prev} ${comment.text};` : prev;
                }, `${name}: `);
                return {
                    code: name,
                    type: proc.argumentTypes[index],
                    description: comments
                };
            });
            ai.registerFunction(proc.code, functionDescription, functionArguments);
        });
    }

    /**
     * Return result to AI for function calling of the last response.
     * @param {object} args - the block's arguments.
     * @param {string} args.RESULT - result to return
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - message indicating result is returned
     */
    returnResultToAI (args, util) {
        const target = util.target;
        const ai = this.getAI(target);
        const result = args.RESULT;
        // Get the top-level block
        const blockId = util.thread.peekStack();
        const topBlockId = target.blocks.getTopLevelScript(blockId);
        const topBlock = target.blocks.getBlock(topBlockId);
        // Check if the top block is a procedure definition
        if (!topBlock || topBlock.opcode !== 'procedures_definition') {
            console.info('returnResultToAI: Not in a procedure definition block.');
            return;
        }
        const prototypeId = topBlock.inputs.custom_block.block;
        const prototype = target.blocks.getBlock(prototypeId);
        const procedureCode = prototype.mutation.proccode;
        const functionSpec = ai.getFunctionSpec(procedureCode);
        if (!functionSpec) {
            console.error(`returnResultToAI: "${procedureCode}" is not registered.`);
            return `"${procedureCode}" is not registered.`;
        }
        const currentCall = util.thread.functionCall;
        if (!currentCall) {
            console.info('returnResultToAI: No function call in progress.');
            return 'No function call in progress.';
        }
        if (currentCall.name !== functionSpec.name) {
            console.info(`returnResultToAI: "${functionSpec.name}" is not the current function call.`);
            return;
        }
        util.thread.functionCall.result = result;
        console.debug(
            `"function: ${functionSpec.name}, block: ${procedureCode}", result: ${result},`
        );
        return;
    }

    /**
     * Get embedding of content.
     * @param {object} args - the block's arguments.
     * @param {string} args.CONTENT - content
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - a Promise that resolves embedding
     */
    embeddingFor (args, util) {
        const ai = this.aiForTarget(util.target);
        const stackFrame = util.stackFrame;
        if (!ai) {
            return `AI is not available`;
        }

        // Create a unique key for this content to avoid state conflicts
        const contentText = Cast.toString(args.CONTENT).trim();
        // Use a simple hash function to handle multi-byte characters properly
        let contentHash = 0;
        for (let i = 0; i < contentText.length; i++) {
            const char = contentText.charCodeAt(i);
            contentHash = ((contentHash << 5) - contentHash) + char;
            contentHash = contentHash & contentHash; // Convert to 32bit integer
        }
        const contentKey = `embedding_${contentText.length}_${Math.abs(contentHash)}`;
        
        // Initialize embedding requests storage if not exists
        if (!stackFrame.embeddingRequests) {
            stackFrame.embeddingRequests = {};
        }
        
        // Get or create state for this specific content
        let requestState = stackFrame.embeddingRequests[contentKey];
        if (!requestState) {
            requestState = stackFrame.embeddingRequests[contentKey] = {};
        }

        if (requestState.requestError) {
            const error = requestState.error;
            return error.message || error.name;
        }
        if (requestState.requestResult) {
            const jsonText = JSON.stringify(requestState.requestResult);
            const result = jsonText.substring(1, jsonText.length - 1); // remove brackets
            return result;
        }

        if (!requestState.requested) {
            // Start a new request
            const content = interpretContentPartsText(contentText);
            requestState.requested = true;
            ai.requestEmbedding(content)
                .then(embedding => {
                    requestState.requestResult = embedding;
                })
                .catch(error => {
                    console.error(error);
                    requestState.error = error;
                });
        }
        util.yield();
        return;
    }

    /**
     * Calculate similarity of two vectors.
     * @param {object} args - the block's arguments.
     * @param {string} args.METRIC - metric {'dotProduct' | 'euclidean'}
     * @param {string} args.VECTOR_A - vector A
     * @param {string} args.VECTOR_B - vector B
     * @returns {number} - dot product
     */
    embeddingDistanceOf (args) {
        const metric = args.METRIC;
        const vectorA = String(args.VECTOR_A).split(',')
            .map(s => parseFloat(s));
        const vectorB = String(args.VECTOR_B).split(',')
            .map(s => parseFloat(s));
        if (vectorA.length !== vectorB.length) return 'error: not same length';
        if (vectorA.every(x => x === 0) || vectorB.every(x => x === 0)) return 'error: zero vector';
        let result = '';
        switch (metric) {
        case 'dotProduct':
            result = dotProduct(vectorA, vectorB);
            break;
        case 'cosine':
            result = cosineDistance(vectorA, vectorB);
            break;
        case 'euclidean':
            result = euclideanDistance(vectorA, vectorB);
            break;
        default:
            console.error(`embeddingDistanceOf: unknown metric ${metric}`);
        }
        return result;
    }

    /**
     * Set API key and reset AI.
     * @param {object} args - the block's arguments.
     * @param {string} args.KEY - API key
     * @param {object} util - utility object provided by the runtime.
     * @returns {void}
     */
    setApiKey (args, util) {
        const apiKey = Cast.toString(args.KEY).trim();
        const ai = this.getAI(util.target);
        ai.setApiKey(apiKey);
    }

    /**
     * Get API key.
     * @param {object} _args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - API key
     */
    apiKey (_args, util) {
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return '';
        }
        const apiKey = ai.apiKey;
        if (!apiKey) {
            return '';
        }
        if (apiKey.length <= 8) {
            return '*'.repeat(apiKey.length);
        }
        // Show only first 4 and last 4 characters
        // e.g., abcd********wxyz
        const firstFourChars = apiKey.slice(0, 4);
        const lastFourChars = apiKey.slice(-4);
        const maskedPortion = '*'.repeat(apiKey.length - 8);
        return firstFourChars + maskedPortion + lastFourChars;
    }

    /**
     * Set base URL and optionally switch AI adapter.
     * @param {object} args - the block's arguments.
     * @param {string} args.URL - base URL
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - message
     */
    setBaseUrl (args, util) {
        const baseUrl = Cast.toString(args.URL).trim();
        
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            return 'error: invalid URL';
        }
        const ai = this.getAI(util.target);
        ai.setBaseUrl(baseUrl);
        return `set base URL to ${baseUrl}`;
    }

    /**
     * Get base URL.
     * @param {object} _args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - base URL
     */
    baseUrl (_args, util) {
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return '';
        }
        return ai.baseUrl || '';
    }

    /**
     * Set API type.
     * @param {object} args - the block's arguments.
     * @param {string} args.API - API type
     * @param {object} util - utility object provided by the runtime.
     * @returns {void}
     */
    setApiType (args, util) {
        const apiType = Cast.toString(args.API).trim();
        const ai = this.getAI(util.target);
        ai.setApiType(apiType);
    }

    /**
     * Get API type.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - API type
     */
    getApiType (args, util) {
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return '';
        }
        return ai.getApiType();
    }

    /**
     * Set model code.
     * @param {object} args - the block's arguments.
     * @param {string} args.MODEL_ID - model code
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - validation result message
     */
    setModel (args, util) {
        const target = util.target;
        const ai = this.getAI(target);
        const modelCode = Cast.toString(args.MODEL_ID).trim();
        return ai.setModel(modelCode)
            .catch(error => `Error setting model: ${error.message}`);
    }

    /**
     * Get model code.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - model code
     */
    getModel (args, util) {
        const target = util.target;
        const ai = this.aiForTarget(target);
        if (!ai) {
            return '';
        }
        return ai.getModel();
    }

    /**
     * Get model ID at index.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - model ID
     */
    getModelIDAtIndex (args, util) {
        const modelIndex = parseInt(args.MODEL_INDEX, 10);
        if (isNaN(modelIndex)) {
            return '';
        }
        if (modelIndex < 1) {
            return '';
        }
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return '';
        }
        return ai.getModelIDs()
            .then(modelIDs => {
                if (!modelIDs || modelIndex > modelIDs.length) {
                    return '';
                }
                return modelIDs[modelIndex - 1];
            });
    }

    /**
     * Get max model number.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {number} - max model number
     */
    getMaxModelNumber (args, util) {
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return 0;
        }
        return ai.getModelIDs()
            .then(modelIDs => (modelIDs ? modelIDs.length : 0));
    }

    /**
     * Get file data at index from last result.
     * @param {object} args - the block's arguments.
     * @param {number} args.INDEX - file index (1-based)
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - file data URL in format "data:mediaType;base64,base64Data"
     */
    getFileDataAtIndex (args, util) {
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return '';
        }
        const files = ai.getResultFiles();
        if (!files || files.length === 0) {
            return '';
        }
        const inputIndex = Math.floor(Number(args.INDEX));
        if (inputIndex < 1) {
            return ''; // Invalid index (less than 1)
        }
        const index = inputIndex - 1; // Convert to 0-based index
        if (index < files.length) {
            const file = files[index];
            const base64 = file.base64 || '';
            const mediaType = file.mediaType || 'application/octet-stream';
            if (base64) {
                return `data:${mediaType};base64,${base64}`;
            }
        }
        return '';
    }

    /**
     * Get file media type at index from last result.
     * @param {object} args - the block's arguments.
     * @param {number} args.INDEX - file index (1-based)
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - file media type
     */
    getFileMediaTypeAtIndex (args, util) {
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return '';
        }
        const files = ai.getResultFiles();
        if (!files || files.length === 0) {
            return '';
        }
        const inputIndex = Math.floor(Number(args.INDEX));
        if (inputIndex < 1) {
            return ''; // Invalid index (less than 1)
        }
        const index = inputIndex - 1; // Convert to 0-based index
        if (index < files.length) {
            return files[index].mediaType || '';
        }
        return '';
    }

    /**
     * Get max file number from last result.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {number} - max file number
     */
    getMaxFileNumber (args, util) {
        const ai = this.aiForTarget(util.target);
        if (!ai) {
            return 0;
        }
        const files = ai.getResultFiles();
        return files ? files.length : 0;
    }

    /**
     * Set generative model code.
     * @param {object} args - the block's arguments.
     * @param {string} args.MODEL_ID - model code
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - validation result message
     * @deprecated Use setModel instead.
     */
    setGenerativeModel (args, util) {
        return this.setModel(args, util);
    }

    /**
     * Get generative model code.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - model code
     * @deprecated Use getModel instead.
     */
    getGenerativeModel (args, util) {
        return this.getModel(args, util);
    }
    /**
     * Get generative model ID.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - model ID
     * @deprecated Use getModelIDAtIndex instead.
     */
    getGenerativeModelID (args, util) {
        return this.getModelIDAtIndex(args, util);
    }

    /**
     * Get max generative model number.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {number} - max generative model number
     * @deprecated Use getMaxModelNumber instead.
     */
    getMaxGenerativeModelNumber (args, util) {
        return this.getMaxModelNumber(args, util);
    }

    /**
     * Set embedding model code.
     * @param {object} args - the block's arguments.
     * @param {string} args.MODEL_ID - model code
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - validation result message
     * @deprecated Use setModel instead.
     */
    setEmbeddingModel (args, util) {
        return this.setModel(args, util);
    }

    /**
     * Get embedding model code.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - model code
     * @deprecated Use getModel instead.
     */
    getEmbeddingModel (args, util) {
        return this.getModel(args, util);
    }

    /**
     * Get embedding model ID.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {string} - model ID
     * @deprecated Use getModelIDAtIndex instead.
     */
    getEmbeddingModelID (args, util) {
        return this.getModelIDAtIndex(args, util);
    }

    /**
     * Get max embedding model number.
     * @param {object} args - the block's arguments.
     * @param {object} util - utility object provided by the runtime.
     * @returns {number} - max embedding model number
     * @deprecated Use getMaxModelNumber instead.
     */
    getMaxEmbeddingModelNumber (args, util) {
        return this.getMaxModelNumber(args, util);
    }

    /**
     * Open dialog to input API key by user.
     * @param {string} [targetName] - target name to show in the dialog
     * @param {string} [defaultApiKey] - default API key
     * @param {string} [customMessage] - custom message to show in the dialog
     * @returns {Promise<string>?} - a Promise that resolves API key or null if canceled
     */
    openApiKeyDialog (targetName = '', defaultApiKey = '', customMessage = '') {
        if (this.apiKeyDialogOpened) {
            // prevent to open multiple dialogs
            return null;
        }
        this.apiKeyDialogOpened = true;
        const inputDialog = document.createElement('dialog');
        inputDialog.style.padding = '0px';
        const dialogFace = document.createElement('div');
        dialogFace.style.padding = '16px';
        inputDialog.appendChild(dialogFace);
        const message = customMessage || formatMessage({
            id: 'gai.apiKeyDialog.message',
            default: 'set API key for AI of [targetName]',
            description: 'label of API key input dialog for GAI'
        }).replace('[targetName]', targetName);
        const label = document.createTextNode(message);
        dialogFace.appendChild(label);
        // Dialog form
        const apiKeyForm = document.createElement('form');
        apiKeyForm.setAttribute('method', 'dialog');
        apiKeyForm.style.margin = '8px';
        apiKeyForm.addEventListener('submit', e => {
            e.preventDefault();
        });
        dialogFace.appendChild(apiKeyForm);
        // API key input
        const apiKeyInput = document.createElement('input');
        apiKeyInput.setAttribute('type', 'text');
        apiKeyInput.setAttribute('id', 'apiKeyInput');
        apiKeyInput.setAttribute('size', '50');
        apiKeyInput.setAttribute('value', defaultApiKey ? defaultApiKey : '');
        apiKeyForm.appendChild(apiKeyInput);
        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = formatMessage({
            id: 'gai.apiKeyDialog.cancel',
            default: 'cancel',
            description: 'cancel button on groupID input dialog for GAI'
        });
        cancelButton.style.margin = '8px';
        dialogFace.appendChild(cancelButton);
        // OK button
        const confirmButton = document.createElement('button');
        confirmButton.textContent = formatMessage({
            id: 'gai.apiKeyDialog.set',
            default: 'set',
            description: 'set button on API key input dialog for GAI'
        });
        confirmButton.style.margin = '8px';
        dialogFace.appendChild(confirmButton);
        return new Promise(
            resolve => {
                // Add onClick action
                const confirmed = () => {
                    const inputValue = apiKeyInput.value.trim();
                    resolve(inputValue);
                };
                confirmButton.onclick = confirmed;
                const canceled = () => {
                    resolve(null);
                };
                cancelButton.onclick = canceled;
                inputDialog.addEventListener('keydown', e => {
                    if (e.code === 'Enter') {
                        confirmed();
                    }
                    if (e.code === 'Escape') {
                        canceled();
                    }
                });
                document.body.appendChild(inputDialog);
                inputDialog.showModal();
            })
            .finally(() => {
                document.body.removeChild(inputDialog);
                this.apiKeyDialogOpened = false;
            });
    }

    /**
     * Ask user to input API key.
     * @param {object} args - the block's arguments.
     * @param {string} args.MESSAGE - message to show in the dialog
     * @param {object} util - utility object provided by the runtime.
     * @returns {Promise<string>} - a Promise that resolves status message
     * 'canceled by user' if canceled, 'API key is empty' if empty key,
     * or 'API key is set' if API key is set.
     */
    askApiKey (args, util) {
        if (this.apiKeyDialogOpened) {
            util.yield();
            return;
        }
        const target = util.target;
        const ai = this.getAI(target);
        const message = args.MESSAGE || 'Please enter API key';
        return this.openApiKeyDialog('', '', message)
            .then(apiKey => {
                if (apiKey === null) {
                    // canceled
                    return 'canceled by user';
                }
                if (apiKey === '') {
                    // empty key
                    return 'API key is empty';
                }
                ai.setApiKey(apiKey);
                return 'API key is set';
            });
    }
}

export {GAIBlocks as default, GAIBlocks as blockClass};
