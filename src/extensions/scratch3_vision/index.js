const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Timer = require('../../util/timer');
const nets = require('nets');
const iconURI = require('./assets/vision_icon');


let image;

const Runtime = require('../../engine/runtime');
const formatMessage = require('format-message');
const Video = require('../../io/video');
const VideoState = {
    /** Video turned off. */
    OFF: 'off',

    /** Video turned on with default y axis mirroring. */
    ON: 'on',

    /** Video turned on without default y axis mirroring. */
    ON_FLIPPED: 'on-flipped'
};

//server info
let classifyURL = 'https://cognimate.me:2635/vision/classify';
let updateURL = 'https://cognimate.me:2635/vision/updateClassifier';
// let classifyURL = 'http://localhost:2634/vision/classify';
// let updateURL = 'http://localhost:2634/vision/updateClassifier';

//classifier_id
let classifier_id = 'general1234';
let api_key = 'ddce01b8a0504adaa59157533ea77747';

//for parsing image response
let watson_response; //the full response
let classes; //the classes and scores returned for the watson_response
let image_class; //the highest scoring class returned for an image

//response when updating a classifier
let update_response;

//image that user takes
let videoElement;
let imageData;
let _track;

class Scratch3Watson {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The last millisecond epoch timestamp that the video stream was
         * analyzed.
         * @type {number}
         */
        this._lastUpdate = null;
        this._lastFrame = undefined;


        if (this.runtime.ioDevices) {
            // Clear target motion state values when the project starts.
            // this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));

            // Kick off looping the analysis logic.
            this._loop();

            // Configure the video device with values from a globally stored
            // location.
            this.setVideoTransparency({
                TRANSPARENCY: this.globalVideoTransparency
            });
            // this.videoToggle({
            //     VIDEO_STATE: this.globalVideoState
            // });

            this.videoToggle({
                VIDEO_STATE: 'off'
            });
        }
    }

    /**
     * After analyzing a frame the amount of milliseconds until another frame
     * is analyzed.
     * @type {number}
     */
    static get INTERVAL () {
        return 33;
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
    static get DIMENSIONS () {
        return [480, 360];
    }

    /**
     * The transparency setting of the video preview stored in a value
     * accessible by any object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoTransparency () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 50;
    }

    set globalVideoTransparency (transparency) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    /**
     * The video state of the video preview stored in a value accessible by any
     * object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoState () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoState;
        }
        return VideoState.ON;
    }

    set globalVideoState (state) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoState = state;
        }
        return state;
    }

    /**
     * Occasionally step a loop to sample the video, stamp it to the preview
     * skin, and add a TypedArray copy of the canvas's pixel data.
     * @private
     */
    _loop () {
        setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, Scratch3Watson.INTERVAL));

        // Add frame to detector
        const time = Date.now();
        if (this._lastUpdate === null) {
            this._lastUpdate = time;
        }
        const offset = time - this._lastUpdate;
        if (offset > Scratch3Watson.INTERVAL) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Scratch3Watson.DIMENSIONS
            });
            if (frame) {
                this._lastUpdate = time;
                this._lastFrame = frame;
                // this.detect.addFrame(frame.data);
            }
        }

    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array
     * of objects with text and value properties. The text is a translated
     * string, and the value is one-indexed.
     * @param {object[]} info - An array of info objects each having a name
     *   property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    /**
     * States the video sensing activity can be set to.
     * @readonly
     * @enum {string}
     */
    static get VideoState () {
        return VideoState;
    }

    get VIDEO_STATE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.off',
                    default: 'off',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.OFF
            },
            {
                name: formatMessage({
                    id: 'videoSensing.on',
                    default: 'on',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.ON
            },
            {
                name: formatMessage({
                    id: 'videoSensing.onFlipped',
                    default: 'on flipped',
                    description: 'Option for the "turn video [STATE]" block that causes the video to be flipped' +
                        ' horizontally (reversed as in a mirror)'
                }),
                value: VideoState.ON_FLIPPED
            }
        ];
    }
    getInfo () {
        return {
            id: 'vision',
            name: formatMessage({
                        id: 'vision.visionTraining',
                        default: 'Vision Training',
                        description: ''
                    }),
            blockIconURI: iconURI,
            blocks: [
                {
                    opcode: 'videoToggle',
                    text: formatMessage({
                        id: 'vision.video',
                        default: 'turn video [VIDEO_STATE]',
                        description: ''
                    }),
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.NUMBER,
                            menu: 'VIDEO_STATE',
                            defaultValue: VideoState.ON
                        }
                    }
                },
                {
                    opcode: 'setAPI',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.setAPI',
                        default: 'Set API key to',
                        description: ''
                    }) + ' [KEY]',
                    arguments:{
                        KEY:{
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.key',
                                default: 'key',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'getModelfromString',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.getModelfromString',
                        default: 'Choose image model',
                        description: ''
                    }) + ': [IDSTRING]',
                    //[THIS] needs to be equal to THIS in arguments
                    arguments: {
                        IDSTRING: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'vision.modelId',
                                default: 'model id',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'setGenModel',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.choosePreTrained',
                        default: 'Choose pre-trained model',
                        description: ''
                    }),
                    //[THIS] needs to be equal to THIS in arguments
                    arguments: {
                        IDSTRING: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'vision.modelId',
                                default: 'model id',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'takePhoto',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.takePhoto',
                        default: 'Take photo from webcam',
                        description: ''
                    })
                },
                {
                    opcode: 'urlPhoto',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.searchImage',
                        default: 'Search image using link',
                        description: ''
                    }) + ' [URL]',
                    arguments:{
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'vision.addLink',
                                default: 'add link here',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'recognizeObject',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'vision.whatDoYouSee',
                        default: 'What do you see in the photo?',
                        description: ''
                    })
                },
                {
                    opcode: 'recognizeObjectCommand',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.searchPrediction',
                        default: 'Search prediction for your photo',
                        description: ''
                    })
                },
                {
                    opcode: 'getScore',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'vision.howSure',
                        default: 'How sure are you the photo is a [CLASS]?',
                        description: ''
                    }),
                    arguments:{
                        CLASS: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.addCategory',
                                default: 'add category here',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode:'trackLabel',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'vision.whenImageIs',
                        default: 'When image is [LABEL]',
                        description: ''
                    }),
                    arguments:{
                        LABEL:{
                            type: ArgumentType.STRING, 
                            defaultValue: formatMessage({
                                id: 'general.addCategory',
                                default: 'add category here',
                                description: ''
                            })
                        }
                    }
                },
                {
                    opcode: 'clearResults',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.clearResults',
                        default: 'Clear results',
                        description: ''
                    })
                },
                {
                    opcode: 'updateClassifier',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vision.addPhoto',
                        default: 'Add photo to [LABEL]',
                        description: ''
                    }),
                    arguments:{
                        LABEL:{
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'general.addCategory',
                                default: 'add category here',
                                description: ''
                            })
                        }
                    }
                }

            ],
            menus: {
                models: ['Default','RockPaperScissors'],
                VIDEO_STATE: this._buildMenu(this.VIDEO_STATE_INFO)
            }
        };
    }

    getModelfromString (args, util){
        if(args.IDSTRING !== 'classifier id'){
            classifier_id = args.IDSTRING;
        }
    }

    setGenModel (args, util){
        classifier_id = 'general1234';
    }

    getScore(args, util){
        //check that classes is not empty
        if(classes === null){
            return 'did you classify an object yet?'
        }
        var comparison_class = args.CLASS.toLowerCase();
        //make sure the class entered is valid
        console.log(classes);
        console.log(comparison_class);
        if(!classes.hasOwnProperty(comparison_class)){
            return 'this is not a valid class'
        }
        return classes[comparison_class];
    }

    takePhoto (args, util) {
        imageData = this.runtime.ioDevices.video.getSnapshot();
        console.log(imageData);
    }

    recognizeObjectCommand(args, util){
        return this.recognizeObject();
    }

    recognizeObject(args,util) {
        if(imageData == null){
            return 'No Image set';
        }
        if(api_key == null){
            return 'No api key set';
        }
        if(classifier_id == null){
            return 'No Classifier ID set';
        }

        image_class = null
        let image = imageData;

        if (this._lastImage === image &&
            this._lastResult !== null) {
            return this._lastResult;
        }

        this._lastImage = image;
        const _this = this;
        let promise = new Promise((resolve)=>{
        this.classify(classifier_id, image,
            function(err, response) {
            if (err){
                console.log(err);
            }
            else {
                watson_response = JSON.parse(response.body, null, 2);
                console.log(watson_response);
                classes = {};
                //store everything
                for (var i = 0, length = watson_response.length; i < length; i++) {
                    classes[watson_response[i].class.toLowerCase()] = watson_response[i].score;
                }
                //figure out the highest scoring class
                var class_label;
                var best_score = 0;
                for (var key in classes) {
                    if (classes.hasOwnProperty(key)) {
                        if(classes[key]>best_score){
                            best_score = classes[key];
                            class_label = key;
                        }
                    }
                }

                image_class = class_label;
                _this._lastResult = image_class;
                resolve(image_class);
            }});
        });
        promise.then(output => output);

        return promise;
      }

    parseResponse(input){
        for (var i = 0, length = input.length; i < length; i++) {
            classes[input[i].class] = input[i].score;
        }
        //figure out the highest scoring class
        var class_label;
        var best_score = 0;
        for (var key in classes) {
            if (classes.hasOwnProperty(key)) {
                if(classes[key]>best_score){
                    best_score = classes[key];
                    class_label = key;
                }
            }
        }
        return class_label;
    }

    classify(classifier, image, callback) {
        var formData = JSON.stringify({classifier_id: classifier, image_data:image});
        console.log(formData);
        if(image.substring(0,4) === 'data'){
            nets({
                url: classifyURL,
                headers: {
                  'apikey': api_key,
                  'Content-Type': 'application/json' // important header to be included henceforth
                }, // couldn't figure out how to get x-url-encoded content-type to work
                method: 'POST',
                body: formData,
                encoding: undefined // This is important to get response as a string otherwise it returns a buffer array
              }, function(err, response){
                  console.log(response);
                    callback(err, response);
            });
        } else{
            // let url_classify_url = "http://localhost:2634/vision/classifyURLImage";
            let url_classify_url = "https://cognimate.me:2635/vision/classifyURLImage";
            nets({
                url: url_classify_url,
                headers: {'apikey': api_key,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: formData,
                encoding: undefined
                }, function(error, response){
                    console.log(response);
                    callback(error, response);
                });
        }
    }


    setAPI(args, util){
        api_key = args.KEY
    }

    urlPhoto(args,util){
        if(args.URL === 'add link here'){
            return 'invalid link'
        } else{
            imageData = args.URL;
        }
    }

    clearResults () {
        image_class = null;
        imageData = null;
        classes = {};
    }

    trackLabel(args, util){
        let label = args.LABEL;
        if(label == image_class){
            return true;
        } else {
            return false;
        }
    }
    updateClassifier(args, util){
        let category = args.LABEL;
        let promise = new Promise((resolve)=>{
            var formData = JSON.stringify({classifier_id: classifier_id, images:[imageData], class: category});
            this.updateRequest(formData, function(err, response) {
                if (err){
                    console.log(err);
                }
                else {
                    resolve(JSON.parse(response.body));
                }
            });
        });
        promise.then(output => output);
        return promise;
    }

    updateRequest(formData, callback){
        nets({
            url: updateURL,
            headers: {
            'apikey': api_key,
            'Content-Type': 'application/json' // important header to be included henceforth
            }, // couldn't figure out how to get x-url-encoded content-type to work
            method: 'POST',
            body: formData,
            encoding: undefined // This is important to get response as a string otherwise it returns a buffer array
        }, function(err, response){
            console.log(response);
            callback(err, response);
        });
    }

    videoToggle (args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            if(videoElement){
                trackerTask.stop();
                videoElement.pause();
                _track.stop();
                videoElement = null;
                _track = null;
            }
            this.runtime.ioDevices.video.disableVideo();
        } else {
            // this._setupVideo();
            this.runtime.ioDevices.video.enableVideo();
            // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
            this.runtime.ioDevices.video.mirror = state === VideoState.ON;
        }
    }

    /**
     * A scratch command block handle that configures the video preview's
     * transparency from passed arguments.
     * @param {object} args - the block arguments
     * @param {number} args.TRANSPARENCY - the transparency to set the video
     *   preview to
     */
    setVideoTransparency (args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
}

module.exports = Scratch3Watson;
