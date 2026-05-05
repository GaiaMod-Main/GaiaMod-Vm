const ArgumentType = require('../../extension-support/argument-type')
const BlockType = require('../../extension-support/block-type')
const Cast = require('../../util/cast')
const formatMessage = require('format-message')
const ml5 = require('ml5')

const Message = {
  joinWithComma: {
    'ja': '[STR1] , [STR2]',
    'ja-Hira': '[STR1] , [STR2]',
    'en': '[STR1] , [STR2]'
  },
  setLabel: {
    'ja': '[VALUES] に [LABEL] とラベル付けする',
    'ja-Hira': '[VALUES] に [LABEL] とラベル付けする',
    'en': 'set label: [LABEL] for data: [VALUES]'
  },
  dataCount: {
    'ja': 'ラベル [LABEL] のデータ数',
    'ja-Hira': 'ラベル [LABEL] のデータすう',
    'en': 'data count of label: [LABEL]'
  },
  all: {
    'ja': 'の全て',
    'ja-Hira': 'のすべて',
    'en': 'all'
  },
  resetAll: {
    'ja': '全てをリセット',
    'ja-Hira': 'すべてをリセット',
    'en': 'reset all'
  },
  train: {
    'ja': '訓練する(エポック数: [EPOCHS] )',
    'ja-Hira': 'くんれんする(エポックすう: [EPOCHS] )',
    'en': 'train(epochs: [EPOCHS] )'
  },
  getLabel: {
    'ja': '[VALUES] のラベル',
    'ja-Hira': '[VALUES] のラベル',
    'en': 'label of [VALUES]'
  },
  defaultLabel: {
    'ja': 'りんご',
    'ja-Hira': 'りんご',
    'en': 'apple'
  }
}
const AvailableLocales = ['en', 'ja', 'ja-Hira']

class Scratch3Nn2ScratchBlocks {

    constructor (runtime) {
        this.runtime = runtime;

        const options = {
          task: 'classification'
        }
        this.nn = ml5.neuralNetwork(options);
    }

    getInfo () {
        this.locale = this.setLocale();

        return {
            id: 'nn2scratch',
            name: 'Nn2Scratch',
            blocks: [
                {
                    opcode: 'joinWithComma',
                    blockType: BlockType.REPORTER,
                    text: Message.joinWithComma[this.locale],
                    arguments: {
                        STR1: {
                            type: ArgumentType.STRING,
                            defaultValue: 0
                          },
                        STR2: {
                            type: ArgumentType.STRING,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'setLabel',
                    blockType: BlockType.COMMAND,
                    text: Message.setLabel[this.locale],
                    arguments: {
                        VALUES: {
                            type: ArgumentType.STRING,
                            defaultValue: 0
                        },
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: Message.defaultLabel[this.locale]
                        }
                    }
                },
                {
                    opcode: 'dataCount',
                    blockType: BlockType.REPORTER,
                    text: Message.dataCount[this.locale],
                    arguments: {
                        LABEL: {
                            type: ArgumentType.STRING,
                            defaultValue: Message.defaultLabel[this.locale]
                        }
                    }
                },
                {
                    opcode: 'resetAll',
                    blockType: BlockType.COMMAND,
                    text: Message.resetAll[this.locale]
                },
                {
                    opcode: 'train',
                    blockType: BlockType.COMMAND,
                    text: Message.train[this.locale],
                    arguments: {
                        EPOCHS: {
                            type: ArgumentType.STRING,
                            defaultValue: 32
                        }
                    }

                },
                {
                    opcode: 'getLabel',
                    text: Message.getLabel[this.locale],
                    blockType: BlockType.REPORTER,
                    arguments: {
                        VALUES: {
                            type: ArgumentType.STRING,
                            defaultValue: 0
                        }
                    }
                }
            ]
        };
    }

    joinWithComma(args) {
      return `${args.STR1},${args.STR2}`;
    }

    setLabel(args) {
      let inputs = args.VALUES.split(',').map(v => Number(v));
      let outputs = [args.LABEL]

      this.nn.addData(inputs, outputs);
    }

    dataCount(args) {
      const arr = this.nn.neuralNetworkData.data.raw;
      return arr.filter(item => item.ys[0] === args.LABEL).length;
    }

    resetAll(args) {
      try {
        const options = {
          task: 'classification'
        }
        this.nn = ml5.neuralNetwork(options);
      } catch (error) {
        alert(error);
      }
    }

    train(args) {
      try {
        this.nn.normalizeData()
        const trainingOptions = {
          epochs: Number(args.EPOCHS),
          batchSize: 12
        }
        this.nn.train(trainingOptions, function() {
          alert('Training is completed.');
        });
      } catch(error) {
        alert(error);
      }
    }

    getLabel(args) {
      try {
        let inputs = args.VALUES.split(',').map(v => Number(v));
        const result = this.nn.classifySync(inputs);
        let maxConfidence = 0;
        let label = null;
        for (let i = 0; i < result.length; i++) {
          if (result[i].confidence > maxConfidence) {
            maxConfidence = result[i].confidence;
            label = result[i].label;
          }
        }
        return label;
      } catch(error) {
        alert(error);
      }
    }

    setLocale() {
      let locale = formatMessage.setup().locale;
      if (AvailableLocales.includes(locale)) {
        return locale;
      } else {
        return 'en';
      }
    }
}

module.exports = Scratch3Nn2ScratchBlocks;
