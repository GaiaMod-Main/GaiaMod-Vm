const formatMessage = require("format-message");
const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");

class LuaExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.lastOutput = '';
        if (!window.FengariLoaded) {
            const script = document.createElement("script");
            script.src = "https://unpkg.com/fengari-web/dist/fengari-web.js";
            script.onload = () => { window.FengariLoaded = true; };
            document.head.appendChild(script);
        }
    }
    getInfo() {
        return {
            id: 'lua',
            name: formatMessage({ default: 'Lua' }),
            isDynamic: true,
            blocks: [
                { opcode: 'unsandbox', text: 'Run Unsandboxed', blockType: BlockType.BUTTON, hideFromPalette: this.runningEditorUnsandboxed },
                { opcode: 'sandbox', text: 'Run Sandboxed', blockType: BlockType.BUTTON, hideFromPalette: !this.runningEditorUnsandboxed },
                { opcode: 'luaHat', text: 'when lua [CODE] == true', blockType: BlockType.HAT, hideFromPalette: !this.runningEditorUnsandboxed, arguments: { CODE: { type: ArgumentType.STRING, defaultValue: "return true" } } },
                { opcode: 'luaStack', text: 'lua [CODE]', blockType: BlockType.COMMAND, arguments: { CODE: { type: ArgumentType.STRING, defaultValue: "print('Hello')" } } },
                { opcode: 'luaString', text: 'lua [CODE]', blockType: BlockType.REPORTER, disableMonitor: true, arguments: { CODE: { type: ArgumentType.STRING, defaultValue: "return 'text'" } } },
                { opcode: 'luaBool', text: 'lua [CODE]', blockType: BlockType.BOOLEAN, disableMonitor: true, arguments: { CODE: { type: ArgumentType.STRING, defaultValue: "return math.random() > 0.5" } } }
            ]
        };
    }
    async unsandbox() {
        const can = await this.runtime.vm.securityManager.canUnsandbox('Lua');
        if (!can) return;
        this.runningEditorUnsandboxed = true;
        this.runtime.vm.emitWorkspaceUpdate();
    }
    sandbox() {
        this.runningEditorUnsandboxed = false;
        this.runtime.vm.emitWorkspaceUpdate();
    }
    _runLua(code) {
        if (!window.FengariLoaded || !fengari) return Promise.resolve("Fengari not loaded");
        return new Promise(resolve => {
            const L = fengari.lauxlib.luaL_newstate();
            fengari.lualib.luaL_openlibs(L);
            const output = [];
            const orig = console.log;
            console.log = (...m) => output.push(m.join(' '));
            const wrapped = `local old_print=print;print=function(...)
 js.global:console_log(table.concat({...}," "));end
 ${code}`;
            fengari.lauxlib.luaL_dostring(L, fengari.to_luastring(wrapped));
            console.log = orig;
            resolve(output.join("\n")||"");
        });
    }
    luaStack(args) {
        const code = args.CODE;
        this._runLua(code);
    }
    luaString(args) {
        const code = args.CODE;
        return this._runLua(code);
    }
    luaBool(args) {
        return this._runLua(args.CODE).then(res => Boolean(res));
    }
    luaHat(args) {
        if (!this.runningEditorUnsandboxed) return false;
        return this.luaBool(args);
    }
}

module.exports = LuaExtension;
