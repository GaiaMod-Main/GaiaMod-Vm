const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
// const tmImage = require('@teachablemachine/image')
const ml5 = require('ml5');


const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'select model based on URL': {
            'en': 'select and init the model which URL is [MODEL_URL]',
            'fr': 'sélectionner et initialiser le modèle dont l\'URL est [MODEL_URL]'
        },
        'select model based on key': {
            'en': 'select and init the model which key is [MODEL_KEY]',
            'fr': 'sélectionner et initialiser le modèle dont la clé est [MODEL_KEY]'
        },
        'select model based on url or key': {
            'en': 'select and init the model [MODEL_KEY_URL]',
            'fr': 'sélectionner et initialiser le modèle [MODEL_KEY_URL]'
        },
        'run detection on webcam': {
            'en': 'run detection on the webcam image',
            'fr': 'lancer la détection sur l\'image de la webcam'
        },
        'turn on and run detection on webcam': {
            'en': 'turn on and run detection on webcam',
            'fr': 'activer la webcam et lancer la détection'
        },
        'run detection on URL': {
            'en': 'run detection on file or URL [IMAGE_URL]',
            'fr': 'lancer la détection sur un fichier ou une URL [IMAGE_URL]'
        },
        'detected class': {
            'en': 'best detection class',
            'fr': 'classe détectée'
        },
        'detection confidence': {
            'en': 'best detection probability',
            'fr': 'taux de confiance'
        },
        'number of classes': {
            'en': 'number of classes',
            'fr': 'nombre de classes'
        },
        'name of class': {
            'en': 'name of class number [CLASS_NUMBER]',
            'fr': 'nom de la classe n° [CLASS_NUMBER]'
        },
        'confidence for class': {
            'en': 'probability of class number [CLASS_NUMBER]',
            'fr': 'taux de confiance pour la classe n° [CLASS_NUMBER]'
        },
        'clear results': {
            'en': 'clear last detection results',
            'fr': 'supprimer les derniers résultats de la détection'
        },
        'error: no model': {
            'en': 'Error: no model found, first select and init a model',
            'fr': 'Erreur: aucun modèle disponible, sélectionnez et initialisez un modèle'
        },
        'error: no detection': {
            'en': 'Error: first run a prediction before getting the results',
            'fr': 'Erreur: lancez une détection avant de récupérer les résultats'
        },
        'error: class number too low': {
            'en': 'Error: class number must be greater or equal to 1',
            'fr': 'Erreur: le n° de la classe doit être 1 ou plus'
        },
        'error: class number too high': {
            'en': 'Error: class number must be lesser or equal to the number of classes',
            'fr': 'Erreur: le n° de la classe ne doit pas dépasser le nombre de classes'
        },
        'video_toggle': {
            'en': 'turn webcam [VIDEO_STATE]',
            'fr': '[VIDEO_STATE] la webcam'
        },
        'on': {
            'en': 'on',
            'fr': 'activer'
        },
        'off': {
            'en': 'off',
            'fr': 'désactiver'
        },
        'video_transparency': {
            'en': 'set transparency to [TRANSPARENCY]',
            'fr': 'régler la transparence à [TRANSPARENCY]'
        },
    }
};
  



function loadImage(url) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.crossOrigin = 'Anonymous';
        image.addEventListener('load', e => resolve(image));
        image.addEventListener('error', () => {
            reject(new Error(`Failed to load image's URL: ${url}`));
        });
        image.src = url;
    });
}


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiM3Y2M2YTU7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iSUFfaW1hZ2UiIGRhdGEtbmFtZT0iSUEgaW1hZ2UiPjxwYXRoIGlkPSJpY29uLWZ1bGxzY3JlZW4iIGNsYXNzPSJjbHMtMiIgZD0iTTE5LjU5LDE5LjM0SDE1LjlhMSwxLDAsMCwxLTEtMWgwYTEsMSwwLDAsMSwxLTFoMi43M1YxNC42OGExLDEsMCwwLDEsMS0xaDBhMSwxLDAsMCwxLDEsMWgwdjMuNjlhMSwxLDAsMCwxLTEsMVptLTguNDksMEg3LjQxYTEsMSwwLDAsMS0xLTFoMFYxNC42OGExLDEsMCwwLDEsMS0xaDBhMSwxLDAsMCwxLDEsMWgwdjIuNzNIMTEuMWExLDEsMCwwLDEsMSwxaDBhMSwxLDAsMCwxLTEsMVptOC40OS04LjIxYTEsMSwwLDAsMS0xLTFoMFY3LjQzSDE1Ljg5YTEsMSwwLDAsMS0xLTFoMGExLDEsMCwwLDEsMS0xaDMuN2ExLDEsMCwwLDEsMSwxaDB2My42OWExLDEsMCwwLDEtMSwxWm0tMTIuMTgsMGExLDEsMCwwLDEtMS0xaDBWNi40OGExLDEsMCwwLDEsMS0xSDExLjFhMSwxLDAsMCwxLDEsMWgwYTEsMSwwLDAsMS0xLDFIOC4zN3YyLjczYTEsMSwwLDAsMS0xLDFaIi8+PC9nPjwvZz48L2c+PC9zdmc+';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iSUFfaW1hZ2UiIGRhdGEtbmFtZT0iSUEgaW1hZ2UiPjxwYXRoIGlkPSJpY29uLWZ1bGxzY3JlZW4iIGNsYXNzPSJjbHMtMiIgZD0iTTE5LjU5LDE5LjM0SDE1LjlhMSwxLDAsMCwxLTEtMWgwYTEsMSwwLDAsMSwxLTFoMi43M1YxNC42OGExLDEsMCwwLDEsMS0xaDBhMSwxLDAsMCwxLDEsMWgwdjMuNjlhMSwxLDAsMCwxLTEsMVptLTguNDksMEg3LjQxYTEsMSwwLDAsMS0xLTFoMFYxNC42OGExLDEsMCwwLDEsMS0xaDBhMSwxLDAsMCwxLDEsMWgwdjIuNzNIMTEuMWExLDEsMCwwLDEsMSwxaDBhMSwxLDAsMCwxLTEsMVptOC40OS04LjIxYTEsMSwwLDAsMS0xLTFoMFY3LjQzSDE1Ljg5YTEsMSwwLDAsMS0xLTFoMGExLDEsMCwwLDEsMS0xaDMuN2ExLDEsMCwwLDEsMSwxaDB2My42OWExLDEsMCwwLDEtMSwxWm0tMTIuMTgsMGExLDEsMCwwLDEtMS0xaDBWNi40OGExLDEsMCwwLDEsMS0xSDExLjFhMSwxLDAsMCwxLDEsMWgwYTEsMSwwLDAsMS0xLDFIOC4zN3YyLjczYTEsMSwwLDAsMS0xLDFaIi8+PC9nPjwvZz48L2c+PC9zdmc+';

/**
 * @typedef {object} PenState - the pen state associated with a particular target.
 * @property {Boolean} penDown - tracks whether the pen should draw for this target.
 * @property {number} color - the current color (hue) of the pen.
 * @property {PenAttributes} penAttributes - cached pen attributes for the renderer. This is the authoritative value for
 *   diameter but not for pen color.
 */

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3AdaVisionBlocks {
    constructor (runtime, config = {}) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._lastModel = undefined
        this._lastPredictions = undefined

        this._video = undefined
        this._classifier = undefined
        this._lastResults = undefined

        this._corsProxyBaseUrl = config.corsProxyBaseUrl || '/cors-proxy'
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        this._locale = this.setLocale();
        return {
            id: 'adavision',
            name: 'Ada Vision',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            docsURI: 'https://adacraft.notion.site/e9def85c84564d1890fe1f478f403543',
            blocks: [
                {
                    opcode: 'selectModelByUrl',
                    blockType: BlockType.COMMAND,
                    text:  this.getMessage('select model based on URL'),
                    arguments: {
                        MODEL_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://teachablemachine.withgoogle.com/models/Se2BsLUiB/'
                        }
                    }
                },
                {
                    opcode: 'selectModelByKey',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('select model based on key'),
                    arguments: {
                        MODEL_KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Se2BsLUiB'
                        }
                    }
                },
                {
                    opcode: 'selectModelByUrlOrKey',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('select model based on url or key'),
                    arguments: {
                        MODEL_KEY_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://teachablemachine.withgoogle.com/models/Se2BsLUiB/'
                        }
                    }
                },
                {
                    opcode: 'runPredictionOnWebcam',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('run detection on webcam')
                },
                {
                    opcode: 'turnOnWebcamAndRunPrediction',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('turn on and run detection on webcam')
                },
                {
                    opcode: 'runPredictionOnUrl',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('run detection on URL'),
                    arguments: {
                        IMAGE_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://i.imgur.com/R0nP64g.png'
                        }
                    }
                },
                {
                    opcode: 'getBestDetectionClass',
                    text: this.getMessage('detected class'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getBestDetectionProbability',
                    text: this.getMessage('detection confidence'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getNumberOfClasses',
                    text: this.getMessage('number of classes'),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getClassName',
                    text: this.getMessage('name of class'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CLASS_NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getClassProbability',
                    text: this.getMessage('confidence for class'),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        CLASS_NUMBER: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'clearLastDetectionResults',
                    text: this.getMessage('clear results'),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'videoToggle',
                    text: this.getMessage('video_toggle'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'video_menu',
                            defaultValue: 'off'
                        }
                    }
                },
                {
                    opcode: 'setVideoTransparency',
                    text: this.getMessage('video_transparency'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                }
            ],
            menus: {
                video_menu: this.getVideoMenu(),
            }
        };
    }

    selectModelByUrl (args) {
        // TODO add / at the end of URL if missing!
        const modelURL = args.MODEL_URL + "model.json";

        return ml5.imageClassifier(modelURL).then(classifier => {
            this._classifier = classifier
            this._lastModel = {
                getMetadata: () => {
                    return {
                        labels: this._classifier.mapStringToIndex
                    }
                }
            }
        });
    }

    selectModelByKey (args) {
        // yHNp_zRXX
        const MODEL_URL = `https://teachablemachine.withgoogle.com/models/${args.MODEL_KEY}/`;
        return this.selectModelByUrl({MODEL_URL});
    }

    selectModelByUrlOrKey (args) {
        if (this.isValidUrl(args.MODEL_KEY_URL) === true){
            const MODEL_URL = args.MODEL_KEY_URL;
            return this.selectModelByUrl({MODEL_URL});
        } else {
            const MODEL_KEY = args.MODEL_KEY_URL;
            return this.selectModelByKey({MODEL_KEY});
        }
    }

    setResults(results) {
        this._lastResults = results
        this._lastPredictions = this._lastResults.map(
            (result) => ({
                className: result.label,
                probability: result.confidence
            })
        )
    }
    
    runPredictionOnUrl (args) {
        if (!this.isValidUrl(args.IMAGE_URL)) {
            return;
        }
        let imageUrl = args.IMAGE_URL;
        // The URL for the image can be a http(s): or a data: URL. Both will
        // work. But in the case of http, we need to use a CORS proxy because we
        // don't know if the origin includes the CORS headers.
        if (new URL(imageUrl).protocol.startsWith('http')) {
            imageUrl = `${this._corsProxyBaseUrl}/${imageUrl}`
        }
        const promise = new Promise(
            (resolve, reject) => {
                loadImage(imageUrl)
                   .then(image => {
                       this._classifier.classify(image, (error, results) => {
                           this.setResults(results)
                           resolve()
                       })
                   })
                   .catch((error) => reject(error))
            }
        )
        return promise
    }

    runPredictionOnWebcam () {
        const promise = new Promise(
            (resolve, reject) => {
                if (this._video === undefined) {
                    this._video = document.createElement("video");
                    this._video.width = 480;
                    this._video.height = 360;
                    this._video.autoplay = true;
                    this._video.style.display = "none";
                
                    let media = navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    });
                
                    media.then((stream) => {
                        this._video.srcObject = stream;
                        this._classifier.classify(this._video, (error, results) => {
                            if (error) {
                                reject(error)
                            } else {
                                this.setResults(results)
                                resolve()
                            }
                        })
                    });    
                } else {
                    this._classifier.classify(this._video, (error, results) => {
                        if (error) {
                            reject(error)
                        } else {
                            this.setResults(results)
                            resolve()
                        }
                    })
                }
            }
        )
        return promise
    }

    turnOnWebcamAndRunPrediction () {
        this.runtime.ioDevices.video.enableVideo();
        this.runtime.ioDevices.video.setPreviewGhost(50);
        return this.runPredictionOnWebcam()
    }

    getBestDetection () {
        const detections = this._lastPredictions;
        const descendingOrderDetections = detections.sort(
            (a, b) => b.probability - a.probability
        );
        const best = descendingOrderDetections[0];
        return best;
    }

    getBestDetectionClass() {
        const model = this._lastModel;
        if (model === undefined) {
            return this.getMessage('error: no model');
        }
        if (this._lastPredictions === undefined) {
            return this.getMessage('error: no detection');
        }
        const best = this.getBestDetection();
        return best.className;
    }

    getBestDetectionProbability () {
        const model = this._lastModel;
        if (model === undefined) {
            return this.getMessage('error: no model');
        }
        if (this._lastPredictions === undefined) {
            return this.getMessage('error: no detection');
        }
        const best = this.getBestDetection();
        return best.probability;
    }

    getNumberOfClasses () {
        const model = this._lastModel;
        if (model === undefined) {
            return -1;
        }
        return model.getMetadata().labels.length;
    }

    getClassName (args) {
        const model = this._lastModel;
        if (model === undefined) {
            return this.getMessage('error: no model');
        }
        if (args.CLASS_NUMBER < 1) {
            return this.getMessage('error: class number too low');
        }
        const classes = model.getMetadata().labels;
        if (args.CLASS_NUMBER > classes.length) {
            return this.getMessage('error: class number too high');
        }
        const index = args.CLASS_NUMBER - 1;
        return model.getMetadata().labels[index];
    }

    getClassProbability (args) {
        const model = this._lastModel;
        if (model === undefined) {
            return this.getMessage('error: no model');
        }
        if (this._lastPredictions === undefined) {
            return this.getMessage('error: no detection');
        }
        if (args.CLASS_NUMBER < 1) {
            return this.getMessage('error: class number too low');
        }
        const classes = model.getMetadata().labels;
        if (args.CLASS_NUMBER > classes.length) {
            return this.getMessage('error: class number too high');
        }
        const index = args.CLASS_NUMBER - 1;
        const className = model.getMetadata().labels[index];
        const prediction = this._lastPredictions.find(
            prediction => prediction.className === className
        );
        if (prediction === undefined) {
            console.error(
                'AdaVision extension: there is a mismatch between the class names in the model and in the prediction results'
            );
            return -1;
        }
        return prediction.probability;
    }

    clearLastDetectionResults () {
        this._lastPredictions = undefined;
    }

    isValidUrl(string) {
        let url
        try {
          url = new URL(string)
        } catch (_) {
          return false
        }
        return true
    }

    /**
     * Return menu for video showing state.
     * @return {Array} - Menu items.
     */
     getVideoMenu() {
        return [
            {
                text: this.getMessage('off'),
                value: 'off'
            },
            {
                text: this.getMessage('on'),
                value: 'on'
            }
        ];
    }

    /**
     * Show video image on the stage or not.
     * @param {object} args - the block's arguments.
     * @property {string} VIDEO_STATE - Show or not ['on'|'off'].
    */
    videoToggle (args) {
        const state = args.VIDEO_STATE;
        if (state === 'off') {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            this.runtime.ioDevices.video.mirror = state === 'on';
            this.runtime.ioDevices.video.setPreviewGhost(50);
        }
    }

    setVideoTransparency (args) {
        const transparency = args.TRANSPARENCY;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
      
    setLocale() {
        let locale = formatMessage.setup().locale;
        if (localisation.availableLocales.includes(locale)) {
          return locale;
        } else {
          return 'en';
        }
    }

    getMessage(id) {
        return localisation.messages[id][this._locale];
    }
    
}
module.exports = Scratch3AdaVisionBlocks;
