const ArgumentType = require(`../../extension-support/argument-type`);
const BlockType = require(`../../extension-support/block-type`);
const axios = require(`axios`).default;
const formatMessage = require(`format-message`);

const de = false;  // true when debugging

/**
 * write de&&bug(*your arguments*) in your code to make debug logging.
 * this function will only be called if `de` is set to true.
 * @param args an infinite number of arguments
 */
function bug(...args) {
	args.forEach(arg => {
		console.log(arg);
	});
}

class Scratch3Poppy {

	static get DEFAULT_LANG() {
		return 'en';
	}

	constructor(runtime) {
		this.runtime = runtime;
		this._robotUrl = 'Undefined';
		this._robotIp = '';
		this._robotPort = '8080';
	}

	poppyErrorManager(status, err) {
		let error = err.error || "";
		let tip = err.tip || "";
		let details = err.details || "";
		let msg = "Error " + status + " : " + error + "\n\nTip : " + tip + "\n\nDetails : " + details;
		alert(msg)
		throw new Error("Error " + status);
	}

	getInfo() {
		const messages = this.getMessagesForLocale();

		return {
			id: 'poppy',
			name: 'Poppy',
			blocks: [
				{
					opcode: 'setHost',
					blockType: BlockType.COMMAND,
					text: messages.blocks.setHost,
					arguments: {
						URL: {
							type: ArgumentType.STRING,
							defaultValue: "poppy.local"
						}
					}
				},

				{
					opcode: 'testConnection',
					blockType: BlockType.REPORTER,
					text: messages.blocks.testConnection
				},

				{
					opcode: 'poppyUrl',
					blockType: BlockType.REPORTER,
					text: messages.blocks.poppyUrl
				},


				{
					opcode: 'getMotors',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getMotors
				},

				{
					opcode: 'getRobotAliases',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getRobotAliases
				},

				{
					opcode: 'getMotorsInGroup',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getMotorsInGroup,
					arguments: {
						GROUP: {
							type: ArgumentType.STRING,
							defaultValue: 'group_name'
						}
					}
				},

				{
					opcode: 'getMotorRegister',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getMotorRegister,
					arguments: {
						REGISTER: {
							type: ArgumentType.STRING,
							defaultValue: 'present_position',
							menu: 'register'
						},
						MOTOR: {
							type: ArgumentType.STRING,
							defaultValue: 'motor_name'
						}
					}
				},

				{
					opcode: 'getMotorsPositions',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getMotorsPositions
				},

				{
					opcode: 'indexMotor',
					blockType: BlockType.REPORTER,
					text: messages.blocks.indexMotor,
					arguments: {
						MOTOR: {
							type: ArgumentType.STRING,
							defaultValue: 'motor_name'
						}
					}
				},

				{
					opcode: 'setCompliant',
					blockType: BlockType.COMMAND,
					text: messages.blocks.setCompliant,
					arguments: {
						MOTORS: {
							type: ArgumentType.STRING,
							defaultValue: 'motor_name'
						},
						STATUS: {
							type: ArgumentType.STRING,
							menu: 'compliant'
						}
					}
				},

				{
					opcode: 'setValue',
					blockType: BlockType.COMMAND,
					text: messages.blocks.setValue,
					arguments: {
						MOTORS: {
							type: ArgumentType.STRING,
							defaultValue: 'head_z'
						},
						REGISTER: {
							type: ArgumentType.STRING,
							menu: 'variable'
						},
						VALUE: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						}
					}
				},

				{
					opcode: 'motorGotoPosition',
					blockType: BlockType.COMMAND,
					text: messages.blocks.motorGotoPosition,
					arguments: {
						MOTORS: {
							type: ArgumentType.STRING,
							defaultValue: 'motor_name'
						},
						POSITIONS: {
							type: ArgumentType.STRING,
							defaultValue: 0
						},
						DURATION: {
							type: ArgumentType.NUMBER,
							defaultValue: 2
						},
						WAIT: {
							type: ArgumentType.STRING,
							menu: 'wait'
						}
					}
				},

				{
					opcode: 'detectMarker',
					blockType: BlockType.BOOLEAN,
					text: messages.blocks.detectMarker,
					arguments: {
						CODE: {
							type: ArgumentType.STRING,
							defaultValue: "caribou",
							menu: "marker"
						}
					}
				},

				{
					opcode: 'listVisibleMarkers',
					blockType: BlockType.REPORTER,
					text: messages.blocks.listVisibleMarkers
				},

				{
					opcode: 'getAvailableRecords',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getAvailableRecords
				},

				{
					opcode: 'recordMove',
					BlockType: BlockType.COMMAND,
					text: messages.blocks.recordMove,
					arguments: {
						MOVE: {
							type: ArgumentType.STRING,
							defaultValue: 'move_name'
						},
						MOTORS: {
							type: ArgumentType.STRING,
							defaultValue: 'motor_name'
						}
					}
				},

				{
					opcode: 'saveMove',
					BlockType: BlockType.COMMAND,
					text: messages.blocks.saveMove,
					arguments: {
						MOVE: {
							type: ArgumentType.STRING,
							defaultValue: 'move_name'
						}
					}
				},

				{
					opcode: 'startMovePlayer',
					blockType: BlockType.COMMAND,
					text: messages.blocks.startMovePlayer,
					arguments: {
						MOVE: {
							type: ArgumentType.STRING,
							defaultValue: 'move_name'
						},
						SPEED: {
							type: ArgumentType.NUMBER,
							defaultValue: 1.0
						}
					}
				},

				{
					opcode: 'stopMovePlayer',
					blockType: BlockType.COMMAND,
					text: messages.blocks.stopMovePlayer,
					arguments: {
						TEXT: {
							type: ArgumentType.STRING,
							defaultValue: 'move_name'
						}
					}
				},

				{
					opcode: 'deleteRecord',
					blockType: BlockType.COMMAND,
					text: messages.blocks.deleteRecord,
					arguments: {
						MOVE: {
							type: ArgumentType.STRING,
							defaultValue: 'move_name'
						}
					}
				},

				{
					opcode: 'getPrimitives',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getPrimitives,
					arguments: {
						STATE: {
							type: ArgumentType.STRING,
							defaultValue: 'all',
							menu: 'getBehaviours'
						}
					}
				},

				{
					opcode: 'actionPrimitives',
					blockType: BlockType.COMMAND,
					text: messages.blocks.actionPrimitives,
					arguments: {
						ACTION: {
							type: ArgumentType.STRING,
							defaultValue: 'start',
							menu: 'actionBehaviours'
						},
						PRIMITIVE: {
							type: ArgumentType.STRING,
							defaultValue: 'behaviour_name'
						}
					}
				},

				{
					opcode: 'getPropertiesMethods',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getPropertiesMethods,
					arguments: {
						ATTRIBUTE: {
							type: ArgumentType.STRING,
							menu: 'getPropBehaviours'
						},
						BEHAVIOUR: {
							type: ArgumentType.STRING,
							defaultValue: 'behaviour_name'
						}
					}
				},

				{
					opcode: 'getRESTAPI',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getRESTAPI,
					arguments: {
						REQUEST: {
							type: ArgumentType.STRING,
							defaultValue: '/motors/list.json'
						}
					}
				},

				{
					opcode: 'postRESTAPI',
					blockType: BlockType.REPORTER,
					text: messages.blocks.postRESTAPI,
					arguments: {
						DATA: {
							type: ArgumentType.STRING,
							defaultValue: 'true'
						},
						URL: {
							type: ArgumentType.STRING,
							defaultValue: '/motors/m1/registers/compliant/value.json'
						}
					}
				},

				{
					opcode: 'getIKpose',
					blockType: BlockType.REPORTER,
					text: messages.blocks.getIKpose,
					arguments: {
						CHAIN: {
							type: ArgumentType.STRING,
							defaultValue: 'chain',
							menu: 'IKchains'
						}
					}
				},

				{
					opcode: 'gotoIK',
					blockType: BlockType.COMMAND,
					text: messages.blocks.gotoIK,
					arguments: {
						CHAIN: {
							type: ArgumentType.STRING,
							defaultValue: 'chain',
							menu: 'IKchains'
						},
						X: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						Y: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						Z: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						DURATION: {
							type: ArgumentType.NUMBER,
							defaultValue: 2
						},
						WAIT: {
							type: ArgumentType.STRING,
							menu: 'wait'
						}
					}
				},

				{
					opcode: 'gotoIKorientation',
					blockType: BlockType.COMMAND,
					text: messages.blocks.gotoIKorientation,
					arguments: {
						CHAIN: {
							type: ArgumentType.STRING,
							defaultValue: 'chain',
							menu: 'IKchains'
						},
						X: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						Y: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						Z: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						ROLL: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						PITCH: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						YAW: {
							type: ArgumentType.STRING,
							defaultValue: '0'
						},
						DURATION: {
							type: ArgumentType.NUMBER,
							defaultValue: 2
						},
						WAIT: {
							type: ArgumentType.STRING,
							menu: 'wait'
						}
					}
				},


			],

			menus: {
				marker: {
					acceptReporters: true,
					items: [
						{text: messages.menus.marker.caribou, value: 'caribou'},
						{text: messages.menus.marker.tetris, value: 'tetris'},
						{text: messages.menus.marker.lapin, value: 'lapin'}
					]
				},
				IKchains: {
					acceptReporters: true,
					items: [
						{text: messages.menus.IKchains.chain, value: 'chain'},
						{text: messages.menus.IKchains.r_arm_chain, value: 'r_arm_chain'},
						{text: messages.menus.IKchains.l_arm_chain, value: 'l_arm_chain'}
					]
				},
				getBehaviours: {
					acceptReporters: true,
					items: [
						{text: messages.menus.getBehaviours.all, value: 'all'},
						{text: messages.menus.getBehaviours.running, value: 'running'}
					]
				},
				getPropBehaviours: {
					acceptReporters: true,
					items: [
						{text: messages.menus.getPropBehaviours.method, value: 'methods'},
						{text: messages.menus.getPropBehaviours.property, value: 'properties'}
					]
				},
				actionBehaviours: {
					acceptReporters: true,
					items: [
						{text: messages.menus.actionBehaviours.start, value: 'start'},
						{text: messages.menus.actionBehaviours.stop, value: 'stop'},
						{text: messages.menus.actionBehaviours.pause, value: 'pause'},
						{text: messages.menus.actionBehaviours.resume, value: 'resume'}
					]
				},
				compliant: {
					acceptReporters: true,
					items: [
						{text: messages.menus.compliant.compliant, value: 'true'},
						{text: messages.menus.compliant.stiff, value: 'false'}
					]
				},
				wait: {
					acceptReporters: true,
					items: [
						{text: messages.menus.wait.false, value: 'false'},
						{text: messages.menus.wait.true, value: 'true'}
					]
				},
				init: {
					acceptReporters: true,
					items: [
						{text: messages.menus.init.start, value: 'start'},
						{text: messages.menus.init.stop, value: 'stop'},
						{text: messages.menus.init.reset, value: 'reset'}
					]
				},
				variable: {
					acceptReporters: true,
					items: [
						{text: messages.menus.variable.goal_position, value: 'goal_position'},
						{text: messages.menus.variable.moving_speed, value: 'moving_speed'},
						{text: messages.menus.variable.torque_limit, value: 'torque_limit'},
						{text: messages.menus.variable.compliant, value: 'compliant'}
					]
				},
				register: {
					acceptReporters: true,
					items: [
						{text: messages.menus.register.present_position, value: 'present_position'},
						{text: messages.menus.register.present_speed, value: 'present_speed'},
						{text: messages.menus.register.present_load, value: 'present_load'},
						{text: messages.menus.register.present_temperature, value: 'present_temperature'},
						{text: messages.menus.register.present_voltage, value: 'present_voltage'},
						{text: messages.menus.register.goal_position, value: 'goal_position'},
						{text: messages.menus.register.moving_speed, value: 'moving_speed'},
						{text: messages.menus.register.torque_limit, value: 'torque_limit'},
						{text: messages.menus.register.compliant, value: 'compliant'}
					]
				}
			}
		};
	}


	/**
	 * Gets the values all present_positions of the motors.
	 * @returns {Promise<any[] | string>} an array containing all motor positions.
	 */
	getMotorsPositions() {
		return this.getRESTAPI({REQUEST: '/motors/registers/present_position/list.json'})
			.then(resp => {
				let positions = Object.values(JSON.parse(resp).present_position);
				de && bug(positions); // array containing all motor positions.
				return positions;
			})
			.catch(() => {
				return 'Error with the connection';
			});
	}

	/**
	 * Makes a GET request to the REST API using getRESTAPI() to have
	 * a list of all motor groups available.
	 * The answer is then formatted for the user.
	 * @returns {Promise<*>} the motor aliases separated by a colon.
	 */
	getRobotAliases() {
		return this.getRESTAPI({REQUEST: "/motors/aliases/list.json"})
			.then(motors => JSON.parse(motors).aliases.toString())
			.catch(() => {
				return 'Error with the connection';
			});
	}

	/**
	 * Makes a GET request to the REST API using getRESTAPI() to read the qrcode with the embedded camera.
	 * You should give the name of a preset code such as lapin, tetris, caribou...
	 * @returns {Promise<*>} a boolean (true of false) depending on whether the code is read by the camera.
	 */
	detectMarker(args) {
		let code = args.CODE.toString();
		return this.getRESTAPI({REQUEST: '/sensors/code/' + code + '.json'})
			.then(boolean => JSON.parse(boolean).found)
			.catch(() => {
				return 'Error with the connection';
			});
	}

	/**
	 * Makes a GET request to the REST API using getRESTAPI() to get the list of all codes read by the camera.
	 * @returns {Promise<*>} a list of code names in front of the camera.
	 */
	listVisibleMarkers() {
		const knownMarkers = {
			112259237: 'tetris',
			221052793: 'caribou',
			44616414: 'lapin,rabbit',
		}
		return this.getRESTAPI({REQUEST: '/sensors/code/list.json'})
			.then(res => JSON.parse(res).codes)  // list of ints (or empty list)
			.then(list => {
				console.log(list);
				let code_names = [];
				let name;
				for(let i = 0; i < list.length; i++){
					console.log("id" + list[i].toString())
					name = knownMarkers[list[i]]
					console.log("name: " + name);
					code_names.push(name);
				}
				console.log("code_names: " + code_names);
				return code_names.toString()
			})
			.catch(() => {
				return 'Error with the connection';
			});
	}

	/**
	 * Gives a list of all motors of a group
	 * @param args the group is stored in args.GROUP
	 * @returns {Promise<* | string>}
	 */
	getMotorsInGroup(args) {
		let group = args.GROUP.toString();
		return this.getRESTAPI({REQUEST: '/motors/' + group + '/list.json'})
			.then(motors => JSON.parse(motors)[group].toString())
			.catch(() => {
				return 'No motor found in group "' + group + '"';
			});
	}


	/**
	 * Makes a GET request to the REST API using getRESTAPI() to have
	 * a list of all motors available.
	 * The answer is then formatted for the user.
	 * @returns {Promise<*>} containing the motor names separated by a colon.
	 */
	getMotors() {
		return this.getRESTAPI({REQUEST: "/motors/list.json"})
			// getRESTAPI answer will look like '{"motors":["m1","m2","m3","m4","m5","m6"]}'
			// From this example, the process below will return "m1,m2,m3,m4,m5,m6"
			.then(motors => JSON.parse(motors).motors.toString())
			.catch(() => {
				return 'No motor found.'
			});
	}

	/**
	 * Gets all or running primitives
	 * @param args either 'all' or 'running' is stored in args.STATE
	 * @returns {Promise<* | string>} a list of primitives
	 */
	getPrimitives(args) {
		let state = args.STATE.toString();
		let uri = (state === 'all') ? '/primitives/list.json' : '/primitives/running/list.json' + ''
		return this.getRESTAPI({REQUEST: uri})
			.then(primitives => {
				let primitiveId = (state === 'all') ? 'primitives' : 'running_primitives';
				return JSON.parse(primitives)[primitiveId].toString()
			})
			.catch(() => {
				return 'Error on connection.'
			});
	}

	/**
	 * Gives the properties and the methods of a motor
	 * @param args
	 * @returns {Promise<* | string>}
	 */
	getPropertiesMethods(args) {
		let attribute = args.ATTRIBUTE.toString();
		let behaviour = args.BEHAVIOUR.toString();
		let url = '/primitives/' + behaviour + '/' + attribute + '/list.json';

		return this.getRESTAPI({REQUEST: url})
			.then(value => JSON.parse(value)[attribute].toString())
			.catch(() => {
				return 'Attribute <' + attribute + '> is not available.'
			});
	}

	/**
	 * Starts / Stops / Pauses / Resumes a primitive
	 * @param args the action of the primitive to launch
	 * @returns {Promise<string | string>} Done! on success, else an error message
	 */
	actionPrimitives(args) {
		let primitive = args.PRIMITIVE.toString();
		let action = args.ACTION.toString();

		return this.getRESTAPI({REQUEST: "/primitives/" + primitive + "/" + action + ".json"})
			.then(state => {
				de && bug(state);
				return "Done!"
			})
			.catch(() => {
				return 'Primitive <' + primitive + '> is not available.'
			});
	}

	/**
	 * Gives the state of the connection with a get request
	 * @returns {Promise<string>} OK on success, else an error message
	 */
	testConnection() {
		let url = this._robotUrl + '/';
		return axios.get(url)
			.then(() => {
				return 'Connection ok!'
			})
			.catch(() => {
				return 'Error on connection.'
			});
	}

	/**
	 * Sets a motor (or motors) either compliant or stiff
	 * @param args the motors
	 */
	setCompliant(args) {
		let motors = args.MOTORS.toString().split(',');
		let compliant = args.STATUS.toString();
		for (let m = 0; m < motors.length; m++) {
			let url = '/motors/' + motors[m] + '/registers/compliant/value.json';
			let postArgs = {
				URL: url,
				DATA: compliant
			};
			this.postRESTAPI(postArgs)
				.catch(() => {
					return 'Error on connection.';
				});
		}
	}

	/**
	 * Changes the value of a register.
	 * @param args
	 */
	setValue(args) {
		let motors = args.MOTORS.toString().split(',');
		let value = args.VALUE.toString();
		let register = args.REGISTER.toString();

		for (let m = 0; m < motors.length; m++) {
			let url = '/motors/' + motors[m] + '/registers/' + register + '/value.json';
			let postArgs = {
				URL: url,
				DATA: value
			};
			this.postRESTAPI(postArgs)
				.catch(() => {
					return 'Error on connection.';
				});
		}
	}

	/**
	 * Moves one or several MOTORS to a given POSITIONS, in DURATION seconds and if WAIT is set to true, il will only
	 * return it answer after the move is complete.
	 * @param args.MOTORS can take one or several motors as a list of motor name separated by commas.
	 * @param args.POSITIONS should have the same amount of elements than args.MOTORS, they correspond to positions to
	 * reach for each motor.
	 * @param args.DURATION is the time to reach each position on seconds. The movement speed is proportional to the duration.
	 * @param args.WAIT is either True or False. On True, we won't move on to the next block until the move is completed.
	 * @return {Promise<string | string>} An alert on error with details and tips to resolve the error.
	 */
	motorGotoPosition(args) {
		let duration = parseFloat(args.DURATION);
		let wait = args.WAIT.toString();
		let motors = args.MOTORS.toString();
		let positions = args.POSITIONS.toString()

		if (motors.split(',').length > 1) {
			// Several motors
			let url = '/motors/goto.json';
			motors = motors.split(',');
			if (positions.split(',').length === 1) {
				// Several motors & 1 position
				let pos = [];
				for (let i = 0; i < motors.length; i++) {
					pos.push(positions)
				}
				motors = motors.join('","');
				positions = pos.join('","');
			} else {
				// Several motors & several positions
				motors = motors.join('","');
				positions = positions.split(',').join('","');
			}
			let postArgs = {
				URL: url,
				DATA: `{"motors": ["${motors}"], "positions": ["${positions}"], "duration": ${duration}, "wait": ${wait}}`
			};
			return this.postRESTAPI(postArgs)
				.catch(() => {
					return 'Error on connection.';
				});
		} else {
			// Only one motor & one position
			let positions = args.POSITIONS.toString();
			let url = '/motors/' + motors + '/goto.json';
			let postArgs = {
				URL: url,
				DATA: `{"position": ${positions}, "duration": ${duration}, "wait": ${wait}}`
			};
			return this.postRESTAPI(postArgs)
				.catch(() => {
					return 'Error on connection.';
				});
		}
	}

	/**
	 * Gives a list of all available records to play
	 * @returns {Promise<* | string>} all recorded moves, separated by a comma.
	 */
	getAvailableRecords() {
		return this.getRESTAPI({REQUEST: "/records/list.json"})
			.then(moves => JSON.parse(moves).moves.toString())
			.catch(() => {
				return 'Error on connection.';
			});
	}

	/**
	 * Plays a recorded move. You can choose the speed of the replay and you can play the move backwards
	 * @param args
	 */
	startMovePlayer(args) {
		let moveName = args.MOVE;
		let speed = args.SPEED;
		let url = '/records/' + moveName + '/play.json';
		let postArgs = {
			URL: url,
			DATA: '{"speed": "' + speed + '"}'
		};
		return this.postRESTAPI(postArgs)
			.then(status => JSON.parse(status)[moveName].toString())
			.catch(() => {
				return 'Error with parameters.';
			});
	}

	/**
	 * Stops a played move
	 * @param args
	 */
	stopMovePlayer(args) {
		let moveName = args.MOVE;
		let url = '/records/' + moveName + '/stop.json';
		let postArgs = {
			URL: url,
			DATA: '{}'
		};
		return this.postRESTAPI(postArgs)
			.then(status => JSON.parse(status)[moveName].toString())
			.catch(() => {
				return 'Error with parameters.';
			});
	}

	/**
	 * Tries to connect to a robot from the address given by the user.
	 * It will get the ip of the robot through a GET /ip.
	 * On success, the ip of the robot is saved for future GET & POST requests.
	 *
	 * @param args the ip of the robot the user wants to access is stored in args.URL
	 * @returns {Promise<string | void>} the ip of the robot on success, else an error message.
	 */
	setHost(args) {
		let robotUrl = "http://" + args.URL.toString() + ":" + this._robotPort + "/ip.json";
		return axios.get(robotUrl)
			.then(resp => {
				return JSON.stringify(resp.data)
			})
			.then(data => {
				return JSON.parse(data).ip.toString();
			})
			.then(ip => {
				this._robotIp = ip;
				this._robotUrl = "http://" + this._robotIp + ":" + this._robotPort;
				de && bug('Robot url:', this._robotUrl);
				return ip;
			})
			.catch(() => {
				return 'Your robot host is unreachable'
			});
	}

	/**
	 * Returns the ip of the robot. You must have used `Set host to [IP]` block before.
	 * @returns {string} url of Poppy Robot
	 */
	poppyUrl() {
		if (this._robotUrl !== 'Undefined')
			return this._robotUrl;

		let error = {
			"error": "Could not find poppy's URL",
			"tip": "Use Set host to [IP] block to define poppy's URL",
			"details": "You never defined poppy's URL, you can't use this block for the moment."
		}
		let status = 404
		try {
			this.poppyErrorManager(status, error);
		} catch {
			return 'No URL found'
		}
	}

	/**
	 * Deletes a record.
	 * @param args args.MOVE is the name of the move to delete.
	 * @return {Promise<* | string>} An alert on error with details and tips to resolve the error.
	 */
	deleteRecord(args) {
		let moveName = args.MOVE.toString()
		let url = '/records/' + moveName + '/delete.json';
		let postArgs = {
			URL: url,
			DATA: '{}'
		};
		return this.postRESTAPI(postArgs)
			.then(status => JSON.parse(status)[moveName].toString())
			.catch(() => {
				return 'Error with parameters.';
			});
	}

	/**
	 * Gives the index of a motor, in the list of all motors.
	 * @param args the motor, stored in args.MOTOR
	 * @returns {Promise<*>} index of the motor given
	 */
	indexMotor(args) {
		let motor = args.MOTOR.toString();
		de && bug("motor:", motor);
		return this.getMotors()
			.then(function (motors) {
				de && bug("motors:", motors);
				for (const [index, element] of motors.split(",").entries())
					if (motor === element)
						return index;
				return -1;
			})
			.then(index => {
				de && bug("index found: ", index);
				if (index !== -1)
					return (index + 1).toString();
				let error = {
					"error": "Could not find motor <" + motor + ">",
					"tip": "Use all motors block to find all motor names",
					"details": "This block makes a request to the robot to find all available motors and gives the position of the " +
						"required motor in the list of all motors. This block was able to retrieve the list of all motors but could " +
						"not find the one you asked."
				}
				let status = 404
				try {
					this.poppyErrorManager(status, error); // Alert thrown to the user
				} catch {
					return "This motor does not exists";
				}
			})
			.catch(err => de && bug("Index of motor:", err));
	}


	/**
	 * Performs a GET method to poppyUrl + URL given. It then returns the promise received.
	 * @param args the url of the request is stored in args.REQUEST
	 * @returns {Promise<string>} the answer given by the REST API
	 */
	getRESTAPI(args) {
		if (this._robotUrl === 'Undefined') {
			// Raises an error if URL is not defined
			let error = {
				"error": "Could not find poppy's URL",
				"tip": "Use Set host to [IP] block to define poppy's URL",
				"details": "This block wants to perform a get request to the REST Api of Poppy, but Poppy's URL is not defined."
			}
			let status = 404
			try {
				this.poppyErrorManager(status, error); // Alert thrown to the user
			} catch {
				return Promise.reject(new Error('Error on Rest API!'));
			}
		}

		de && bug("GET API-REST args: ", args);
		let url = this._robotUrl + args.REQUEST.toString();
		return axios.get(url)
			.then(resp => {
				return JSON.stringify(resp.data)
			})
			.catch(err => {
				if (err.response) {
					de && bug(err.response.data)
					this.poppyErrorManager(err.response.status, err.response.data);
				}
			});
	}


	/**
	 * Performs a POST method to poppyUrl + URL, using the data given. It then returns the promise received.
	 * @param args the url of the request is stored in args.REQUEST, the data is stored in args.DATA
	 * @returns {Promise<string>} the answer given by the REST API
	 */
	postRESTAPI(args) {
		if (this._robotUrl === 'Undefined') {
			// Raises an error if URL is not defined
			let error = {
				"error": "Could not find poppy's URL",
				"tip": "Use Set host to [IP] block to define poppy's URL",
				"details": "This block wants to perform a post request to the REST Api of Poppy, but Poppy's URL is not defined."
			}
			let status = 404
			try {
				this.poppyErrorManager(status, error); // Alert thrown to the user
			} catch {
				return Promise.reject(new Error('Error on Rest API!'));
			}
		}

		de && bug("POST API-REST args: ", args);
		let url = this._robotUrl + decodeURI(args.URL);  // url given in the block
		let dataString = decodeURIComponent(args.DATA);  // data given in the block

		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}
		de && bug("URL post API-REST: ", url);
		de && bug("config post API-REST: ", config);
		de && bug("data post API-REST: ", dataString);
		return axios.post(url, dataString, config)
			.then(resp => {
				de && bug("POST API-REST answer: ", resp.data);
				return JSON.stringify(resp.data)
			})
			.catch(err => {
				if (err.response) {
					de && bug(err.response.data)
					this.poppyErrorManager(err.response.status, err.response.data);
				}
			});
	}

	/**
	 * Get the register value of a motor.
	 * @param args the motor is stored in args.MOTOR
	 * and the register requested is in args.REGISTER
	 * @returns {Promise<AxiosResponse<any>>} the value of the register
	 */
	getMotorRegister(args) {
		let motor = args.MOTOR.toString();
		let register = args.REGISTER.toString();
		let url = '/motors/' + motor + '/registers/' + register + '/value.json';

		return this.getRESTAPI({REQUEST: url})
			.then(value => JSON.parse(value)[register].toString())
			.catch(() => {
				return 'Register not found.'
			});
	}

	/**
	 * Starts to record a move. If the move does not exist yet, it is created. If a move with the same name has already
	 * been defined, it will be erased.
	 * @param args args.MOVE is the name of the move to create/edit. args.MOTORS are the motors recorded for the move.
	 * @return {Promise<* | string>} An alert on error with details and tips to resolve the error.
	 */
	recordMove(args) {
		let moveName = args.MOVE.toString();
		let motors = args.MOTORS.toString();
		let url = '/records/' + moveName + '/record.json';
		let postArgs = {
			URL: url,
			DATA: '{"motors": "' + motors + '"}'
		};
		return this.postRESTAPI(postArgs)
			.then(status => JSON.parse(status)[moveName].toString())
			.catch(() => {
				return 'Error with parameters.';
			});
	}

	/**
	 * Stops the record. It saves the move.
	 * @param args args.MOVE is the name of the move to create/edit.
	 * @return {Promise<* | string>} An alert on error with details and tips to resolve the error.
	 */
	saveMove(args) {
		let moveName = args.MOVE.toString();
		let url = '/records/' + moveName + '/save.json';
		let postArgs = {
			URL: url,
			DATA: '{}'
		};
		return this.postRESTAPI(postArgs)
			.then(status => JSON.parse(status)[moveName].toString())
			.catch(() => {
				return 'Error with parameters.';
			});
	}


	/**
	 * Gives the x, y and z coordinates of the IK chain of your choice.
	 * @param args args.CHAIN is the name of your IK chain
	 * @return {Promise<* | string>}
	 */
	getIKpose(args) {
		let chainName = args.CHAIN.toString();
		let url = '/ik/' + chainName + '/value.json';
		return this.getRESTAPI({REQUEST: url})
			.then(xyz => JSON.parse(xyz)["xyz"].toString())
			.catch(() => {
				return 'Error on connection.';
			});
	}


	/**
	 * Moves arm to a cartesian position
	 * @param args args.CHAIN is the name of your IK chain, args.{X,Y,Z} are the cartesian coordinates of the goal position.
	 * args.DURATION is the travel time in sec and if args.WAIT is set to true, the block waits for the end of the travel
	 * before proceeding to the next block.
	 * @return {Promise<* | string>} the actual postiton reached
	 */
	gotoIK(args) {
		let chainName = args.CHAIN.toString();
		let X = args.X.toString().replace(',', '.');
		let Y = args.Y.toString().replace(',', '.');
		let Z = args.Z.toString().replace(',', '.');
		let duration = parseFloat(args.DURATION);
		let wait = args.WAIT.toString();
		let url = '/ik/' + chainName + '/goto.json';
		let postArgs = {
			URL: url,
			DATA: '{"xyz": "' + X + ',' + Y + ',' + Z + '", "duration":' + duration + ', "wait": ' + wait + '}'
		};
		return this.postRESTAPI(postArgs)
			.then(xyz => JSON.parse(xyz)["xyz"].toString())
			.catch(() => {
				return 'Error with parameters.';
			});
	}


	/**
	 * Moves arm to a cartesian position, and with an orientation
	 * @param args args.CHAIN is the name of your IK chain, args.{X,Y,Z} are the cartesian coordinates of the goal position.
	 * args.{ROLL,PITCH,YAW} are the orientation of the endeffector, in radians. args.DURATION is the travel time in sec
	 * and if args.WAIT is set to true, the block waits for the end of the travel before proceeding to the next block.
	 * @return {Promise<* | string>} the actual postiton reached
	 */
	gotoIKorientation(args) {
		let chainName = args.CHAIN.toString();
		let X = args.X.toString().replace(',', '.');
		let Y = args.Y.toString().replace(',', '.');
		let Z = args.Z.toString().replace(',', '.');
		let ROLL = args.ROLL.toString().replace(',', '.');
		let PITCH = args.PITCH.toString().replace(',', '.');
		let YAW = args.YAW.toString().replace(',', '.');
		let duration = parseFloat(args.DURATION);
		let wait = args.WAIT.toString();
		let url = '/ik/' + chainName + '/goto.json';
		let postArgs = {
			URL: url,
			DATA: '{"xyz": "' + X + ',' + Y + ',' + Z + '", "rpy": "' + ROLL + ',' + PITCH + ',' + YAW + '", "duration":' + duration + ', "wait": ' + wait + '}'
		};
		return this.postRESTAPI(postArgs)
			.then(xyz => JSON.parse(xyz)["xyz"].toString())
			.catch(() => {
				return 'Error with parameters.';
			});
	}


	getMessagesForLocale() {
		const locale = formatMessage.setup().locale;

		let messages;
		try {
			messages = require(`./lang/${locale}`);
		} catch (ex) {
			console.log(`Locale "${locale}" is not supported.`);
			messages = require(`./lang/${Scratch3Poppy.DEFAULT_LANG}`);
		}
		return messages;
	}
}


module.exports = Scratch3Poppy;

