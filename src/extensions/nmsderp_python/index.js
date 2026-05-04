const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

class PythonExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.serverEndpoint = 'https://python-output.snail-ide-repl.repl.co/'; // Set your Repl.it app URL here
    }

    getInfo() {
        return {
            id: 'pythonExtension',
            name: 'Python Extension',
            color1: '#2E8B57',
            blocks: [
                {
                    opcode: 'setServerEndpoint',
                    text: 'Set Server Endpoint to [ENDPOINT]',
                    arguments: {
                        ENDPOINT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://python-output.snail-ide-repl.repl.co/'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'runPythonCode',
                    text: 'Run Python code: [CODE]',
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'print("Hello, Snail IDE")'
                        }
                    },
                    blockType: BlockType.COMMAND
                }
            ]
        };
    }

    setServerEndpoint(args) {
        this.serverEndpoint = Cast.toString(args.ENDPOINT);
    }

    async runPythonCode(args) {
        if (!this.serverEndpoint) {
            console.error('Server endpoint not set. Use the "Set Server Endpoint" block.');
            return;
        }

        const pythonCode = Cast.toString(args.CODE);

        try {
            const response = await fetch(`${this.serverEndpoint}/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: pythonCode }),
            });

            if (!response.ok) {
                throw new Error('Failed to execute Python code.');
            }

            const result = await response.json();
            // Handle the result as needed, for example, update a Scratch variable.
            console.log('Python Execution Result:', result);
        } catch (error) {
            console.error('Error executing Python code:', error.message);
        }
    }
}

module.exports = PythonExtension;
