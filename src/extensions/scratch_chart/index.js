const echarts = require('echarts');
const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRF////fIel5ufolZ62/2YavsPS+YZOkJmy9/j53+Hk6+zs6N/b6dfO////tDhMHAAAAA50Uk5T/////////////////wBFwNzIAAAA6ElEQVR42uzX2w6DIBAEUGDVtlr//3dLaLwgiwUd2z7MJPJg5EQWiGhGcAxBggQJEiT436CIfqXJPTn3MKNYYMSDFpoAmp24OaYgvwKnFgL2zvVTCwHrMoMi+nUQLFthaNCCa0iwclLkDgYVsQp0mzxuqXgK1MRzoCLWgkPXNN2wI/q6Kvt7u/cX0HtejN8x2sXpnpb8J8D3b0Keuhh3X975M+i0xNVbg3s1TIasgK21bQyGO+s2PykaGMYbge8KrNrssvkOWDXkErB8UuBHETjoYLkKBA8ZfuDkbwVBggQJEiR4MC8BBgDTtMZLx2nFCQAAAABJRU5ErkJggg==';

class ScratchChart {
    constructor(runtime) {
        this.runtime = runtime
    }

    init() {
        const chartDom = document.getElementById('chartMain');
        console.log(chartDom, 'chartDom')
        this.myChart = echarts.init(chartDom);
        this.option = {
            title: {
                text: 'Stacked Line'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            tooltip: {
                show: true
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {},
                    magicType: {
                        type: ['line', 'bar']
                    },
                    dataView: {
                        show: true,
                        // optionToContent: function (opt) {
                        //     console.log(opt,'opt')
                        //     var axisData = opt.xAxis[0].data;
                        //     var series = opt.series;
                        //     var table = `<table style="width:100%;text-align:center"><tbody><tr>`
                        //     if(series[0]){
                        //         table += '<td>' + series[0].name + '</td>'
                        //     }
                        //     if(series[1]){
                        //         table += '<td>' + series[1].name + '</td>'
                        //     }
                        //     table  += '</tr>';
                                
                        //     for (var i = 0, l = axisData.length; i < l; i++) {
                        //         table += '<tr>'
                        //             + '<td>' + axisData[i] + '</td>'
                        //         if(series[0]){
                        //             table += '<td>' + series[0].data[i] + '</td>'
                        //         }
                        //         if(series[1]){
                        //             table + '<td>' + series[1].data[i] + '</td>'
                        //         }
                        //         table += '</tr>';
                        //     }
                        //     table += '</tbody></table>';
                        //     return table;
                        // }
                    }
                },

            },
            xAxis: {
                name: "x",
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                name: "y",
                type: 'value',
                axisLine: {
                    show: true
                }
            },
            series: []
        }
        this.myChart.setOption(this.option)
        this.containerDom = document.getElementById('chartsBox');
    }

    getInfo() {
        this.init()

        return {
            id: "chart",
            name: formatMessage({ id: 'chart.categoryName' }),
            blockIconURL: iconURI,
            showStatusButton: false,
            blocks: [
                {
                    opcode: "showChart",
                    text: formatMessage({ id: 'chart.showChart' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "setTitle",
                    text: formatMessage({ id: 'chart.setTitle' }),
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'untitled'
                        }
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "setAxisTitle",
                    text: formatMessage({ id: 'chart.setAxisTitle' }),
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'x'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            defaultValue: 'y'
                        },
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "inputData",
                    text: formatMessage({ id: 'chart.inputData' }),
                    arguments: {
                        ONE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'data'
                        },
                        TWO: {
                            type: ArgumentType.STRING,
                            defaultValue: '10'
                        },
                        THREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                    },
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "clearData",
                    text: formatMessage({ id: 'chart.clearData' }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: "closeChart",
                    text: formatMessage({ id: 'chart.closeChart' }),
                    blockType: BlockType.COMMAND
                },
            ]
        }
    }

    showChart() {
        console.log(this.containerDom, 'containerDom')
        this.containerDom.classList.remove("none");
    }

    setTitle(args) {
        console.log(args)
        this.option.title.text = args.ONE
        this.myChart.setOption(this.option)
    }

    setAxisTitle(args) {
        this.option.xAxis.name = args.ONE
        this.option.yAxis.name = args.TWO
        this.myChart.setOption(this.option)
    }

    inputData(args) {
        const input = args.ONE
        const x = args.TWO
        const y = args.THREE
        if (-1 === this.option.legend.data.indexOf(input)) {
            this.option.legend.data.push(input)
            this.option.series.push({
                name: input,
                type: 'line',
                // stack: 'Total',
                data: [y]
            })
        } else {
            for (const i of this.option.series) {
                if (i.name === input) {
                    i.data.push(y)
                }
            }
        }
        if (-1 === this.option.xAxis.data.indexOf(x)) {
            this.option.xAxis.data.push(x)
        }
        this.myChart.setOption(this.option)
        console.log(this.option, 'this.option')
    }

    clearData() {
        this.option = {
            title: {
                text: 'Stacked Line'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            grid: {
                left: '3%',
                right: '5%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {},
                    magicType: {
                        type: ['line', 'bar']
                    },
                    dataView: {
                        show: true
                    }
                }
            },
            xAxis: {
                name: "x",
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                name: "y",
                type: 'value',
                axisLine: {
                    show: true
                }
            },
            series: []
        }
        console.log(this.option)
        this.myChart.clear()
        this.myChart.setOption(this.option)
    }

    closeChart() {
        this.containerDom.classList.add("none");
    }
}

module.exports = ScratchChart