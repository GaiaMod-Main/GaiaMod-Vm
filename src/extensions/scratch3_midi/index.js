const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const Timer = require('../../util/timer');

/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const iconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAOVBMVEUAAAAkJCQhISEhISEgICAiIiIgICAiIiIiIiIhISEhISEhISEhISEgICAiIiIhISEhISEhISH///9LIL9ZAAAAEXRSTlMAHFVWWFt3gIi7xM7S1NXX2B0i/q0AAAABYktHRBJ7vGwAAAAAY0lEQVQoz72R0QqAIAxFzUzTrLz//7PNiiGr0UPgYeM+HBxjGtOFggf7KZBmQcIlgpwRWAy2FuG8H1thl1pEBtZWqKMU8QKvS53A0axLXd/fEf6IzZkpc3yuG70gQjt76fPhB2ewCdi29ipfAAAAAElFTkSuQmCC';

/* ----------------------------------------	*/
/* for MIDI Ebvent */
var mMIDI = null;
var mInputs = null;
var mOutputs = null;

var mOutDev = 0;	//Output Device Number

var mCtlbuf = new Array(0x80);
var mNoteOn = new Array(0x80);

var mCC_change_event = false
var mMIDI_event = false;
var mKey_on_event = false;
var mKey_off_event = false;
var mPBend_event = false;
var mPC_event = false;

var mCC_change_flag = false;
var mKey_on_flag = false;
var mKey_off_flag = false;
var mPC_flag = false;
var mPBend_flag = false;

var mNoteNum = 0;
var mNoteVel = 0;
//	var mNoteBuf = 0;
var mPBend = 64;
var mPCn = 0;

/* ================================	*/
var mCount = 0;
var mBeat = 0;
var mDticks = 1;
var mTempo = 120;
const mBaseCount = 4;
const mResolution = 480;

var mTimer = setInterval(function () {
	//		clearInterval(id);　//idをclearIntervalで指定している
	mDticks = mTempo * mResolution / 60000;
	mCount = mCount + mDticks * mBaseCount;
	mBeat = mBeat + mDticks * mBaseCount;
	if (mCount > mResolution * 4) { mCount = mCount - mResolution * 4; }
}, mBaseCount);

/**
 * Enum for eventl ist parameter values.
 * @readonly
 * @enum {string}
 */
/*const EventList = {
	"key on",
		  "key off",
		  "cc-chg",
		  "p-bend",
	"pg-chg"
};*/

const EventList = {
	KEY_ON: 'key-on',
	KEY_OF: 'key-of',
	CC_CHG: 'cc-chg',
	P_BEND: 'p-bend',
	PG_CHG: 'pg-chg'
};

function success(midiAccess) {
	mMIDI = midiAccess;
	var msg = "";
	var inum = 0, onum = 0;

	for (var i = 0; i < 0x80; i++) {
		mCtlbuf[i] = 0;
		mNoteOn[i] = 0;
	}

	if (typeof mMIDI.inputs === "function") {
		mInputs = mMIDI.inputs();
		mOutputs = mMIDI.outputs();
	} else {
		msg += "Input device: "
		var inputIterator = mMIDI.inputs.values();
		mInputs = [];
		for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
			mInputs.push(o.value);
			msg += (inum + 1).toString(10);
			msg += ") ";
			msg += o.value.name;
			msg += " ";
			inum++;
		}
		if (inum == 0) {
			msg += "Zero\n";
		} else {
			msg += "\n";
		}

		msg += "Output device: "
		var outputIterator = mMIDI.outputs.values();
		mOutputs = [];
		for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
			mOutputs.push(o.value)
			msg += (onum + 1).toString(10);
			msg += ") ";
			msg += o.value.name;
			msg += " ";
			onum++;
		}
		if (onum == 0) {
			msg += "Zero\n";
		} else {
			msg += "\n";
		}
	}
	for (var i = 0; i < mInputs.length; i++) {
		mInputs[i].onmidimessage = m_midiin;
	}
	alert(msg);
	console.log(msg);
}

function failure(error) {
	alert("Failed MIDI!" + error);
}

function m_midiin(event) {		/* MIDI parse */
	//	console.log(event.data[0]);
	switch (event.data[0] & 0xF0) {
		case 0x80:
			mMIDI_event = true;
			m_noteon(event.data[1], 0);
			break;
		case 0x90:
			mMIDI_event = true;
			m_noteon(event.data[1], event.data[2]);
			break;
		case 0xA0:
			break;
		case 0xB0:
			mMIDI_event = true;
			mCC_change_event = true;
			mCC_change_flag = true;
			mCtlbuf[event.data[1]] = event.data[2];
			break;
		case 0xC0:
			mMIDI_event = true;
			mPC_event = true;
			mPC_flag = true;
			mPCn = event.data[1];
			break;
		case 0xD0:
			break;
		case 0xE0:
			mMIDI_event = true;
			mPBend_event = true;
			mPBend_flag = true;
			mPBend = event.data[2];
			break;
		case 0xF0:
			break;
	}
}

function m_noteon(note, vel) {
	mNoteNum = note;
	mNoteVel = vel;

	if (vel > 0) {
		mKey_on_event = true;
		mKey_on_flag = true;
		mNoteOn[mNoteNum] = true;
	} else {
		mKey_off_event = true;
		mKey_off_flag = true;
	}
}

function m_midiout(event, note, vel) {
	var data1 = event & 0xFF;
	var data2 = note & 0x7F;
	var data3 = vel & 0x7F;

	/*	if(mOutputs!=null){
			for(var i=0; i<mOutputs.length; i++){
				var l_output=mOutputs[i];
				if(l_output!=null){
					l_output.send([data1,data2,data3], 0);
				}
			}
		}
	*/
	if (mOutputs != null) {
		if (mOutDev < mOutputs.length) {
			var l_output = mOutputs[mOutDev];
			if (l_output != null) {
				l_output.send([data1, data2, data3], 0);
			}
		}
	}
}


function m_midiout_2byte(event, data) {
	var data1 = event & 0xFF;
	var data2 = data & 0x7F;

	/*	if(mOutputs!=null){
			for(var i=0; i<mOutputs.length; i++){
				var l_output=mOutputs[i];
				if(l_output!=null){
					l_output.send([data1,data2], 0);
				}
			}
		}
	*/
	if (mOutputs != null) {
		if (mOutDev < mOutputs.length) {
			var l_output = mOutputs[mOutDev];
			if (l_output != null) {
				l_output.send([data1, data2], 0);
			}
		}
	}
}

function m_sysexout(data, size) {
	var buf = new Array(size);
	for (var i = 0; i < size; i++) {
		buf[i] = data[i];
	}
	if (mOutputs != null) {
		/*		for(var i=0; i<mOutputs.length; i++){
					var l_output=mOutputs[i];
					if(l_output!=null){
						l_output.send(buf, 0);
					}
				}
		*/
		if (mOutDev < mOutputs.length) {
			var l_output = mOutputs[mOutDev];
			if (l_output != null) {
				l_output.send(buf, 0);
			}
		}
	}
}

/**
 * Class for the new blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3WebMIDI {

	constructor(runtime) {
		/**
		 * The runtime instantiating this block package.
		 * @type {Runtime}
		 */
		this.runtime = runtime;

		navigator.requestMIDIAccess({ sysex: true }).then(success, failure);

		//this._onTargetCreated = this._onTargetCreated.bind(this);
		//this.runtime.on('targetWasCreated', this._onTargetCreated);
	}
	/*
		success(midiAccess)
		{
			this.m=midiAccess;
	
			if (typeof this.m.inputs === "function") {
				this.mInputs  =	this.m.inputs();
				this.mOutputs =	this.m.outputs();
			} else {
				var inputIterator = this.m.inputs.values();
				this.mInputs = [];
				for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
					this.mInputs.push(o.value);
				}
	
				var outputIterator = this.m.outputs.values();
				this.mOutputs = [];
				for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
					this.mOutputs.push(o.value)
				}
			}
			for(var i=0; i<mInputs.length;i++){
				this.mInputs[i].onmidimessage=this.m_midiin;
			}
			alert( "Success MIDI!" );
		}
	
		failure(error)
		{
			alert( "Failed MIDI!" + error );
		}
	*/

	/**
	 * @returns {object} metadata for this extension and its blocks.
	 */
	getInfo() {
		return {
			id: 'midi',
			name: 'MIDI',

			menuIconURI: iconURI,
			blockIconURI: iconURI,

			blocks: [
				{
					opcode: 's_Note',
					text: 'NoteNum',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_Vel',
					text: 'Velocity',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_PBend',
					text: 'PB',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_PChange',
					text: 'PC',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_Ticks',
					text: 'Ticks',
					blockType: BlockType.REPORTER
				},

				{
					opcode: 's_Ccin',
					text: formatMessage({
						id: 'webmidi.s_Ccin',
						default: 'CC [ccnum]',
						description: 'Control Change Value'
					}),
					blockType: BlockType.REPORTER,
					arguments: {
						ccnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						}
					}
				},

				{
					opcode: 's_Getmidievent',
					text: 'MIDI EVENT',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getkeyon',
					text: 'Key ON',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getkeyoff',
					text: 'Key OFF',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_PBevent',
					text: 'P.Bend',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_PCevent',
					text: 'PrgChg',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getcc',
					text: 'CtrlChg',
					blockType: BlockType.HAT,
				},

				{
					opcode: 's_Getkeyonnum',
					text: formatMessage({
						id: 'webmidi.s_Getkeyonnum',
						default: 'KEY ON [ckeynum]',
						description: 'Note Number'
					}),
					blockType: BlockType.HAT,
					arguments: {
						ckeynum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						}
					}
				},

				{
					opcode: 's_Event',
					text: formatMessage({
						id: 'webmidi.s_Event',
						default: 'EVENT [n_event]',
						description: 'any events recieved?'
					}),
					blockType: BlockType.BOOLEAN,
					arguments: {
						n_event: {
							type: ArgumentType.STRING,
							menu: 'eventlist',
							defaultValue: EventList.KEY_ON
						}
					}
				},

				{
					opcode: 's_Noteon_out',
					text: formatMessage({
						id: 'webmidi.noteon_out',
						default: 'NOTE ON [channelnum][notenum][velo]',
						description: 'send note on'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						channelnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						},
						notenum: {
							type: ArgumentType.NUMBER,
							defaultValue: 60
						},
						velo: {
							type: ArgumentType.NUMBER,
							defaultValue: 127
						}
					}
				},

				{
					opcode: 's_Noteon_out_duration',
					text: formatMessage({
						id: 'webmidi.noteon_out_durauion',
						default: 'NOTE ON [channelnum][notenum][velo][duration]',
						description: 'send note on with duration'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						channelnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						},
						notenum: {
							type: ArgumentType.NUMBER,
							defaultValue: 60
						},
						velo: {
							type: ArgumentType.NUMBER,
							defaultValue: 127
						},
						duration: {
							type: ArgumentType.NUMBER,
							defaultValue: 480
						}
					}
				},

				{
					opcode: 's_Noteoff_out',
					text: formatMessage({
						id: 'webmidi.noteoff_out',
						default: 'NOTE OFF [channelnum][notenum][velo]',
						description: 'send note off'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						channelnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						},
						notenum: {
							type: ArgumentType.NUMBER,
							defaultValue: 60
						},
						velo: {
							type: ArgumentType.NUMBER,
							defaultValue: 127
						}
					}
				},

				{
					opcode: 's_ProgramChange',
					text: formatMessage({
						id: 'webmidi.program_change',
						default: 'PrgChg [channelnum][pnumber]',
						description: 'send program change'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						channelnum: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						},
						pnumber: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						}
					}
				},

				{
					opcode: 's_RestTicks',
					text: formatMessage({
						id: 'webmidi.rest_tickes',
						default: 'Rest [rticks] tickes',
						description: 'rest some tickes'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						rticks: {
							type: ArgumentType.NUMBER,
							defaultValue: 240
						},
					}
				},

				{
					opcode: 's_GetBeat',
					text: formatMessage({
						id: 'webmidi.s_GetBeat',
						default: 'BEAT [tempo]',
						description: 'Tempo'
					}),
					blockType: BlockType.HAT,
					arguments: {
						tempo: {
							type: ArgumentType.NUMBER,
							defaultValue: 120
						}
					}
				},

				{
					opcode: 's_OutDevice',
					text: formatMessage({
						id: 'webmidi.out_device',
						default: 'Out Dev No. [outdev]',
						description: 'midi out device number'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						outdev: {
							type: ArgumentType.NUMBER,
							defaultValue: 1
						},
					}
				},


				/* ================================	*/
				{
					opcode: 's_PokeText',
					text: formatMessage({
						id: 'webmidi.s_poketext',
						default: 'Pokemiku [rtext]',
						description: 'send text to Pokemiku'
					}),
					blockType: BlockType.COMMAND,
					arguments: {
						rtext: {
							type: ArgumentType.STRING,
							defaultValue: 'あいうえお'
						},
					}
				},

				{
					opcode: 's_Strlen',
					text: 'Strlen',
					blockType: BlockType.REPORTER
				},
				/* ================================	*/

			],
			menus: {
				eventlist: {
					acceptReporters: true,
					items: this._initEventList()
				}
			}
		};
	}

	/* ================================	*/
	/**
	  * Initialize event parameters menu with localized strings
	  * @returns {array} of the localized text and values for each menu element
	  * @private
	  */
	_initEventList() {
		return [
			{
				text: formatMessage({
					id: 'webmidi.eventlist.key-on',
					default: 'key-on',
					description: 'label for event for webmidi extension'
				}),
				value: EventList.KEY_ON
			},
			{
				text: formatMessage({
					id: 'webmidi.eventlist.key-of',
					default: 'key-of',
					description: 'label for event for webmidi extension'
				}),
				value: EventList.KEY_OF
			},
			{
				text: formatMessage({
					id: 'webmidi.eventlist.cc-chg',
					default: 'cc-chg',
					description: 'label for event for webmidi extension'
				}),
				value: EventList.CC_CHG
			},
			{
				text: formatMessage({
					id: 'webmidi.eventlist.p-bend',
					default: 'p-bend',
					description: 'label for event for webmidi extension'
				}),
				value: EventList.P_BEND

			},
			{
				text: formatMessage({
					id: 'webmidi.eventlist.pg-chg',
					default: 'pg-chg',
					description: 'label for event for webmidi extension'
				}),
				value: EventList.PG_CHG

			}
		];
	}

	/* ================================	*/
	/**
		* Write log.
		* @param {object} args - the block arguments.
		* @property {number} TEXT - the text.
	*/
	writeLog(args) {
		const text = Cast.toString(args.TEXT);
		log.log(text);
	}

	/**
		* Get the browser.
		* @return {number} - the user agent.
	*/
	getBrowser() {
		return navigator.userAgent;
	}

	/* ================================	*/
	// GET NOTE ON/OFF
	s_Getmidievent() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mMIDI_event == true) {
			mMIDI_event = false;
			return true;
		}
		return false;
	}

	//Set Note Number
	s_Note() {
		return (mNoteNum);
	}

	//Set Note Vel
	s_Vel() {
		return (mNoteVel);
	}

	// GET KEY ON
	s_Getkeyon() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mKey_on_event == true) {
			mKey_on_event = false;
			return true;
		}
		return false;
	}

	// GET KEY ON with keynumber
	s_Getkeyonnum(args) {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mNoteOn[args.ckeynum] == true) {
			mNoteOn[args.ckeynum] = false;
			return true;
		}
		return false;
	}

	// GET KEY OFF
	s_Getkeyoff() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mKey_off_event == true) {
			mKey_off_event = false;
			return true;
		}
		return false;
	}

	/* ================================	*/
	// GET CC
	s_Getcc() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mCC_change_event === true) {
			mCC_change_event = false;
			return true;
		}
		return false;
	}


	// Set CC Value
	// ccnum: Control Change Number
	s_Ccin(args) {
		return (mCtlbuf[args.ccnum]);
	}

	/* ================================	*/
	//Set PitchBend
	s_PBevent() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mPBend_event == true) {
			mPBend_event = false;
			return true;
		}
		return false;
	}

	//Set PitchBend Valuel
	s_PBend() {
		return (mPBend);
	}

	/* ================================	*/
	//Set Program Change Event
	s_PCevent() {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		if (mPC_event == true) {
			mPC_event = false;
			return true;
		}
		return false;
	}

	//Set Program Change
	s_PChange() {
		return (mPCn);
	}

	/* ================================	*/
	//Event
	s_Event(args) {
		var n_flag = false;

		switch (args.n_event) {
			case EventList.KEY_ON:
				{
					if (mKey_on_flag == true) {
						n_flag = true;
						mKey_on_flag = false;
					}
				}
				break;

			case EventList.KEY_OF:
				{
					if (mKey_off_flag == true) {
						n_flag = true;
						mKey_off_flag = false;
					}
				}
				break;

			case EventList.CC_CHG:
				{
					if (mCC_change_flag == true) {
						n_flag = true;
						mCC_change_flag = false;
					}
				}
				break;

			case EventList.P_BEND:
				{
					if (mPBend_flag == true) {
						n_flag = true;
						mPBend_flag = false;
					}
				}
				break;

			case EventList.PG_CHG:
				{
					if (mPC_flag == true) {
						n_flag = true;
						mPC_flag = false;
					}
				}
				break;
		}
		return n_flag;
	}

	/* ================================	*/
	//NOTE ON
	s_Noteon_out(args) {
		var chnum = (args.channelnum & 0x0F) - 1;
		return m_midiout(0x90 + chnum, args.notenum & 0x7F, args.velo & 0x7F);
	}

	s_Noteon_out_duration(args) {
		var chnum = (args.channelnum & 0x0F) - 1;
		var irticks = args.duration;
		if (irticks < 10) irticks = 10;
		var waittime = irticks / mResolution * 60 / mTempo * 1000;
		setTimeout(function () { m_midiout(0x80 + chnum, args.notenum & 0x7F, 0x40); }
			, waittime);
		return m_midiout(0x90 + chnum, args.notenum & 0x7F, args.velo & 0x7F);
	}


	//NOTE OFF
	s_Noteoff_out(args) {
		var chnum = (args.channelnum & 0x0F) - 1;
		return m_midiout(0x80 + chnum, args.notenum & 0x7F, args.velo & 0x7F);
	}

	//Program Change
	s_ProgramChange(args) {
		var chnum = (args.channelnum & 0x0F) - 1;
		var pgnum = (args.pnumber & 0x7F);
		return m_midiout_2byte(0xC0 + chnum, pgnum);
	}

	//MIDI Output Device Number
	s_OutDevice(args) {
		if (args.outdev < 1) args.outdev = 1;
		else if (args.outdev > mOutputs.length) args.outdev = mOutputs.length;
		mOutDev = args.outdev - 1;
	}

	/* ================================	*/
	/*var mCount = 0;
	var mTimer = setInterval(function(){
	//		clearInterval(id);　//idをclearIntervalで指定している
			mCount++;
		}, 20);
	*/

	// Beat
	s_GetBeat(args) {
		// Reset alarm_went_off if it is true, and return true
		// otherwise, return false.
		mTempo = args.tempo;

		if (mBeat >= mResolution) {
			mBeat = mBeat - mResolution;
			return true;
		}
		return false;
	}

	s_Ticks() {
		return (Math.floor(mCount));
	}

	s_PokeText(args) {
		if (args.rtext.length <= 32) {
			//		console.log(args.rtext);
			mSize = sendstring(args.rtext);
			mSysSz = set_sysex();
			m_sysexout(mMKsys, mSysSz);
		}
	}

	s_Strlen() {
		return (mSize);
	}

	/*
		s_RestTicks(args){
			args.rticks = args.rticks%480;
			var irticks = args.rticks;
			var iCount = mCount;
	
			var itimer = setInterval(function(){
				var dcount = mCount-iCount;
				if ( dcount<0 ) dcount =dcount + mResolution*4;
				if( dcount >= irticks){
	//				console.log(irticks,dcount);
					clearInterval(itimer);
					return true;
				}
			   return false;
	
			} , mBaseCount);
	
		}
	*/
	/**
	 * Rest for some number of beats.
	 * @param {object} args - the block arguments.
	 * @param {object} util - utility object provided by the runtime.
	 * @property {number} BEATS - the duration in beats of the rest.
	 */
	s_RestTicks(args, util) {
		var iCount = this.mCount;

		if (this._stackTimerNeedsInit(util)) {
			let irticks = args.rticks;
			var waittime = irticks / mResolution * 60 / mTempo;
			//         beats = this._clampBeats(beats);
			//         this._startStackTimer(util, this._beatsToSec(beats));
			this._startStackTimer(util, waittime);
		} else {
			this._checkStackTimer(util);
		}
	}

	/* ================================	*/
	/**
	 * Check if the stack timer needs initialization.
	 * @param {object} util - utility object provided by the runtime.
	 * @return {boolean} - true if the stack timer needs to be initialized.
	 * @private
	 */
	_stackTimerNeedsInit(util) {
		return !util.stackFrame.timer;
	}

	/**
	 * Start the stack timer and the yield the thread if necessary.
	 * @param {object} util - utility object provided by the runtime.
	 * @param {number} duration - a duration in seconds to set the timer for.
	 * @private
	 */
	_startStackTimer(util, duration) {
		util.stackFrame.timer = new Timer();
		util.stackFrame.timer.start();
		util.stackFrame.duration = duration;
		util.yield();
	}

	/**
	 * Check the stack timer, and if its time is not up yet, yield the thread.
	 * @param {object} util - utility object provided by the runtime.
	 * @private
	 */
	_checkStackTimer(util) {
		const timeElapsed = util.stackFrame.timer.timeElapsed();
		if (timeElapsed < util.stackFrame.duration * 1000) {
			util.yield();
		}
	}

	/* ================================	*/
} //--- class Scratch3WebMIDI

module.exports = Scratch3WebMIDI;


/* ================================	*/
const textMapANum = 73;
const textMapBNum = 72;

var textMapA = [	//textMapANum
	["あ", "a"], ["い", "i"], ["う", "M"], ["え", "e"], ["お", "o"],
	["か", "k a"], ["き", "k' i"], ["く", "k M"], ["け", "k e"], ["こ", "k o"],
	["さ", "s a"], ["し", "S i"], ["す", "s M"], ["せ", "s e"], ["そ", "s o"],
	["た", "t a"], ["ち", "tS i"], ["つ", "ts M"], ["て", "t e"], ["と", "t o"],
	["な", "n a"], ["に", "J i"], ["ぬ", "n M"], ["ね", "n e"], ["の", "n o"],
	["は", "h a"], ["ひ", "C i"], ["ふ", "p\\ M"], ["へ", "h e"], ["ほ", "h o"],
	["ま", "m a"], ["み", "m i"], ["む", "m M"], ["め", "m e"], ["も", "m o"],
	["ら", "4 a"], ["り", "4' i"], ["る", "4 M"], ["れ", "4 e"], ["ろ", "4 o"],
	["が", "g a"], ["ぎ", "g' i"], ["ぐ", "g M"], ["げ", "g e"], ["ご", "g o"],
	["ざ", "dz a"], ["じ", "dZ i"], ["ず", "dz M"], ["ぜ", "dZ e"], ["ぞ", "dz o"],
	["だ", "d a"], ["ぢ", "dZ i"], ["づ", "dz M"], ["で", "d e"], ["ど", "d o"],
	["ば", "b a"], ["び", "b' i"], ["ぶ", "b M"], ["べ", "b e"], ["ぼ", "b o"],
	["ぱ", "p a"], ["ぴ", "p' i"], ["ぷ", "p M"], ["ぺ", "p e"], ["ぽ", "p o"],
	["や", "j a"], ["ゆ", "j M"], ["よ", "j o"],
	["わ", "w a"], ["ゐ", "w i"], ["ゑ", "w e"], ["を", "o"], ["ん", "N\\"]
];

var textMapB = [ //textMapBNum
	["ふぁ", "p\\ a"], ["つぁ", "ts a"],
	["うぃ", "w i"], ["すぃ", "s i"], ["ずぃ", "dz i"], ["つぃ", "ts i"], ["てぃ", "t' i"],
	["でぃ", "d' i"], ["ふぃ", "p\\' i"],
	["とぅ", "t M"], ["どぅ", "d M"],
	["いぇ", "j e"], ["うぇ", "w e"], ["きぇ", "k' e"], ["しぇ", "S e"], ["ちぇ", "tS e"],
	["つぇ", "ts e"], ["てぇ", "t' e"], ["にぇ", "J e"], ["ひぇ", "C e"], ["みぇ", "m' e"],
	["りぇ", "4' e"], ["ぎぇ", "g' e"], ["じぇ", "dZ e"], ["でぇ", "d' e"], ["びぇ", "b' e"],
	["ぴぇ", "p' e"], ["ふぇ", "p\\ e"],
	["うぉ", "w o"], ["つぉ", "ts o"], ["ふぉ", "p\\ o"],
	["きゃ", "k' a"], ["しゃ", "S a"], ["ちゃ", "tS a"], ["てゃ", "t' a"], ["にゃ", "J a"],
	["ひゃ", "C a"], ["みゃ", "m' a"], ["りゃ", "4' a"], ["ぎゃ", "N' a"], ["じゃ", "dZ a"],
	["でゃ", "d' a"], ["びゃ", "b' a"], ["ぴゃ", "p' a"], ["ふゃ", "p\\' a"],
	["きゅ", "k' M"], ["しゅ", "S M"], ["ちゅ", "tS M"], ["てゅ", "t' M"], ["にゅ", "J M"],
	["ひゅ", "C M"], ["みゅ", "m' M"], ["りゅ", "4' M"], ["ぎゅ", "g' M"], ["じゅ", "dZ M"],
	["でゅ", "d' M"], ["びゅ", "b' M"], ["ぴゅ", "p' M"], ["ふゅ", "p\\' M"],
	["きょ", "k' o"], ["しょ", "S o"], ["ちょ", "tS o"], ["てょ", "t' o"], ["にょ", "J o"],
	["ひょ", "C o"], ["みょ", "m' o"], ["りょ", "4' o"], ["ぎょ", "N' o"], ["じょ", "dZ o"],
	["でょ", "d' o"], ["びょ", "b' o"], ["ぴょ", "p' o"]
];

var mDex;
var mTextMap = null;
var mMKsys = null;
var mSize = 0;
var mSysSz = null;
const mSYSMAX = 1024;

function init_textanlz() {
	mTextMap = new Array(textMapANum + textMapBNum);
	for (var i = 0; i < textMapANum; i++) {
		mTextMap[textMapA[i][0]] = textMapA[i][1];
	}
	for (var i = 0; i < textMapBNum; i++) {
		mTextMap[textMapB[i][0]] = textMapB[i][1];
	}
	mMKsys = new Array(mSYSMAX);
	mMKsys[0] = 0xF0; mMKsys[1] = 0x43; mMKsys[2] = 0x79; mMKsys[3] = 0x09;
	mMKsys[4] = 0x00; mMKsys[5] = 0x50; mMKsys[6] = 0x10;
}

function sendstring(text) {
	var i, j = text.length, k = 0;
	var str = null;
	var ss = null;
	mDex = new Array(j);

	for (i = 0; i < j - 1; i++) {
		str = text[i] + text[i + 1];
		if ((ss = mTextMap[str]) != null) {
			mDex[k++] = ss;
			i++;
		}
		else {
			if ((ss = mTextMap[text[i]]) != null) {
				mDex[k++] = ss;
			}
		}
	}
	if (i < j) {
		if ((ss = mTextMap[text[i]]) != null) {
			mDex[k++] = ss;
		}
	}
	return k;
}

function set_sysex() {
	var i, j;
	var k = 7;
	for (i = 0; i < mSize; i++) {
		for (j = 0; j < mDex[i].length; j++) {
			mMKsys[k++] = mDex[i].charCodeAt(j);
		}
		if (i < mSize - 1) mMKsys[k++] = 0x2c;
	}
	mMKsys[k++] = 0x00;
	mMKsys[k++] = 0xF7;
	return k;
}

init_textanlz();

/*
mSize=sendstring("あひゃいうvえお ぎょ");
	console.log(mSize);
	console.log(mDex);
mSysSz=set_sysex();
	console.log(mSysSz);
	console.log(mMKsys);

mSize=sendstring("かきくけこ");
	console.log(mSize);
	console.log(mDex);
mSysSz=set_sysex();
	console.log(mSysSz);
	console.log(mMKsys);
*/


