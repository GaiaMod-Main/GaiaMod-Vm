class Serial {
  constructor (
    runtime, 
    extensionId, 
    connectCallback,
    messageCallback
    ) {
    this._runtime = runtime
    this._extensionId = extensionId
    this._availablePeripherals = []
    this._device = null
    this.connected = false
    this._connectCallback = connectCallback
    this.requestPeripheral()
    this._messageCallback = messageCallback
  }

  requestPeripheral(){
    navigator.serial.requestPort()
    .then(this._handleUpdateDevices)
    .catch(() => {
      if(navigator.serial.getPorts().length === 0) this._handleDiscoveryTimeout
      else this._handleUpdateDevices()
    })
  }

  _readPort(){
    this._reader = this._device.readable.getReader()
    let data = ''
    const read = () => {
      this._reader.read().then(({value, done}) => {
        if(done){
          this._reader.releaseLock()
          return
        }
        value.forEach(element => {
          if(element === 3 || element === 4){
            this._reader.releaseLock()
            return
          } else if(element === 10){
            data += String.fromCharCode(element)
            this._messageCallback(data)
            data = ''
          } else data += String.fromCharCode(element)
        })
        read()
      })
    }
    read()
  }

  connectPeripheral(id){
    navigator.serial.getPorts().then(ports => {
      if(ports[id]) {
        this._device = ports[id]
        //Realizar confirmacion del firmware
        //Realizar autenticacion de dispositivo
        this._device.open({baudRate: 115200})
        .then(() => {
          this.connected = true
          this._runtime.emit(this._runtime.constructor.PERIPHERAL_CONNECTED)
          this._connectCallback()
          this._readPort()
        })
        .catch(e => {
          this.connected = false
          this._runtime.emit(this._runtime.constructor.PERIPHERAL_REQUEST_ERROR)
        })
      }
    })
  }

  disconnectPeripheral(){
    if(this.connected) {
      this._reader.cancel().then(() => {
        this.connected = false
        this._device.close()
        this._runtime.emit(this._runtime.constructor.PERIPHERAL_DISCONNECTED);
      })
    }
  }

  _handleUpdateDevices = () => {
    navigator.serial.getPorts().then(ports => {
      this._availablePeripherals = []
      ports.forEach((port, index) => {
        this._availablePeripherals[index] = {
          "peripheralId": `${index}`,
          "name": "Serial COM",
          "rssi": -50
        }
      })
      this._runtime.emit(
        this._runtime.constructor.PERIPHERAL_LIST_UPDATE, 
        this._availablePeripherals
      )
    })
  }

  _handleDiscoveryTimeout () {
    this._runtime.emit(this._runtime.constructor.PERIPHERAL_SCAN_TIMEOUT)
  }


}


module.exports = Serial