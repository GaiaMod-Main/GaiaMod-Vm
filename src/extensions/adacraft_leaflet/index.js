/* eslint-disable no-else-return */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const DOMPurify = require('dompurify');

const L = require('leaflet');

// Ajv is a library to validate JSON strings and JS objects shapes.
const Ajv = require('ajv/dist/ajv');
const ajv = new Ajv();

// Coordinates is an array of arrays containeing exactly 2 numbers. Like:
//
// ``` js
// [
//     [43.6, 1.45],
//     [43.7, 1.45],
//     [43.6, 1.46]
// ]
// ```
const coordinatesSchema = {
    type: 'array',
    items: {
        type: 'array',
        items: {
            type: 'number'
        },
        minItems: 2,
        maxItems: 2
    }
};
// This is the funciton to use to validate a JS object against the given schema.
const validateCoordinates = ajv.compile(coordinatesSchema);

let mapDiv = document.getElementById('leaflet-map');
const markers = {};

const maps = [];

const jawgToken = 'S4q2z0yLImZc5LDQTaC32LPLKD7Inl3nTKLCJK5y1mtLppIXDZRY0MSVTLynJQRb'; // this is a free access token
maps[0] = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});
maps[1] = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '<a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
maps[2] = L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy;'
});
maps[3] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    // eslint-disable-next-line max-len
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
maps[4] = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.jpg', {
    attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
    bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
    minZoom: 1,
    maxZoom: 8,
    time: '',
    tilematrixset: 'GoogleMapsCompatible_Level'
});
maps[5] = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
maps[6] = L.tileLayer('https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    accessToken: jawgToken
});
maps[7] = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    accessToken: jawgToken
});
maps[8] = L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    accessToken: jawgToken
});
maps[9] = L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
    attribution: '<a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors',
    minZoom: 0,
    maxZoom: 22,
    accessToken: jawgToken
});
maps[10] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', {
    // eslint-disable-next-line max-len
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
    maxZoom: 9
});
maps[11] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    // eslint-disable-next-line max-len
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    maxZoom: 18
});
maps[12] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
    // eslint-disable-next-line max-len
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    maxZoom: 11
});
maps[13] = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a href="https://www.google.fr/maps/">Google Maps</a>'
});
maps[14] = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a href="https://www.google.fr/maps/">Google Maps</a>'
});
maps[15] = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a href="https://www.google.fr/maps/">Google Maps</a>'
});
maps[16] = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '<a href="https://www.google.fr/maps/">Google Maps</a>'
});

let currentLayer = maps[0];

const localisation = {
    availableLocales: ['en', 'fr'],
    messages: {
        'display OSM map': {
            en: 'init OSM map at [LATITUDE] [LONGITUDE] with zoom [ZOOM]',
            fr: 'initialiser la carte OSM centrée sur [LATITUDE] [LONGITUDE] avec zoom [ZOOM]'
        },
        'display OSM map in div': {
            en: 'init OSM map at [LATITUDE] [LONGITUDE] with zoom [ZOOM] in the element by id [ID] in HTML block',
            // eslint-disable-next-line max-len
            fr: 'initialiser la carte OSM centrée sur [LATITUDE] [LONGITUDE] avec zoom [ZOOM] dans l\'élément avec l\'id [ID] dans le bloc HTML'
        },
        'go to XYZ': {
            en: 'go to [LATITUDE] [LONGITUDE] with zoom [ZOOM] [ANIMATION] animation',
            fr: 'se déplacer à [LATITUDE] [LONGITUDE] avec zoom [ZOOM] [ANIMATION] animation'
        },
        'add marker': {
            en: 'add marker at [LATITUDE] [LONGITUDE]',
            fr: 'ajouter un marqueur [LATITUDE] [LONGITUDE]'
        },
        'add marker id': {
            en: 'add marker at [LATITUDE] [LONGITUDE] with id [ID]',
            fr: 'ajouter un marqueur [LATITUDE] [LONGITUDE] avec id [ID]'
        },
        'add popup to element id': {
            en: 'add popup with text [TEXT] to the element with id [ID]',
            fr: 'ajouter un popup avec texte [TEXT] à l\'élément avec id [ID]'
        },
        'add shown popup to element id': {
            en: 'add popup with text [TEXT] to the element with id [ID] and show it',
            fr: 'ajouter un popup avec texte [TEXT] à l\'élément avec id [ID] et l\'afficher'
        },
        'add circle id': {
            en: 'add a circle around [LATITUDE][LONGITUDE] with color [COLOR] radius [RADIUS] and id [ID]',
            fr: 'ajouter un cercle autour de [LATITUDE][LONGITUDE] de couleur [COLOR] rayon [RADIUS] avec id [ID]'
        },
        'add polygone id': {
            en: 'add a polygone at [COORDINATES] with color [COLOR] and id [ID]',
            fr: 'ajouter un polygone en [COORDINATES] de couleur [COLOR] avec id [ID]'
        },
        'add polyline id': {
            en: 'add a polyline at [COORDINATES] with color [COLOR] and id [ID]',
            fr: 'ajouter des lignes en [COORDINATES] de couleur [COLOR] avec id [ID]'
        },
        'remove element id': {
            en: 'remove element with id [ID]',
            fr: 'supprimer l\'élément avec id [ID]'
        },
        'hide map': {
            en: 'hide map',
            fr: 'masquer la carte'
        },
        'display map': {
            en: 'show map',
            fr: 'montrer la carte'
        },
        'set map control': {
            en: 'set map control to [CONTROL]',
            fr: 'mettre le contrôle de la carte à [CONTROL]'
        },
        'current latitude': {
            en: 'current latitude',
            fr: 'latitude actuelle'
        },
        'current longitude': {
            en: 'current longitude',
            fr: 'longitude actuelle'
        },
        'with': {
            en: 'with',
            fr: 'avec'
        },
        'without': {
            en: 'without',
            fr: 'sans'
        },
        'enabled': {
            en: 'enabled',
            fr: 'activé'
        },
        'disabled': {
            en: 'disabled',
            fr: 'désactivé'
        },
        'map control zoom only': {
            en: 'zoom only',
            fr: 'zoom seulement'
        },
        'map control drag only': {
            en: 'drag only',
            fr: 'déplacement seulement'
        },
        'set map zoom': {
            en: 'set map zoom to [ZOOM]',
            fr: 'mettre le zoom de la carte à [ZOOM]'
        },
        'current zoom': {
            en: 'current zoom',
            fr: 'niveau de zoom'
        },
        'get OSM link': {
            en: 'Open Street Map link',
            fr: 'lien Open Street Map'
        },
        'remove map': {
            en: 'remove map',
            fr: 'supprimer la carte'
        },
        'set map style': {
            en: 'set map style to [STYLE]',
            fr: 'mettre le style de la carte à [STYLE]'
        }
    }
};


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// Icon credits: https://popicons.cc
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01Ljc2MDIzIDEuNjU4MTRDNS45MDQ0MiAxLjYwMjcgNi4wNjIxMiAxLjU5MzEyIDYuMjExOTMgMS42MzA2OUwxNC4wMDY4IDMuNTg1NzRMMTcuNjU4MyAyLjE4MTg0QzE3LjY3MTkgMi4xNzY1OSAxNy42ODU2IDIuMTcxMzQgMTcuNjk5MiAyLjE2NjA4QzE3Ljk3MjMgMi4wNjEwMSAxOC4yNDk1IDEuOTU0MzIgMTguNDg2NCAxLjkwMTNDMTguNzUwOCAxLjg0MjExIDE5LjEzNjYgMS44MDg0IDE5LjQ5ODYgMi4wNTgxMkMxOS44NjA1IDIuMzA3ODUgMTkuOTY3MiAyLjY4MTM0IDIwLjAwNjggMi45NTAyMkMyMC4wNDIyIDMuMTkxMDkgMjAuMDQyMSAzLjQ4OSAyMC4wNDIgMy43ODIzN0MyMC4wNDIgMy43OTcwNiAyMC4wNDIgMy43Njc3MiAyMC4wNDIgMy43ODIzN0wyMC4wNDIgMTQuMDM4QzIwLjA0MiAxNC4wNDYzIDIwLjA0MiAxNC4wNTQ3IDIwLjA0MiAxNC4wNjMyQzIwLjA0MiAxNC4yMDQ3IDIwLjA0MjEgMTQuMzY0OSAyMC4wMjY4IDE0LjUwNDhDMjAuMDA4NyAxNC42NzE2IDE5Ljk2MzUgMTQuODc3MSAxOS44Mjg2IDE1LjA3ODRDMTkuNjkzNiAxNS4yNzk3IDE5LjUyMSAxNS4zOTkyIDE5LjM3MzggMTUuNDc5QzE5LjI1MDQgMTUuNTQ1OSAxOS4xMDI0IDE1LjYwNjMgMTguOTcxOCAxNS42NTk2TDE0LjMzODMgMTcuNTUyNEMxNC4xOTAzIDE3LjYxMjkgMTQuMDI3IDE3LjYyNDUgMTMuODcyMSAxNy41ODU2TDYuMDc3MTUgMTUuNjMwNkwyLjQyNTcgMTcuMDM0NUMyLjQxMjA2IDE3LjAzOTcgMi4zOTgzOSAxNy4wNDUgMi4zODQ3MiAxNy4wNTAyQzIuMTExNyAxNy4xNTUzIDEuODM0NDUgMTcuMjYyIDEuNTk3NiAxNy4zMTVDMS4zMzMxOSAxNy4zNzQyIDAuOTQ3Mzc3IDE3LjQwNzkgMC41ODU0MTYgMTcuMTU4MkMwLjIyMzQ1NSAxNi45MDg1IDAuMTE2NzY0IDE2LjUzNSAwLjA3NzIzMyAxNi4yNjYxQzAuMDQxODIxNiAxNi4wMjUyIDAuMDQxOTEyIDE1LjcyNzMgMC4wNDIwMDExIDE1LjQzMzlDMC4wNDIwMDU2IDE1LjQxOTMgMC4wNDIwMTAxIDE1LjQwNDYgMC4wNDIwMTAxIDE1LjM4OTlWNS4wNjc4QzAuMDQyMDEwMSA1LjA1OTMgMC4wNDIwMDY3IDUuMDUwNzIgMC4wNDIwMDMzIDUuMDQyMDhDMC4wNDE5NDU4IDQuODk3NTQgMC4wNDE4ODA4IDQuNzM0MiAwLjA1NzYzMTcgNC41OTE3MkMwLjA3NjM5NDkgNC40MjIgMC4xMjMwNzcgNC4yMTI2OSAwLjI2MjczNiA0LjAwODk1QzAuNDAyMzk1IDMuODA1MiAwLjU4MDUxIDMuNjg2NTYgMC43MzE3NjMgMy42MDgyNUMwLjg1ODczMyAzLjU0MjUxIDEuMDEwNzkgMy40ODQxMiAxLjE0NTM0IDMuNDMyNDVDMS4xNTMzOSAzLjQyOTM2IDEuMTYxMzcgMy40MjYyOSAxLjE2OTI4IDMuNDIzMjVMNS43NjAyMyAxLjY1ODE0Wk02Ljc4MTgxIDE0LjI1MTNMMTMuMzAyMiAxNS44ODY2VjQuOTY1MDVMNi43ODE4MSAzLjMyOTY2VjE0LjI1MTNaTTUuMjc3MTEgMy40NjA1M1YxNC4zMjE1TDEuODg3MjQgMTUuNjI0OUMxLjc1NDMgMTUuNjc2IDEuNjQ0NDkgMTUuNzE4MSAxLjU0ODYxIDE1Ljc1M0MxLjU0Njc1IDE1LjY1MDcgMS41NDY3MSAxNS41MzI3IDEuNTQ2NzEgMTUuMzg5OVY1LjA2NzhDMS41NDY3MSA0Ljk5ODM4IDEuNTQ2NzMgNC45NDI5OCAxLjU0NzM2IDQuODk1MjNDMS41OTE1OCA0Ljg3NzU2IDEuNjQzMTMgNC44NTc3MSAxLjcwNzc1IDQuODMyODdMNS4yNzcxMSAzLjQ2MDUzWk0xNC44MDY5IDQuODk0NzhWMTUuNzMxMUwxOC4zODExIDE0LjI3MUMxOC40NDM4IDE0LjI0NTQgMTguNDkzOCAxNC4yMjQ5IDE4LjUzNjcgMTQuMjA2N0MxOC41MzczIDE0LjE2MDEgMTguNTM3MyAxNC4xMDU5IDE4LjUzNzMgMTQuMDM4VjMuODI2MzlDMTguNTM3MyAzLjY4MzU2IDE4LjUzNzIgMy41NjU2IDE4LjUzNTQgMy40NjMzQzE4LjQzOTUgMy40OTgxNyAxOC4zMjk3IDMuNTQwMzQgMTguMTk2NyAzLjU5MTQ1TDE0LjgwNjkgNC44OTQ3OFoiIGZpbGw9IiMxOTk5MDAiPjwvcGF0aD4KPC9zdmc+';
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjYiIHZpZXdCb3g9Ii0zIDAgMjMgMjIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNS43NjAyMyAxLjY1ODE0QzUuOTA0NDIgMS42MDI3IDYuMDYyMTIgMS41OTMxMiA2LjIxMTkzIDEuNjMwNjlMMTQuMDA2OCAzLjU4NTc0TDE3LjY1ODMgMi4xODE4NEMxNy42NzE5IDIuMTc2NTkgMTcuNjg1NiAyLjE3MTM0IDE3LjY5OTIgMi4xNjYwOEMxNy45NzIzIDIuMDYxMDEgMTguMjQ5NSAxLjk1NDMyIDE4LjQ4NjQgMS45MDEzQzE4Ljc1MDggMS44NDIxMSAxOS4xMzY2IDEuODA4NCAxOS40OTg2IDIuMDU4MTJDMTkuODYwNSAyLjMwNzg1IDE5Ljk2NzIgMi42ODEzNCAyMC4wMDY4IDIuOTUwMjJDMjAuMDQyMiAzLjE5MTA5IDIwLjA0MjEgMy40ODkgMjAuMDQyIDMuNzgyMzdDMjAuMDQyIDMuNzk3MDYgMjAuMDQyIDMuNzY3NzIgMjAuMDQyIDMuNzgyMzdMMjAuMDQyIDE0LjAzOEMyMC4wNDIgMTQuMDQ2MyAyMC4wNDIgMTQuMDU0NyAyMC4wNDIgMTQuMDYzMkMyMC4wNDIgMTQuMjA0NyAyMC4wNDIxIDE0LjM2NDkgMjAuMDI2OCAxNC41MDQ4QzIwLjAwODcgMTQuNjcxNiAxOS45NjM1IDE0Ljg3NzEgMTkuODI4NiAxNS4wNzg0QzE5LjY5MzYgMTUuMjc5NyAxOS41MjEgMTUuMzk5MiAxOS4zNzM4IDE1LjQ3OUMxOS4yNTA0IDE1LjU0NTkgMTkuMTAyNCAxNS42MDYzIDE4Ljk3MTggMTUuNjU5NkwxNC4zMzgzIDE3LjU1MjRDMTQuMTkwMyAxNy42MTI5IDE0LjAyNyAxNy42MjQ1IDEzLjg3MjEgMTcuNTg1Nkw2LjA3NzE1IDE1LjYzMDZMMi40MjU3IDE3LjAzNDVDMi40MTIwNiAxNy4wMzk3IDIuMzk4MzkgMTcuMDQ1IDIuMzg0NzIgMTcuMDUwMkMyLjExMTcgMTcuMTU1MyAxLjgzNDQ1IDE3LjI2MiAxLjU5NzYgMTcuMzE1QzEuMzMzMTkgMTcuMzc0MiAwLjk0NzM3NyAxNy40MDc5IDAuNTg1NDE2IDE3LjE1ODJDMC4yMjM0NTUgMTYuOTA4NSAwLjExNjc2NCAxNi41MzUgMC4wNzcyMzMgMTYuMjY2MUMwLjA0MTgyMTYgMTYuMDI1MiAwLjA0MTkxMiAxNS43MjczIDAuMDQyMDAxMSAxNS40MzM5QzAuMDQyMDA1NiAxNS40MTkzIDAuMDQyMDEwMSAxNS40MDQ2IDAuMDQyMDEwMSAxNS4zODk5VjUuMDY3OEMwLjA0MjAxMDEgNS4wNTkzIDAuMDQyMDA2NyA1LjA1MDcyIDAuMDQyMDAzMyA1LjA0MjA4QzAuMDQxOTQ1OCA0Ljg5NzU0IDAuMDQxODgwOCA0LjczNDIgMC4wNTc2MzE3IDQuNTkxNzJDMC4wNzYzOTQ5IDQuNDIyIDAuMTIzMDc3IDQuMjEyNjkgMC4yNjI3MzYgNC4wMDg5NUMwLjQwMjM5NSAzLjgwNTIgMC41ODA1MSAzLjY4NjU2IDAuNzMxNzYzIDMuNjA4MjVDMC44NTg3MzMgMy41NDI1MSAxLjAxMDc5IDMuNDg0MTIgMS4xNDUzNCAzLjQzMjQ1QzEuMTUzMzkgMy40MjkzNiAxLjE2MTM3IDMuNDI2MjkgMS4xNjkyOCAzLjQyMzI1TDUuNzYwMjMgMS42NTgxNFpNNi43ODE4MSAxNC4yNTEzTDEzLjMwMjIgMTUuODg2NlY0Ljk2NTA1TDYuNzgxODEgMy4zMjk2NlYxNC4yNTEzWk01LjI3NzExIDMuNDYwNTNWMTQuMzIxNUwxLjg4NzI0IDE1LjYyNDlDMS43NTQzIDE1LjY3NiAxLjY0NDQ5IDE1LjcxODEgMS41NDg2MSAxNS43NTNDMS41NDY3NSAxNS42NTA3IDEuNTQ2NzEgMTUuNTMyNyAxLjU0NjcxIDE1LjM4OTlWNS4wNjc4QzEuNTQ2NzEgNC45OTgzOCAxLjU0NjczIDQuOTQyOTggMS41NDczNiA0Ljg5NTIzQzEuNTkxNTggNC44Nzc1NiAxLjY0MzEzIDQuODU3NzEgMS43MDc3NSA0LjgzMjg3TDUuMjc3MTEgMy40NjA1M1pNMTQuODA2OSA0Ljg5NDc4VjE1LjczMTFMMTguMzgxMSAxNC4yNzFDMTguNDQzOCAxNC4yNDU0IDE4LjQ5MzggMTQuMjI0OSAxOC41MzY3IDE0LjIwNjdDMTguNTM3MyAxNC4xNjAxIDE4LjUzNzMgMTQuMTA1OSAxOC41MzczIDE0LjAzOFYzLjgyNjM5QzE4LjUzNzMgMy42ODM1NiAxOC41MzcyIDMuNTY1NiAxOC41MzU0IDMuNDYzM0MxOC40Mzk1IDMuNDk4MTcgMTguMzI5NyAzLjU0MDM0IDE4LjE5NjcgMy41OTE0NUwxNC44MDY5IDQuODk0NzhaIiBmaWxsPSIjZWZmYWM4Ij48L3BhdGg+Cjwvc3ZnPg==';

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
            name: 'Leaflet Map',
            menuIconURI: menuIconURI,
            docsURI: 'https://adacraft.notion.site/Leaflet-7bcf6a5826cf4564ba46764a7516c668',
            color1: '#9ccc00',
            blocks: [
                {
                    opcode: 'initOsmMap',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
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
                            type: ArgumentType.MENU,
                            defaultValue: 13,
                            menu: 'mapZoom'
                        }
                    }
                },
                {
                    opcode: 'initOsmMapDivId',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('display OSM map in div'),
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
                            type: ArgumentType.MENU,
                            defaultValue: 13,
                            menu: 'mapZoom'
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'leaflet'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setMapStyle',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('set map style'),
                    arguments: {
                        STYLE: {
                            type: ArgumentType.MENU,
                            menu: 'mapStyles',
                            defaultValue: '1'
                        }
                    }
                },
                '---',
                {
                    opcode: 'displayMap',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('display map')
                },
                {
                    opcode: 'hideMap',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('hide map')
                },
                '---',
                {
                    opcode: 'addMarker',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('add marker'),
                    hideFromPalette: true,
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
                    opcode: 'addMarkerId',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('add marker id'),
                    arguments: {
                        LATITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '43.6'
                        },
                        LONGITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '1.45'
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'place1'
                        }
                    }
                },
                {
                    opcode: 'addCircleId',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('add circle id'),
                    arguments: {
                        LATITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '43.6'
                        },
                        LONGITUDE: {
                            type: ArgumentType.STRING,
                            defaultValue: '1.45'
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                            defaultValue: '#ff0000'
                        },
                        RADIUS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '500'
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'circle1'
                        }
                    }
                },
                {
                    opcode: 'addPolygoneId',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('add polygone id'),
                    arguments: {
                        COORDINATES: {
                            type: ArgumentType.STRING,
                            defaultValue: '[[43.6, 1.45], [43.603, 1.45], [43.6, 1.451]]'
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                            defaultValue: '#ff0000'
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'polygone1'
                        }
                    }
                },
                {
                    opcode: 'addPolylineId',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('add polyline id'),
                    arguments: {
                        COORDINATES: {
                            type: ArgumentType.STRING,
                            defaultValue: '[[43.597, 1.45], [43.6, 1.45], [43.6, 1.449]]'
                        },
                        COLOR: {
                            type: ArgumentType.COLOR,
                            defaultValue: '#ff0000'
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'polyline1'
                        }
                    }
                },
                {
                    opcode: 'addPopup',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('add popup to element id'),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'place1'
                        }
                    }
                },
                {
                    opcode: 'addShownPopup',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('add shown popup to element id'),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'hello world'
                        },
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'place1'
                        }
                    }
                },
                {
                    opcode: 'bracketsAndComma',
                    blockType: BlockType.REPORTER,
                    // Here, we use "$[" and "$]" characters because "[" and "]"
                    // are used for arguments interpolation.
                    text: '$[[LATITUDE],[LONGITUDE]$]',
                    arguments: {
                        LATITUDE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 43.6
                        },
                        LONGITUDE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1.45
                        }
                    }
                },
                {
                    opcode: 'twoCommas',
                    blockType: BlockType.REPORTER,
                    text: '[A],[B]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 35
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 28
                        }
                    }
                },
                {
                    opcode: 'threeCommas',
                    blockType: BlockType.REPORTER,
                    text: '[A],[B],[C]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: 43.6
                        },
                        B: {
                            type: ArgumentType.STRING,
                            defaultValue: 1.45
                        },
                        C: {
                            type: ArgumentType.STRING,
                            defaultValue: 1.45
                        }
                    }
                },
                {
                    opcode: 'brackets',
                    blockType: BlockType.REPORTER,
                    // Here, we use "$[" and "$]" characters because "[" and "]"
                    // are used for arguments interpolation.
                    text: '$[[A]$]',
                    arguments: {
                        A: {
                            type: ArgumentType.STRING,
                            defaultValue: '35, 18, 42'
                        }
                    }
                },
                {
                    opcode: 'removeElement',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('remove element id'),
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: 'place1'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setControl',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('set map control'),
                    arguments: {
                        CONTROL: {
                            type: ArgumentType.MENU,
                            defaultValue: true,
                            menu: 'mapControl'
                        }
                    }
                },
                '---',
                {
                    opcode: 'goToXYZ',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('go to XYZ'),
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
                            type: ArgumentType.MENU,
                            defaultValue: 13,
                            menu: 'mapZoom'
                        },
                        ANIMATION: {
                            type: ArgumentType.MENU,
                            menu: 'animation'
                        }
                    }
                },
                {
                    opcode: 'currentLatitude',
                    blockType: BlockType.REPORTER,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('current latitude')
                },
                {
                    opcode: 'currentLongitude',
                    blockType: BlockType.REPORTER,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('current longitude')
                },
                '---',
                {
                    opcode: 'setZoom',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('set map zoom'),
                    arguments: {
                        ZOOM: {
                            type: ArgumentType.MENU,
                            defaultValue: 13,
                            menu: 'mapZoom'
                        }
                    }
                },
                {
                    opcode: 'getZoom',
                    blockType: BlockType.REPORTER,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('current zoom')
                },
                '---',
                {
                    opcode: 'getOSMlink',
                    blockType: BlockType.REPORTER,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('get OSM link')
                },
                '---',
                {
                    opcode: 'removeMap',
                    blockType: BlockType.COMMAND,
                    blockIconURI: blockIconURI,
                    text: this.getMessage('remove map')
                }
            ],
            menus: {
                animation: {
                    items: [
                        {
                            text: this.getMessage('with'),
                            value: 'true'
                        },
                        {
                            text: this.getMessage('without'),
                            value: 'false'
                        }
                    ]
                },
                mapControl: {
                    items: [
                        {
                            text: this.getMessage('enabled'),
                            value: 'true'
                        },
                        {
                            text: this.getMessage('disabled'),
                            value: 'false'
                        },
                        {
                            text: this.getMessage('map control zoom only'),
                            value: 'zoom'
                        },
                        {
                            text: this.getMessage('map control drag only'),
                            value: 'drag'
                        }
                    ]
                },
                mapZoom: {
                    items: [
                        {
                            text: '0 (min)',
                            value: 0
                        },
                        {
                            text: '1',
                            value: 1
                        },
                        {
                            text: '2',
                            value: 2
                        },
                        {
                            text: '3',
                            value: 3
                        },
                        {
                            text: '4',
                            value: 4
                        },
                        {
                            text: '5',
                            value: 5
                        },
                        {
                            text: '6',
                            value: 6
                        },
                        {
                            text: '7',
                            value: 7
                        },
                        {
                            text: '8',
                            value: 8
                        },
                        {
                            text: '9',
                            value: 9
                        },
                        {
                            text: '10',
                            value: 10
                        },
                        {
                            text: '11',
                            value: 11
                        },
                        {
                            text: '12',
                            value: 12
                        },
                        {
                            text: '13',
                            value: 13
                        },
                        {
                            text: '14',
                            value: 14
                        },
                        {
                            text: '15',
                            value: 15
                        },
                        {
                            text: '16',
                            value: 16
                        },
                        {
                            text: '17',
                            value: 17
                        },
                        {
                            text: '18',
                            value: 18
                        },
                        {
                            text: '19 (max)',
                            value: 19
                        }
                    ],
                    acceptReporters: true
                },
                mapStyles: {
                    items: [
                        {
                            text: '(1) Open Street Map',
                            value: '1'
                        },
                        {
                            text: '(2) Open Topo Map',
                            value: '2'
                        },
                        {
                            text: '(3) Memo maps',
                            value: '3'
                        },
                        {
                            text: '(4) World Imagery',
                            value: '4'
                        },
                        {
                            text: '(5) NASA Earth at night',
                            value: '5'
                        },
                        {
                            text: '(6) CyclOSM',
                            value: '6'
                        },
                        {
                            text: '(7) Jawg Matrix',
                            value: '7'
                        },
                        {
                            text: '(8) Jawg Light',
                            value: '8'
                        },
                        {
                            text: '(9) Jawg Dark',
                            value: '9'
                        },
                        {
                            text: '(10) Jawg Terrain',
                            value: '10'
                        },
                        {
                            text: '(11) Esri Oceans',
                            value: '11'
                        },
                        {
                            text: '(12) Esri Old style',
                            value: '12'
                        },
                        {
                            text: '(13) Esri Countries',
                            value: '13'
                        },
                        {
                            text: '(14) Google Street',
                            value: '14'
                        },
                        {
                            text: '(15) Google Hybrid',
                            value: '15'
                        },
                        {
                            text: '(16) Google Satellite',
                            value: '16'
                        },
                        {
                            text: '(17) Google Terrain',
                            value: '17'
                        }
                    ],
                    acceptReporters: true
                }
            }
        };
    }

    initOsmMap (args, util, blockInfo) {
        if (!this.map._loaded) {
            mapDiv = document.getElementById('leaflet-map');
            try {
                this.map = L.map('leaflet-map', {
                    center: [Number(args.LATITUDE), Number(args.LONGITUDE)],
                    zoom: args.ZOOM
                });
                this.map.addLayer(maps[0]);
                setInterval(() => {
                    if (this.map._loaded) {
                        this.map.invalidateSize();
                    }
                }, 100);
                mapDiv.style.display = 'block';
            } catch (error) {
                this.error(`unknown leaflet error (Error: ${error})`, util, blockInfo);
                return;
            }
        }
    }

    initOsmMapDivId (args, util, blockInfo) {
        if (!this.map._loaded) {
            if (document.getElementById('dom-render-root').contains(document.getElementById(args.ID))) {
                mapDiv = document.getElementById(args.ID);
            }
            try {
                this.map = L.map(args.ID, {
                    center: [Number(args.LATITUDE), Number(args.LONGITUDE)],
                    zoom: args.ZOOM
                });
                this.map.addLayer(maps[0]);
                setInterval(() => {
                    if (this.map._loaded) {
                        this.map.invalidateSize();
                    }
                }, 100);
                mapDiv.style.display = 'block';
            } catch (error) {
                this.error(`unknown leaflet error (Error: ${error})`, util, blockInfo);
                return;
            }
        }
    }

    goToXYZ (args) {
        if (this.map._loaded) {
            if (args.ANIMATION === 'true') {
                this.map.flyTo([args.LATITUDE, args.LONGITUDE], args.ZOOM);
            } else {
                this.map.setView([args.LATITUDE, args.LONGITUDE], args.ZOOM);
            }
        }
    }

    addMarker (args, util, blockInfo) {
        if (this.map._loaded) {
            try {
                L.marker(
                    [Number(args.LATITUDE), Number(args.LONGITUDE)]
                ).addTo(this.map);
            } catch (error) {
                this.error(`unknown leaflet error (Error: ${error})`, util, blockInfo);
                return;
            }
        }
    }

    addMarkerId (args, util, blockInfo) {
        if (this.map._loaded) {
            try {
                markers[args.ID] = L.marker(
                    [Number(args.LATITUDE), Number(args.LONGITUDE)]
                ).addTo(this.map);
            } catch (error) {
                this.error(`unknown leaflet error (Error: ${error})`, util, blockInfo);
                return;
            }
        }
    }

    addCircleId (args, util, blockInfo) {
        if (this.map._loaded) {
            try {
                markers[args.ID] = L.circle([args.LATITUDE, args.LONGITUDE], {
                    color: args.COLOR,
                    fillColor: args.COLOR,
                    fillOpacity: 0.5,
                    radius: args.RADIUS
                }).addTo(this.map);
            } catch (error) {
                this.error(`unknown leaflet error (Error: ${error})`, util, blockInfo);
                return;
            }
        }
    }

    addPolyWithId (args, util, blockInfo, polyType) {
        if (this.map._loaded) {
            let coordinates;
            try {
                // The following 2 conventions are ok:
                //   [[43.6, 1.45], [43.603, 1.45], [43.6, 1.451]]
                // and
                //   [43.6, 1.45], [43.603, 1.45], [43.6, 1.451]
                // I.e, with or without the external "[...]". With, it's a valid
                // JSON. Without it's not, but it's easier for the user (more
                // readable and more easy to create).
                try {
                    coordinates = JSON.parse(`${args.COORDINATES}`);
                } catch (error) {
                    coordinates = JSON.parse(`[${args.COORDINATES}]`);
                }
            } catch (error) {
                // eslint-disable-next-line max-len
                const message = `argument COORDINATES is not a valid JSON ("${args.COORDINATES}"), must be in the form "[1,2], [3,4], ..."`;
                this.error(message, util, blockInfo);
                return;
            }
            if (!validateCoordinates(coordinates)) {
                // eslint-disable-next-line max-len
                const message = `argument COORDINATES has not a valid shape ("${args.COORDINATES}"), must be in the form "[1,2], [3,4], ..."`;
                this.error(message, util, blockInfo);
                return;
            }
            try {
                if (polyType === 'polygon') {
                    markers[args.ID] = L.polygon(coordinates, {
                        color: args.COLOR,
                        fillColor: args.COLOR,
                        fillOpacity: 0.5
                    }).addTo(this.map);
                } else if (polyType === 'polyline') {
                    markers[args.ID] = L.polyline(coordinates, {
                        color: args.COLOR,
                        fillColor: args.COLOR,
                        fillOpacity: 0.5
                    }).addTo(this.map);
                }
            } catch (error) {
                // eslint-disable-next-line max-len
                const message = `unknown leaflet error during ${polyType} creation (Error: ${error})`;
                this.error(message, util, blockInfo);
                return;
            }
        }
    }

    addPolygoneId (args, util, blockInfo) {
        this.addPolyWithId(args, util, blockInfo, 'polygon');
    }

    addPolylineId (args, util, blockInfo) {
        this.addPolyWithId(args, util, blockInfo, 'polyline');
    }

    bracketsAndComma (args) {
        return `[${args.LATITUDE},${args.LONGITUDE}]`;
    }

    twoCommas (args) {
        return `${args.A},${args.B}`;
    }

    threeCommas (args) {
        return `${args.A},${args.B},${args.C}`;
    }

    brackets (args) {
        return `[${args.A}]`;
    }


    removeElement (args) {
        if (this.map._loaded) {
            if (markers[args.ID]) {
                markers[args.ID].removeFrom(this.map);
                delete markers[args.ID];
            }
        }
    }

    addPopup (args) {
        if (this.map._loaded) {
            if (markers[args.ID]) {
                const text = DOMPurify.sanitize(args.TEXT);
                markers[args.ID]
                    .bindPopup(text)
                    .on('popupopen', () => {
                        markers[args.ID]._popup._closeButton.removeAttribute('href');
                    });
            }
        }
    }


    addShownPopup (args) {
        if (this.map._loaded) {
            if (markers[args.ID]) {
                const text = DOMPurify.sanitize(args.TEXT);
                markers[args.ID]
                    .bindPopup(text)
                    .openPopup()
                    .on('popupopen', () => {
                        markers[args.ID]._popup._closeButton.removeAttribute('href');
                    });
                markers[args.ID]._popup._closeButton.removeAttribute('href');
            }
        }
    }

    setMapStyle (args) {
        if (this.map._loaded) {
            this.map.removeLayer(currentLayer);
            const styleNumber = Math.floor(args.STYLE - 1);
            if (!isNaN(styleNumber)) {
                currentLayer = maps[styleNumber];
            }
            this.map.addLayer(currentLayer);
            if (maps[styleNumber].options.maxZoom < this.map.getZoom()) {
                this.map.setZoom(maps[styleNumber].options.maxZoom);
            }
            if (maps[styleNumber].options.minZoom > this.map.getZoom()) {
                this.map.setZoom(maps[styleNumber].options.minZoom);
            }
            this.map.setMaxZoom(maps[styleNumber].options.maxZoom);
            this.map.setMinZoom(maps[styleNumber].options.minZoom);
        }
    }

    hideMap () {
        if (this.map._loaded) {
            mapDiv.style.display = 'none';
        }
    }

    displayMap () {
        if (this.map._loaded) {
            mapDiv.style.display = 'block';
        }
    }

    currentLatitude () {
        if (this.map._loaded) {
            return this.map.getCenter().lat;
        } else {
            return 0;
        }
    }

    currentLongitude () {
        if (this.map._loaded) {
            return this.map.getCenter().lng;
        } else {
            return 0;
        }
    }

    setControl (args) {
        if (this.map._loaded) {
            if (args.CONTROL === 'zoom') {
                this.map.dragging.disable();
                this.map.touchZoom.enable();
                this.map.doubleClickZoom.enable();
                this.map.scrollWheelZoom.enable();
                this.map.boxZoom.enable();
                this.map.keyboard.enable();
                mapDiv.style.pointerEvents = 'auto';
                document.getElementsByClassName('leaflet-control-zoom')[0].style.visibility = 'visible';
            } else if (args.CONTROL === 'false') {
                this.map.touchZoom.disable();
                this.map.doubleClickZoom.disable();
                this.map.scrollWheelZoom.disable();
                this.map.boxZoom.disable();
                this.map.keyboard.disable();
                this.map.dragging.disable();
                mapDiv.style.pointerEvents = 'none';
                document.getElementsByClassName('leaflet-control-zoom')[0].style.visibility = 'hidden';
            } else if (args.CONTROL === 'true') {
                this.map.touchZoom.enable();
                this.map.doubleClickZoom.enable();
                this.map.scrollWheelZoom.enable();
                this.map.boxZoom.enable();
                this.map.keyboard.enable();
                this.map.dragging.enable();
                mapDiv.style.pointerEvents = 'auto';
                document.getElementsByClassName('leaflet-control-zoom')[0].style.visibility = 'visible';
            } else if (args.CONTROL === 'drag') {
                this.map.touchZoom.disable();
                this.map.doubleClickZoom.disable();
                this.map.scrollWheelZoom.disable();
                this.map.boxZoom.disable();
                this.map.keyboard.disable();
                this.map.dragging.enable();
                mapDiv.style.pointerEvents = 'auto';
                document.getElementsByClassName('leaflet-control-zoom')[0].style.visibility = 'hidden';
            }
        }
    }

    setZoom (args) {
        if (this.map._loaded) {
            this.map.setZoom(args.ZOOM);
        }
    }

    getZoom () {
        if (this.map._loaded) {
            return this.map.getZoom();
        } else {
            return '-1';
        }
    }

    getOSMlink () {
        if (this.map._loaded) {
            return `https://www.openstreetmap.org/#map=${this.map.getZoom()}/${this.map.getCenter().lat}/${this.map.getCenter().lng}`;
        } else {
            return '';
        }
    }


    removeMap () {
        if (this.map._loaded) {
            this.map.remove();
            this.map = {};
            mapDiv.setAttribute('class', '');
            mapDiv.style.display = 'none';
        }
    }

    setLocale () {
        const locale = formatMessage.setup().locale;
        if (localisation.availableLocales.includes(locale)) {
            return locale;
        } else {
            return 'en';
        }
    }

    getMessage (id) {
        return localisation.messages[id][this._locale];
    }

    map = {};
    markers = {}

    error (message, util, blockInfo) {
        const extensionDescription = `"${this.getInfo().name}" (id: ${this.getInfo().id})`;
        // eslint-disable-next-line max-len
        const blockDescription = `"${blockInfo.text}" (opcode: ${blockInfo.opcode}, blockId: "${util.thread.peekStack()}")`;
        // eslint-disable-next-line no-console
        console.error(`Error in extension ${extensionDescription}, for block ${blockDescription}: ${message}`);
    }
}

// The following fixes the unexpected display of leaflet controls when openning
// libraries pages (extensions, sprite...).
mapDiv.style.zIndex = 50;

module.exports = AdacraftLeafletBlocks;
