class WebSocketClient {
    constructor (host, port, ssl) {
        this.host = host;
        this.port = port;
        this.ssl = ssl;
        this.blockInfo = {};
        this.position = {};
        this.isLogChanged = false;
        this.result = '';
        this.eventChanged = {};
        this.eventData = {};
        this.ws = null;

        this.messageQueue = [];
        this.isSending = false;
        this.marks = {};            
    }

    isConnected () {
        return this.connected;
    }

    connect (player, entity) {
        // 接続済みの場合は再利用する
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'connect',
                data: {
                    player: player,
                    entity: entity,
                }
            }));
            return Promise.resolve();
        }

        this.player_id = player;
        this.entity_id = entity;
        this.connected = false;
        
 
        return new Promise((resolve, reject) => {
            let scheme = this.ssl? 'wss://' : 'ws://';
            let serverAddr = scheme + this.host + ':'+this.port+'/ws';
            //this.ws = new WebSocket('wss://os3-316-47519.vs.sakura.ne.jp:25570/ws');
            //this.ws = new WebSocket('ws://localhost:25570/ws');
            this.ws = new WebSocket(serverAddr);

            // websocket.onopen イベントハンドラの登録
            // WebSocketイベントリスナーの登録
            this.ws.addEventListener('open', event => {
                this.ws.send(JSON.stringify({
                    type: 'connect',
                    data: {
                        player: this.player_id,
                        entity: this.entity_id
                    }
                }));
            });

            this.ws.addEventListener('message', event => {
                const json = JSON.parse(event.data);
                if (json.type === 'error') {
                    reject(event);
                } else if (json.type === 'connected') {
                    this.connected = true;
                    this.entityUuid = json.data;
                    resolve(event.data);
                } else if (json.type === 'event') {
                    const data = JSON.parse(json.data);
                    console.log('event data=', data)
                    if(data.data.entityUuid == this.entityUuid) {
                        if(data.name == 'onCustomEvent'){
                            this.eventChanged[data.data.message] = true;
                            this.eventData[data.data.message] = "";    
                        }
                        else if(data.name == 'onInteractEvent') {
                            console.log('data', data)
                            console.log('event', data.data.event)
                            const dataEvent = data.data.event;
                            this.eventChanged[dataEvent.event] = true;
                            this.eventData['onInteractEvent'] = dataEvent;
                        }
                        else{
                            this.eventChanged[data.name] = true;
                            this.eventData[data.name] = data.data;    
                        }
                    }
                }
            });

            this.ws.addEventListener('close', () => {
                //this.reconnect(player, entity);
            });

            this.ws.addEventListener('error', event => {
                console.error('WebSocket error:', event);
                reject(event);
            });
        });
    }

    close () {
        if (this.ws !== null && this.ws !== undefined && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'disconnect'
            }));
            this.ws.close();
        }
    }

    send(json) {
        return new Promise((resolve, reject) => {
            // キューが5個以上スタックしていたらキャンセルする
            if (this.messageQueue.length >= 5) {
                reject(new Error("Message queue is full, canceling request."));
                return;
            }

            // メッセージとそれに対応するresolveとrejectの関数をキューに追加
            this.messageQueue.push({
                message: json,
                resolve: resolve,
                reject: reject
            });

            // 送信がまだ行われていない場合は送信を開始
            if (!this.isSending) {
                this.sendNextMessage();
            }
        });
    }

    sendNextMessage (json) {
        if (this.messageQueue.length === 0) {
            // 送信するメッセージがなければ送信フラグを下ろす
            this.isSending = false;
            return;
        }

        // 送信フラグを立てる
        this.isSending = true;

        // キューから次のメッセージを取り出す
        const {message, resolve, reject} = this.messageQueue.shift();


        if (this.ws != null && this.ws.readyState !== WebSocket.OPEN) {
            this.connect(this.player_id, this.entity_id)
        }

        this.ws.onmessage = event => {
            // サーバーからの応答を受け取ったら、この関数が呼ばれる
            // 応答結果を引数にresolve()を呼び出し、Promiseを解決する
            resolve(event.data);

            // このメッセージの送信が完了したら次のメッセージを送信
            this.sendNextMessage();
        };

        this.ws.onerror = error => {
            reject(error);

            // エラーが発生しても次のメッセージを送信
            this.sendNextMessage();
        };

        this.ws.send(JSON.stringify(message));
    }
}

module.exports = WebSocketClient;
