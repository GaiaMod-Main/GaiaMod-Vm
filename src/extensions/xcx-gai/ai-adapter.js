import {createGoogleGenerativeAI} from '@ai-sdk/google';
import {createOpenAI} from '@ai-sdk/openai';
import {createOpenAICompatible} from '@ai-sdk/openai-compatible';
import {createAnthropic} from '@ai-sdk/anthropic';
import {generateText, streamText, tool, jsonSchema, stepCountIs, embed, Output} from 'ai';

/**
 * Function Call class for AI adapter function calling.
 */
class FunctionCall {

    /**
     * @param {object} spec - The specification of the function being called.
     * @param {object} call - The call object containing arguments and options.
     */
    constructor (spec, call) {
        this.spec = spec;
        this.call = call;
        this.status = 'PENDING';
        this.thread = null; // thread to run function
        this.result = null; // result of function call
        this.error = null; // error message if failed
        this.onStop = null; // callback when function call stops
    }

    /**
     * Get function call name.
     * @returns {string} - function call name
     */
    get name () {
        return this.spec.name;
    }

    /**
     * Get function call arguments.
     * @returns {Array} - function call arguments
     */
    get args () {
        return this.call.args;
    }
    /**
     * Get function call messages.
     * @returns {Array} - function call messages
     */
    get messages () {
        return this.call.options.messages;
    }

    /**
     * Whether function call is pending.
     * @returns {boolean} - true if function call is pending, false otherwise
     */
    isPending () {
        return this.status === 'PENDING';
    }

    /**
     * Whether function call is finished.
     * @returns {boolean} - true if function call is finished, false otherwise
     */
    isStopped () {
        return this.status === 'DONE' ||
               this.status === 'FAILED' ||
               this.status === 'KILLED';
    }

    /**
     * Mark function call as failed.
     */
    failed () {
        this.status = 'FAILED';
        if (this.onStop) {
            this.onStop(this);
        }
    }

    /**
     * Update status of function call based on runtime.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    updateStatusOn (runtime) {
        if (this.status === 'PROCESSING') {
            if (this.thread && !runtime.isActiveThread(this.thread)) {
                // Thread has finished
                if (this.thread.isKilled) {
                    this.status = 'KILLED';
                } else {
                    this.status = 'DONE';
                }
                this.thread = null;
                if (this.onStop) {
                    this.onStop(this);
                }
            }
        }
    }
}

// Provider configurations with static imports
const PROVIDER_FACTORIES = {
    Gemini: createGoogleGenerativeAI,
    OpenAI: createOpenAI,
    OpenAICompatible: createOpenAICompatible,
    Anthropic: createAnthropic
};

const PROVIDERS = {
    Gemini: {
        id: 'gemini',
        factory: PROVIDER_FACTORIES.Gemini,
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        defaultModels: {
            generative: 'gemini-flash-latest',
            embedding: 'gemini-embedding-001'
        },
        supports: {
            functionCalling: true,
            embeddings: true,
            streaming: true
        }
    },
    OpenAI: {
        id: 'openai',
        factory: PROVIDER_FACTORIES.OpenAI,
        baseUrl: 'https://api.openai.com/v1',
        defaultModels: {
            generative: 'gpt-5-mini',
            embedding: 'text-embedding-3-small'
        },
        supports: {
            functionCalling: true,
            embeddings: true,
            streaming: true
        }
    },
    OpenAICompatible: {
        id: 'openai-compatible',
        factory: PROVIDER_FACTORIES.OpenAICompatible,
        baseUrl: 'https://router.huggingface.co/v1',
        defaultModels: {
            generative: 'HuggingFaceTB/SmolLM3-3B:hf-inference',
            embedding: 'google/embeddinggemma-300m:hf-inference'
        },
        supports: {
            functionCalling: true,
            embeddings: true,
            streaming: true
        }
    },
    Anthropic: {
        id: 'anthropic',
        factory: PROVIDER_FACTORIES.Anthropic,
        baseUrl: 'https://api.anthropic.com/v1',
        defaultModels: {
            generative: 'claude-3-7-sonnet-latest',
            embedding: null
        },
        supports: {
            functionCalling: true,
            embeddings: false,
            streaming: true
        }
    }
};

// Map of target.id to AIAdapter instances
const AI_ADAPTERS = {};

/**
 * Multi-provider AI Adapter class using Vercel AI SDK.
 * Provides unified interface for Gemini and OpenAI APIs.
 */
export class AIAdapter {

    /**
     * Get adapters map.
     * @returns {object.<string, AIAdapter>} - adapters with target.id as key
     * @static
     */
    static get ADAPTERS () {
        return AI_ADAPTERS;
    }

    /**
     * Default model code for each provider and data type.
     * @returns {object} model code for provider and data type
     */
    static DEFAULT_MODEL_ID = {
        generative: PROVIDERS.Gemini.defaultModels.generative,
        embedding: PROVIDERS.Gemini.defaultModels.embedding
    };

    /**
     * API key for AI services.
     * @type {string}
     */
    static apiKey = null;

    /**
     * Base URL for AI services.
     * @type {string}
     */
    static baseUrl = null;

    /**
     * Default API type for AI services.
     * @type {string}
     */
    static defaultApiType = 'Gemini';

    /**
     * Function calling modes for AI operations.
     * @returns {object} function calling modes
     */
    static FUNCTION_CALLING_NONE = 'none';
    static FUNCTION_CALLING_AUTO = 'auto';
    static FUNCTION_CALLING_REQUIRED = 'required';

    /**
     * Check if AI Adapter exists for target.
     * @param {Target} target - target to check
     * @returns {boolean} - whether AI Adapter exists for target
     * @static
     * @public
     */
    static existsForTarget (target) {
        return !!AIAdapter.ADAPTERS[target.id];
    }

    /**
     * Get AI Adapter for target. Initialize if not exists.
     * @param {Target} target - target to get AI Adapter
     * @returns {AIAdapter} - AI Adapter
     */
    static getForTarget (target) {
        const ai = AIAdapter.ADAPTERS[target.id];
        if (ai) {
            return ai;
        }
        return new AIAdapter(target);
    }

    /**
     * Remove AI Adapter for target.
     * @param {Target} target - target to remove AI Adapter
     * @returns {void}
     */
    static removeForTarget (target) {
        delete AIAdapter.ADAPTERS[target.id];
    }

    /**
     * Remove all AI Adapters.
     */
    static removeAllAdapter () {
        Object.keys(AIAdapter.ADAPTERS).forEach(key => {
            delete AIAdapter.ADAPTERS[key];
        });
    }

    /**
     * Get API key.
     * @returns {string} - API key
     */
    static getApiKey () {
        return AIAdapter.apiKey;
    }

    /**
     * Set API key.
     * @param {string} key - API key
     * @returns {void}
     */
    static setApiKey (key) {
        AIAdapter.apiKey = key;
    }

    /**
     * Abort all requests for all adapters.
     * @param {string} reason - reason for aborting requests
     */
    static abortAllRequests (reason) {
        Object.values(AIAdapter.ADAPTERS).forEach(adapter => {
            adapter.abortRequests(reason);
        });
    }

    /**
     * Constructor for AIAdapter.
     * @param {Target} target - target for the adapter
     */
    constructor (target) {
        AIAdapter.ADAPTERS[target.id] = this;

        this.apiType = null;
        this.apiKey = null;
        this.baseUrl = null;
        this.modelID = null;
        this.generationConfig = {};
        this.client = null;
        this.models = [];
        this.messages = [];
        this.lastResult = null;
        this.lastPartialText = null;
        
        // Function calling setup
        this.functionRegistry = {};
        this.functionIndex = 0;
        this.functionArgPrefix = 'arg_';
        this.functionNamePrefix = 'func_';
        this.functionCallingMode = AIAdapter.FUNCTION_CALLING_AUTO;
        
        // Abort controllers for cancelling requests
        this.abortControllers = [];
    }

    /**
     * Set API key.
     * @param {string} apiKey - API key
     */
    setApiKey (apiKey) {
        this.apiKey = apiKey;
        this.client = null; // Reset client to reinitialize with new API key
        this.models = []; // Clear models to reload for new API key
        AIAdapter.apiKey = apiKey; // Set default API key for later use
    }

    /**
     * Set base URL.
     * @param {string} baseUrl - base URL
     */
    setBaseUrl (baseUrl) {
        this.baseUrl = baseUrl;
        this.client = null; // Reset client to reinitialize with new base URL
        this.models = []; // Clear models to reload for new base URL
        AIAdapter.baseUrl = baseUrl; // Set default base URL for later use
    }

    /**
     * Set API type.
     * @param {string} apiType - API type
     */
    setApiType (apiType) {
        this.apiType = apiType;
        this.client = null; // Reset client to reinitialize with new API type
        this.models = []; // Clear models to reload for new API type
        AIAdapter.apiType = apiType; // Set default API type for later use
    }

    /**
     * Get API type.
     * Returns the explicitly set API type, or infers it from the base URL if not set.
     * @returns {string} - API type
     */
    getApiType () {
        if (this.apiType) {
            return this.apiType;
        }

        if (this.baseUrl) {
            // Infer API type from base URL
            if (this.baseUrl.startsWith('https://generativelanguage.googleapis.com/v1beta/openai')) {
                return 'OpenAICompatible';
            } else if (this.baseUrl.startsWith('https://generativelanguage.googleapis.com')) {
                return 'Gemini';
            } else if (this.baseUrl.startsWith('https://api.openai.com')) {
                return 'OpenAI';
            } else if (this.baseUrl.startsWith('https://api.anthropic.com')) {
                return 'Anthropic';
            }
            return 'OpenAICompatible'; // Default to OpenAICompatible if unable to determine
        }

        return AIAdapter.defaultApiType;
    }

    /**
     * Get client. Initialize if not exists.
     * @returns {object} - AI SDK client
     */
    getClient () {
        if (!this.client) {
            const providerType = this.getApiType();
            const provider = PROVIDERS[providerType];
            if (!provider) {
                throw new Error(`Unsupported API type: ${providerType}`);
            }

            if (!this.baseUrl) {
                // Use provider default base URL if not set
                this.baseUrl = provider.baseUrl;
            }

            const config = {
                baseURL: this.baseUrl,
                ...(this.apiKey && {apiKey: this.apiKey}),
                ...((providerType === 'OpenAICompatible') && {supportsStructuredOutputs: true})
            };
            
            this.client = provider.factory(config);
        }
        return this.client;
    }

    /**
     * Get models list.
     * @returns {Promise<Array.<object>>} - a Promise that resolves when the models are loaded
     */
    async getModels () {
        if (this.models && this.models.length > 0) {
            return this.models;
        }

        const baseUrl = this.baseUrl || AIAdapter.baseUrl;
        
        // If no baseURL is configured, return empty models list
        if (!baseUrl) {
            this.models = [];
            return this.models;
        }
        const apiType = this.getApiType();
        if (apiType === 'Gemini') {
            try {
                // Use baseURL to fetch models
                const apiUrl = `${baseUrl.replace(/\/$/, '')}/models`;
                
                const response = await fetch(apiUrl, {
                    headers: {
                        'x-goog-api-key': this.apiKey
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Gemini API error: ${response.status}`);
                }
                
                const data = await response.json();
                if (data.models && Array.isArray(data.models)) {
                    this.models = data.models.map(model => ({
                        id: model.name.replace('models/', '')
                    }));
                } else {
                    console.warn('Unexpected Gemini API response structure:', data);
                    this.models = [];
                }
            } catch (error) {
                console.warn(`Failed to fetch models for Gemini:`, error);
                this.models = [];
            }
        } else if (apiType === 'OpenAI' || apiType === 'OpenAICompatible') {
            try {
                // Use baseURL to fetch models
                const apiUrl = `${baseUrl.replace(/\/$/, '')}/models`;
                
                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`OpenAI API error: ${response.status}`);
                }
                
                const data = await response.json();
                this.models = data.data
                    .map(model => ({
                        id: model.id
                    }));
            } catch (error) {
                console.warn(`Failed to fetch models for OpenAI:`, error);
                this.models = [];
            }
        }

        return this.models;
    }

    /**
     * Get list of model IDs.
     * @returns {Promise<Array.<string>>} - array of model IDs
     */
    async getModelIDs () {
        const models = await this.getModels();
        return models.map(model => model.id);
    }

    /**
     * Get list of generative model IDs.
     * @returns {Promise<Array.<string>>} - array of generative model names
     */
    async getGenerativeModelList () {
        const models = await this.getModels();
        return models
            .map(model => model.id);
    }

    /**
     * Convert content parts to a message in Vercel AI SDK format.
     * @param {Array.<string | object>} contentParts - content to convert
     * @returns {object} - message in Vercel AI SDK format
     * @private
     */
    _convertToMessage (contentParts) {
        if (!Array.isArray(contentParts)) {
            contentParts = [contentParts];
        }
        
        let textContent = '';
        const parts = [];
        
        contentParts.forEach(part => {
            if (typeof part === 'string') {
                textContent += part;
            } else if (part.type === 'text') {
                textContent += part.data;
            } else if (part.type === 'dataURL') {
                const mimeType = part.data.substring(part.data.indexOf(':') + 1, part.data.indexOf(';'));
                parts.push({
                    type: 'file',
                    data: part.data,
                    mediaType: mimeType
                });
            }
        });
        
        if (textContent) {
            parts.push({
                type: 'text',
                text: textContent
            });
        }
        
        return {
            role: 'user',
            content: (parts.length === 1 && parts[0].type === 'text') ? parts[0].text : parts
        };
    }

    /**
     * Execute function call and handle errors properly.
     * @param {FunctionCall} functionCall - function call to execute
     * @param {Function} functionDispatcher - function to dispatch the call
     * @returns {Promise} - result or error
     * @private
     */
    _executeFunctionCall (functionCall, functionDispatcher) {
        return new Promise((resolve, reject) => {
            functionCall.onStop = call => {
                if (call.status === 'FAILED') {
                // Create a structured error object
                    const error = new Error(call.error || 'Function execution failed');
                    error.name = 'FunctionExecutionError';
                    error.functionName = call.name;
                    error.functionArgs = call.args;
                    reject(error);
                } else if (call.status === 'KILLED') {
                    const error = new Error('Function execution was killed');
                    error.name = 'FunctionKilledError';
                    error.functionName = call.name;
                    reject(error);
                } else {
                    resolve(call.result);
                }
            };

            functionDispatcher(functionCall);
        });
    }

    /**
     * Build generation parameters from generationConfig for Vercel AI SDK.
     * @returns {object} - generation parameters for generateText/streamText
     * @private
     */
    _buildGenerationParams () {
        const params = {};
        
        // Map generationConfig properties to Vercel AI SDK parameters
        if (Object.prototype.hasOwnProperty.call(this.generationConfig, 'temperature')) {
            params.temperature = this.generationConfig.temperature;
        }
        
        if (Object.prototype.hasOwnProperty.call(this.generationConfig, 'topP')) {
            params.topP = this.generationConfig.topP;
        }
        
        if (Object.prototype.hasOwnProperty.call(this.generationConfig, 'topK')) {
            params.topK = this.generationConfig.topK;
        }
        
        if (Object.prototype.hasOwnProperty.call(this.generationConfig, 'maxOutputTokens')) {
            params.maxOutputTokens = this.generationConfig.maxOutputTokens;
        }
        
        if (Object.prototype.hasOwnProperty.call(this.generationConfig, 'stopSequences') &&
            Array.isArray(this.generationConfig.stopSequences) &&
            this.generationConfig.stopSequences.length > 0) {
            params.stopSequences = this.generationConfig.stopSequences;
        }
        
        // Handle system instruction - add to system parameter if present
        if (Object.prototype.hasOwnProperty.call(this.generationConfig, 'systemInstruction')) {
            params.system = this.generationConfig.systemInstruction;
        }
        
        // Handle response schema - experimental structured output
        if (Object.prototype.hasOwnProperty.call(this.generationConfig, 'responseSchema')) {
            params.output = Output.object({schema: jsonSchema(this.generationConfig.responseSchema)});
        }
        
        return params;
    }

    /**
     * Build tools array from registered functions.
     * @param {Function} functionDispatcher - function to dispatch the call
     * @returns {Array.<object>} - tools array for Vercel AI SDK
     * @private
     */
    _buildTools (functionDispatcher) {
        const tools = {};
        
        Object.values(this.functionRegistry).forEach(funcSpec => {
            tools[funcSpec.name] = tool({
                description: funcSpec.description,
                inputSchema: jsonSchema(funcSpec.parameters),
                execute: async (input, options) => {
                    try {
                        const functionCall = new FunctionCall(
                            funcSpec,
                            {
                                args: input,
                                options: options
                            }
                        );
                    
                        // Function execution logic here
                        const result = await this._executeFunctionCall(functionCall, functionDispatcher);
                        if (result) {
                            // Return successful result
                            return {
                                success: true,
                                result: result
                            };
                        }
                        return; // No return message to send
                    } catch (error) {
                        // Return error information
                        return {
                            success: false,
                            error: error.message,
                            type: error.name || 'FunctionExecutionError'
                        };
                    }
                }
            });
        });
        return tools;
    }

    /**
     * Get text from response.
     * @param {object} responses - response from AI
     * @return {string} response text
     */
    getTextFromResponse (responses) {
        if (!responses) {
            return '';
        }
        
        if (typeof responses === 'string') {
            return responses;
        }
        
        if (Array.isArray(responses)) {
            return responses.map(r => this._extractTextFromSingleResponse(r)).join('');
        }
        
        return this._extractTextFromSingleResponse(responses);
    }

    /**
     * Extract text from a single response object.
     * @param {object} response - single response object
     * @returns {string} - extracted text
     * @private
     */
    _extractTextFromSingleResponse (response) {
        if (typeof response === 'string') {
            return response;
        }
        
        if (response.text) {
            return response.text;
        }
        
        if (response.content) {
            return response.content;
        }
        
        // Handle AI SDK response format with messages array
        if (response.messages && Array.isArray(response.messages)) {
            return response.messages
                .map(msg => {
                    if (typeof msg.content === 'string') {
                        return msg.content;
                    }
                    if (Array.isArray(msg.content)) {
                        return msg.content
                            .filter(c => c.type === 'text')
                            .map(c => c.text)
                            .join('');
                    }
                    return '';
                })
                .join('');
        }
        
        if (response.message && response.message.content) {
            return response.message.content;
        }
        
        if (response.name?.includes('Error')) {
            return response.message || response.name;
        }
        
        return '';
    }

    /**
     * Get last result object from AI.
     * @returns {object} - last result
     */
    getLastResult () {
        return this.lastResult;
    }

    /**
     * Set last result from AI.
     * @param {object} result - last result
     * @returns {void}
     */
    setLastResult (result) {
        this.lastResult = result;
    }

    /**
     * Get result files from last result.
     * @returns {Array.<{base64: string, mediaType: string}>} - array of result files
     */
    getResultFiles () {
        if (!this.lastResult) {
            return [];
        }
        return this.lastResult.files || [];
    }

    /**
     * Get last response text from AI.
     * @returns {string} - last response text
     */
    getLastResponseText () {
        return this.lastResponseText;
    }

    /**
     * Set last response text from AI.
     * @param {string} text - last response text
     * @returns {void}
     */
    setLastResponseText (text) {
        this.lastResponseText = text;
    }

    /**
     * Set last partial text from AI.
     * @param {string} text - last partial text
     * @returns {void}
     */
    setLastPartialText (text) {
        this.lastPartialText = text;
    }

    /**
     * Get last partial text from AI.
     * @returns {string} - last partial text
     */
    getLastPartialText () {
        return this.lastPartialText;
    }

    /**
     * Register a function for generation.
     * @param {string} procedureCode - code of the procedure to register
     * @param {string} functionDescription - description of the function
     * @param {Array.<{type: string, description: string, code: string}>} procedureArguments
     *  - arguments of the procedure
     * @returns {void}
     */
    registerFunction (procedureCode, functionDescription, procedureArguments) {
        let functionName;
        const existingSpec = this.getFunctionSpec(procedureCode);
        if (existingSpec) {
            // If function already exists, update it
            functionName = existingSpec.name;
        } else {
            this.functionIndex = this.functionIndex + 1;
            functionName = `${this.functionNamePrefix}${this.functionIndex}`;
        }
        
        const parameters = {
            type: 'object',
            properties: {},
            required: []
        };
        
        const argumentDict = {};
        if (procedureArguments && procedureArguments.length > 0) {
            procedureArguments.forEach((argSpec, index) => {
                const paramName = `${this.functionArgPrefix}${index}`;
                parameters.properties[paramName] = {
                    type: argSpec.type,
                    description: argSpec.description
                };
                parameters.required.push(paramName);
                argumentDict[paramName] = argSpec.code;
            });
        }
        
        this.functionRegistry[functionName] = {
            name: functionName,
            procedureCode: procedureCode,
            description: functionDescription,
            parameters: parameters,
            argumentDict: argumentDict
        };
    }

    /**
     * Get function specification by procedure code.
     * @param {string} procedureCode - code of the procedure to get specification for
     * @returns {object|null} - function specification or null if not found
     */
    getFunctionSpec (procedureCode) {
        return Object.values(this.functionRegistry).find(func => func.procedureCode === procedureCode);
    }

    /**
     * Erase a function from registered functions.
     * @param {string} procedureCode - code of the procedure to erase
     * @returns {void}
     */
    unregisterFunction (procedureCode) {
        const functionSpec = this.getFunctionSpec(procedureCode);
        if (functionSpec) {
            delete this.functionRegistry[functionSpec.name];
        }
    }

    /**
     * Unregister all functions.
     * @returns {void}
     */
    clearRegisteredFunctions () {
        Object.keys(this.functionRegistry).forEach(key => {
            delete this.functionRegistry[key];
        });
        this.functionIndex = 0;
    }

    /**
     * Set function calling mode for AI generation.
     * @param {string} mode - function calling mode ('none', 'auto', 'required')
     * @returns {void}
     */
    setFunctionCallingMode (mode) {
        this.functionCallingMode = mode;
    }

    /**
     * Send generator type prompt to AI.
     * @param {Array.<string | object>} prompt - the original prompt to AI
     * @param {function} responseTextHandler - A function to handle response text.
     * @param {function} functionDispatcher - A function to dispatch tool calls.
     * @param {function} partialTextHandler - A function to handle partial text responses.
     * @param {boolean} isChat - A flag indicating if the request is for chat.
     * @returns {Promise<[object, Array.<object>]>} - a Promise that resolves
     *  to an array with response and function calls
     */
    async requestGenerate (
        prompt,
        responseTextHandler,
        functionDispatcher,
        partialTextHandler,
        isChat
    ) {
        const promptMessage = this._convertToMessage(prompt);
        const messages = isChat ? this.messages : [];
        messages.push(promptMessage);
        // Create abort controller for this request
        const abortController = this._createAbortController();
        
        try {
            const client = this.getClient();
            const tools = this._buildTools(functionDispatcher);
            const functionCallingEnabled = this.functionCallingMode !== AIAdapter.FUNCTION_CALLING_NONE;
            const toolExists = Object.keys(tools).length > 0 && functionCallingEnabled;
            const generator = partialTextHandler ? streamText : generateText;
            const modelId = this.getModel('generative');

            // Apply generation config to Vercel AI SDK parameters
            const generationParams = this._buildGenerationParams();

            const result = await generator({
                model: client.languageModel(modelId),
                messages: messages,
                ...(toolExists && {tools, toolChoice: this.functionCallingMode}),
                ...generationParams,
                abortSignal: abortController.signal,
                onAbort: abortEvent => {
                    console.debug(abortEvent);
                },
                stopWhen: stepCountIs(5),
                onStepFinish: step => {
                    this.setLastResponseText(step.text);
                    if (typeof responseTextHandler === 'function') {
                        responseTextHandler(step.text);
                    }
                },
                ...('responseSchema' in this.generationConfig) && {
                    experimental_output: Output.object({schema: jsonSchema(this.generationConfig.responseSchema)})
                },
                headers: {
                    ...(this.getApiType() === 'Anthropic' && {'anthropic-dangerous-direct-browser-access': 'true'})
                }
            });

            if (partialTextHandler) {
                for await (const textPart of result.textStream) {
                    this.setLastPartialText(textPart);
                    partialTextHandler(textPart);
                }
            }

            this.setLastResult(result);
            if (isChat) {
                const response = await result.response;
                this.messages.push(...response.messages);
            }
            return result;
        } catch (error) {
            this.setLastResult(error);
            throw error;
        } finally {
            // Remove the abort controller from the array when request is finished
            this._removeAbortController(abortController);
        }
    }

    /**
     * Get chat history.
     * @returns {Array.<string>} - chat history
     */
    getChatHistory () {
        return this.messages;
    }

    /**
     * Set chat history.
     * @param {Array.<string>} history - history of chat
     * @returns {void}
     */
    startChat (history) {
        this.messages = history || [];
    }

    /**
     * Request embedding of content.
     * @param {Array.<string> | string} contentParts - content to AI
     * @returns {Promise<number[]>} - a Promise that resolves to embedding vector
     */
    async requestEmbedding (contentParts) {
        
        if (!contentParts || !contentParts.length) {
            return [];
        }
        
        if (typeof contentParts === 'string') {
            contentParts = [contentParts];
        }

        const text = contentParts.reduce((acc, p) => {
            if (typeof p === 'string') {
                return acc + p;
            }
            if (p.type === 'text') {
                return acc + p.data;
            }
            return acc;
        }, '');

        const modelId = this.getModel('embedding');

        // Create abort controller for this request
        const abortController = this._createAbortController();

        try {
            const client = this.getClient();
            
            const {embedding} = await embed({
                model: client.textEmbeddingModel(modelId),
                value: text,
                abortSignal: abortController.signal
            });
            return embedding;
        } catch (error) {
            if (error.name === 'AI_APICallError') {
                throw new Error(`API call error: ${error.responseBody} URL: ${error.url}`);
            }
            throw error;
        } finally {
            // Remove the abort controller from the array when request is finished
            this._removeAbortController(abortController);
        }
    }

    /**
     * Get model code for specific model type.
     * @param {string} supportedType - type of model ('generative' | 'embedding')
     * @returns {string} - model code
     */
    getModel (supportedType = 'generative') {
        if (this.modelID) {
            return this.modelID;
        }
        return PROVIDERS[this.getApiType()].defaultModels[supportedType];
    }

    /**
     * Set and validate model code for specific model type.
     * @param {string} modelID - model code to set
     * @param {string} modelType - type of model ('generative' | 'embedding')
     * @returns {Promise<string>} A promise that resolves to success message or error message
     */
    setModel (modelID) {
        if (!modelID || !modelID.trim()) {
            return Promise.resolve('Model ID is empty');
        }
        this.modelID = modelID;
        return Promise.resolve(`Model "${modelID}" set successfully`);
    }

    /**
     * Abort all ongoing requests for this adapter.
     * This will cancel all in-flight requests.
     * @param {string} reason - reason for aborting requests
     * @returns {void}
     */
    abortRequests (reason) {
        this.abortControllers.forEach(controller => {
            if (controller) {
                controller.abort(reason);
            }
        });
        this.abortControllers = [];
    }

    /**
     * Create a new abort controller for requests.
     * @returns {AbortController} - new abort controller
     * @private
     */
    _createAbortController () {
        // Create new abort controller without aborting existing requests
        const abortController = new AbortController();
        
        // Add to the list of controllers
        this.abortControllers.push(abortController);
        
        // Clean up completed controllers (optional optimization)
        this.abortControllers = this.abortControllers.filter(controller =>
            controller && !controller.signal.aborted
        );
        
        return abortController;
    }

    /**
     * Remove a specific abort controller from the array.
     * @param {AbortController} abortController - controller to remove
     * @returns {void}
     * @private
     */
    _removeAbortController (abortController) {
        const index = this.abortControllers.indexOf(abortController);
        if (index !== -1) {
            this.abortControllers.splice(index, 1);
        }
    }
}

export default AIAdapter;
