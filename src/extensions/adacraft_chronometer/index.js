const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');

let Chronometer_value = 0; //Chronomètre
let Chronometer_enabled = false;
function fChronometer(args) {
  if (args === 'Start') Chronometer_enabled = true;
  if (args === 'Stop') Chronometer_enabled = false;
  if (args === '+Increment') Chronometer_value++;
  if (args === '-Increment') Chronometer_value--;
  if (args === 'Reset') Chronometer_value = 0;
}
setInterval(() => {
    if (Chronometer_enabled === true) Chronometer_value++;
}, 1000);

class Chronometer {
  getInfo() {
    return {
      id: 'adachronometer',
      color1: "#1e9101",
      color2: "#146300",
      name: 'Chronometer',
      blockIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNjQwIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDcuMS4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjYgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTI2NC41IDY0QzI1MS4yIDY0IDI0MC41IDc0LjcgMjQwLjUgODhDMjQwLjUgMTAxLjMgMjUxLjIgMTEyIDI2NC41IDExMkwyOTYuNSAxMTJMMjk2LjUgMTM3LjNDMTg4LjUgMTQ5LjIgMTA0LjUgMjQwLjggMTA0LjUgMzUyQzEwNC41IDQ3MS4zIDIwMS4yIDU2OCAzMjAuNSA1NjhDNDM5LjggNTY4IDUzNi41IDQ3MS4zIDUzNi41IDM1MkM1MzYuNSAzMTIuMiA1MjUuNyAyNzQuOSA1MDYuOSAyNDIuOEw1MzUuMSAyMTQuNkM1NDcuNiAyMDIuMSA1NDcuNiAxODEuOCA1MzUuMSAxNjkuM0M1MjIuNiAxNTYuOCA1MDIuMyAxNTYuOCA0ODkuOCAxNjkuM0w0NjYuNCAxOTIuN0M0MzMuNSAxNjIuNSAzOTEuMiAxNDIuNCAzNDQuNCAxMzcuMkwzNDQuNCAxMTEuOUwzNzYuNCAxMTEuOUMzODkuNyAxMTEuOSA0MDAuNCAxMDEuMiA0MDAuNCA4Ny45QzQwMC40IDc0LjYgMzg5LjcgNjMuOSAzNzYuNCA2My45TDI2NC40IDYzLjl6TTM0NC41IDI0OEwzNDQuNSAzNTJDMzQ0LjUgMzY1LjMgMzMzLjggMzc2IDMyMC41IDM3NkMzMDcuMiAzNzYgMjk2LjUgMzY1LjMgMjk2LjUgMzUyTDI5Ni41IDI0OEMyOTYuNSAyMzQuNyAzMDcuMiAyMjQgMzIwLjUgMjI0QzMzMy44IDIyNCAzNDQuNSAyMzQuNyAzNDQuNSAyNDh6Ii8+PC9zdmc+",
      blocks: [
        {
          opcode: 'show',
          blockType: BlockType.REPORTER,
          text: 'chronometer'
        }, {
          opcode: 'enable',
          blockType: BlockType.COMMAND,
          text: "start    "
        }, {
          opcode: 'disenable',
          blockType: BlockType.COMMAND,
          text: "pause    "
        }, {
          opcode: 'reset',
          blockType: BlockType.COMMAND,
          text: "stop     "
        }, {
          opcode: 'clear',
          blockType: BlockType.COMMAND,
          text: "clear    "
        }, {
          opcode: 'increment',
          blockType: BlockType.COMMAND,
          text: "add [SECONDS] to chronometer",
          arguments: {
            SECONDS: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        }, {
          opcode: 'mincrement',
          blockType: BlockType.COMMAND,
          text: 'remove [SECONDS] to chronometer',
          arguments: {
            SECONDS: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        }
      ]
    }
  }
  show() {
    return Chronometer_value;
  }
  enable() {
    fChronometer('Start');
  }
  disenable() {
    fChronometer('Stop');
  }
  increment(args) {
    Chronometer_value+=Number(args.SECONDS);
  }
  mincrement(args) {
    Chronometer_value-=Number(args.SECONDS);
  }
  reset() {
    fChronometer('Reset');
    fChronometer('Stop');
  }
  clear() {
    fChronometer('Reset');
  }
}
module.exports = Chronometer;
