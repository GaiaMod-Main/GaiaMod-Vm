//EXTENSION NOT BY GVBVDXX, ONLY MODIFIED TO RUN INSIDE GVBVDXX MOD 2.


const Cast = require('../../util/cast');
const TargetType = require('../../extension-support/target-type');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const STRETCH_X = Symbol("stretch.x");
const STRETCH_Y = Symbol("stretch.y");
const vm = window.LatestVirtualMachine;
const implementStretchForTarget = (target, originalTarget) => {
    if (STRETCH_X in target) {
      // Target already has stretch. Don't implement again.
      return;
    }

    target[STRETCH_X] = originalTarget ? originalTarget[STRETCH_X] : 100;
    target[STRETCH_Y] = originalTarget ? originalTarget[STRETCH_Y] : 100;

    const original = target._getRenderedDirectionAndScale;
    target._getRenderedDirectionAndScale = function () {
      const result = original.call(this);

      result.scale[0] *= this[STRETCH_X] / 100;
      result.scale[1] *= this[STRETCH_Y] / 100;

      return result;
    };
  };
  vm.runtime.targets.forEach((target) => implementStretchForTarget(target));
  vm.runtime.on("targetWasCreated", (target, originalTarget) =>
    implementStretchForTarget(target, originalTarget)
  );
  vm.runtime.on("PROJECT_LOADED", () => {
    vm.runtime.targets.forEach((target) => implementStretchForTarget(target));
  });
  const forceUpdateDirectionAndScale = (target) => {
    target.setDirection(target.direction);
  };
class Stretch {
	constructor () {
		
	}
    getInfo() {
      return {
        id: "stretch",
        name: "Stretch",
        color1: "#4287f5",
        color2: "#2b62ba",
        color3: "#204785",
        blocks: [
          {
            opcode: "setStretch",
            blockType: BlockType.COMMAND,
            text: "set stretch to x: [X] y: [Y]",
            arguments: {
              X: {
                type: ArgumentType.NUMBER,
                defaultValue: 100,
              },
              Y: {
                type: ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
            filter: [TargetType.SPRITE],
          },
          {
            opcode: "changeStretch",
            blockType: BlockType.COMMAND,
            text: "change stretch by x: [DX] y: [DY]",
            arguments: {
              DX: {
                type: ArgumentType.NUMBER,
                defaultValue: 0,
              },
              DY: {
                type: ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },

          "---",

          {
            opcode: "setStretchX",
            blockType: BlockType.COMMAND,
            text: "set stretch x to [X]",
            arguments: {
              X: {
                type: ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
            filter: [TargetType.SPRITE],
          },
          {
            opcode: "setStretchY",
            blockType: BlockType.COMMAND,
            text: "set stretch y to [Y]",
            arguments: {
              Y: {
                type: ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
            filter: [TargetType.SPRITE],
          },
          {
            opcode: "changeStretchX",
            blockType: BlockType.COMMAND,
            text: "change stretch x by [DX]",
            arguments: {
              DX: {
                type: ArgumentType.NUMBER,
                defaultValue: 10,
              },
            },
          },
          {
            opcode: "changeStretchY",
            blockType: BlockType.COMMAND,
            text: "change stretch y by [DY]",
            arguments: {
              DY: {
                type: ArgumentType.NUMBER,
                defaultValue: 10,
              },
            },
          },

          "---",

          {
            opcode: "getX",
            blockType: BlockType.REPORTER,
            text: "x stretch",
            filter: [TargetType.SPRITE],
            disableMonitor: true,
          },
          {
            opcode: "getY",
            blockType: BlockType.REPORTER,
            text: "y stretch",
            filter: [TargetType.SPRITE],
            disableMonitor: true,
          },
        ],
      };
    }
    setStretch(args, util) {
      util.target[STRETCH_X] = Cast.toNumber(args.X);
      util.target[STRETCH_Y] = Cast.toNumber(args.Y);
      forceUpdateDirectionAndScale(util.target);
    }
    changeStretch(args, util) {
      util.target[STRETCH_X] += Cast.toNumber(args.DX);
      util.target[STRETCH_Y] += Cast.toNumber(args.DY);
      forceUpdateDirectionAndScale(util.target);
    }
    setStretchX(args, util) {
      util.target[STRETCH_X] = Cast.toNumber(args.X);
      forceUpdateDirectionAndScale(util.target);
    }
    setStretchY(args, util) {
      util.target[STRETCH_Y] = Cast.toNumber(args.Y);
      forceUpdateDirectionAndScale(util.target);
    }
    changeStretchX(args, util) {
      util.target[STRETCH_X] += Cast.toNumber(args.DX);
      forceUpdateDirectionAndScale(util.target);
    }
    changeStretchY(args, util) {
      util.target[STRETCH_Y] += Cast.toNumber(args.DY);
      forceUpdateDirectionAndScale(util.target);
    }
    getX(args, util) {
      return util.target[STRETCH_X];
    }
    getY(args, util) {
      return util.target[STRETCH_Y];
    }
  }
  
  module.exports = Stretch;