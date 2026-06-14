const Cast = require('../../util/cast');

const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTMuNTQgMTkyLjc1Ij48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtNHtmaWxsOiMzYzM5Mzk7fS5jbHMtMXtzdHJva2U6IzM3MzgzODtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9LmNscy0xLC5jbHMtM3tzdHJva2Utd2lkdGg6M3B4O30uY2xzLTEsLmNscy0yLC5jbHMtNXtmaWxsLXJ1bGU6ZXZlbm9kZDt9LmNscy0ye2ZpbGw6I2RhYTg1NDt9LmNscy0ze2ZpbGw6bm9uZTtzdHJva2U6IzM4MzgzODtzdHJva2UtbGluZWNhcDpzcXVhcmU7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO30uY2xzLTV7ZmlsbDojMDA5ZGUxO30uY2xzLTZ7ZmlsbDojMzczODM4O30uY2xzLTd7ZmlsbDojMjExODE1O30uY2xzLTh7ZmlsbDojNWNhZmRkO308L3N0eWxlPjwvZGVmcz48dGl0bGU+6LWE5rqQIDg8L3RpdGxlPjxnIGlkPSLlm77lsYJfMiIgZGF0YS1uYW1lPSLlm77lsYIgMiI+PGcgaWQ9IuWbvuWxgl8xLTIiIGRhdGEtbmFtZT0i5Zu+5bGCIDEiPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE5MiwxNzcuNDFWNTAuNGMwLS4zNCwwLS42NywwLTFWNDAuNDVhNS4zOCw1LjM4LDAsMCwwLTUuMzgtNS4zOEg2LjkyYTUuMzgsNS4zOCwwLDAsMC01LjM3LDUuMzh2OC42OWMwLC4zNC0uMDUuNjgtLjA1LDFWMTgxLjU3SDE5MnYtNC4xNlptLTE2OC45MiwwaC0uN2E3LjY4LDcuNjgsMCwxLDEsLjcsMFptMzYuNjIsMEg1OWE3LjY5LDcuNjksMCwxLDEsLjcsMFptMzYuNjMsMGgtLjdhNy42OCw3LjY4LDAsMSwxLC43LDBabTM2LjYzLDBoLS43YTcuNjgsNy42OCwwLDEsMSwuNywwWm0zNi42MiwwaC0uN2E3LjY5LDcuNjksMCwxLDEsLjcsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xOTIsMTc5Ljc0YzAtMi4xNi0zLjg3LTEuNi04LjY1LTEuNkgxMC4xNWMtNC43OCwwLTguNjUtLjUxLTguNjUsMS42NXY3LjU2YzAsMi4xNSwzLjg3LDMuOSw4LjY1LDMuOUgxODMuMzljNC43OCwwLDguNjUtMS43NSw4LjY1LTMuOVoiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0xLjUsMTc1LjcxdjEwLjY4YzAsMi42OCwzLjg3LDQuODYsOC42NSw0Ljg2SDE4My4zOWM0Ljc4LDAsOC42NS0yLjE4LDguNjUtNC44NlYxNzUuNjUiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjExLjM1IiB5PSIxNzMuMTIiIHdpZHRoPSIxLjY0IiBoZWlnaHQ9IjE3LjY2Ii8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSIzMi41NSIgeT0iMTczLjEyIiB3aWR0aD0iMS42NCIgaGVpZ2h0PSIxNy42NiIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iNDAuMjYiIHk9IjE3My41OSIgd2lkdGg9IjEuNjQiIGhlaWdodD0iMTcuNjYiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9Ijc2Ljk3IiB5PSIxNzMuNTkiIHdpZHRoPSIxLjY0IiBoZWlnaHQ9IjE3LjY2Ii8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSIxMTMuNTQiIHk9IjE3My41OSIgd2lkdGg9IjEuNjQiIGhlaWdodD0iMTcuNjYiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjE1MC4wOSIgeT0iMTczLjU5IiB3aWR0aD0iMS42NCIgaGVpZ2h0PSIxNy42NiIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iNDcuOTgiIHk9IjE3My41OSIgd2lkdGg9IjEuNjQiIGhlaWdodD0iMTcuNjYiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9Ijg0LjQ3IiB5PSIxNzMuNTkiIHdpZHRoPSIxLjY0IiBoZWlnaHQ9IjE3LjY2Ii8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSIxMjEuMjUiIHk9IjE3My41OSIgd2lkdGg9IjEuNjQiIGhlaWdodD0iMTcuNjYiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjE1Ny44NSIgeT0iMTczLjU5IiB3aWR0aD0iMS42NCIgaGVpZ2h0PSIxNy42NiIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iNjkuMTciIHk9IjE3My41OSIgd2lkdGg9IjEuNjQiIGhlaWdodD0iMTcuNjYiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9IjEwNS44MSIgeT0iMTczLjU5IiB3aWR0aD0iMS42NCIgaGVpZ2h0PSIxNy42NiIvPjxyZWN0IGNsYXNzPSJjbHMtNCIgeD0iMTQyLjQ1IiB5PSIxNzMuNTkiIHdpZHRoPSIxLjY0IiBoZWlnaHQ9IjE3LjY2Ii8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSIxNzkuMDYiIHk9IjE3My41OSIgd2lkdGg9IjEuNjQiIGhlaWdodD0iMTcuNjYiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yMC45LDE1OS43NEExMC4wOSwxMC4wOSwwLDAsMCwxMywxNjkuOHYxMi43MmMwLS45MiwyLjU4LDIuODcsNi42OSw0LjE0LDYuNzEsMi4wNywxMi44OC05LjYsMTIuODgtOS4zMXYtOEE5LjgsOS44LDAsMCwwLDIwLjksMTU5Ljc0Wm0xLjg3LDE3LjYxYTcuNjksNy42OSwwLDEsMSw3LjY4LTcuNjlBNy42OSw3LjY5LDAsMCwxLDIyLjc3LDE3Ny4zNVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik01OS4zOSwxNTkuNTdhOS43OCw5Ljc4LDAsMCwwLTkuNzgsOS43OHY4YzAsNS40LDQuMzgsNy4yNyw5Ljc4LDcuMjdzOS43OS0xLjg3LDkuNzktNy4yN3YtOEE5Ljc4LDkuNzgsMCwwLDAsNTkuMzksMTU5LjU3Wm0wLDE3Ljc4YTcuNjksNy42OSwwLDEsMSw3LjY5LTcuNjlBNy42OCw3LjY4LDAsMCwxLDU5LjM5LDE3Ny4zNVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik05NS44OSwxNTkuNTdhOS43OCw5Ljc4LDAsMCwwLTkuNzgsOS43OHY4YzAsNS40LDQuMzgsNy4yNyw5Ljc4LDcuMjdzOS43OC0xLjg3LDkuNzgtNy4yN3YtOEE5Ljc4LDkuNzgsMCwwLDAsOTUuODksMTU5LjU3Wk05NiwxNzcuMzVhNy42OSw3LjY5LDAsMSwxLDcuNjgtNy42OUE3LjY5LDcuNjksMCwwLDEsOTYsMTc3LjM1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEzMi42NSwxNTkuNTdhOS43OSw5Ljc5LDAsMCwwLTkuNzksOS43OHY4YzAsNS40LDQuMzksNy4yNyw5Ljc5LDcuMjdzOS43OC0xLjg3LDkuNzgtNy4yN3YtOEE5Ljc4LDkuNzgsMCwwLDAsMTMyLjY1LDE1OS41N1ptMCwxNy43OGE3LjY5LDcuNjksMCwxLDEsNy42OC03LjY5QTcuNjksNy42OSwwLDAsMSwxMzIuNjUsMTc3LjM1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE2OS4yNywxNTkuNTdhOS43OCw5Ljc4LDAsMCwwLTkuNzgsOS43OHY4YzAsNS40LDQuMzgsNy4yNyw5Ljc4LDcuMjdzOS43OS0xLjg3LDkuNzktNy4yN3YtOEE5Ljc5LDkuNzksMCwwLDAsMTY5LjI3LDE1OS41N1ptMCwxNy43OGE3LjY5LDcuNjksMCwxLDEsNy42OS03LjY5QTcuNjgsNy42OCwwLDAsMSwxNjkuMjcsMTc3LjM1WiIvPjxwYXRoIGNsYXNzPSJjbHMtNSIgZD0iTTE4Ni4zNiwyMS40NWgtNjAuMUwxMzguNzgsOC45MmE0LjM1LDQuMzUsMCwwLDAtNi4xNC02LjE1TDExNiwxOS4zN2E0LjMzLDQuMzMsMCwwLDAtMS4xNCwyLjA4SDc4LjY0YTQuMzMsNC4zMywwLDAsMC0xLjE0LTIuMDhMNjAuOSwyLjc3YTQuMzUsNC4zNSwwLDAsMC02LjE1LDYuMTVMNjcuMjgsMjEuNDVINy4xOEE1LjY3LDUuNjcsMCwwLDAsMS41LDI3LjEyVjE1MmE1LjY3LDUuNjcsMCwwLDAsNS42OCw1LjY3SDE4Ni4zNkE1LjY4LDUuNjgsMCwwLDAsMTkyLDE1MlYyNy4xMkE1LjY4LDUuNjgsMCwwLDAsMTg2LjM2LDIxLjQ1Wk05MS42NiwxNDguNjZhMSwxLDAsMCwxLTIsMHYtMy4zM2ExLDEsMCwwLDEsMiwwWm0zLDEuOTRhLjg3Ljg3LDAsMCwxLS44Ni44NmgtLjI3YS44Ny44NywwLDAsMS0uODctLjg2di03LjE1YS44Ny44NywwLDAsMSwuODctLjg3aC4yN2EuODcuODcsMCwwLDEsLjg2Ljg3Wm0zLjEyLDEuNjNhMS4wNywxLjA3LDAsMCwxLTIuMTMsMFYxNDEuNzdhMS4wNywxLjA3LDAsMSwxLDIuMTMsMFptMy0xLjYzYS44Ny44NywwLDAsMS0uODcuODZoLS4yN2EuODcuODcsMCwwLDEtLjg3LS44NnYtNy4xNWEuODcuODcsMCwwLDEsLjg3LS44N0gxMDBhLjg3Ljg3LDAsMCwxLC44Ny44N1ptMy0xLjk0YTEsMSwwLDAsMS0yLDB2LTMuMzNhMSwxLDAsMCwxLDIsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik0xODYuMzYsMTU5LjEySDcuMThBNy4xOCw3LjE4LDAsMCwxLDAsMTUyVjI3LjEyQTcuMTgsNy4xOCwwLDAsMSw3LjE4LDIwSDYzLjY2bC0xMC0xMEE1Ljg1LDUuODUsMCwwLDEsNjIsMS43MWwxNi42LDE2LjZBNS40OSw1LjQ5LDAsMCwxLDc5LjcsMjBoMzQuMTNBNS44OCw1Ljg4LDAsMCwxLDExNSwxOC4zMWwxNi42MS0xNi42YTUuODUsNS44NSwwLDAsMSw4LjI3LDAsNS44NSw1Ljg1LDAsMCwxLDAsOC4yN2wtMTAsMTBoNTYuNDhhNy4xOCw3LjE4LDAsMCwxLDcuMTgsNy4xN1YxNTJBNy4xOCw3LjE4LDAsMCwxLDE4Ni4zNiwxNTkuMTJaTTcuMTgsMjNBNC4xOCw0LjE4LDAsMCwwLDMsMjcuMTJWMTUyYTQuMTgsNC4xOCwwLDAsMCw0LjE4LDQuMTdIMTg2LjM2YTQuMTgsNC4xOCwwLDAsMCw0LjE4LTQuMTdWMjcuMTJBNC4xOCw0LjE4LDAsMCwwLDE4Ni4zNiwyM0gxMjIuNjNMMTM3LjcyLDcuODZhMi44NSwyLjg1LDAsMCwwLTQtNGwtMTYuNjEsMTYuNmEyLjg3LDIuODcsMCwwLDAtLjc0LDEuMzZMMTE2LjA4LDIzSDc3LjQ1bC0uMjctMS4xNmEyLjcxLDIuNzEsMCwwLDAtLjc0LTEuMzZMNTkuODQsMy44M2EyLjg1LDIuODUsMCwwLDAtNCw0TDcwLjksMjNaIi8+PHJlY3QgY2xhc3M9ImNscy03IiB4PSIyNS40MiIgeT0iNDIuMjMiIHdpZHRoPSIxNDIuNyIgaGVpZ2h0PSI5NC42MSIgcng9IjQuMDkiLz48cmVjdCBjbGFzcz0iY2xzLTgiIHg9IjcuODIiIHk9IjExNC44OSIgd2lkdGg9IjEzLjYzIiBoZWlnaHQ9IjIuMjIiIHJ4PSIxLjExIi8+PHJlY3QgY2xhc3M9ImNscy04IiB4PSI4LjE1IiB5PSIxMTkuNTgiIHdpZHRoPSIxMy42MyIgaGVpZ2h0PSIyLjIyIiByeD0iMS4xMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI2LjI2IDYuMjgpIHJvdGF0ZSgtMTIuNzQpIi8+PHJlY3QgY2xhc3M9ImNscy04IiB4PSI3LjgyIiB5PSIxMTAuMjQiIHdpZHRoPSIxMy42MyIgaGVpZ2h0PSIyLjIyIiByeD0iMS4xMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTguNDIgLTAuODkpIHJvdGF0ZSg5LjQyKSIvPjxyZWN0IGNsYXNzPSJjbHMtOCIgeD0iMTcyLjA4IiB5PSIxMTQuODkiIHdpZHRoPSIxMy42MyIgaGVpZ2h0PSIyLjIyIiByeD0iMS4xMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzU3LjggMjMyKSByb3RhdGUoMTgwKSIvPjxyZWN0IGNsYXNzPSJjbHMtOCIgeD0iMTcxLjc1IiB5PSIxMTkuNTgiIHdpZHRoPSIxMy42MyIgaGVpZ2h0PSIyLjIyIiByeD0iMS4xMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzI2LjExIDI3Ny44KSByb3RhdGUoLTE2Ny4yNikiLz48cmVjdCBjbGFzcz0iY2xzLTgiIHg9IjE3Mi4wOCIgeT0iMTEwLjI0IiB3aWR0aD0iMTMuNjMiIGhlaWdodD0iMi4yMiIgcng9IjEuMTEiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjk5LCAwLjE2LCAtMC4xNiwgLTAuOTksIDM3My42MSwgMTkxLjkxKSIvPjwvZz48L2c+PC9zdmc+"
const blockIconURI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTAuNTQgMTU2LjEyIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjtmaWxsLXJ1bGU6ZXZlbm9kZDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPui1hOa6kCAxPC90aXRsZT48ZyBpZD0i5Zu+5bGCXzIiIGRhdGEtbmFtZT0i5Zu+5bGCIDIiPjxnIGlkPSLlm77lsYJfMS0yIiBkYXRhLW5hbWU9IuWbvuWxgiAxIj48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xODQuODYsMjBoLTYwLjFMMTM3LjI4LDcuNDJhNC4zNSw0LjM1LDAsMCwwLTYuMTQtNi4xNWwtMTYuNjEsMTYuNkE0LjMzLDQuMzMsMCwwLDAsMTEzLjM5LDIwSDc3LjE0QTQuMzMsNC4zMywwLDAsMCw3NiwxNy44N0w1OS40LDEuMjdhNC4zNSw0LjM1LDAsMCwwLTYuMTUsNi4xNUw2NS43OCwyMEg1LjY4QTUuNjcsNS42NywwLDAsMCwwLDI1LjYyVjE1MC40NWE1LjY3LDUuNjcsMCwwLDAsNS42OCw1LjY3SDE4NC44NmE1LjY4LDUuNjgsMCwwLDAsNS42OC01LjY3VjI1LjYyQTUuNjgsNS42OCwwLDAsMCwxODQuODYsMjBaTTkwLjE2LDE0Ny4xNmExLDEsMCwwLDEtMiwwdi0zLjMzYTEsMSwwLDAsMSwyLDBabTMsMS45NGEuODcuODcsMCwwLDEtLjg2Ljg2aC0uMjdhLjg3Ljg3LDAsMCwxLS44Ny0uODZWMTQyYS44Ny44NywwLDAsMSwuODctLjg3aC4yN2EuODcuODcsMCwwLDEsLjg2Ljg3Wm0zLjEyLDEuNjNhMS4wNywxLjA3LDAsMCwxLTIuMTMsMFYxNDAuMjdhMS4wNywxLjA3LDAsMSwxLDIuMTMsMFptMy0xLjYzYS44Ny44NywwLDAsMS0uODcuODZoLS4yN2EuODcuODcsMCwwLDEtLjg3LS44NlYxNDJhLjg3Ljg3LDAsMCwxLC44Ny0uODdoLjI3YS44Ny44NywwLDAsMSwuODcuODdabTMtMS45NGExLDEsMCwwLDEtMiwwdi0zLjMzYTEsMSwwLDAsMSwyLDBabTY0LjI1LTE1LjkyYTQuMSw0LjEsMCwwLDEtNC4xLDQuMUgyOGE0LjA5LDQuMDksMCwwLDEtNC4wOS00LjFWNDQuODJBNC4wOSw0LjA5LDAsMCwxLDI4LDQwLjczSDE2Mi41MmE0LjEsNC4xLDAsMCwxLDQuMSw0LjA5WiIvPjwvZz48L2c+PC9zdmc+"

socket = null
isConnected = false
output = null

class FutureBoard {

	waitingForResponse = false

	constructor(runtime) {
		this.runtime = runtime
		if (window.location.protocol == "https:") {
			alert("You're using secure HTTPS protocol to access Scratch++ and your browser will probably block access to Future Board because it's using insecure WS protocol. If you want to use this extension you must enable mixed content in your browser.")
		}
	}

	ws_onopen(event) {
		isConnected = true;
		console.log("[FB] Connected.");
	}

	ws_onmessage(event) {
		var response = JSON.parse(event.data)
		if (response["method"] == "data") {
			var lines = Buffer.from(response["params"]["data"], 'base64').toString().split(/\r?\n/)
			if (lines.length > 1 && lines[1] != "" && lines[1] != ">>> ") {
				output = lines[1]
				console.log("[FB] Output: " + output)
			} else {
				output = null
			}
		}
	}

	ws_onclose(event) {
		isConnected = false
		if (event.wasClean) {
			console.log("[FB] Disconnected.")
		} else {
			console.log("[FB] Disconnected with code " + event.code + " and reason " + event.reason + ".")
		}
	}

	ws_onerror(error) {
		console.log("[FB] Error: " + error.message)
	}

	ws_connect(ip) {
		if (!isConnected) {
			socket = new WebSocket("ws://" + ip)
			socket.onopen = this.ws_onopen
			socket.onmessage = this.ws_onmessage
			socket.onclose = this.ws_onclose
			socket.onerror = this.ws_onerror
		}
	}

	ws_send(command) {
		if (isConnected) {
			var b64Command = Buffer.from(command + '\r').toString('base64')
			var message = '{"jsonrpc": "2.0", "method": "write", "params": {"data": "' + b64Command + '"}}\n'
			console.log("[FB] Sending: " + message)
			socket.send(message)
		}
	}

	ws_disconnect() {
		if (isConnected) {
			isConnected = false
			output = null
			socket.close()
			console.log("[FB] Disconnected.")
		}
	}

	getInfo() {
		return {
			id: "futureBoard",
			name: "Future Board",
			menuIconURI: menuIconURI,
			blockIconURI: blockIconURI,
			blocks: [
				{
					opcode: "connect",
					blockType: "command",
					text: "connect to [ip]",
					arguments: {
						ip: {
							type: "string",
							defaultValue: "192.168.1.2"
						}
					}
				},
				{
					opcode: "disconnect",
					blockType: "command",
					text: "disconnect"
				},
				{
					opcode: "import",
					blockType: "command",
					text: "import [module]",
					arguments: {
						module: {
							type: "string",
							menu: "module",
							defaultValue: "audio"
						},
					}
				},
				{
					opcode: "screenFill",
					blockType: "command",
					text: "fill screen with [color] color",
					arguments: {
						color: {
							type: "color",
							defaultValue: "#FFFFFF"
						}
					}
				},
				{
					opcode: "screenText",
					blockType: "command",
					text: "write [text] x[x] y[y] size[size] color[color]",
					arguments: {
						text: {
							type: "string",
							defaultValue: "Hello, World!"
						},
						x: {
							type: "number",
							defaultValue: 5
						},
						y: {
							type: "number",
							defaultValue: 10
						},
						size: {
							type: "number",
							defaultValue: 1
						},
						color: {
							type: "color",
							defaultValue: "#FFFFFF"
						}
					}
				},
				{
					opcode: "screenLine",
					blockType: "command",
					text: "draw [color] line from x[x1] y[y1] to x[x2] y[y2]",
					arguments: {
						color: {
							type: "color",
							defaultValue: "#FFFFFF"
						},
						x1: {
							type: "number",
							defaultValue: 0
						},
						y1: {
							type: "number",
							defaultValue: 0
						},
						x2: {
							type: "number",
							defaultValue: 160
						},
						y2: {
							type: "number",
							defaultValue: 128
						}
					}
				},
				{
					opcode: "screenClear",
					blockType: "command",
					text: "clear screen"
				},
				{
					opcode: "screenSync",
					blockType: "command",
					text: "set screen sync to [mode]",
					arguments: {
						mode: {
							type: "number",
							menu: "syncMode",
							defaultValue: "0"
						},
					}
				},
				{
					opcode: "screenRefresh",
					blockType: "command",
					text: "refresh screen"
				},
				{
					opcode: "sensorBtnValue",
					blockType: "Boolean",
					text: "[button] button pressed?",
					arguments: {
						button: {
							type: "string",
							menu: "button",
							defaultValue: "A"
						},
					}
				},
				{
					opcode: "audioLoudness",
					blockType: "reporter",
					text: "loudness"
				},
				{
					opcode: "buzzerTone",
					blockType: "command",
					text: "play tone [tone] for [duration] second(s)",
					arguments: {
						tone: {
							type: "number",
							defaultValue: 440
						},
						duration: {
							type: "number",
							defaultValue: 1
						}
					}
				},
				{
					opcode: "buzzerNote",
					blockType: "command",
					text: "play note [note] for [duration] beats",
					arguments: {
						note: {
							type: "note",
							defaultValue: 60
						},
						duration: {
							type: "number",
							defaultValue: 0.5
						}
					}
				},
				{
					opcode: "buzzerRest",
					blockType: "command",
					text: "rest for [duration] beats",
					arguments: {
						duration: {
							type: "number",
							defaultValue: 0.5
						}
					}
				},
				{
					opcode: "buzzerMelody",
					blockType: "command",
					text: "play melody [melody]",
					arguments: {
						melody: {
							type: "string",
							menu: "melody",
							defaultValue: "CORRECT"
						}
					}
				},
				{
					opcode: "buzzerCustomMelody",
					blockType: "command",
					text: "play melody [melody]",
					arguments: {
						melody: {
							type: "string",
							defaultValue: "g4:1 c5 e g:2 e:1 g:3"
						}
					}
				},
				{
					opcode: "buzzerSetBpm",
					blockType: "command",
					text: "set tempo to [tempo]",
					arguments: {
						tempo: {
							type: "number",
							defaultValue: 60
						}
					}
				},
				{
					opcode: "buzzerStop",
					blockType: "command",
					text: "stop playing"
				},
				{
					opcode: "sensorAcc",
					blockType: "reporter",
					text: "IMU acc [axis]",
					arguments: {
						axis: {
							type: "string",
							menu: "accAxis",
							defaultValue: "x"
						}
					}
				},
				{
					opcode: "sensorRollPitch",
					blockType: "reporter",
					text: "IMU [rotation] angle",
					arguments: {
						rotation: {
							type: "string",
							menu: "rotation",
							defaultValue: "roll"
						}
					}
				},
				{
					opcode: "sensorGesture",
					blockType: "Boolean",
					text: "IMU [gesture]",
					arguments: {
						gesture: {
							type: "string",
							menu: "gesture",
							defaultValue: "shake"
						}
					}
				},
				{
					opcode: "sensorMag",
					blockType: "reporter",
					text: "IMU mag [axis]",
					arguments: {
						axis: {
							type: "string",
							menu: "magAxis",
							defaultValue: "x"
						}
					}
				},
				{
					opcode: "sensorHeading",
					blockType: "reporter",
					text: "IMU compass heading"
				},
				{
					opcode: "calibrateCompass",
					blockType: "command",
					text: "IMU calibrate compass"
				},
				{
					opcode: "neoPixel",
					blockType: "command",
					text: "init NeoPixel",
					arguments: {
						axis: {
							type: "string",
							menu: "magAxis",
							defaultValue: "x"
						}
					}
				},
				{
					opcode: "neoPixelSetColor",
					blockType: "command",
					text: "set NeoPixel color at [index] to [color]",
					arguments: {
						index: {
							type: "number",
							menu: "neoPixelIndex",
							defaultValue: 0
						},
						color: {
							type: "color",
							defaultValue: "#FFFFFF"
						}
					}
				},
				{
					opcode: "neoPixelSetColorAll",
					blockType: "command",
					text: "set NeoPixel to [color]",
					arguments: {
						color: {
							type: "color",
							defaultValue: "#FFFFFF"
						}
					}
				},
				{
					opcode: "neoPixelUpdate",
					blockType: "command",
					text: "update NeoPixel"
				},
				{
					opcode: "meowPin",
					blockType: "command",
					text: "init [pin] as [mode]",
					arguments: {
						pin: {
							type: "string",
							menu: "pin",
							defaultValue: "P0"
						},
						mode: {
							type: "string",
							menu: "pinMode",
							defaultValue: "IN"
						}
					}
				},
				{
					opcode: "meowPinGetDigital",
					blockType: "reporter",
					text: "digital read [pin]",
					arguments: {
						pin: {
							type: "string",
							menu: "pin",
							defaultValue: "P0"
						}
					}
				},
				{
					opcode: "meowPinSetDigital",
					blockType: "command",
					text: "digital write [pin] to [value]",
					arguments: {
						pin: {
							type: "string",
							menu: "pin",
							defaultValue: "P0"
						},
						value: {
							type: "number",
							menu: "pinValue",
							defaultValue: 1
						}
					}
				},
				{
					opcode: "meowPinGetAnalog",
					blockType: "reporter",
					text: "analog read [pin]",
					arguments: {
						pin: {
							type: "string",
							menu: "pin",
							defaultValue: "P0"
						}
					}
				},
				{
					opcode: "meowPinSetAnalog",
					blockType: "command",
					text: "analog write [pin] to [value]",
					arguments: {
						pin: {
							type: "string",
							menu: "pin",
							defaultValue: "P0"
						},
						value: {
							type: "number",
							defaultValue: 1023
						}
					}
				},
				{
					opcode: "execute",
					blockType: "command",
					text: "execute [command]",
					arguments: {
						command: {
							type: "string",
							defaultValue: "buzzer.note(60,1/2)"
						}
					}
				},
				{
					opcode: "executeWithResponse",
					blockType: "reporter",
					text: "execute [command]",
					arguments: {
						command: {
							type: "string",
							defaultValue: "sensor.btnValue('a')"
						}
					}
				},
			],
			menus: {
				module: ["audio"],
				syncMode: ["0", "1"],
				button: ["A", "B"],
				melody: ["CORRECT", "NOTICE", "ERROR", "DADA", "ENTERTAINER", "PRELUDE", "ODE", "NYAN", "RING", "FUNK", "BLUES", "BIRTHDAY", "WEDDING", "FUNERAL", "PUNCHLINE", "BADDY", "CHASE", "BA_DING", "WAWA", "JUMP_UP", "JUMP_DOWN", "POWER_UP", "POWER_DOWN"],
				accAxis: ["x", "y", "z"],
				rotation: ["roll", "pitch"],
				gesture: ["shake", "freefall", "tilt_up", "tilt_down", "tilt_left", "tilt_right", "face_up", "face_down"],
				magAxis: ["x", "y", "z", "strength"],
				neoPixelIndex: ["0", "1", "2"],
				pin: ["P0", "P1", "P2", "P8", "P12", "P13", "P14", "P15"],
				pinMode: ["IN", "OUT", "ANALOG", "PWM"],
				pinValue: ["0", "1"]
			}
		};
	}

	connect({ ip }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			this.ws_connect(ip)
			output = null
			setTimeout(function () { output = 1 }, 1000);
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
			this.ws_send("buzzer.melody(CORRECT)")
		}
	}

	disconnect() {
		this.ws_disconnect()
	}

	import({ module }) {
		const command = `import ${module}`
		this.ws_send(command)
	}

	screenFill({ color }) {
		const rgbColor = Cast.toRgbColorObject(color)
		const command = `screen.fill((${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}))`
		this.ws_send(command)
	}

	screenText({ text, x, y, size, color }) {
		const rgbColor = Cast.toRgbColorObject(color)
		const command = `screen.text("${text}", ${x}, ${y}, ${size}, (${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}))`
		this.ws_send(command)
	}

	screenLine({ color, x1, y1, x2, y2 }) {
		const rgbColor = Cast.toRgbColorObject(color)
		const command = `screen.line(${x1}, ${y1}, ${x2}, ${y2}, (${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}))`
		this.ws_send(command)
	}

	screenClear() {
		const command = `screen.clear()`
		this.ws_send(command)
	}

	screenSync({ mode }) {
		const command = `screen.sync = ${mode}`
		this.ws_send(command)
	}

	screenRefresh() {
		const command = `screen.refresh()`
		this.ws_send(command)
	}

	sensorBtnValue({ button }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			output = null
			const command = `sensor.btnValue('${button.toLowerCase()}')`
			this.ws_send(command)
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
		}
		return output == "True"
	}

	audioLoudness({ }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			output = null
			const command = `audio.Audio().loudness()`
			this.ws_send(command)
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
		}
		return output
	}

	buzzerTone({ tone, duration }) {
		const command = `buzzer.tone(${tone}, ${duration})`
		this.ws_send(command)
	}

	buzzerNote({ note, duration }) {
		const command = `buzzer.note(${note}, ${duration})`
		this.ws_send(command)
	}

	buzzerRest({ duration }) {
		const command = `buzzer.rest(${duration})`
		this.ws_send(command)
	}

	buzzerMelody({ melody }) {
		const command = `buzzer.melody(${melody})`
		this.ws_send(command)
	}

	buzzerCustomMelody({ melody }) {
		const command = `buzzer.melody("${melody}")`
		this.ws_send(command)
	}

	buzzerSetBpm({ tempo }) {
		const command = `buzzer.setBpm(${tempo})`
		this.ws_send(command)
	}

	buzzerStop() {
		const command = `buzzer.stop()`
		this.ws_send(command)
	}

	sensorAcc({ axis }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			output = null
			const command = `sensor.acc${axis.toUpperCase()}()`
			this.ws_send(command)
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
		}
		return output
	}

	sensorRollPitch({ rotation }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			output = null
			const command = `sensor.${rotation}()`
			this.ws_send(command)
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
		}
		return output
	}

	sensorGesture({ gesture }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			output = null
			const command = `sensor.gesture("${gesture}")`
			this.ws_send(command)
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
		}
		return output == "True"
	}

	sensorMag({ axis }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			output = null
			var command = `sensor.mag${axis.toUpperCase()}()`
			if (axis == "strength") {
				command = `sensor.magStrength()`
			}
			this.ws_send(command)
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
		}
		return output
	}

	sensorHeading() {
		const command = `sensor.heading()`
		this.ws_send(command)
	}

	calibrateCompass() {
		const command = `calibrateCompass()`
		this.ws_send(command)
	}

	neoPixel() {
		const command = `np = NeoPixel("P7", 3)`
		this.ws_send(command)
	}

	neoPixelSetColor({ index, color }) {
		const rgbColor = Cast.toRgbColorObject(color)
		const command = `np.setColor(${index}, (${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}))`
		this.ws_send(command)
	}

	neoPixelSetColorAll({ color }) {
		const rgbColor = Cast.toRgbColorObject(color)
		const command = `np.setColorAll((${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}))`
		this.ws_send(command)
	}

	neoPixelUpdate() {
		const command = `np.update()`
		this.ws_send(command)
	}

	meowPin({ pin, mode }) {
		const command = `${pin} = MeowPin("${pin}", "${mode}")`
		this.ws_send(command)
	}

	meowPinGetDigital({ pin }) {
		const command = `${pin}.getDigital()`
		this.ws_send(command)
	}

	meowPinSetDigital({ pin, value }) {
		const command = `${pin}.setDigital(${value})`
		this.ws_send(command)
	}

	meowPinGetAnalog({ pin }) {
		const command = `${pin}.getAnalog(width=10)`
		this.ws_send(command)
	}

	meowPinSetAnalog({ pin, value }) {
		const command = `${pin}.setAnalog(${value})`
		this.ws_send(command)
	}

	execute({ command }) {
		this.ws_send(command)
	}

	executeWithResponse({ command }, util) {
		if (!this.waitingForResponse) {
			this.waitingForResponse = true
			output = null
			this.ws_send(command)
		}
		if (output == null) {
			util.yield();
		} else {
			this.waitingForResponse = false
		}
		return output
	}

}

module.exports = FutureBoard;