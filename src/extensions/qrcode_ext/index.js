const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

class QRCodeBlock {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            opcode: 'generateQRCode',
            blockType: BlockType.REPORTER,
            text: formatMessage({
                id: 'qrcodeblock.generateQRCode',
                default: 'generate QR code from text',
                description: 'QR code block label',
            }),
            arguments: {
                text: {
                    type: ArgumentType.STRING,
                    defaultValue: 'Hello, Scratch!',
                },
            },
            color1: '#003366', // Dark Blue color
        };
    }

    generateQRCode(args) {
        const textToEncode = args.text;
        const apiUrl = `https://api.qr-code-generator.com/v1/create?text=${encodeURIComponent(textToEncode)}`;

        // Fetch the QR code from the API
        fetch(apiUrl)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Provide the data URL as the result
                    this.runtime.returnValue(reader.result);
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.error('Error generating QR code:', error);
                this.runtime.returnValue(null);
            });
    }
}

Scratch.extensions.register(new QRCodeBlock());
