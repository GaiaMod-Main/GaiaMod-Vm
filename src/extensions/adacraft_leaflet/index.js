const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const L = require('leaflet');

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'display OSM map': {
            'en': 'init OSM map at [LATITUDE] [LONGITUDE] with zoom [ZOOM]',
            'fr': 'initialiser la carte OSM centrée sur [LATITUDE] [LONGITUDE] avec zoom [ZOOM]'
        },
        'add marker': {
            'en': 'add marker at [LATITUDE] [LONGITUDE]',
            'fr': 'ajouter un marqueur [LATITUDE] [LONGITUDE]'
        },
        'hide map': {
            'en': 'hide map',
            'fr': 'masquer la carte'
        },
        'display map': {
            'en': 'show map',
            'fr': 'montrer la carte'
        }
    }
};


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNjZTU3NGU7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48ZyBpZD0iQnJvd3NlciI+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjAsMTguMjNIN2EuNzguNzgsMCwwLDEtLjc4LS43OFY3LjlBMS4xMywxLjEzLDAsMCwxLDcuMzMsNi43N0gxOS42N0ExLjEzLDEuMTMsMCwwLDEsMjAuNzksNy45djkuNTVBLjc4Ljc4LDAsMCwxLDIwLDE4LjIzWk03LjMzLDcuMjlhLjYuNiwwLDAsMC0uNi42MXY5LjU1YS4yNi4yNiwwLDAsMCwuMjYuMjZIMjBhLjI2LjI2LDAsMCwwLC4yNi0uMjZWNy45YS42LjYsMCwwLDAtLjYtLjYxWiIvPjxnIGlkPSJ0b3AiPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTcuMzMsN0gxOS42N2EuODYuODYsMCwwLDEsLjg2Ljg2VjkuNjVhMCwwLDAsMCwxLDAsMEg2LjQ3YTAsMCwwLDAsMSwwLDBWNy45QS44Ni44NiwwLDAsMSw3LjMzLDdaIi8+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==';
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNyAyNSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjxnIGlkPSJDYWxxdWVfMiIgZGF0YS1uYW1lPSJDYWxxdWUgMiI+PGcgaWQ9IkxheWVyXzEiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iMjciIGhlaWdodD0iMjUiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xOS42Niw2LjdINy4zM0ExLjEyLDEuMTIsMCwwLDAsNi4yMSw3LjgydjkuNTVhLjc4Ljc4LDAsMCwwLC43OC43OEgyMGEuNzguNzgsMCwwLDAsLjc3LS43OFY3LjgyQTEuMTIsMS4xMiwwLDAsMCwxOS42Niw2LjdaTTIwLDE3LjYzSDdhLjI1LjI1LDAsMCwxLS4yNi0uMjZWOS41N0gyMC4yN3Y3LjhBLjI2LjI2LDAsMCwxLDIwLDE3LjYzWiIvPjwvZz48L2c+PC9zdmc+';

class AdacraftLeafletBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        this._locale = this.setLocale();
        return {
            id: 'adacraftleaflet',
            name: 'Leaflet',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            color1: '#9ccc00',
            blocks: [
                {
                    opcode: 'initOsmMap',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('display OSM map'),
                    arguments: {
                        LATITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '43.6'
                        },
                        LONGITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '1.45'
                        },
                        ZOOM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '13'
                        }
                    }
                },
                {
                    opcode: 'addMarker',
                    blockType: BlockType.COMMAND,
                    text: this.getMessage('add marker'),
                    arguments: {
                        LATITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '43.6'
                        },
                        LONGITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '1.45'
                        }
                    }
                },
                {
                    opcode: 'hideMap',
                    blocktype: BlockType.COMMAND,
                    text: this.getMessage('hide map')
                },

                {
                    opcode: 'displayMap',
                    blocktype: BlockType.COMMAND,
                    text: this.getMessage('display map')
                }
            ]
        };
    }

    initOsmMap (args) {
        try {
            const mapDiv = document.getElementById('leaflet-map');
            // mapDiv.style.height = '400px';
            // mapDiv.style.width = '800px';
            this.map = L.map('leaflet-map', {
                center: [Number(args.LATITUDE), Number(args.LONGITUDE)],
                zoom: args.ZOOM
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(this.map);
            setInterval(() => {
                this.map.invalidateSize();
            }, 100)
        } catch (error) {
            console.error(error);
        }
    }

    addMarker (args) {
        try {
            var marker = L.marker(
                [Number(args.LATITUDE), Number(args.LONGITUDE)]
            ).addTo(this.map);
        } catch (error) {
            console.error(error);
        }
    }


    hideMap() { 
        document.getElementById('leaflet-map').style.display = 'none';
    }

    displayMap() { 
        document.getElementById('leaflet-map').style.display = 'block';
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

// The following fixes the unexpected display of leaflet controls when openning
// libraries pages (extensions, sprite...).
document.getElementById('leaflet-map').style.zIndex = 100;

module.exports = AdacraftLeafletBlocks;
