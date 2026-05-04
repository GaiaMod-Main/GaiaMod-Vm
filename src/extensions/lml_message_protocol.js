function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 
 * @param {*} operation : string
 * @param {*} args : Array
 * @returns Promise
 */
export function lmlRequest(operation, args) {
    let message_id = uuidv4();

    return new Promise((resolve, reject) => {
        let bc_request = new BroadcastChannel('channel-request');
        let bc_response = new BroadcastChannel('channel-response');
        bc_request.postMessage({
            message_id: message_id,
            operation: operation,
            args: args
        });
        bc_request.close();
        bc_response.addEventListener('message', ev => {
            if (ev.data.message_id != message_id) resolve("NONE");
            resolve(ev.data.result);
            bc_response.close();
        })
    });
}



