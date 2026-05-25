const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const axios = require('axios').default;
const Icons = require('./lib/icons.js');

const hostname = location.hostname;
log.log(`host: ${hostname}`);
const client = `http://${hostname}:52002`;
const cameraClient = `${client}/camera`;
const cameraMode = {
    NONE: 'None',
    RGB: 'RGB',
    DEPTH: 'Depth',
    FACE_DETECTION: 'FaceDetection',
    OBJECT_DETECTION: 'ObjectDetection'
};
const axis = {
    X: 'x',
    Y: 'y'
};
const objects = {
    PERSON: 'person',
    PHONE: 'cell phone',
    BOOK: 'book',
    MOUSE: 'mouse',
    SCISSORS: 'scissors',
    BOTTLE: 'scissors',
    CUP: 'cup',
    FORK: 'fork',
    KNIFE: 'knife',
    SPOON: 'spoon',
    CHAIR: 'chair',
    TOOTHBRUSH: 'toothbrush',
    BIRD: 'bird',
    CAT: 'cat',
    DOG: 'dog',
    HORSE: 'horse',
    SHEEP: 'sheep',
    COW: 'cow',
    CAR: 'car',
    BUS: 'bus',
    TRAIN: 'train'
};
const column = {
    RIGHT: 'right',
    CENTER: 'center',
    LEFT: 'left'
};
const row = {
    UPPER: 'upper',
    CENTER: 'center',
    LOWER: 'lower'
};

const DETECTION_IMAGE_SIZE = [480, 360];
const COLUMN_SPLIT_THRESHOLD = 0.3
const ROW_SPLIT_THRESHOLD = 0.3


// eslint-disable-next-line func-style, require-jsdoc
function convertPos(pos, imageSize) {
    return ((pos / (imageSize / 2)) - 1);
}

// eslint-disable-next-line func-style, require-jsdoc
function convertSize(size, imageSize) {
    return (size / (imageSize));
}

// eslint-disable-next-line func-style, require-jsdoc
function getCenter(pos, size) {
    return (pos + (size / 2));
}

function recognitionColumn(recognition_column, pos, size){
    let x = getCenter(pos, size)
    // 中央で検出
    if (recognition_column === column.CENTER) {
        if (x <= COLUMN_SPLIT_THRESHOLD && x >= -COLUMN_SPLIT_THRESHOLD) {
            return true
        }
    // 左側で検出
    } else if (recognition_column === column.RIGHT) {
        if (x > COLUMN_SPLIT_THRESHOLD) {
            return true
        }
    // 右側で検出
    } else if (recognition_column === column.LEFT) {
        if (x < -COLUMN_SPLIT_THRESHOLD) {
            return true
        }
    }
    return false
}

function recognitionRow(recognition_row, pos, size){
    let y = getCenter(pos, size)
    // 上側で検出
    if (recognition_row === row.UPPER) {
        if (y < -ROW_SPLIT_THRESHOLD) {
            return true
        }
    // 真ん中で検出
    } else if (recognition_row === row.CENTER) {
        if (y <= ROW_SPLIT_THRESHOLD && y >= -ROW_SPLIT_THRESHOLD) {
            return true
        }
    // 下側で検出
    } else if (recognition_row === row.LOWER) {
        if (y > ROW_SPLIT_THRESHOLD) {
            return true
        }
    }
    return false
}


class detectionResult {
    constructor(data) {
        this.name = data.name;
        this.x = convertPos(parseInt(data.x, 10), DETECTION_IMAGE_SIZE[0]);
        this.y = convertPos(parseInt(data.y, 10), DETECTION_IMAGE_SIZE[1]);
        this.width = convertSize(parseInt(data.width, 10), DETECTION_IMAGE_SIZE[0]);
        this.height = convertSize(parseInt(data.height, 10), DETECTION_IMAGE_SIZE[1]);
    }
}


let faceResult = [];
let objectResult = [];

// eslint-disable-next-line func-style, require-jsdoc
function toBoolean(str) {
    if (typeof str !== 'string') {
        return Boolean(str);
    }
    try {
        const obj = JSON.parse(str.toLowerCase());
        return obj === true;
    } catch (e) {
        return str !== '';
    }
}


const cameraModeChange = async mode => {
    await axios.post(`${cameraClient}/mode`, {
        mode: mode
    });
};

const getFaceResult = async () => {
    const res = await axios.get(`${cameraClient}/face`);
    const items = JSON.parse(JSON.stringify(res.data));
    return items;
};

const getObjectResult = async () => {
    const res = await axios.get(`${cameraClient}/object`);
    const items = JSON.parse(JSON.stringify(res.data));
    return items;
};

class Scratch3AkariCameraSimple {

    constructor(runtime) {
        this.runtime = runtime;
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        cameraModeChange(cameraMode.NONE);
    }
    get CAMERA_MENU() {
        return [
            {
                text: 'RGB',
                value: cameraMode.RGB
            },
            {
                text: 'デプス',
                value: cameraMode.DEPTH
            },
            {
                text: 'かおにんしき',
                value: cameraMode.FACE_DETECTION
            },
            {
                text: 'ぶったいにんしき',
                value: cameraMode.OBJECT_DETECTION
            }
        ];
    }
    get AXIS_MENU() {
        return [
            {
                text: 'x',
                value: axis.X
            },
            {
                text: 'y',
                value: axis.Y
            }
        ];
    }
    get OBJECTS_MENU() {
        return [
            {
                text: 'ひと',
                value: objects.PERSON
            },
            {
                text: 'スマホ',
                value: objects.PHONE
            },
            {
                text: 'ほん',
                value: objects.BOOK
            },
            {
                text: 'マウス',
                value: objects.MOUSE
            },
            {
                text: 'はさみ',
                value: objects.SCISSORS
            },
            {
                text: 'ペットボトル',
                value: objects.BOTTLE
            },
            {
                text: 'コップ',
                value: objects.CUP
            },
            {
                text: 'フォーク',
                value: objects.FORK
            },
            {
                text: 'スプーン',
                value: objects.KNIFE
            },
            {
                text: 'ナイフ',
                value: objects.SPOON
            },
            {
                text: 'いす',
                value: objects.CHAIR
            },
            {
                text: 'はブラシ',
                value: objects.TOOTHBRUSH
            },
            {
                text: 'とり',
                value: objects.BIRD
            },
            {
                text: 'ねこ',
                value: objects.CAT
            },
            {
                text: 'いぬ',
                value: objects.DOG
            },
            {
                text: 'うま',
                value: objects.HORSE
            },
            {
                text: 'ひつじ',
                value: objects.SHEEP
            },
            {
                text: 'ぞう',
                value: objects.ELEPHANT
            },
            {
                text: 'うし',
                value: objects.COW
            },
            {
                text: 'くるま',
                value: objects.CAR
            },
            {
                text: 'バス',
                value: objects.BUS
            },
            {
                text: 'でんしゃ',
                value: objects.TRAIN
            }
        ];
    }
    get COLUMN_MENU() {
        return [
            {
                text: 'みぎ',
                value: column.RIGHT
            },
            {
                text: 'まんなか',
                value: column.CENTER
            },
            {
                text: 'ひだり',
                value: column.LEFT
            }
        ];
    }
    get ROW_MENU() {
        return [
            {
                text: 'うえ',
                value: row.UPPER
            },
            {
                text: 'まんなか',
                value: column.CENTER
            },
            {
                text: 'した',
                value: row.LOWER
            }
        ];
    }
    getInfo() {
        return {
            id: 'akaricamerasimple',
            name: 'AKARIカメラ(簡易版)',
            menuIconURI: Icons.menuIconURI,
            blockIconURI: Icons.blockIconURI,
            blocks: [
                {
                    opcode: 'cameraOn',
                    blockType: BlockType.COMMAND,
                    text: '[MODE]のカメラをONにする',
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            menu: 'cameraModes',
                            defaultValue: cameraMode.RGB
                        }
                    }
                },
                {
                    opcode: 'cameraOff',
                    blockType: BlockType.COMMAND,
                    text: 'カメラをOFFにする',
                    arguments: {}
                },
                {
                    opcode: 'getFaceDetection',
                    text: '【かお】にんしきけっかをもらう',
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: 'isFace',
                    text: '【かお】にんしきされた',
                    blockType: BlockType.BOOLEAN,
                    arguments: {}
                },
                {
                    opcode: 'getFaceCenter',
                    text: '【かお】[AXIS]のばしょ',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        AXIS: {
                            type: ArgumentType.STRING,
                            menu: 'axis',
                            defaultValue: axis.X
                        }
                    }
                },
                // {
                //     opcode: 'getFaceSize',
                //     text: '【顔】顔の[AXIS]方向のサイズ',
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         AXIS: {
                //             type: ArgumentType.STRING,
                //             menu: 'axis',
                //             defaultValue: axis.X
                //         }
                //     }
                // },
                {
                    opcode: 'getObjectDetection',
                    text: '【もの】にんしきけっかをもらう',
                    blockType: BlockType.COMMAND,
                    arguments: {}
                },
                {
                    opcode: 'isObject',
                    text: '【もの】[NAME]がにんしきされた',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'objects',
                            defaultValue: objects.PERSON
                        }
                    }
                },
                {
                    opcode: 'isObjectVisibleColumn',
                    text: '【もの】[NAME]が[COLUMN]でにんしきされた',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'objects',
                            defaultValue: objects.PERSON
                        },
                        COLUMN: {
                            type: ArgumentType.STRING,
                            menu: 'column',
                            defaultValue: column.RIGHT
                        }
                    }
                },
                {
                    opcode: 'isObjectVisibleRow',
                    text: '【もの】[NAME]が[ROW]でにんしきされた',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'objects',
                            defaultValue: objects.PERSON
                        },
                        ROW: {
                            type: ArgumentType.STRING,
                            menu: 'row',
                            defaultValue: row.UPPER
                        }
                    }
                },
                {
                    opcode: 'isObjectVisibleArea',
                    text: '【もの】[NAME]が[COLUMN]の[ROW]がわでにんしきされた',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'objects',
                            defaultValue: objects.PERSON
                        },
                        COLUMN: {
                            type: ArgumentType.STRING,
                            menu: 'column',
                            defaultValue: column.CENTER
                        },
                        ROW: {
                            type: ArgumentType.STRING,
                            menu: 'row',
                            defaultValue: row.UPPER
                        }
                    }
                },
                {
                    opcode: 'getObjectNum',
                    text: '【もの】にんしきした[NAME]のかず',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        NAME: {
                            type: ArgumentType.STRING,
                            menu: 'objects',
                            defaultValue: objects.PERSON
                        }
                    }
                },
                {
                    opcode: 'getTotalObjectNum',
                    text: '【もの】にんしきしたかず',
                    blockType: BlockType.REPORTER,
                    arguments: {}
                },
                // {
                //     opcode: 'getObjectNameFromId',
                //     text: '【物体】[ID]番目の名前',
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         ID: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         }
                //     }
                // },
                // {
                //     opcode: 'getObjectCenter',
                //     text: '【物体】[ID]番目の[AXIS]位置',
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         ID: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         },
                //         AXIS: {
                //             type: ArgumentType.STRING,
                //             menu: 'axis',
                //             defaultValue: axis.X
                //         }
                //     }
                // },
                // {
                //     opcode: 'getObjectSize',
                //     text: '【物体】[ID]番目の[AXIS]方向のサイズ',
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         ID: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         },
                //         AXIS: {
                //             type: ArgumentType.STRING,
                //             menu: 'axis',
                //             defaultValue: axis.X
                //         }
                //     }
                // }
            ],
            menus: {
                cameraModes: {
                    acceptReporters: true,
                    items: this.CAMERA_MENU
                },
                axis: {
                    acceptReporters: true,
                    items: this.AXIS_MENU
                },
                objects: {
                    acceptReporters: true,
                    items: this.OBJECTS_MENU
                },
                column: {
                    acceptReporters: true,
                    items: this.COLUMN_MENU
                },
                row: {
                    acceptReporters: true,
                    items: this.ROW_MENU
                }
            }
        };
    }

    async cameraOn(args) {
        await (cameraModeChange(args.MODE));
    }

    async cameraOff() {
        await (cameraModeChange(cameraMode.NONE));
    }

    async getFaceDetection() {
        const res = await getFaceResult();
        if (toBoolean(res.result) === true) {
            faceResult = [];
            for (let i = 0; i < res.data.length; i++) {
                faceResult.push(new detectionResult(res.data[i]));
            }
            return true;
        }
        return false;
    }
    isFace() {
        if (faceResult.length > 0) {
            return true;
        }
        return false;
    }
    getFaceCenter(args) {
        if (faceResult.length > 0) {
            if (args.AXIS === axis.X) {
                return getCenter(faceResult[0].x, faceResult[0].width);
            } else if (args.AXIS === axis.Y) {
                return getCenter(faceResult[0].y, faceResult[0].height);
            }
        }
        return 0;
    }
    getFaceSize(args) {
        if (faceResult.length > 0) {
            if (args.AXIS === axis.X) {
                return faceResult[0].width;
            } else if (args.AXIS === axis.Y) {
                return faceResult[0].height;
            }
        }
        return 0;
    }
    async getObjectDetection() {
        const res = await getObjectResult();
        if (toBoolean(res.result) === true) {
            objectResult = [];
            for (let i = 0; i < res.data.length; i++) {
                objectResult.push(new detectionResult(res.data[i]));
            }
            return true;
        }
        return false;
    }
    isObject(args) {
        for (let i = 0; i < objectResult.length; i++) {
            if (objectResult[i].name === args.NAME) {
                return true;
            }
        }
        return false;
    }
    isObjectVisibleColumn(args) {
        for (let i = 0; i < objectResult.length; i++) {
            if (objectResult[i].name === args.NAME) {
                return recognitionColumn(args.COLUMN, objectResult[i].x, objectResult[i].width)
            }
        }
        return false;
    }
    isObjectVisibleRow(args) {
        for (let i = 0; i < objectResult.length; i++) {
            if (objectResult[i].name === args.NAME) {
                return recognitionRow(args.ROW, objectResult[i].y, objectResult[i].height)
            }
        }
        return false;
    }
    isObjectVisibleArea(args) {
        for (let i = 0; i < objectResult.length; i++) {
            if (objectResult[i].name === args.NAME) {
                if (recognitionColumn(args.COLUMN, objectResult[i].x, objectResult[i].width)){
                    return recognitionRow(args.ROW, objectResult[i].y, objectResult[i].height)
                }
            }
        }
    return false
    }
    getObjectNum(args) {
        let num = 0;
        for (let i = 0; i < objectResult.length; i++) {
            if (objectResult[i].name === args.NAME) {
                num++;
            }
        }
        return num;
    }
    getTotalObjectNum() {
        return objectResult.length;
    }
    getObjectNameFromId(args) {
        if (args.ID >= objectResult.length) {
            return 'NONE';
        }
        return objectResult[args.ID].name;
    }
    getObjectCenter(args) {
        if (args.ID < objectResult.length) {
            if (args.AXIS === axis.X) {
                return getCenter(objectResult[args.ID].x, objectResult[args.ID].width);
            } else if (args.AXIS === axis.Y) {
                return getCenter(objectResult[args.ID].y, objectResult[args.ID].height);
            }
        }
        return 0;
    }
    getObjectSize(args) {
        if (args.ID < objectResult.length) {
            if (args.AXIS === axis.X) {
                return objectResult[args.ID].width;
            } else if (args.AXIS === axis.Y) {
                return objectResult[args.ID].height;
            }
        }
        return 0;
    }
}

module.exports = Scratch3AkariCameraSimple;
