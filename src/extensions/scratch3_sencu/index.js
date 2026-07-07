const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const formatMessage = require('format-message');
const Cast = require('../../util/cast');
const fetchWithTimeout = require('../../util/fetch-with-timeout');
const TIMEOUT = 500;

const SenCuColor = {
    RED: 'Red',
    GREEN: 'Green',
    BLUE: 'Blue'
};

const SenCuAQI = {
    PM25: 'PM2.5',
    PM1: 'PM1.0',
    PM10: 'PM10'
};

const SenCu9Axis = {
    ACCX: '加速度X',
    ACCY: '加速度Y',
    ACCZ: '加速度Z',
    GYRX: '陀螺儀X',
    GYRY: '陀螺儀Y',
    GYRZ: '陀螺儀Z',
    MAGX: '磁力計X',
    MAGY: '磁力計Y',
    MAGZ: '磁力計Z'
}

const SenCuTemp = {
    AmbientC: '環境溫度(℃)',
    ObjectC: '物件溫度(℃)',
    AmbientF: '環境溫度(℉)',
    ObjectF: '物件溫度(℉)'
};

// const QueryURL = 'http://192.168.4.1/poll';
const QueryURL = 'http://localhost:3456/';
 
class Scratch3SenCuBlocks {
    constructor(runtime) {
        this.runtime = runtime;
    }
 
    getInfo() {
        return {
            id: 'sencu',
            name: 'SenCu',
            blocks: [
                {
                    opcode: 'getSenCuColor',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuColor',
                        default: 'Get [SenCu_COLOR] Data from SenCu',
                        description: 'Get specified color data from SenCu.'
                    }),
                    arguments: {
                        SenCu_COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'colorMenu',
                            defaultValue: SenCuColor.RED
                        }
                    }
                },
                {
                    opcode: 'getSenCuAQI',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuAQI',
                        default: 'Get [SenCu_AQI] Data from SenCu',
                        description: 'Get specified AQI data from SenCu.'
                    }),
                    arguments: {
                        SenCu_AQI: {
                            type: ArgumentType.STRING,
                            menu: 'aqiMenu',
                            defaultValue: SenCuAQI.PM25
                        }
                    }
                },
                {
                    opcode: 'getSenCu9Axis',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCu9Axis',
                        default: 'Get [SenCu_9AXIS] Data from SenCu',
                        description: 'Get specified 9-Axis data from SenCu.'
                    }),
                    arguments: {
                        SenCu_9AXIS: {
                            type: ArgumentType.STRING,
                            menu: 'axisMenu',
                            defaultValue: SenCu9Axis.ACCX
                        }
                    }
                },
                {
                    opcode: 'getSenCuIRD',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuIRD',
                        default: 'Get IRD Data from SenCu',
                        description: 'Get IRD data from SenCu.'
                    })
                },
                {
                    opcode: 'getSenCuBattery',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuBattery',
                        default: 'Get Battery Data from SenCu',
                        description: 'Get Battery data from SenCu.'
                    })
                },
                {
                    opcode: 'getSenCuTemp',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuTemp',
                        default: 'Get [SenCu_TEMP] Data from SenCu',
                        description: 'Get specified temperature data from SenCu.'
                    }),
                    arguments: {
                        SenCu_TEMP: {
                            type: ArgumentType.STRING,
                            menu: 'tempMenu',
                            defaultValue: SenCuTemp.AmbientC
                        }
                    }
                },
                {
                    opcode: 'getSenCuColorMulti',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuColorMulti',
                        default: 'Get [SenCu_COLOR] Data from [SenCu_ADDR]',
                        description: 'Get specified color data from SenCu.'
                    }),
                    arguments: {
                        SenCu_COLOR: {
                            type: ArgumentType.STRING,
                            menu: 'colorMenu',
                            defaultValue: SenCuColor.RED
                        },
                        SenCu_ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABCD'
                        }
                    }
                },
                {
                    opcode: 'getSenCuAQIMulti',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuAQIMulti',
                        default: 'Get [SenCu_AQI] Data from [SenCu_ADDR]',
                        description: 'Get specified AQI data from SenCu.'
                    }),
                    arguments: {
                        SenCu_AQI: {
                            type: ArgumentType.STRING,
                            menu: 'aqiMenu',
                            defaultValue: SenCuAQI.PM25
                        },
                        SenCu_ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABCD'
                        }
                    }
                },
                {
                    opcode: 'getSenCu9AxisMulti',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCu9AxisMulti',
                        default: 'Get [SenCu_9AXIS] Data from [SenCu_ADDR]',
                        description: 'Get specified 9-Axis data from SenCu.'
                    }),
                    arguments: {
                        SenCu_9AXIS: {
                            type: ArgumentType.STRING,
                            menu: 'axisMenu',
                            defaultValue: SenCu9Axis.ACCX
                        },
                        SenCu_ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABCD'
                        }
                    }
                },
                {
                    opcode: 'getSenCuIRDMulti',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuIRDMulti',
                        default: 'Get IRD Data from [SenCu_ADDR]',
                        description: 'Get IRD data from SenCu.'
                    }),
                    arguments: {
                        SenCu_ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABCD'
                        }
                    }
                },
                {
                    opcode: 'getSenCuBatteryMulti',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuBatteryMulti',
                        default: 'Get Battery Data from [SenCu_ADDR]',
                        description: 'Get Battery data from SenCu.'
                    }),
                    arguments: {
                        SenCu_ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABCD'
                        }
                    }
                },
                {
                    opcode: 'getSenCuTempMulti',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuTempMulti',
                        default: 'Get [SenCu_TEMP] Data from [SenCu_ADDR]',
                        description: 'Get specified temperature data from SenCu.'
                    }),
                    arguments: {
                        SenCu_TEMP: {
                            type: ArgumentType.STRING,
                            menu: 'tempMenu',
                            defaultValue: SenCuTemp.AmbientC
                        },
                        SenCu_ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABCD'
                        }
                    }
                },
                {
                    opcode: 'getSenCuSPO2',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuSPO2',
                        default: 'Get SPO2 Data from SenCu',
                        description: 'Get SPO2 data from SenCu.'
                    })
                },
                {
                    opcode: 'getSenCuSPO2Multi',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'SenCu.getSenCuSPO2Multi',
                        default: 'Get SPO2 Data from [SenCu_ADDR]',
                        description: 'Get SPO2 data from SenCu.'
                    }),
                    arguments: {
                        SenCu_ADDR: {
                            type: ArgumentType.STRING,
                            defaultValue: 'ABCD'
                        }
                    }
                }
            ],
            menus: {
                colorMenu: {
                    acceptReporters: true,
                    items: this.getColorMenu()
                },
                aqiMenu: {
                    acceptReporters: true,
                    items: this.getAQIMenu()
                },
                axisMenu: {
                    acceptReporters: true,
                    items: this.get9AxisMenu()
                },
                tempMenu: {
                    acceptReporters: true,
                    items: this.getTempMenu()
                }
            }
        }
    };
 
    getSenCuColor(args, util) {
        //return navigator.appVersion;
        return this.getColorData(args.SenCu_COLOR, '');
    };
 
    getSenCuColorMulti(args, util) {
        //return navigator.appVersion;
        return this.getColorData(args.SenCu_COLOR, args.SenCu_ADDR);
    };

    getSenCuAQI(args, util) {
        //return navigator.appVersion;
        return this.getAQIData(args.SenCu_AQI, '');
    };

    getSenCuAQIMulti(args, util) {
        //return navigator.appVersion;
        return this.getAQIData(args.SenCu_AQI, args.SenCu_ADDR);
    };

    getSenCu9Axis(args, util) {
        //return navigator.appVersion;
        return this.get9AxisData(args.SenCu_9AXIS, '');
    };

    getSenCu9AxisMulti(args, util) {
        //return navigator.appVersion;
        return this.get9AxisData(args.SenCu_9AXIS, args.SenCu_ADDR);
    };

    getSenCuTemp(args, util) {
        //return navigator.appVersion;
        return this.getTempData(args.SenCu_TEMP, '');
    };

    getSenCuTempMulti(args, util) {
        //return navigator.appVersion;
        return this.getTempData(args.SenCu_TEMP, args.SenCu_ADDR);
    };

    getSenCuIRD(args, util) {
        //return navigator.appVersion;
        return this.getSenCuIRDData('');
    };

    getSenCuBattery(args, util) {
        //return navigator.appVersion;
        return this.getSenCuBatteryData('');
    };

    getSenCuSPO2(args, util) {
        //return navigator.appVersion;
        return this.getSenCuSPO2Data('');
    };

    getSenCuIRDMulti(args, util) {
        //return navigator.appVersion;
        return this.getSenCuIRDData(args.SenCu_ADDR);
    };

    getSenCuBatteryMulti(args, util) {
        //return navigator.appVersion;
        return this.getSenCuBatteryData(args.SenCu_ADDR);
    };

    getSenCuSPO2Multi(args, util) {
        //return navigator.appVersion;
        return this.getSenCuSPO2Data(args.SenCu_ADDR);
    };

    getSenCuIRDData(addr) {
        // var prefix = 'IRD\\s+';
        // var numeric = '-?\\d+\\.?\\d*';

        var param = 'IRD';

        if(addr.length == 4) param = addr + ',' + param;

        // fetch(QueryURL, {
        //     method: 'POST',
        //     body: param
        // })
        // .then(response => response.text())
        // .then()
        // .catch(err => 'ERROR')

        return fetchWithTimeout(QueryURL, {
            method: 'POST',
            body: param
        }, TIMEOUT)
        .then(response => response.text())
        .catch(err => 'ERROR')
    };

    getSenCuBatteryData(addr) {
        var param = 'BAT';

        if(addr.length == 4) param = addr + ',' + param;

        return fetchWithTimeout(QueryURL, {
            method: 'POST',
            body: param
        }, TIMEOUT)
        .then(response => response.text())
        .catch(err => 'ERROR')
    };

    getSenCuSPO2Data(addr) {
        // var prefix = 'IRD\\s+';
        // var numeric = '-?\\d+\\.?\\d*';

        var param = 'SPO2';

        if(addr.length == 4) param = addr + ',' + param;

        // fetch(QueryURL, {
        //     method: 'POST',
        //     body: param
        // })
        // .then(response => response.text())
        // .then()
        // .catch(err => 'ERROR')

        return fetchWithTimeout(QueryURL, {
            method: 'POST',
            body: param
        }, TIMEOUT)
        .then(response => response.text())
        .catch(err => 'ERROR')
    };

    getColorData(color, addr) {
        // var prefix = '';
        // var numeric = '-?\\d+\\.?\\d*';

        var param = '';

        switch (color) {
            case SenCuColor.RED:
                // prefix = 'color_R\\s+';
                param = 'RED';
                break;
            case SenCuColor.GREEN:
                // prefix = 'color_G\\s+';
                param = 'GREEN';
                break;
            case SenCuColor.BLUE:
                // prefix = 'color_B\\s+';
                param = 'BLUE';
                break;
        }

        if(addr.length == 4) param = addr + ',' + param;

        return fetchWithTimeout(QueryURL, {
            method: 'POST',
            body: param
        }, TIMEOUT)
        .then(response => response.text())
        .catch(err => 'ERROR')

        // try {
        //     fetch(QueryURL, {
        //         method: 'POST',
        //         body: param
        //     })
        //     .then(response => response.text())
        //     .then(text => {
        //         var match = text.match(prefix + numeric);

        //         if (match != null) {
        //             var pre = match[0].match(prefix)[0];
        //             var result = match[0].replace(pre, '');
        //             return result;
        //         }
        //         else {
        //             return null;
        //         }
        //     });

        //     // var req = new XMLHttpRequest();  
        //     // req.open('GET', QueryURL, false);   
        //     // req.send(null);

        //     // var poll = req.responseText;

        //     // var match = poll.match(prefix + numeric);

        //     // if (match != null) {
        //     //     var pre = match[0].match(prefix)[0];
        //     //     var result = match[0].replace(pre, '');
        //     //     return parseFloat(result);
        //     // }
        //     // else {
        //     //     return null;
        //     // }
        // }
        // catch {
        //     return null;
        // }
    };

    getAQIData(aqi, addr) {
        // var prefix = '';
        // var numeric = '-?\\d+\\.?\\d*';

        var param = '';

        switch (aqi) {
            case SenCuAQI.PM25:
                // prefix = 'PM2\\.5\\s+';
                param = 'PM2.5';
                break;
            case SenCuAQI.PM1:
                // prefix = 'PM1\\.0\\s+';
                param = 'PM1.0';
                break;
            case SenCuAQI.PM10:
                // prefix = 'PM10\\s+';
                param = 'PM10';
                break;
        }

        if(addr.length == 4) param = addr + ',' + param;

        return fetchWithTimeout(QueryURL, {
            method: 'POST',
            body: param
        }, TIMEOUT)
        .then(response => response.text())
        .catch(err => 'ERROR')

        // try {
        //     fetch(QueryURL, {
        //         method: 'POST',
        //         body: param
        //     })
        //     .then(response => response.text())
        //     .then(text => {
        //         var match = text.match(prefix + numeric);

        //         if (match != null) {
        //             var pre = match[0].match(prefix)[0];
        //             var result = match[0].replace(pre, '');
        //             return result;
        //         }
        //         else {
        //             return null;
        //         }
        //     });

        //     // var req = new XMLHttpRequest();  
        //     // req.open('GET', QueryURL, false);   
        //     // req.send(null);

        //     // var poll = req.responseText;

        //     // var match = poll.match(prefix + numeric);

        //     // if (match != null) {
        //     //     var pre = match[0].match(prefix)[0];
        //     //     var result = match[0].replace(pre, '');
        //     //     return parseFloat(result);
        //     // }
        //     // else {
        //     //     return null;
        //     // }
        // }
        // catch {
        //     return null;
        // }
    };

    get9AxisData(axis, addr) {
        // var prefix = '';
        // var numeric = '-?\\d+\\.?\\d*';

        var param = '';

        switch (axis) {
            case SenCu9Axis.ACCX:
                // prefix = 'acc_X\\s+';
                param = 'ACCX';
                break;
            case SenCu9Axis.ACCY:
                // prefix = 'acc_Y\\s+';
                param = 'ACCY';
                break;
            case SenCu9Axis.ACCZ:
                // prefix = 'acc_Z\\s+';
                param = 'ACCZ';
                break;
            case SenCu9Axis.GYRX:
                // prefix = 'gyro_X\\s+';
                param = 'GYRX';
                break;
            case SenCu9Axis.GYRY:
                // prefix = 'gyro_Y\\s+';
                param = 'GYRY';
                break;
            case SenCu9Axis.GYRZ:
                // prefix = 'gyro_Z\\s+';
                param = 'GYRZ';
                break;
            case SenCu9Axis.MAGX:
                // prefix = 'magnetic_X\\s+';
                param = 'MAGX';
                break;
            case SenCu9Axis.MAGY:
                // prefix = 'magnetic_Y\\s+';
                param = 'MAGY';
                break;
            case SenCu9Axis.MAGZ:
                // prefix = 'magnetic_Z\\s+';
                param = 'MAGZ';
                break;
        }

        if(addr.length == 4) param = addr + ',' + param;

        return fetchWithTimeout(QueryURL, {
            method: 'POST',
            body: param
        }, TIMEOUT)
        .then(response => response.text())
        .catch(err => 'ERROR')

        // try {
        //     fetch(QueryURL, {
        //         method: 'POST',
        //         body: param
        //     })
        //     .then(response => response.text())
        //     .then(text => {
        //         var match = text.match(prefix + numeric);

        //         if (match != null) {
        //             var pre = match[0].match(prefix)[0];
        //             var result = match[0].replace(pre, '');
        //             return result;
        //         }
        //         else {
        //             return null;
        //         }
        //     });

        //     // var req = new XMLHttpRequest();  
        //     // req.open('GET', QueryURL, false);   
        //     // req.send(null);

        //     // var poll = req.responseText;

        //     // var match = poll.match(prefix + numeric);

        //     // if (match != null) {
        //     //     var pre = match[0].match(prefix)[0];
        //     //     var result = match[0].replace(pre, '');
        //     //     return parseFloat(result);
        //     // }
        //     // else {
        //     //     return null;
        //     // }
        // }
        // catch {
        //     return null;
        // }
    }

    getTempData(temp, addr) {
        // var prefix = '';
        // var numeric = '-?\\d+\\.?\\d*';

        var param = '';

        switch (temp) {
            case SenCuTemp.AmbientC:
                // prefix = 'AmbientTempC\\s+';
                param = 'TAMBC';
                break;
            case SenCuTemp.ObjectC:
                // prefix = 'ObjectTempC\\s+';
                param = 'TOBJC';
                break;
            case SenCuTemp.AmbientF:
                // prefix = 'AmbientTempF\\s+';
                param = 'TAMBF';
                break;
            case SenCuTemp.ObjectF:
                // prefix = 'ObjectTempF\\s+';
                param = 'TOBJF';
                break;
        }

        if(addr.length == 4) param = addr + ',' + param;

        return fetchWithTimeout(QueryURL, {
            method: 'POST',
            body: param
        }, TIMEOUT)
        .then(response => response.text())
        .catch(err => 'ERROR')

        // try {
        //     fetch(QueryURL, {
        //         method: 'POST',
        //         body: param
        //     })
        //     .then(response => response.text())
        //     .then(text => {
        //         var match = text.match(prefix + numeric);

        //         if (match != null) {
        //             var pre = match[0].match(prefix)[0];
        //             var result = match[0].replace(pre, '');
        //             return result;
        //         }
        //         else {
        //             return null;
        //         }
        //     });

        //     // var req = new XMLHttpRequest();  
        //     // req.open('GET', QueryURL, false);   
        //     // req.send(null);

        //     // var poll = req.responseText;

        //     // var match = poll.match(prefix + numeric);

        //     // if (match != null) {
        //     //     var pre = match[0].match(prefix)[0];
        //     //     var result = match[0].replace(pre, '');
        //     //     return parseFloat(result);
        //     // }
        //     // else {
        //     //     return null;
        //     // }
        // }
        // catch {
        //     return null;
        // }
    };

    getColorMenu () {
        return [
            {
                text: formatMessage({
                    id: 'SenCu.color.red',
                    default: 'Red',
                    description: 'Red'
                }),
                value: SenCuColor.RED
            },
            {
                text: formatMessage({
                    id: 'SenCu.color.green',
                    default: 'Green',
                    description: 'Green'
                }),
                value: SenCuColor.GREEN
            },
            {
                text: formatMessage({
                    id: 'SenCu.color.blue',
                    default: 'Blue',
                    description: 'Blue'
                }),
                value: SenCuColor.BLUE
            }
        ];
    };

    getAQIMenu () {
        return [
            {
                text: formatMessage({
                    id: 'SenCu.aqi.pm25',
                    default: 'PM2.5',
                    description: 'PM2.5'
                }),
                value: SenCuAQI.PM25
            },
            {
                text: formatMessage({
                    id: 'SenCu.aqi.pm1',
                    default: 'PM1.0',
                    description: 'PM1.0'
                }),
                value: SenCuAQI.PM1
            },
            {
                text: formatMessage({
                    id: 'SenCu.aqi.pm10',
                    default: 'PM10',
                    description: 'PM10'
                }),
                value: SenCuAQI.PM10
            }
        ];
    };

    get9AxisMenu () {
        return [
            {
                text: formatMessage({
                    id: 'SenCu.axis.accx',
                    default: '加速度X',
                    description: '加速度X'
                }),
                value: SenCu9Axis.ACCX
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.accy',
                    default: '加速度Y',
                    description: '加速度Y'
                }),
                value: SenCu9Axis.ACCY
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.accz',
                    default: '加速度Z',
                    description: '加速度Z'
                }),
                value: SenCu9Axis.ACCZ
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.gyrx',
                    default: '陀螺儀X',
                    description: '陀螺儀X'
                }),
                value: SenCu9Axis.GYRX
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.gyry',
                    default: '陀螺儀Y',
                    description: '陀螺儀Y'
                }),
                value: SenCu9Axis.GYRY
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.gyrz',
                    default: '陀螺儀Z',
                    description: '陀螺儀Z'
                }),
                value: SenCu9Axis.GYRZ
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.magx',
                    default: '磁力計X',
                    description: '磁力計X'
                }),
                value: SenCu9Axis.MAGX
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.magy',
                    default: '磁力計Y',
                    description: '磁力計Y'
                }),
                value: SenCu9Axis.MAGY
            },
            {
                text: formatMessage({
                    id: 'SenCu.axis.magz',
                    default: '磁力計Z',
                    description: '磁力計Z'
                }),
                value: SenCu9Axis.MAGZ
            }
        ];
    };

    getTempMenu () {
        return [
            {
                text: formatMessage({
                    id: 'SenCu.temp.AmbientC',
                    default: '環境溫度(℃)',
                    description: '環境溫度(℃)'
                }),
                value: SenCuTemp.AmbientC
            },
            {
                text: formatMessage({
                    id: 'SenCu.temp.ObjectC',
                    default: '物件溫度(℃)',
                    description: '物件溫度(℃)'
                }),
                value: SenCuTemp.ObjectC
            },
            {
                text: formatMessage({
                    id: 'SenCu.temp.AmbientF',
                    default: '環境溫度(℉)',
                    description: '環境溫度(℉)'
                }),
                value: SenCuTemp.AmbientF
            },
            {
                text: formatMessage({
                    id: 'SenCu.temp.ObjectF',
                    default: '物件溫度(℉)',
                    description: '物件溫度(℉)'
                }),
                value: SenCuTemp.ObjectF
            }
        ];
    };
}
 
module.exports = Scratch3SenCuBlocks;
