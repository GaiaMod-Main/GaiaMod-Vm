class SnailExtras {
    getInfo() {
      return {
        id: 'snailextras',
        name: 'Snail Extras',
        blocks: [
          {
            opcode: 'wait',
            text: 'wait [TIME] miliseconds',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1000
              }
            }
          },
          {
            opcode: 'grab',
            text: 'grab [URL]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'http://example.org/'
              }
            }
          }
        ]
      };
    }
  
    wait (args) {
      return new Promise((resolve, reject) => {
        const timeInMilliseconds = args.TIME * 1;
        setTimeout(() => {
          resolve();
        }, timeInMilliseconds);
      });
    }
  
    fetch (args) {
      return fetch(args.URL)
        .then((response) => {
          return response.text();
        })
        .catch((error) => {
          console.error(error);
          return 'Uh oh! Something went wrong.';
        });
    }
  }
  Scratch.extensions.register(new SnailExtras());