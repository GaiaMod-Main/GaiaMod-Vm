const { Client } = require('discord-rpc');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');

/**
 * Class for Discord RPC extension blocks
 * @constructor
 */
class DiscordRPC {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.client = new Client({ transport: 'ipc' });
        this.applicationID = 1226598637086310431; // Default application ID (Client ID)
        this.buttons = [];
        this.largeimagekey = 'main'; // Default value for large image key
        this.smallimagekey = 'logo'; // Default value for small image key
        this.smallimagetext = 'Powered by ElectraMod'; // Default value for small image text
        this.largeimagetext = 'Discord RPC Example in Scratch'; // Default value for large image text
        this.details = 'ElectraMod is a mod of PenguinMod which is a mod of Turbowarp which is a mod of Scratch';
        this.state = 'This is a test';
        this.enabled = true;
    
        // Utilisation de this.applicationID au lieu de applicationID
        this.client.login({ clientId: this.applicationID }).catch(console.error);
        this.client.once('ready', () => {
            console.log(`Logged in as ${this.client.user.username}!`);
            if (this.applicationID && this.enabled) {
                this.updatePresence();
            }
        });
    }
    

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'emdiscordrpc',
            name: 'Discord RPC',
            color1: '#6B74F5',
            color2: '#3D46C2',
            color3: '#3D46C2',
            blocks: [
                {
                    opcode: 'setApplicationID',
                    text: 'set application id [ID]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1226598637086310431
                        }
                    }
                },
                {
                    opcode: 'getApplicationID',
                    text: 'application id',
                    blockType: BlockType.REPORTER,
                    returnType: ArgumentType.NUMBER
                },               
                {
                    opcode: 'setDetails',
                    text: 'set details [DETAILS]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DETAILS: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Your Details Here'
                        }
                    }
                },
                {
                    opcode: 'getDetails',
                    text: 'details',
                    blockType: BlockType.REPORTER,
                    returnType: ArgumentType.STRING
                },
                {
                    opcode: 'setStates',
                    text: 'set states [STATE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Your State Here'
                        }
                    }
                },
                {
                    opcode: 'getStates',
                    text: 'states',
                    blockType: BlockType.REPORTER,
                    returnType: ArgumentType.STRING
                },
                {
                    opcode: 'setLargeImage',
                    text: 'set large image [KEY] [TEXT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'large_image_key'
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Large Image Text'
                        }
                    }
                },
                {
                    opcode: 'getLargeImageKey',
                    text: 'large image key',
                    blockType: BlockType.REPORTER,
                    returnType: ArgumentType.STRING
                },
                {
                    opcode: 'getLargeImageText',
                    text: 'large image text',
                    blockType: BlockType.REPORTER,
                    returnType: ArgumentType.STRING
                },
                {
                    opcode: 'setSmallImage',
                    text: 'set small image [KEY] [TEXT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'small_image_key'
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Small Image Text'
                        }
                    }
                },
                {
                    opcode: 'getSmallImageKey',
                    text: 'small image key',
                    blockType: BlockType.REPORTER,
                    returnType: ArgumentType.STRING
                },
                {
                    opcode: 'getSmallImageText',
                    text: 'small image text',
                    blockType: BlockType.REPORTER,
                    returnType: ArgumentType.STRING
                },
                {
                    opcode: 'setButtonDetails',
                    text: '[SET_OPTION] label1:[LABEL1] link1:[LINK1] label2:[LABEL2] link2:[LINK2]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SET_OPTION: {
                            type: ArgumentType.STRING,
                            menu: 'set_options',
                            defaultValue: 'set only one button'
                        },
                        LABEL1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'label1'
                        },
                        LINK1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://link1'
                        },
                        LABEL2: {
                            type: ArgumentType.STRING,
                            defaultValue: 'label2'
                        },
                        LINK2: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://link2'
                        }
                    }
                }
            ],
            menus: {
                set_options: ['set only one button', 'set two buttons', "don't set button"],
                button_value: ['button1', 'button2'],
                value_type: ['label', 'link']
            }
        };
    }

    setApplicationID(args) {
        this.applicationID = args.ID;
        console.log(`Application ID set to: ${this.applicationID}`);
        if (this.client.readyAt && this.enabled) {
            this.updatePresence();
        }
        // Se reconnecter avec le nouvel ID de l'application Discord
        this.client.login({ clientId: this.applicationID }).catch(console.error);
    }
    

    setDetails(args) {
        this.details = args.DETAILS;
        if (this.client.readyAt && this.enabled) {
            this.updatePresence();
        }
    }

    getDetails() {
        return this.details || 'Your Details Here';
    }

    setStates(args) {
        this.state = args.STATE;
        if (this.client.readyAt && this.enabled) {
            this.updatePresence();
        }
    }

    getStates() {
        return this.state || 'Your State Here';
    }

    setLargeImage(args) {
        this.largeImageKey = args.KEY;
        this.largeImageText = args.TEXT;
        if (this.client.readyAt && this.enabled) {
            this.updatePresence();
        }
    }

    getLargeImageKey() {
        return this.largeImageKey || 'large_image_key';
    }

    getLargeImageText() {
        return this.largeImageText || 'Large Image Text';
    }

    setSmallImage(args) {
        this.smallImageKey = args.KEY;
        this.smallImageText = args.TEXT;
        if (this.client.readyAt && this.enabled) {
            this.updatePresence();
        }
    }

    getSmallImageKey() {
        return this.smallImageKey || 'small_image_key';
    }

    getSmallImageText() {
        return this.smallImageText || 'Small Image Text';
    }
    getApplicationID() {
        return this.applicationID;
    }

    setButtonDetails(args) {
        const { SET_OPTION, LABEL1, LINK1, LABEL2, LINK2 } = args;
        this.buttons = [];
        
        if (SET_OPTION === 'set only one button') {
            if (LABEL1 && LINK1) {
                this.buttons.push({ label: LABEL1, url: LINK1 });
            }
        } else if (SET_OPTION === 'set two buttons') {
            if (LABEL1 && LINK1) {
                this.buttons.push({ label: LABEL1, url: LINK1 });
            }
            if (LABEL2 && LINK2) {
                this.buttons.push({ label: LABEL2, url: LINK2 });
            }
        }
        // Si l'option est 'don't set button', aucun bouton n'est ajouté
    
        // Utilisez les détails des boutons (dans le tableau buttons) comme vous le souhaitez
        console.log('Buttons:', this.buttons);
        if (this.client.readyAt && this.enabled) {
            this.updatePresence();
        }
    }
    updatePresence() {
        this.client.setActivity({
            details: this.getDetails(),
            state: this.getStates(),
            startTimestamp: new Date(),
            largeImageKey: this.getLargeImageKey(),
            largeImageText: this.getLargeImageText(),
            smallImageKey: this.getSmallImageKey(),
            smallImageText: this.getSmallImageText(),
            buttons: this.buttons
        });
    }
    
}

module.exports = DiscordRPC;
