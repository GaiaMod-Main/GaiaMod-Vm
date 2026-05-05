
// create by scratch3-extension generator
const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

const menuIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcKICAgIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIKICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgICB4bWxuczpuczE9Imh0dHA6Ly9zb3ppLmJhaWVyb3VnZS5mciIKICAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICAgaWQ9InN2ZzExNjk5IgogICAgdmlld0JveD0iMCAwIDcyNC4xOCA4MDYuNzYiCiAgICB2ZXJzaW9uPSIxLjEiCiAgPgogIDxnCiAgICAgIGlkPSJsYXllcjEiCiAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExOTMuNSA0OTkuNTkpIgogICAgPgogICAgPGcKICAgICAgICBpZD0iZzExNjc2IgogICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAgLTE3LjI1NCAxNy4yNTQgMCAxMDQ0MyAtMjI1Mi45KSIKICAgICAgPgogICAgICA8cGF0aAogICAgICAgICAgaWQ9InBhdGgxMTY2NiIKICAgICAgICAgIGQ9Im0tMTM0LjM4IDMwOS41YzAgNC4xNjgzLTMuMzc5MSA3LjU0NzQtNy41NDc0IDcuNTQ3NHMtNy41NDc0LTMuMzc5MS03LjU0NzQtNy41NDc0IDMuMzc5MS03LjU0NzQgNy41NDc0LTcuNTQ3NCA3LjU0NzQgMy4zNzkxIDcuNTQ3NCA3LjU0NzR6IgogICAgICAgICAgc3R5bGU9ImNvbG9yOiMwMDAwMDAiCiAgICAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjEwNDUgLTk0OS40OCkiCiAgICAgIC8+CiAgICAgIDxwYXRoCiAgICAgICAgICBpZD0icGF0aDExNjY4IgogICAgICAgICAgZD0ibS0xMzQuMzggMzA5LjVjMCA0LjE2ODMtMy4zNzkxIDcuNTQ3NC03LjU0NzQgNy41NDc0cy03LjU0NzQtMy4zNzkxLTcuNTQ3NC03LjU0NzQgMy4zNzkxLTcuNTQ3NCA3LjU0NzQtNy41NDc0IDcuNTQ3NCAzLjM3OTEgNy41NDc0IDcuNTQ3NHoiCiAgICAgICAgICBzdHlsZT0iY29sb3I6IzAwMDAwMCIKICAgICAgICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyLjc2NyAtOTQ5LjQ4KSIKICAgICAgLz4KICAgICAgPHBhdGgKICAgICAgICAgIGlkPSJwYXRoMTE2NzAiCiAgICAgICAgICBkPSJtLTEzNC4zOCAzMDkuNWMwIDQuMTY4My0zLjM3OTEgNy41NDc0LTcuNTQ3NCA3LjU0NzRzLTcuNTQ3NC0zLjM3OTEtNy41NDc0LTcuNTQ3NCAzLjM3OTEtNy41NDc0IDcuNTQ3NC03LjU0NzQgNy41NDc0IDMuMzc5MSA3LjU0NzQgNy41NDc0eiIKICAgICAgICAgIHN0eWxlPSJjb2xvcjojMDAwMDAwIgogICAgICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuOTM2IC05NzYuMzUpIgogICAgICAvPgogICAgICA8cmVjdAogICAgICAgICAgaWQ9InJlY3QxMTY3MiIKICAgICAgICAgIHN0eWxlPSJjb2xvcjojMDAwMDAwIgogICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoLTYwLjAwMSkiCiAgICAgICAgICBoZWlnaHQ9IjMiCiAgICAgICAgICB3aWR0aD0iMjcuNjkyIgogICAgICAgICAgeT0iLTQ0My43MyIKICAgICAgICAgIHg9IjQ4OC4yMiIKICAgICAgLz4KICAgICAgPHJlY3QKICAgICAgICAgIGlkPSJyZWN0MTE2NzQiCiAgICAgICAgICBzdHlsZT0iY29sb3I6IzAwMDAwMCIKICAgICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KC0uNSAtLjg2NjAzIC0uODY2MDMgLjUgMCAwKSIKICAgICAgICAgIGhlaWdodD0iMyIKICAgICAgICAgIHdpZHRoPSIyNy42OTIiCiAgICAgICAgICB5PSItMjI2LjkiCiAgICAgICAgICB4PSI2MTMuMTYiCiAgICAgIC8+CiAgICA8L2cKICAgID4KICA8L2cKICA+CiAgPG1ldGFkYXRhCiAgICA+CiAgICA8cmRmOlJERgogICAgICA+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgPgogICAgICAgIDxkYzpmb3JtYXQKICAgICAgICAgID5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQKICAgICAgICA+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIKICAgICAgICAvPgogICAgICAgIDxjYzpsaWNlbnNlCiAgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvcHVibGljZG9tYWluLyIKICAgICAgICAvPgogICAgICAgIDxkYzpwdWJsaXNoZXIKICAgICAgICAgID4KICAgICAgICAgIDxjYzpBZ2VudAogICAgICAgICAgICAgIHJkZjphYm91dD0iaHR0cDovL29wZW5jbGlwYXJ0Lm9yZy8iCiAgICAgICAgICAgID4KICAgICAgICAgICAgPGRjOnRpdGxlCiAgICAgICAgICAgICAgPk9wZW5jbGlwYXJ0PC9kYzp0aXRsZQogICAgICAgICAgICA+CiAgICAgICAgICA8L2NjOkFnZW50CiAgICAgICAgICA+CiAgICAgICAgPC9kYzpwdWJsaXNoZXIKICAgICAgICA+CiAgICAgICAgPGRjOnRpdGxlCiAgICAgICAgICA+U2hhcmUgaWNvbjwvZGM6dGl0bGUKICAgICAgICA+CiAgICAgICAgPGRjOmRhdGUKICAgICAgICAgID4yMDEzLTA3LTEzVDExOjQ1OjQyPC9kYzpkYXRlCiAgICAgICAgPgogICAgICAgIDxkYzpkZXNjcmlwdGlvbgogICAgICAgICAgPkEgc2ltcGxlIHNoYXJlIGljb248L2RjOmRlc2NyaXB0aW9uCiAgICAgICAgPgogICAgICAgIDxkYzpzb3VyY2UKICAgICAgICAgID5odHRwczovL29wZW5jbGlwYXJ0Lm9yZy9kZXRhaWwvMTgwODMyL3NoYXJlLWljb24tYnktbWluZHVrYS0xODA4MzI8L2RjOnNvdXJjZQogICAgICAgID4KICAgICAgICA8ZGM6Y3JlYXRvcgogICAgICAgICAgPgogICAgICAgICAgPGNjOkFnZW50CiAgICAgICAgICAgID4KICAgICAgICAgICAgPGRjOnRpdGxlCiAgICAgICAgICAgICAgPk1pbmR1a2E8L2RjOnRpdGxlCiAgICAgICAgICAgID4KICAgICAgICAgIDwvY2M6QWdlbnQKICAgICAgICAgID4KICAgICAgICA8L2RjOmNyZWF0b3IKICAgICAgICA+CiAgICAgICAgPGRjOnN1YmplY3QKICAgICAgICAgID4KICAgICAgICAgIDxyZGY6QmFnCiAgICAgICAgICAgID4KICAgICAgICAgICAgPHJkZjpsaQogICAgICAgICAgICAgID5pY29uPC9yZGY6bGkKICAgICAgICAgICAgPgogICAgICAgICAgICA8cmRmOmxpCiAgICAgICAgICAgICAgPnNoYXJlPC9yZGY6bGkKICAgICAgICAgICAgPgogICAgICAgICAgPC9yZGY6QmFnCiAgICAgICAgICA+CiAgICAgICAgPC9kYzpzdWJqZWN0CiAgICAgICAgPgogICAgICA8L2NjOldvcmsKICAgICAgPgogICAgICA8Y2M6TGljZW5zZQogICAgICAgICAgcmRmOmFib3V0PSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9wdWJsaWNkb21haW4vIgogICAgICAgID4KICAgICAgICA8Y2M6cGVybWl0cwogICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zI1JlcHJvZHVjdGlvbiIKICAgICAgICAvPgogICAgICAgIDxjYzpwZXJtaXRzCiAgICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjRGlzdHJpYnV0aW9uIgogICAgICAgIC8+CiAgICAgICAgPGNjOnBlcm1pdHMKICAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyNEZXJpdmF0aXZlV29ya3MiCiAgICAgICAgLz4KICAgICAgPC9jYzpMaWNlbnNlCiAgICAgID4KICAgIDwvcmRmOlJERgogICAgPgogIDwvbWV0YWRhdGEKICA+Cjwvc3ZnCj4K";
const blockIconURI = null;

class shareExt{
  constructor (runtime){
    this.runtime = runtime;
    // communication related
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('shareExt', this);
    // session callbacks
    this.reporter = null;
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.write = this.write.bind(this);
    // string op
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
  }

  onclose (){
    this.session = null;
  }

  write (data, parser = null){
    if (this.session){
      return new Promise(resolve => {
        if (parser){
          this.reporter = {
            parser,
            resolve
          }
        }
        this.session.write(data);
      })
    }
  }

  onmessage (data){
    const dataStr = this.decoder.decode(data);
    this.lineBuffer += dataStr;
    if (this.lineBuffer.indexOf('\n') !== -1){
      const lines = this.lineBuffer.split('\n');
      this.lineBuffer = lines.pop();
      for (const l of lines){
        if (this.reporter){
          const {parser, resolve} = this.reporter;
          resolve(parser(l));
        };
      }
    }
  }

  scan (){
    this.comm.getDeviceList().then(result => {
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  getInfo (){
    return {
      id: 'shareExt',
      name: 'Share',
      color1: '#128676',
      color2: '#000000',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'shareurl',
          blockType: BlockType.COMMAND,
          arguments: {
            url: {
              type: ArgumentType.STRING
            }
          },
          text: 'share url [url]'
        },
        {
          opcode: 'url',
          blockType: BlockType.REPORTER,
          text: 'current url'
        }
      ]
    }
  }

shareurl (args, util){
  const url = args.url;

  return this.write(`M0 \n`);
}

url (args, util){

  return this.write(`M0 \n`);
}

}

module.exports = shareExt;
