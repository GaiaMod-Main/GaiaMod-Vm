const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
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
        'run detection on mic': {
            'en': 'run detection on the mic',
            'fr': 'lancer la détection sur le micro'
        },
        'run detection on URL': {
            'en': 'run detection on file or URL [SOUND_URL]',
            'fr': 'lancer la détection sur un fichier ou une URL [SOUND_URL]'
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
        }
    }
};




function loadSound(url) {
    return new Promise((resolve, reject) => {
        let sound = new Audio();
        sound.crossOrigin = 'Anonymous';
        sound.addEventListener('load', e => resolve(sound));
        sound.addEventListener('error', () => {
            reject(new Error(`Failed to load sound's URL: ${url}`));
        });
        sound.src = url;
    });
}


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiM3Y2M2YTU7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iSUFfc29uIiBkYXRhLW5hbWU9IklBIHNvbiI+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTQuNzcsMTQuNTJ2NC4xYzAsLjEzLDAsLjMxLDAsLjM5YS43Ny43NywwLDAsMS0uNDYuMzNjLS4xMywwLS4zMS0uMTktLjQtLjMzYS45MS45MSwwLDAsMSwwLS40NFYxMC40MmEyLjExLDIuMTEsMCwwLDEsMC0uMzZjMC0uMjguMi0uNDkuNDctLjQyYS45LjksMCwwLDEsLjQzLjQzLDEuMTMsMS4xMywwLDAsMSwwLC40OVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNi4zNSwxMi4zN3Y0LjUxYTEuMDcsMS4wNywwLDAsMSwwLC40NGMtLjA5LjE1LS4yNi4zNS0uMzkuMzRhLjc4Ljc4LDAsMCwxLS40Ny0uMzFjLS4wNy0uMDgsMC0uMjYsMC0uMzlWNy44MmMwLS4xMiwwLS4yOCwwLS4zNXMuMjktLjM1LjQ0LS4zNS4zMy4yLjQzLjM1LDAsLjI3LDAsLjR2NC41WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwLjY1LDEyLjYydi00YzAtLjE0LDAtLjMxLDAtLjRzLjI4LS4zNS40My0uMzZhLjYuNiwwLDAsMSwuNDMuMzUsMS44LDEuOCwwLDAsMSwwLC42NmMwLDIuNTIsMCw1LjA1LDAsNy41NywwLC42My0uMTMuODctLjQ4LjgzLS41MywwLS40NS0uNDctLjQ1LS44MloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMi4yNSwxMC40NFY2LjI1YzAtLjEzLDAtLjMsMC0uMzlzLjI5LS4zNS40NC0uMzUuMzMuMi40NC4zNSwwLC4yNywwLC40djguNTZjMCwuMjktLjEzLjUtLjQ0LjUxcy0uNDgtLjItLjQ4LS41MlYxMC40NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNy45NCwxMi4xNXYxLjIxYzAsLjMtLjE1LjQ5LS40Ni40OXMtLjQ1LS4yLS40NS0uNXEwLTEuMjIsMC0yLjQzYS40My40MywwLDAsMSwuNDYtLjQ5LjQ0LjQ0LDAsMCwxLC40NS41djEuMjJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTAsMTIuMzFjMCwuMzQsMCwuNjksMCwxcy0uMTQuNS0uNDUuNTEtLjQ2LS4xOS0uNDctLjQ5VjExLjI5YzAtLjMuMTQtLjUxLjQ1LS41MXMuNDcuMjIuNDcuNTNaIi8+PC9nPjwvZz48L2c+PC9zdmc+';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iSUFfc29uIiBkYXRhLW5hbWU9IklBIHNvbiI+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTQuNzYsMTQuNTJ2NC4xYzAsLjEzLDAsLjMxLDAsLjM5YS44LjgsMCwwLDEtLjQ2LjMzYy0uMTMsMC0uMzEtLjE5LS40LS4zM2EuOTEuOTEsMCwwLDEsMC0uNDRWMTAuNDJjMC0uMTIsMC0uMjUsMC0uMzYsMC0uMjguMjEtLjQ5LjQ4LS40MmEuODguODgsMCwwLDEsLjQyLjQzLDEuMTMsMS4xMywwLDAsMSwwLC40OVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNi4zNCwxMi4zN2MwLDEuNSwwLDMsMCw0LjUxYS45Mi45MiwwLDAsMSwwLC40NGMtLjA4LjE1LS4yNi4zNS0uMzkuMzRzLS4zNC0uMTctLjQ2LS4zMSwwLS4yNiwwLS4zOVY3LjgyYzAtLjEyLDAtLjI4LDAtLjM1cy4zLS4zNS40NS0uMzUuMzIuMi40My4zNSwwLC4yNywwLC40djQuNVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMC42NSwxMi42MmMwLTEuMzIsMC0yLjY0LDAtNCwwLS4xNCwwLS4zMSwwLS40cy4yOS0uMzUuNDQtLjM2YS42NC42NCwwLDAsMSwuNDMuMzUsMS44LDEuOCwwLDAsMSwwLC42NnY3LjU3YzAsLjYzLS4xMy44Ny0uNDguODMtLjU0LDAtLjQ1LS40Ny0uNDUtLjgyQzEwLjY0LDE1LjIsMTAuNjUsMTMuOTEsMTAuNjUsMTIuNjJaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTIuMjUsMTAuNDRjMC0xLjQsMC0yLjc5LDAtNC4xOSwwLS4xMy0uMDUtLjMsMC0uMzlzLjI5LS4zNS40NC0uMzUuMzIuMi40My4zNSwwLC4yNywwLC40djguNTZjMCwuMjktLjEyLjUtLjQ0LjUxcy0uNDctLjItLjQ3LS41MlYxMC40NFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNy45MywxMi4xNWMwLC40LDAsLjgxLDAsMS4yMWEuNDMuNDMsMCwwLDEtLjQ2LjQ5Yy0uMzEsMC0uNDUtLjItLjQ1LS41VjEwLjkyYS40My40MywwLDAsMSwuNDYtLjQ5LjQ0LjQ0LDAsMCwxLC40NS41YzAsLjQxLDAsLjgxLDAsMS4yMloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMCwxMi4zMXYxYzAsLjMtLjE1LjUtLjQ2LjUxcy0uNDYtLjE5LS40Ni0uNDlxMC0xLDAtMi4wN2MwLS4zLjEzLS41MS40NS0uNTFzLjQ2LjIyLjQ3LjUzWiIvPjwvZz48L2c+PC9nPjwvc3ZnPg==';

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
class Scratch3AdaSoundBlocks {
    constructor(runtime, config = {}) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._lastModel = undefined
        this._lastPredictions = undefined

        this._sound = undefined
        this._classifier = undefined
        this._lastResults = undefined

        this._corsProxyBaseUrl = config.corsProxyBaseUrl || '/cors-proxy'
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        this._locale = this.setLocale();
        return {
            id: 'adasound',
            name: 'Ada Sound',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            docsURI: 'https://adacraft.notion.site/01994d800fbc464799d1ead04fac52cf',
            blocks: [
                {
                    opcode: 'selectModelByUrl',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('select model based on URL'),
                    arguments: {
                        MODEL_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://teachablemachine.withgoogle.com/models/-uCcuy8lO/'
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
                            defaultValue: '-uCcuy8lO'
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
                            defaultValue: 'https://teachablemachine.withgoogle.com/models/-uCcuy8lO/'
                        }
                    }
                },
                {
                    opcode: 'runPredictionOnMic',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('run detection on mic')
                },
                {
                    opcode: 'runPredictionOnUrl',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('run detection on URL'),
                    arguments: {
                        SOUND_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://else.where.org/media/gong.ogg'
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
                }
            ]
        };
    }

    selectModelByUrl(args) {
        // TODO add / at the end of URL if missing!
        const modelURL = args.MODEL_URL + "model.json";

        return ml5.soundClassifier(modelURL).then(classifier => {
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

    selectModelByKey(args) {
        // yHNp_zRXX
        const MODEL_URL = `https://teachablemachine.withgoogle.com/models/${args.MODEL_KEY}/`;
        return this.selectModelByUrl({ MODEL_URL });
    }

    selectModelByUrlOrKey (args) {
        if (this.isValidUrl(args.MODEL_KEY_URL)===true) {
            const MODEL_URL = args.MODEL_KEY_URL;
            return this.selectModelByUrl ({MODEL_URL});
        } else {
            const MODEL_KEY = args.MODEL_KEY_URL;
            return this.selectModelByKey ({MODEL_KEY});
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

    runPredictionOnUrl(args) {
        if (!this.isValidUrl(args.SOUND_URL)) {
            return;
        }
        let soundUrl = args.SOUND_URL;
        // The URL for the image can be a http(s): or a data: URL. Both will
        // work. But in the case of http, we need to use a CORS proxy because we
        // don't know if the origin includes the CORS headers.
        if (new URL(soundUrl).protocol.startsWith('http')) {
            soundUrl = `${this._corsProxyBaseUrl}/${soundUrl}`
        }
        const promise = new Promise(
            (resolve, reject) => {
                loadSound(soundUrl)
                    .then(sound => {
                        this._classifier.classify(sound, (error, results) => {
                            this.setResults(results)
                            resolve()
                        })
                    })
                    .catch((error) => reject(error))
            }
        )
        return promise
    }

    runPredictionOnMic() {
        const promise = new Promise(
            (resolve, reject) => {
                if (this._sound === undefined) {
                    this._sound = document.createElement("sound");
                    this._sound.autoplay = true;
                    this._sound.style.display = "none";

                    let media = navigator.mediaDevices.getUserMedia({
                        video: false,
                        audio: true
                    });

                    media.then((stream) => {
                        this._sound.srcObject = stream;
                        this._classifier.classify(this._sound, (error, results) => {
                            if (error) {
                                reject(error)
                            } else {
                                this.setResults(results)
                                resolve()
                            }
                        })
                    });
                } else {
                    this._classifier.classify(this._sound, (error, results) => {
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

    getBestDetection() {
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

    getBestDetectionProbability() {
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

    getNumberOfClasses() {
        const model = this._lastModel;
        if (model === undefined) {
            return -1;
        }
        return model.getMetadata().labels.length;
    }

    getClassName(args) {
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

    getClassProbability(args) {
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
                'AdaSound extension: there is a mismatch between the class names in the model and in the prediction results'
            );
            return -1;
        }
        return prediction.probability;
    }

    clearLastDetectionResults() {
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

module.exports = Scratch3AdaSoundBlocks;
