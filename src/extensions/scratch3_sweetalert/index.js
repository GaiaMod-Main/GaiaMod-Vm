//THIS IS A TEST EXTENSION, AND AT NO POINT SHOULD IT BE ADDED TO THE EXTENSION MENU OR THE IMPORT LIST
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const log = require('../../util/log');
const Swal = require('sweetalert2');

class TESTEXTENSION {
    getInfo() {
        return {
            id: 'sweetalert2', // change this if you make an actual extension!
            name: 'Sweet Alert',
            blocks: [
                {
                    opcode: 'testAlert',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'test alert',
                }
            ]
        };
    }
    testAlert() {
        Swal.fire({
            title: 'Hello',
            text: 'This is a SweetAlert2 alert!',
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
}

Scratch.extensions.register(new TESTEXTENSION());
