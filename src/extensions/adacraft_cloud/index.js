const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const supabase = require('@supabase/supabase-js');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmNmUwNWU7fS5jbHMtM3tmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iQWRhY3JhZnRfcnVudGltZSIgZGF0YS1uYW1lPSJBZGFjcmFmdCBydW50aW1lIj48ZyBpZD0ibG9nb19BZGFjcmFmdCIgZGF0YS1uYW1lPSJsb2dvIEFkYWNyYWZ0Ij48Y2lyY2xlIGNsYXNzPSJjbHMtMiIgY3g9IjEzLjUiIGN5PSIxMi40MiIgcj0iNi45MSIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE1LDkuNzlsMS40NiwzLjQ4cy42LDIuMTgtMS41NSwybC0zLjctLjUyYTEuNCwxLjQsMCwwLDEtLjg4LTIuNGwyLjM1LTNBMS4zNiwxLjM2LDAsMCwxLDE1LDkuNzZaIi8+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMy41LDUuNTFhNi45Miw2LjkyLDAsMSwwLDYuOTEsNi45MUE2LjkxLDYuOTEsMCwwLDAsMTMuNSw1LjUxWk0xNSwxNS4zbC0zLjctLjUyYTEuNCwxLjQsMCwwLDEtLjg4LTIuNGwyLjM1LTNBMS4zNiwxLjM2LDAsMCwxLDE1LDkuNzZ2MGwxLjQ2LDMuNDhTMTcuMSwxNS40NSwxNSwxNS4zWiIvPjwvZz48L2c+PC9zdmc+';

const runtime = vm.runtime;

class Scratch3AdaCloudBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.connectToServer({URL: "https://ojpnrfomcjvmsdetfahv.supabase.co", KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qcG5yZm9tY2p2bXNkZXRmYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzE5NzAsImV4cCI6MjA2NTY0Nzk3MH0.6o7rV2lcej7edCBnUXPq0sfbUdD0JpOBt-6pD5eSF3Q"})

    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'adacloud',
            name: 'adacraft cloud',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            docsURI: 'https://www.adacraft.org/docs/extensions/adacloud/',
            color1: '#059669',
            blocks: [
                {
                    opcode: 'connectToServer',
                    blockType: BlockType.COMMAND,
                    text: "connect to server [URL] using key [KEY]",
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: "https://ojpnrfomcjvmsdetfahv.supabase.co",
                        },
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qcG5yZm9tY2p2bXNkZXRmYWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNzE5NzAsImV4cCI6MjA2NTY0Nzk3MH0.6o7rV2lcej7edCBnUXPq0sfbUdD0JpOBt-6pD5eSF3Q",
                        }
                    },
                    hideFromPalette: true,
                },
                {
                    opcode: 'signIn',
                    blockType: BlockType.COMMAND,
                    text: "sign in",
                    hideFromPalette: true,
                },
                {
                    opcode: 'signOut',
                    blockType: BlockType.COMMAND,
                    text: "sign out",
                    hideFromPalette: true,
                },
                {
                    opcode: 'checkConnection',
                    blockType: BlockType.BOOLEAN,
                    text: "is user [MENU]",
                    arguments: {
                        MENU: {
                            type: ArgumentType.MENU,
                            menu: 'connection'
                        },
                    },
                    hideFromPalette: true,
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Cloud variables",
                    hideFromPalette: true,
                },
                {
                    opcode: 'setVarToValue',
                    blockType: BlockType.COMMAND,
                    text: "set [VAR] to [VALUE]",
                    arguments: {
                        VAR: {
                            type: ArgumentType.STRING,
                            defaultValue: "foo",
                        },
                        VALUE: {
                            type: ArgumentType.STRING,
                            defaultValue: "bar",
                        }
                    },
                    hideFromPalette: true,
                },
                {
                    opcode: 'getVarValue',
                    blockType: BlockType.REPORTER,
                    text: "value of [VAR]",
                    arguments: {
                        VAR: {
                            type: ArgumentType.STRING,
                            defaultValue: "foo",
                        },
                    },
                    hideFromPalette: true,
                },
                {
                    opcode: 'removeVar',
                    blockType: BlockType.COMMAND,
                    text: "remove [VAR]",
                    arguments: {
                        VAR: {
                            type: ArgumentType.STRING,
                            defaultValue: "foo",
                        },
                    },
                    hideFromPalette: true,
                },
                '---',
                {
                    opcode: 'whenDataUpdated',
                    text: "when any variable is updated",
                    blockType: BlockType.EVENT,
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: true,
                    hideFromPalette: true,
                },
                {
                    opcode: 'whenVarUpdated',
                    text: "when [TEXT] is updated",
                    blockType: BlockType.EVENT,
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: true,
                    arguments: {
                        TEXT: { // do NOT change the name of the argument, for an unknown reason it doesn't work with any other value
                            type: ArgumentType.STRING,
                            defaultValue: "foo",
                        },
                    },
                    hideFromPalette: true,
                },
                '---',
                {
                    blockType: BlockType.LABEL,
                    text: "Cloud messages",
                },
                {
                    opcode: 'connectToChannel',
                    blockType: BlockType.COMMAND,
                    text: "join channel [ROOM]",
                    arguments: {
                        ROOM: {
                            type: ArgumentType.STRING,
                            defaultValue: "my room",
                        },
                    }
                },
                {
                    opcode: 'getChannelName',
                    blockType: BlockType.REPORTER,
                    text: "current channel name",
                },
                '---',
                {
                    opcode: 'sendMessage',
                    blockType: BlockType.COMMAND,
                    text: "send message [NAME]",
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello",
                        },
                    }
                },
                {
                    opcode: 'sendMessageContent',
                    blockType: BlockType.COMMAND,
                    text: "send message [NAME] with content [DATA]",
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello",
                        },
                        DATA: {
                            type: ArgumentType.STRING,
                            defaultValue: "world",
                        },
                    }
                },
                {
                    opcode: 'whenReceiveMessage',
                    blockType: BlockType.EVENT,
                    text: "when a message is received",
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: true,
                },
                {
                    opcode: 'whenReceiveMessageName',
                    blockType: BlockType.EVENT,
                    text: "when message [TEXT] is received",
                    isEdgeActivated: false,
                    shouldRestartExistingThreads: true,
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello",
                        },
                    }
                },
                {
                    opcode: 'getLastMessageName',
                    blockType: BlockType.REPORTER,
                    text: "last message name",
                },
                {
                    opcode: 'getLastMessageData',
                    blockType: BlockType.REPORTER,
                    text: "last message content",
                },
                '---',
                {
                    blockType: BlockType.LABEL,
                    text: "Errors",
                },
                {
                    opcode: 'checkStatus',
                    blockType: BlockType.BOOLEAN,
                    text: "error occured",
                },
                {
                    opcode: 'checkLastError',
                    blockType: BlockType.REPORTER,
                    text: "last error [TYPE]",
                    arguments: {
                        TYPE: {
                            type: ArgumentType.MENU,
                            menu: 'error'
                        },
                    }
                },
            ],
            menus: {
                error: {
                    items: [
                        {
                            text: 'message',
                            value: 'message'
                        },
                        {
                            text: 'type',
                            value: 'type'
                        }
                    ]
                },
                connection: {
                    items: [
                        {
                            text: 'connected to server',
                            value: 'connected'
                        },
                        {
                            text: 'signed in',
                            value: 'signedIn'
                        },
                        {
                            text: 'in a channel',
                            value: 'inChannel'
                        },
                    ]
                },
            }
        };
    }

    APIStatus = false;
    lastError = {name: '', message: ''};
    lastMessageName = '';
    lastMessageData = '';

    /* Limitations */
    cooldown = 50;
    maxCharacters = 1000;

    connectToServer(args) {
        this.APIStatus = false;
        this.lastError = {};
        this.lastDate = 0;
        try {
            // init supabase
            this.supabase = supabase.createClient(args.URL, args.KEY);

            // init supabase changes listening
            this.channels = this.supabase.channel('custom-all-channel').on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'adacloud_var' },
                (payload) => {
                    runtime.startHats('adacloud_whenDataUpdated');
                    if (payload.new.name) {
                        runtime.startHats('adacloud_whenVarUpdated', {
                            TEXT: payload.new.name
                        });
                    }
                }
            ).subscribe();

            // set up the broadcast channel

        } catch (error) {
            this.lastError = error;
            this.APIStatus = true;
        }
    }

    async signIn() {
        if (this.supabase) {
            this.APIStatus = false;
            this.lastError = {};
            let cred = prompt('cred', '');
            let pass = prompt('pass', '');
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: cred,
                password: pass,
            });
            if (error) {
                this.lastError = error;
                this.APIStatus = true;
            }
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    async signOut() {
        if (this.supabase) {
            this.APIStatus = false;
            this.lastError = {};
            const {error} = await this.supabase.auth.signOut({scope: "local"});
            if (error) {
                this.lastError = error;
                this.APIStatus = true;
            }
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    checkConnection(args) {
        if (args.MENU === 'connected') {
            if (this.supabase) {
                return true
            } else {
                return false
            }
        } else if (this.supabase && args.MENU === 'signedIn') {
            if (localStorage.getItem(this.supabase.auth.storageKey)) {
                return true
            } else {
                return false
            }
        } else if (this.supabase && args.MENU === 'inChannel') {
            if (this.currentChannel) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    async setVarToValue(args) {
        if (this.supabase) {
            this.APIStatus = false;
            this.lastError = {};
            const { data, error } = await this.supabase
                .from('adacloud_var')
                .upsert({value: String(args.VALUE).substring(0, this.maxCharacters), name: String(args.VAR).substring(0, this.maxCharacters)}, { onConflict: ['name'] })
                .select()
            if (error) {
                this.lastError = error;
                if (typeof error.name !== "string") {
                    error.name = 'AccessError';
                }
                this.APIStatus = true;
            }
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    async removeVar(args) {
        if (this.supabase) {
            this.APIStatus = false;
            this.lastError = {};
            /* Warning this request does NOT return an error when the user doesn't have enough rights to do the action */
            const { error } = await this.supabase
                .from('adacloud_var')
                .delete()
                .eq('name', args.VAR)
            if (error) {
                this.lastError = error;
                if (typeof error.name !== "string") {
                    error.name = 'AccessError';
                }
                this.APIStatus = true;
            }
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    async getVarValue(args) {
        if (this.supabase) {
            this.APIStatus = false;
            this.lastError = {};
            let { data: adacloud_var, error } = await this.supabase
                .from('adacloud_var')
                .select("*")
                .eq('name', args.VAR)
            if (adacloud_var.length > 0) {
                return adacloud_var[0].value;
            } else {
                return '';
            }
            if (error) {
                this.lastError = error;
                this.APIStatus = true;
            }
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    checkStatus() {
        return this.APIStatus;
    }

    checkLastError(args) {
        if (args.TYPE === "message" && this.lastError.message) {
            return this.lastError.message;
        } else if (args.TYPE === "type" && this.lastError.name) {
            return this.lastError.name;
        } else {
            return '';
        }
    }

    connectToChannel(args) {
        if (this.supabase) {
            this.APIStatus = false;
            this.lastError = {};
            if (this.currentChannel) {
                this.currentChannel.unsubscribe();
            }
            this.currentChannel = this.supabase.channel(args.ROOM, {
                config: {
                    broadcast: { self: true },
                },
            })
            this.currentChannel.on('broadcast',{ event: '*' }, async (payload) => {
                runtime.startHats('adacloud_whenReceiveMessage');
                runtime.startHats('adacloud_whenReceiveMessageName', {
                    TEXT: payload.event
                });
                this.lastMessageName = payload.event;
                this.lastMessageData = payload.payload.message;
            }).subscribe();
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    getChannelName() {
        if (this.currentChannel) {
            return this.currentChannel.subTopic
        } else {
            return ''
        }
    }

    async sendMessage(args, util) {
        if (this.supabase) {
            if (this.currentChannel) {
                if (Number(new Date()) - Number(this.lastDate) > this.cooldown) {
                    this.lastDate = new Date();
                    this.APIStatus = false;
                    this.lastError = {};
                    const resp = await this.currentChannel.send({
                        type: 'broadcast',
                        event: String(args.NAME).substring(0, this.maxCharacters),
                        payload: { message: '' },
                    })
                    if (resp !== "ok") {
                        this.lastError = {name: 'ConnectionError', message: 'The message couldn\' be delivered correctly'};
                        this.APIStatus = true;
                    }
                    await new Promise(resolve => setTimeout(resolve, this.cooldown));
                } else {
                    this.lastError = {name: 'ConnectionError', message: 'Messages are sent too fast'};
                    this.APIStatus = true;
                }
            } else {
                this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a channel first'};
                this.APIStatus = true;
            }
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    async sendMessageContent(args, util) {
        if (this.supabase) {
            if (this.currentChannel) {
                if (Number(new Date()) - Number(this.lastDate) > this.cooldown) {
                    this.lastDate = new Date();
                    this.APIStatus = false;
                    this.lastError = {};
                    const resp = await this.currentChannel.send({
                        type: 'broadcast',
                        event: String(args.NAME).substring(0, this.maxCharacters),
                        payload: { message: String(args.DATA).substring(0, this.maxCharacters) },
                    })
                    if (resp !== "ok") {
                        this.lastError = {name: 'ConnectionError', message: 'The message couldn\' be delivered correctly'};
                        this.APIStatus = true;
                    }
                    await new Promise(resolve => setTimeout(resolve, this.cooldown));
                } else {
                    this.lastError = {name: 'ConnectionError', message: 'Messages are sent too fast'};
                    this.APIStatus = true;
                }
            } else {
                this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a channel first'};
                this.APIStatus = true;
            }
        } else {
            this.lastError = {name: 'ConnectionError', message: 'The user must be connected to a database first'};
            this.APIStatus = true;
        }
    }

    getLastMessageName() {
        return this.lastMessageName;
    }

    getLastMessageData() {
        return this.lastMessageData;
    }
}

function blockInputs() {
    let blocks = Blockly.getMainWorkspace().getAllBlocks();
    blocks.forEach(function(part, index, blockList) {
      let block = blockList[index];
      if (block.type === "adacloud_whenVarUpdated" || block.type === "adacloud_whenReceiveMessageName") {
          block.inputList[0].connection.type = 0;
      }
    })
}
Blockly.getMainWorkspace().addChangeListener(blockInputs)

module.exports = Scratch3AdaCloudBlocks;
