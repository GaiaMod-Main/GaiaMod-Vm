const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

const Swal = require('sweetalert2');

// eslint-disable-next-line max-len
const iconURI = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNTEuNjIzMDMiIGhlaWdodD0iMTQ3LjAxNDUxIiB2aWV3Qm94PSIwLDAsMTUxLjYyMzAzLDE0Ny4wMTQ1MSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI0Ni4xODg0NywtMTA5LjI0Mjc0KSI+PGcgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PGc+PHBhdGggZD0iTTM3MC40MzMyNywyNTQuMTAwNTZjLTEwLjMxOTQ4LDcuNjYxMSAtNDUuNzQ4MDIsLTIzLjM4OTMzIC00NS43NDgwMiwtMjMuMzg5MzNjMCwwIC0zNC43MDIxLDMxLjg1MzA3IC00NS4xNjgyMSwyNC40MjIyNGMtMTAuNDY1NDIsLTcuNDMxMDIgOC4wOTg5LC01MC42OTgwOCA4LjA5ODksLTUwLjY5ODA4YzAsMCAtNDAuOTkxODUsLTIzLjE5NDA3IC0zNy4xNzY3OSwtMzUuNDI5MzJjMy44MzExNCwtMTIuMjU0ODYgNTAuNzE3NDksLTcuOTU2NyA1MC43MTc0OSwtNy45NTY3YzAsMCA5LjM2Mjc4LC00Ni4xNjk1NCAyMi4yMTYwOCwtNDYuMzA2MjVjMTIuODM1MDcsLTAuMTUyOSAyMy4yMjQyOCw0NS43ODMyMiAyMy4yMjQyOCw0NS43ODMyMmMwLDAgNDYuODE3MTEsLTUuMzU5MDMgNTAuOTE3NTYsNi44MDI0N2M0LjEzNzIzLDEyLjE3NTMzIC0zNi4zMjY0LDM2LjI2NDIyIC0zNi4zMjY0LDM2LjI2NDIyYzAsMCAxOS41MzA4Myw0Mi44NDk4NSA5LjI0NTE5LDUwLjUwNzYyeiIgZmlsbD0iIzdhODVlOSIvPjxwYXRoIGQ9Ik0zNjYuNDMzMjcsMjQ4LjYwMDU2Yy0xMC4zMTk0OCw3LjY2MTEgLTQ1Ljc0ODAyLC0yMy4zODkzMyAtNDUuNzQ4MDIsLTIzLjM4OTMzYzAsMCAtMzQuNzAyMSwzMS44NTMwNyAtNDUuMTY4MjEsMjQuNDIyMjRjLTEwLjQ2NTQyLC03LjQzMTAyIDguMDk4OSwtNTAuNjk4MDggOC4wOTg5LC01MC42OTgwOGMwLDAgLTQwLjk5MTg1LC0yMy4xOTQwNyAtMzcuMTc2NzksLTM1LjQyOTMyYzMuODMxMTQsLTEyLjI1NDg2IDUwLjcxNzQ5LC03Ljk1NjcgNTAuNzE3NDksLTcuOTU2N2MwLDAgOS4zNjI3OCwtNDYuMTY5NTQgMjIuMjE2MDgsLTQ2LjMwNjI1YzEyLjgzNTA3LC0wLjE1MjkgMjMuMjI0MjgsNDUuNzgzMjIgMjMuMjI0MjgsNDUuNzgzMjJjMCwwIDQ2LjgxNzExLC01LjM1OTAzIDUwLjkxNzU2LDYuODAyNDdjNC4xMzcyMywxMi4xNzUzMyAtMzYuMzI2NCwzNi4yNjQyMiAtMzYuMzI2NCwzNi4yNjQyMmMwLDAgMTkuNTMwODMsNDIuODQ5ODUgOS4yNDUxOSw1MC41MDc2MnoiIGZpbGw9IiNhNWFlZmYiLz48L2c+PC9nPjwvZz48L3N2Zz4=`;

/**
 */
class WonderBlocks {
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
            id: 'wonderblocks',
            name: 'WonderBlocks',
            color1: '#4c64ff',
            color2: '#4643e6',
            color3: '#3c3ac7',
            menuIconURI: iconURI,
            blockIconURI: iconURI,
            blocks: [
			{
            opcode: 'isGaiaMod',
            blockType: BlockType.BOOLEAN,
            text: 'Is GaiaMod?',
			disableMonitor: true,
            },
			{
            opcode: 'removeUnusedExtensions',
            blockType: BlockType.COMMAND,
            text: 'Remove all unused extensions',
          },
                          {
            opcode: "fetch",
            blockType: BlockType.REPORTER,
            // eslint-disable-next-line extension/should-translate
            text: "capture [URL]",
            arguments: {
              URL: {
                type: ArgumentType.STRING,
                defaultValue: "http://example.org/",
              },
              },
             },
			 {
                    opcode: 'skibidi',
                    blockType: BlockType.COMMAND,
                    text: 'Did you like Skibidi Toilet?',
                },
                 {
                    opcode: 'showAlert',
                    text: 'show [ALERT_TYPE] with the icon [ICON], the title [TITLE], and the text [TEXT]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ALERT_TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'ALERT_TYPE_MENU'
                        },
                        TITLE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'It\'s great!'
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Yay!'
                        },
                        ICON: {
                            type: ArgumentType.STRING,
                            defaultValue: 'success',
                            menu: 'ICON_MENU'
                        }
                    }
                },
                 {
                    opcode: 'changeTheme',
                    text: 'change theme color: [COLOR]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR_MENU'
                        }
                    }
                },
				
            ],
			 menus: {
                ALERT_TYPE_MENU: {
                    items: ['alert', 'toast']
                },
                ICON_MENU: {
                    acceptReporters: true,
                    items: ['none', 'success', 'error', 'warning', 'info', 'question']
                },
				COLOR_MENU: {
                    acceptReporters: true,
                    items: ['Gaia Blue', 'Red', 'Blue', 'Light Blue', 'Lime Green', 'Scratch', 'Magenta', 'Serene Blue', 'Pink', 'Gray Purple', 'Gold', 'Silver', 'Black', 'Nebula', 'Cosmic', 'Mint', 'Cherry', 'Aurora', 'Rainbow', 'Corrupted Blue', 'Partytime', 'NIGHTMARE']
                }
            }
        };
    }

    isGaiaMod() {
  return 'true';
    }

async removeUnusedExtensions() {
      vm.extensionManager.removeUnusedExtensions();
    }
	
 fetch(args) {
      return fetch(args.URL)
        .then((r) => r.text())
        .catch(() => "");
    }
	
 skibidi() {
        Swal.fire({
            title: '!!!???',
            text: 'What on Earth is Skibidi Toilet!?',
            icon: 'info'
        });
    }
	
	showAlert (args) {
        Swal.fire({
            toast: args.ALERT_TYPE === 'toast',
            titleText: args.TITLE,
            text: args.TEXT,
            icon: args.ICON === 'none' ? null : args.ICON,
            position: args.ALERT_TYPE === 'toast' ? 'top-end' : 'center',
            showConfirmButton: args.ALERT_TYPE !== 'toast',
            timer: args.ALERT_TYPE === 'toast' ? 2500 : null,
            timerProgressBar: args.ALERT_TYPE === 'toast'
        });
    }
	
	changeTheme (args) {
        document.body.setAttribute("coloraccent", args.COLOR);
    }
}

module.exports = WonderBlocks;
