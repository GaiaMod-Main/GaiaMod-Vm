const formatMessage = require("format-message");
const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");

class LuaExecutorExtension {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * Stores the output from the last Lua execution
         * @type {string}
         */
        this.lastOutput = '';

        /**
         * Load Fengari if not already loaded
         */
        if (!window.FengariLoaded) {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/fengari-web/dist/fengari-web.js";
            script.onload = () => {
                window.FengariLoaded = true;
            };
            document.head.appendChild(script);
        }
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: "luaexecutor",
            name: formatMessage({
                id: "luaexecutor.name",
                default: "Lua",
                description: "Run your own Lua code and retrieve output"
            }),
            color1: '#2644DA',
            color2: '#2644DA',
            blocks: [
                {
                    opcode: "setCode",
                    text: formatMessage({
                        id: "luaexecutor.setCode",
                        default: "Set Lua Code to [CODE]",
                        description: "Set Lua code to be executed"
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "luaexecutor.codeDefault",
                                default: "return 1 + 1",
                                description: "Default Lua code"
                            })
                        }
                    }
                },
                {
                    opcode: "executeCode",
                    text: formatMessage({
                        id: "luaexecutor.executeCode",
                        default: "Execute Lua Code",
                        description: "Execute the stored Lua code"
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "getResult",
                    text: formatMessage({
                        id: "luaexecutor.getResult",
                        default: "Get Lua Output",
                        description: "Get the result of the Lua execution"
                    }),
                    blockType: BlockType.REPORTER
                }
            ]
        };
    }

    setCode(args) {
        this.luaCode = args.CODE;
    }

    executeCode() {
        if (!window.FengariLoaded || typeof fengari === "undefined") {
            this.lastOutput = "Fengari is not loaded yet.";
            return;
        }

        try {
            const luaState = fengari.lauxlib.luaL_newstate();
            fengari.lualib.luaL_openlibs(luaState);

            const output = [];
            const originalConsoleLog = console.log;
            console.log = (...args) => output.push(args.join(" "));

            fengari.lauxlib.luaL_dostring(luaState, fengari.to_luastring(`
                local print = function(...) 
                    js.global:console_log(table.concat({...}, " ")) 
                end
                ${this.luaCode || ""}
            `));

            console.log = originalConsoleLog;
            this.lastOutput = output.join("\n") || "Executed successfully with no output.";
        } catch (error) {
            this.lastOutput = "Lua Error: " + error.message;
        }
    }

    getResult() {
        return this.lastOutput;
    }
}

module.exports = LuaExecutorExtension;
