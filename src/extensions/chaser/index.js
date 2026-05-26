// @ts-check

import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import formatMessage from 'format-message';

/**
 * @typedef {Readonly<{
 *   close: () => void,
 *   send: (command: string) => Promise<string | null>,
 *   isMyturn: boolean,
 *   isClosed: boolean,
 *   onClose: (listener: () => unknown) => void,
 *   offClose: (listener: () => unknown) => void,
 *   onMyturn: (listener: (info: string) => unknown) => void,
 *   offMyturn: (listener: (info: string) => unknown) => void,
 * }>} Session
 */

const createCHaserSession = (() => {
    /**
     * @type {Readonly<{
     *   connect: (host: string, port: number, name: string) => Promise<string | null>,
     *   send: (sessionid: string, command: string) => void,
     *   close: (sessionid: string) => void,
     *   onClose: (listener: (sessionid: string) => unknown) => void,
     *   onMyturn: (listener: (sessionid: string, info: string) => unknown) => void,
     *   onTurnend: (listener: (sessionid: string, info: string) => unknown) => void,
     * }>}
     */
    // @ts-ignore
    const chaserClientPreload = window.chaserClientPreload;

    /** @type {Map<string, [() => void, (info: string) => void, (info: string) => void]>} */
    const sessions = new Map();

    chaserClientPreload.onClose((sessionid) => {
        sessions.get(sessionid)?.[0]();
    });

    chaserClientPreload.onMyturn((sessionid, info) => {
        sessions.get(sessionid)?.[1](info);
    });

    chaserClientPreload.onTurnend((sessionid, info) => {
        sessions.get(sessionid)?.[2](info);
    });

    /**
     * @param {string} host
     * @param {number} port
     * @param {string} name
     * @returns {Promise<Session | null>} 
     */
    return async (host, port, name) => {
        const id = await chaserClientPreload.connect(host, port, name);
        if (id == null) return null;
        /** @type {Set<() => unknown>} */
        const closeListeners = new Set();
        /** @type {Set<(info: string) => unknown>} */
        const turnListeners = new Set();
        /** @type {0|1|2|3} */
        let status = 0;
        /** @type {string | null} */
        let skinfo = null;
        /** @type {((info: string | null) => void) | null} */
        let presolver = null;
        sessions.set(id, [() => {
            sessions.delete(id);
            status = 3;
            presolver?.(null);
            for (const listener of closeListeners) try {
                listener();
            } catch(e) {
                console.error(e);
            }
        }, (info) => {
            if (status === 3) return;
            if (status === 2) {
                skinfo = info;
                return;
            }
            if (status === 1) throw new Error();
            status = 1;
            for (const listener of turnListeners) try {
                listener(info);
            } catch(e) {
                console.error(e);
            }
        }, async (info) => {
            if (status === 3) return;
            if (status !== 2) throw new Error();
            status = 0;
            presolver?.(info);
            if (skinfo) {
                const xinfo = skinfo;
                skinfo = null;
                queueMicrotask(() => {
                    if (status === 3) return;
                    if (status !== 0) throw new Error();
                    status = 1;
                    for (const listener of turnListeners) try {
                        listener(xinfo);
                    } catch(e) {
                        console.error(e);
                    }
                });
            }
        }]);
        return {
            close: () => {
                if (status === 3) return;
                sessions.delete(id);
                status = 3;
                presolver?.(null);
                chaserClientPreload.close(id);
            },
            send: (command) => {
                if (status !== 1) return Promise.resolve(null);
                status = 2;
                chaserClientPreload.send(id, command);
                return new Promise(resolve => {
                    presolver = resolve;
                });
            },
            get isMyturn() { return status === 1; },
            get isClosed() { return status === 3; },
            onClose: (listener) => { closeListeners.add(listener); },
            offClose: (listener) => { closeListeners.delete(listener); },
            onMyturn: (listener) => { turnListeners.add(listener); },
            offMyturn: (listener) => { turnListeners.delete(listener); },
        };
    };
})();

const session = Symbol('CHaser:session');
const stdinfo = Symbol('CHaser:stdinfo');
const superinfo = Symbol('CHaser:superinfo');

/**
 * @typedef {{
 *   [session]?: Session | null,
 *   [stdinfo]?: string | null,
 *   [superinfo]?: string | null,
 * }} Target
 * @typedef {{ target: Target }} Util
 */

/** @param {Target} target */
export const resetSession = (target) => {
    if (target[session]) {
        target[session].close();
        target[session] = null;
        target[stdinfo] = null;
        target[superinfo] = null;
    }
};

export class CHaser {
    getInfo () {
        const i18n = (() => {
            const loc = formatMessage.setup().locale;
            /**
             * @param {string} ja
             * @param {string} hira
             * @returns {string}
             */
            return (ja, hira) => {
                if (loc === 'ja-Hira') return hira;
                return ja;
            };
        })();
        return {
            id: 'chaserp',
            name: 'CHaser',
            docsURI: '',
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: i18n('[HOST]:[PORT]に接続する (名前: [NAME])', '[HOST]:[PORT]にせつぞくする (なまえ: [NAME])'),
                    arguments: {
                        HOST: { type: ArgumentType.STRING, defaultValue: '127.0.0.1' },
                        PORT: { type: ArgumentType.NUMBER, defaultValue: '2009' },
                        NAME: { type: ArgumentType.STRING, defaultValue: 'ゲストさん' },
                    },
                },
                {
                    opcode: 'close',
                    blockType: BlockType.COMMAND,
                    text: i18n('切断する', 'せつだんする'),
                },
                {
                    opcode: 'isconnecting',
                    blockType: BlockType.BOOLEAN,
                    disableMonitor: true,
                    text: i18n('接続されている', 'せつぞくされている'),
                },
                {
                    opcode: 'ismyturn',
                    blockType: BlockType.BOOLEAN,
                    disableMonitor: true,
                    text: i18n('自分のターン', 'じぶんのターン'),
                },
                {
                    opcode: 'walk',
                    blockType: BlockType.COMMAND,
                    text:  i18n('[DIR] に歩く', '[DIR] にあるく'),
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'dir4',
                            defaultValue: 'u',
                        },
                    },
                },
                {
                    opcode: 'put',
                    blockType: BlockType.COMMAND,
                    text: i18n('[DIR] にブロックを置く', '[DIR] にブロックをおく'),
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'dir4',
                            defaultValue: 'u',
                        },
                    },
                },
                {
                    opcode: 'look',
                    blockType: BlockType.COMMAND,
                    text: i18n('[DIR] を見る', '[DIR] をみる'),
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'dir4',
                            defaultValue: 'u',
                        },
                    },
                },
                {
                    opcode: 'search',
                    blockType: BlockType.COMMAND,
                    text: i18n('[DIR] を調べる', '[DIR] をしらべる'),
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'dir4',
                            defaultValue: 'u',
                        },
                    },
                },
                {
                    opcode: 'donothing',
                    blockType: BlockType.COMMAND,
                    text: i18n('何もしない', 'なにもしない'),
                },
                {
                    opcode: 'check',
                    blockType: BlockType.BOOLEAN,
                    text: '[DIR] に [COND]',
                    arguments: {
                        DIR: {
                            type: ArgumentType.STRING,
                            menu: 'dir8',
                            defaultValue: "1",
                        },
                        COND: {
                            type: ArgumentType.STRING,
                            menu: 'cellinfo',
                            defaultValue: "1",
                        },
                    },
                },
                {
                    opcode: 'checkC',
                    blockType: BlockType.BOOLEAN,
                    text: i18n('[IDX] 番目のマスに [COND]', '[IDX] ばんめのマスに [COND]'),
                    arguments: {
                        IDX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "1",
                        },
                        COND: {
                            type: ArgumentType.STRING,
                            menu: 'cellinfo',
                            defaultValue: "1",
                        },
                    },
                },
            ],
            menus: {
                dir4: {
                    acceptReporters: false,
                    items: [
                        {text: i18n('上', 'うえ'), value: 'u'},
                        {text: i18n('下', 'した'), value: 'd'},
                        {text: i18n('左', 'ひだり'), value: 'l'},
                        {text: i18n('右', 'みぎ'), value: 'r'},
                    ]
                },
                dir8: {
                    acceptReporters: false,
                    items: [
                        {text: i18n('左上', 'ひだりうえ'), value: "1"},
                        {text: i18n('上', 'うえ'), value: "2"},
                        {text: i18n('右上', 'みぎうえ'), value: "3"},
                        {text: i18n('左', 'ひだり'), value: "4"},
                        {text: i18n('右', 'みぎ'), value: "6"},
                        {text: i18n('左下', 'ひだりした'), value: "7"},
                        {text: i18n('下', 'した'), value: "8"},
                        {text: i18n('右下', 'みぎした'), value: "9"},
                    ]
                },
                cellinfo: {
                    acceptReporters: false,
                    items: [
                        {text: i18n('何もない', 'なにもない'), value: "0"},
                        {text: i18n('相手がいる', 'あいてがいる'), value: "1"},
                        {text: i18n('ブロックがある', 'ブロックがある'), value: "2"},
                        {text: i18n('アイテムがある', 'アイテムがある'), value: "3"},
                    ]
                },
            }
        };
    }

    /**
     * @param {{
     *   HOST?: unknown,
     *   PORT?: unknown,
     *   NAME?: unknown,
     * }} args
     * @param {Util} util
     * @returns {Promise<void>}
     */
    async connect(args, util) {
        const host = Cast.toString(args.HOST);
        const port = Cast.toNumber(args.PORT);
        const name = Cast.toString(args.NAME);
        const target = util.target;
        resetSession(target);
        const tsession = await createCHaserSession(host, port, name || ' ');
        if (tsession) {
            resetSession(target);
            target[session] = tsession;
            tsession.onMyturn((info) => {
                target[stdinfo] = info;
            });
            tsession.onClose(() => {
                if (target[session] === tsession) target[session] = null;
            });
        }
    }

    /**
     * @param {unknown} _args
     * @param {Util} util
     * @returns {void}
     */
    close(_args, util) {
        resetSession(util.target);
    }

    /**
     * @param {unknown} _args
     * @param {Util} util
     * @returns {boolean}
     */
    isconnecting(_args, util) {
        return util.target[session] != null;
    }

    /**
     * @param {unknown} _args
     * @param {Util} util
     * @returns {boolean}
     */
    ismyturn(_args, util) {
        return util.target[session]?.isMyturn ?? false;
    }

    /**
     * @param {string} command
     * @param {Target} target
     * @param {'act' | 'info' | null} mode
     * @returns {Promise<void> | void}
     */
    sendCommand(command, target, mode) {
        const tsession = target[session];
        if (!tsession) return;
        return new Promise(resolve => {
            const send = () => {
                tsession.send(command).then((info) => {
                    resolve();
                    if (target[session] === tsession && !tsession.isMyturn) {
                        if (mode === 'act') target[stdinfo] = info;
                        if (mode === 'info') target[superinfo] = info;
                    }
                });
            };
            if (tsession.isMyturn) {
                send();
                return;
            }
            const onclose = () => resolve();
            const onmyturn = ()=> {
                if (!tsession.isMyturn) return;
                tsession.offClose(onclose);
                tsession.offMyturn(onmyturn);
                send();
            };
            tsession.onClose(onclose);
            tsession.onMyturn(onmyturn);
        });
    }

    /**
     * @param {{ DIR?: unknown }} args
     * @param {Util} util
     * @returns {Promise<void> | void}
     */
    walk(args, util) {
        return this.sendCommand(`w${Cast.toString(args.DIR)}`, util.target, 'act');
    }

    /**
     * @param {{ DIR?: unknown }} args
     * @param {Util} util
     * @returns {Promise<void> | void}
     */
    put(args, util) {
        return this.sendCommand(`p${Cast.toString(args.DIR)}`, util.target, 'act');
    }

    /**
     * @param {{ DIR?: unknown }} args
     * @param {Util} util
     * @returns {Promise<void> | void}
     */
    search(args, util) {
        return this.sendCommand(`s${Cast.toString(args.DIR)}`, util.target, 'info');
    }

    /**
     * @param {{ DIR?: unknown }} args
     * @param {Util} util
     * @returns {Promise<void> | void}
     */
    look(args, util) {
        return this.sendCommand(`l${Cast.toString(args.DIR)}`, util.target, 'info');
    }

    /**
     * @param {unknown} _args
     * @param {Util} util
     * @returns {Promise<void> | void}
     */
    donothing(_args, util) {
        return this.sendCommand('lun', util.target, null);
    }

    /**
     * @param {{ DIR?: unknown, COND?: unknown }} args
     * @param {Util} util
     * @returns {boolean}
     */
    check(args, util) {
        const dir = Cast.toListIndex(args.DIR, 9, false);
        const cond = Cast.toString(args.COND);
        if (dir === Cast.LIST_INVALID) {
            return false;
        } else {
            return util.target[stdinfo]?.[dir] === cond;
        }
    }

    /**
     * @param {{ IDX?: unknown, COND?: unknown }} args
     * @param {Util} util
     * @returns {boolean}
     */
    checkC(args, util) {
        const dir = Cast.toListIndex(args.IDX, 9, false);
        const cond = Cast.toString(args.COND);
        if (dir === Cast.LIST_INVALID) {
            return false;
        } else {
            return util.target[superinfo]?.[dir] === cond;
        }
    }
}
