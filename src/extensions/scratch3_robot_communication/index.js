const { name } = require('file-loader');
const BlockType = require('../../extension-support/block-type');


class RobotcommunicationBlocks {

    static get EXTENSION_ID () {
        return 'Communication';
    };

    constructor (runtime) {
        this.runtime = runtime;
    };

    getInfo () {
        return {
            id: RobotcommunicationBlocks.EXTENSION_ID,
            name: 'Communication',
            blocks: [
                {
                    opcode: 'event_whenbroadcastreceived',
                    blockType: BlockType.HAT,
                    isEdgeActivated: false,
                    arguments: {
                        //
                    }
                },
                {
                    opcode: 'event_broadcast',
                    arguments: [
                        {
                            type: 'input',
                            inputOp: 'dropdown_broadcast',
                            inputName: 'CHOICE',
                            variableType: 'broadcast_msg'
                        }
                    ]
                }
            ]
        };
    };

    event_whenbroadcastreceived(args, util) {
        return true;
    };

    event_broadcast(args, util) {
        util.runtime.startHats('Communication_event_whenbroadcastreceived', {CHOICE: args.CHOICE});
    };
};

module.exports = RobotcommunicationBlocks;
