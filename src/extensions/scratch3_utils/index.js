const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

class Utils {
    getInfo() {
      return {
        id: 'utils', // change this if you make an actual extension!
        name: 'Utilities',
        blocks: [
          {
            opcode: 'strictlyEquals',
            blockType: BlockType.BOOLEAN,
            text: '[ONE] == [TWO]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: 'First value'
              },
              TWO: {
                type: ArgumentType.STRING,
                defaultValue: 'Second value'
              }
            }
          },
          {
            opcode: 'true',
            blockType: BlockType.BOOLEAN,
            text: 'true',
            
          },
     {
            opcode: 'false',
            blockType: BlockType.BOOLEAN,
            text: 'false',
          },
          {
            opcode: 'gte',
            blockType: BlockType.BOOLEAN,
            text: '[ONE] >= [TWO]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: '5'
              },
              TWO: {
                type: ArgumentType.STRING,
                defaultValue: '5'
              }
            }
          },
          {
            opcode: 'lte',
            blockType: BlockType.BOOLEAN,
            text: '[ONE] <= [TWO]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: '4'
              },
              TWO: {
                type: ArgumentType.STRING,
                defaultValue: '4'
              }
            }
          },
  {
            opcode: 'mew',
            blockType: BlockType.REPORTER,
            text: 'Infinity',
            
            
          },
          {
            opcode: 'power',
            blockType: BlockType.REPORTER,
            text: '[ONE] ^ [TWO]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: '5'
              },
              TWO: {
                type: ArgumentType.STRING,
                defaultValue: '3'
              }
            }
          },
          {
            opcode: 'pi',
            blockType: BlockType.REPORTER,
            text: 'Pi',
            
            
          },
  {
            opcode: 'e',
            blockType: BlockType.REPORTER,
            text: 'Euler',
            
            
          },
  {
            opcode: 'cot',
            blockType: BlockType.REPORTER,
            text: 'cot [ONE]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: '5'
              }
            }
          },
  {
            opcode: 'sec',
            blockType: BlockType.REPORTER,
            text: 'sec [ONE]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: '5'
              }
            }
          },
  {
            opcode: 'csc',
            blockType: BlockType.REPORTER,
            text: 'csc [ONE]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: '5'
              }
            }
          },
          
  
        ]
      };
    }
    strictlyEquals(args) {
      // Note strict equality: Inputs must match exactly: in type, case, etc.
      return args.ONE === args.TWO;
    }
    true() {
  return true;
  }
  false() {
  return false;
  }
  gte(args) {
  return args.ONE >= args.TWO;
  }
  lte(args) {
  return args.ONE <= args.TWO;
  }
  mew() {
  return Infinity;
  }
  power(args) {
  return Math.pow(args.ONE, args.TWO);
  }
  pi() {
  return 3.141593;
  }
  e() {
  return 2.71828;
  }
  cot(args) {
  return 1/Math.tan(args.ONE);
  }
  sec(args) {
  return 1/Math.cos(args.ONE);
  }
  csc(args) {
  return 1/Math.sin(args.ONE);
  }
  }
  module.exports = Utils;