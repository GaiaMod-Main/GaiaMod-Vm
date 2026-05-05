/*

    NumberBank 2.0
    20231221 - ver2.0(2010)
    Scratch3.0 Extension

    Web:
    https://con3.com/numberbank/

*/


const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const formatMessage = require('format-message');
const {Crypto} = require('@peculiar/webcrypto');
const crypto = new Crypto();

const Variable = require('../../engine/variable');

const {initializeApp, getApps, deleteApp} = require('firebase/app');
const firestore = require('firebase/firestore');
const {initializeFirestore, doc, getDoc, setDoc, onSnapshot} = require('firebase/firestore');


const encoder = new TextEncoder();
const decoderUtf8 = new TextDecoder('utf-8');

const numberbankVersion = 'NumberBank 2.0(2010)';


/**
* Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
* @type {string}
*/
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgIHhtbDpzcGFjZT0icHJlc2VydmUiIGlkPSJudW1iZXJiYW5rX2luc2V0Ij4KICAgIDwhLS0gR2VuZXJhdGVkIGJ5IFBhaW50Q29kZSAtIGh0dHA6Ly93d3cucGFpbnRjb2RlYXBwLmNvbSAtLT4KICAgIDxnIGlkPSJudW1iZXJiYW5rX2luc2V0LWdyb3VwIj4KICAgICAgICA8ZWxsaXBzZSBpZD0ibnVtYmVyYmFua19pbnNldC1vdmFsIiBzdHJva2U9Im5vbmUiIGZpbGw9InJnYigxMjgsIDEyOCwgMTI4KSIgY3g9IjIxLjUiIGN5PSI3MiIgcng9IjE1LjUiIHJ5PSIxNiIgLz4KICAgICAgICA8ZWxsaXBzZSBpZD0ibnVtYmVyYmFua19pbnNldC1vdmFsMiIgc3Ryb2tlPSJub25lIiBmaWxsPSJyZ2IoMTI4LCAxMjgsIDEyOCkiIGN4PSI0Ny4yNSIgY3k9IjYxLjUiIHJ4PSIyNi43NSIgcnk9IjI2LjUiIC8+CiAgICAgICAgPGVsbGlwc2UgaWQ9Im51bWJlcmJhbmtfaW5zZXQtb3ZhbDMiIHN0cm9rZT0ibm9uZSIgZmlsbD0icmdiKDEyOCwgMTI4LCAxMjgpIiBjeD0iNzYuMjUiIGN5PSI2MS41IiByeD0iMjEuNzUiIHJ5PSIyMS41IiAvPgogICAgPC9nPgogICAgPHBhdGggaWQ9Im51bWJlcmJhbmtfaW5zZXQtdGV4dCIgc3Ryb2tlPSJyZ2IoMjU1LCAyNTUsIDI1NSkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBmaWxsPSJyZ2IoMCwgMCwgMCkiIGQ9Ik0gNDAuMjcsMTcuNyBMIDUzLjQ4LDQ5LjggNTMuNDgsMjcuNiBDIDUzLjQ4LDI0LjI1IDUyLjgzLDIyLjU4IDUxLjUyLDIyLjU4IDUxLjE3LDIyLjU4IDUwLjY2LDIyLjY2IDQ5Ljk5LDIyLjg0IDQ5LjMxLDIzLjAxIDQ4LjgsMjMuMSA0OC40NSwyMy4xIDQ3LjQsMjMuMSA0Ni41MSwyMi42MyA0NS43OSwyMS42OCA0NS4wNiwyMC43MiA0NC43LDE5LjU1IDQ0LjcsMTguMTUgNDQuNywxNi41IDQ1LjE3LDE1LjE4IDQ2LjEyLDE0LjE4IDQ3LjA4LDEzLjE3IDQ4LjMyLDEyLjY4IDQ5Ljg4LDEyLjY4IDUwLjY4LDEyLjY4IDUyLjA1LDEyLjggNTQsMTMuMDUgNTUuOTUsMTMuMyA1Ny42NywxMy40MyA1OS4xNywxMy40MyA2MC41MywxMy40MyA2Mi4xLDEzLjMzIDYzLjksMTMuMTIgNjYuNiwxMi44MiA2OC4yNywxMi42OCA2OC45MiwxMi42OCA3MC41MywxMi42OCA3MS44MiwxMy4xNyA3Mi44MiwxNC4xOCA3My44MywxNS4xOCA3NC4zMywxNi41IDc0LjMzLDE4LjE1IDc0LjMzLDE5LjU1IDczLjkzLDIwLjcyIDczLjEyLDIxLjY4IDcyLjMyLDIyLjYzIDcxLjM1LDIzLjEgNzAuMiwyMy4xIDY5Ljc1LDIzLjEgNjkuMTUsMjMuMDEgNjguNCwyMi44NCA2Ny42NSwyMi42NiA2Ny4wOCwyMi41OCA2Ni42NywyMi41OCA2NS42NywyMi41OCA2NS4wMywyMy4yIDY0LjcyLDI0LjQ1IDY0LjYyLDI0Ljk1IDY0LjU4LDI2IDY0LjU3LDI3LjYgTCA2NC41Nyw1OC4xMiBDIDY0LjU4LDYxLjQzIDYzLjIzLDYzLjA3IDYwLjUyLDYzLjA3IDYwLjAyLDYzLjA3IDU5LjI2LDYzLjA0IDU4LjI0LDYyLjk2IDU3LjIxLDYyLjg5IDU2LjQ1LDYyLjg1IDU1Ljk1LDYyLjg1IDU1LjksNjIuODUgNTQuNjgsNjIuOSA1Mi4yNyw2MyA1Mi4yNyw2MyA1MS43Myw2MyA1MC42Miw2MyA0OS4xNyw2MyA0OC4xLDYyLjY1IDQ3LjQsNjEuOTUgNDcsNjEuNTUgNDYuNDMsNjAuNDggNDUuNjcsNTguNzIgTCAzMS4yLDI1LjcyIDMxLjIsNDguMzggQyAzMS4yLDUxLjc4IDMxLjg1LDUzLjQ3IDMzLjE1LDUzLjQ3IDMzLjUsNTMuNDcgMzQuMDQsNTMuMzkgMzQuNzYsNTMuMjEgMzUuNDksNTMuMDQgMzYuMDIsNTIuOTUgMzYuMzgsNTIuOTUgMzcuNDMsNTIuOTUgMzguMzEsNTMuNDIgMzkuMDQsNTQuMzggMzkuNzYsNTUuMzMgNDAuMTIsNTYuNSA0MC4xMiw1Ny45IDQwLjEyLDYxLjU1IDM4LjM4LDYzLjM4IDM0Ljg4LDYzLjM4IDMzLjg3LDYzLjM4IDMyLjIzLDYzLjIzIDI5LjkzLDYyLjkzIDI4LjM3LDYyLjcyIDI2LjgzLDYyLjYyIDI1LjI3LDYyLjYyIDIzLjk3LDYyLjYyIDIyLjIzLDYyLjc1IDIwLjAyLDYzIDE3LjgyLDYzLjI1IDE2LjQzLDYzLjM4IDE1LjgyLDYzLjM4IDEyLjE3LDYzLjM4IDEwLjM1LDYxLjU1IDEwLjM1LDU3LjkgMTAuMzUsNTYuNSAxMC43NCw1NS4zMyAxMS41MSw1NC4zOCAxMi4yOSw1My40MiAxMy4yNSw1Mi45NSAxNC40LDUyLjk1IDE0Ljg1LDUyLjk1IDE1LjQ2LDUzLjA0IDE2LjI0LDUzLjIxIDE3LjAxLDUzLjM5IDE3LjYsNTMuNDcgMTgsNTMuNDcgMTkuMzUsNTMuNDcgMjAuMDIsNTEuNzggMjAuMDIsNDguMzggTCAyMC4wMiwyNy42IEMgMjAuMDIsMjQuMjUgMTkuMzUsMjIuNTggMTgsMjIuNTggMTcuNiwyMi41OCAxNy4wMSwyMi42NiAxNi4yNCwyMi44NCAxNS40NiwyMy4wMSAxNC44NSwyMy4xIDE0LjQsMjMuMSAxMy4yNSwyMy4xIDEyLjI5LDIyLjYzIDExLjUxLDIxLjY4IDEwLjc0LDIwLjcyIDEwLjM1LDE5LjU1IDEwLjM1LDE4LjE1IDEwLjM1LDE2LjUgMTAuODUsMTUuMTggMTEuODUsMTQuMTggMTIuODUsMTMuMTcgMTQuMTUsMTIuNjggMTUuNzUsMTIuNjggMTYuOCwxMi42OCAxOC4zMiwxMi44IDIwLjMyLDEzLjA1IDIyLjMzLDEzLjMgMjMuOSwxMy40MyAyNS4wNSwxMy40MyAyNiwxMy40MyAyNy42MiwxMy4zMyAyOS45MywxMy4xMiAzMC45OCwxMy4wNyAzMi4xNywxMi45OCAzMy41MiwxMi44MyAzNC4xMywxMi43MiAzNC43NywxMi42OCAzNS40NywxMi42OCAzNi44MywxMi42OCAzNy44NywxMy4yIDM4LjYyLDE0LjI1IDM4LjkzLDE0LjY1IDM5LjQ3LDE1LjggNDAuMjcsMTcuNyBaIE0gNDAuMjcsMTcuNyIgLz4KPC9zdmc+Cg==';

/**
* Icon svg to be displayed in the category menu, encoded as a data URI.
* @type {string}
*/
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgIHhtbDpzcGFjZT0icHJlc2VydmUiIGlkPSJudW1iZXJiYW5rX2luc2V0Ij4KICAgIDwhLS0gR2VuZXJhdGVkIGJ5IFBhaW50Q29kZSAtIGh0dHA6Ly93d3cucGFpbnRjb2RlYXBwLmNvbSAtLT4KICAgIDxnIGlkPSJudW1iZXJiYW5rX2luc2V0LWdyb3VwIj4KICAgICAgICA8ZWxsaXBzZSBpZD0ibnVtYmVyYmFua19pbnNldC1vdmFsIiBzdHJva2U9Im5vbmUiIGZpbGw9InJnYigxMjgsIDEyOCwgMTI4KSIgY3g9IjIxLjUiIGN5PSI3MiIgcng9IjE1LjUiIHJ5PSIxNiIgLz4KICAgICAgICA8ZWxsaXBzZSBpZD0ibnVtYmVyYmFua19pbnNldC1vdmFsMiIgc3Ryb2tlPSJub25lIiBmaWxsPSJyZ2IoMTI4LCAxMjgsIDEyOCkiIGN4PSI0Ny4yNSIgY3k9IjYxLjUiIHJ4PSIyNi43NSIgcnk9IjI2LjUiIC8+CiAgICAgICAgPGVsbGlwc2UgaWQ9Im51bWJlcmJhbmtfaW5zZXQtb3ZhbDMiIHN0cm9rZT0ibm9uZSIgZmlsbD0icmdiKDEyOCwgMTI4LCAxMjgpIiBjeD0iNzYuMjUiIGN5PSI2MS41IiByeD0iMjEuNzUiIHJ5PSIyMS41IiAvPgogICAgPC9nPgogICAgPHBhdGggaWQ9Im51bWJlcmJhbmtfaW5zZXQtdGV4dCIgc3Ryb2tlPSJyZ2IoMjU1LCAyNTUsIDI1NSkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBmaWxsPSJyZ2IoMCwgMCwgMCkiIGQ9Ik0gNDAuMjcsMTcuNyBMIDUzLjQ4LDQ5LjggNTMuNDgsMjcuNiBDIDUzLjQ4LDI0LjI1IDUyLjgzLDIyLjU4IDUxLjUyLDIyLjU4IDUxLjE3LDIyLjU4IDUwLjY2LDIyLjY2IDQ5Ljk5LDIyLjg0IDQ5LjMxLDIzLjAxIDQ4LjgsMjMuMSA0OC40NSwyMy4xIDQ3LjQsMjMuMSA0Ni41MSwyMi42MyA0NS43OSwyMS42OCA0NS4wNiwyMC43MiA0NC43LDE5LjU1IDQ0LjcsMTguMTUgNDQuNywxNi41IDQ1LjE3LDE1LjE4IDQ2LjEyLDE0LjE4IDQ3LjA4LDEzLjE3IDQ4LjMyLDEyLjY4IDQ5Ljg4LDEyLjY4IDUwLjY4LDEyLjY4IDUyLjA1LDEyLjggNTQsMTMuMDUgNTUuOTUsMTMuMyA1Ny42NywxMy40MyA1OS4xNywxMy40MyA2MC41MywxMy40MyA2Mi4xLDEzLjMzIDYzLjksMTMuMTIgNjYuNiwxMi44MiA2OC4yNywxMi42OCA2OC45MiwxMi42OCA3MC41MywxMi42OCA3MS44MiwxMy4xNyA3Mi44MiwxNC4xOCA3My44MywxNS4xOCA3NC4zMywxNi41IDc0LjMzLDE4LjE1IDc0LjMzLDE5LjU1IDczLjkzLDIwLjcyIDczLjEyLDIxLjY4IDcyLjMyLDIyLjYzIDcxLjM1LDIzLjEgNzAuMiwyMy4xIDY5Ljc1LDIzLjEgNjkuMTUsMjMuMDEgNjguNCwyMi44NCA2Ny42NSwyMi42NiA2Ny4wOCwyMi41OCA2Ni42NywyMi41OCA2NS42NywyMi41OCA2NS4wMywyMy4yIDY0LjcyLDI0LjQ1IDY0LjYyLDI0Ljk1IDY0LjU4LDI2IDY0LjU3LDI3LjYgTCA2NC41Nyw1OC4xMiBDIDY0LjU4LDYxLjQzIDYzLjIzLDYzLjA3IDYwLjUyLDYzLjA3IDYwLjAyLDYzLjA3IDU5LjI2LDYzLjA0IDU4LjI0LDYyLjk2IDU3LjIxLDYyLjg5IDU2LjQ1LDYyLjg1IDU1Ljk1LDYyLjg1IDU1LjksNjIuODUgNTQuNjgsNjIuOSA1Mi4yNyw2MyA1Mi4yNyw2MyA1MS43Myw2MyA1MC42Miw2MyA0OS4xNyw2MyA0OC4xLDYyLjY1IDQ3LjQsNjEuOTUgNDcsNjEuNTUgNDYuNDMsNjAuNDggNDUuNjcsNTguNzIgTCAzMS4yLDI1LjcyIDMxLjIsNDguMzggQyAzMS4yLDUxLjc4IDMxLjg1LDUzLjQ3IDMzLjE1LDUzLjQ3IDMzLjUsNTMuNDcgMzQuMDQsNTMuMzkgMzQuNzYsNTMuMjEgMzUuNDksNTMuMDQgMzYuMDIsNTIuOTUgMzYuMzgsNTIuOTUgMzcuNDMsNTIuOTUgMzguMzEsNTMuNDIgMzkuMDQsNTQuMzggMzkuNzYsNTUuMzMgNDAuMTIsNTYuNSA0MC4xMiw1Ny45IDQwLjEyLDYxLjU1IDM4LjM4LDYzLjM4IDM0Ljg4LDYzLjM4IDMzLjg3LDYzLjM4IDMyLjIzLDYzLjIzIDI5LjkzLDYyLjkzIDI4LjM3LDYyLjcyIDI2LjgzLDYyLjYyIDI1LjI3LDYyLjYyIDIzLjk3LDYyLjYyIDIyLjIzLDYyLjc1IDIwLjAyLDYzIDE3LjgyLDYzLjI1IDE2LjQzLDYzLjM4IDE1LjgyLDYzLjM4IDEyLjE3LDYzLjM4IDEwLjM1LDYxLjU1IDEwLjM1LDU3LjkgMTAuMzUsNTYuNSAxMC43NCw1NS4zMyAxMS41MSw1NC4zOCAxMi4yOSw1My40MiAxMy4yNSw1Mi45NSAxNC40LDUyLjk1IDE0Ljg1LDUyLjk1IDE1LjQ2LDUzLjA0IDE2LjI0LDUzLjIxIDE3LjAxLDUzLjM5IDE3LjYsNTMuNDcgMTgsNTMuNDcgMTkuMzUsNTMuNDcgMjAuMDIsNTEuNzggMjAuMDIsNDguMzggTCAyMC4wMiwyNy42IEMgMjAuMDIsMjQuMjUgMTkuMzUsMjIuNTggMTgsMjIuNTggMTcuNiwyMi41OCAxNy4wMSwyMi42NiAxNi4yNCwyMi44NCAxNS40NiwyMy4wMSAxNC44NSwyMy4xIDE0LjQsMjMuMSAxMy4yNSwyMy4xIDEyLjI5LDIyLjYzIDExLjUxLDIxLjY4IDEwLjc0LDIwLjcyIDEwLjM1LDE5LjU1IDEwLjM1LDE4LjE1IDEwLjM1LDE2LjUgMTAuODUsMTUuMTggMTEuODUsMTQuMTggMTIuODUsMTMuMTcgMTQuMTUsMTIuNjggMTUuNzUsMTIuNjggMTYuOCwxMi42OCAxOC4zMiwxMi44IDIwLjMyLDEzLjA1IDIyLjMzLDEzLjMgMjMuOSwxMy40MyAyNS4wNSwxMy40MyAyNiwxMy40MyAyNy42MiwxMy4zMyAyOS45MywxMy4xMiAzMC45OCwxMy4wNyAzMi4xNywxMi45OCAzMy41MiwxMi44MyAzNC4xMywxMi43MiAzNC43NywxMi42OCAzNS40NywxMi42OCAzNi44MywxMi42OCAzNy44NywxMy4yIDM4LjYyLDE0LjI1IDM4LjkzLDE0LjY1IDM5LjQ3LDE1LjggNDAuMjcsMTcuNyBaIE0gNDAuMjcsMTcuNyIgLz4KPC9zdmc+Cg==';


const EXTENSION_ID = 'numberbank';


/**
 * Scratch 3.0 blocks
 */
class Scratch3NumberbankBlocks {


    /**
    * @return {string} - the name of this extension.
    */
    static get EXTENSION_NAME() {
        return formatMessage({
            id: 'numberbank.name',
            default: 'NumberBank',
            description: 'name of the extension'
        }).toString();
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL() {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL(url) {
        extensionURL = url;
    }


    /**
     * Construct a set of blocks for NumberBank1.0.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this.firstInstall = true;

        //updated
        this.whenUpdatedCallCountMap = new Map();
        this.LisningBankCard_flag = false;
        //onSnapshot
        this.unsubscribe = () => {};

        console.log(numberbankVersion);

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
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


    putNum(args) {
        return new Promise((resolve, reject) => {
            if (masterSha256 == '') { resolve(); }
            if (args.BANK == '' || args.CARD == '' || args.VAL == '') { resolve(); }

            bankKey = new String(args.BANK);
            bankName = args.BANK;
            cardKey = new String(args.CARD);

            uniKey = bankKey.trim().concat(cardKey.trim());

            if (args.VAL != '' && args.VAL != undefined) {
                settingNum = args.VAL;
            }

            if (!crypto || !crypto.subtle) {
                reject("crypto.subtle is not supported.");
            }

            if (bankKey != '' && bankKey != undefined) {
                crypto.subtle.digest('SHA-256', encoder.encode(bankKey))
                    .then(bankStr => {
                        bankSha256 = hexString(bankStr);

                        return crypto.subtle.digest('SHA-256', encoder.encode(cardKey));
                    })
                    .then(cardStr => {
                        cardSha256 = hexString(cardStr);

                        return crypto.subtle.digest('SHA-256', encoder.encode(uniKey));
                    })
                    .then(uniStr => {
                        uniSha256 = hexString(uniStr);

                        return sleep(1);
                    })
                    .then(() => {
                        if (masterSha256 != '' && masterSha256 != undefined) {
                            const now = Date.now();
                            const cardDocRef = doc(db, 'card', uniSha256);
                            const bankDocRef = doc(db, 'bank', bankSha256);

                            enqueueApiCall(() => setDoc(cardDocRef, {
                                number: settingNum,
                                bank_key: bankSha256,
                                card_key: cardSha256,
                                master_key: masterSha256,
                                time_stamp: now
                            })
                                .then(() => setDoc(bankDocRef, {
                                    bank_name: bankName,
                                    time_stamp: now}))
                                .catch(error => {
                                    console.error("Error writing document: ", error);
                                    reject();
                                }));
                            
                            resolve();

                        } else {
                            console.log("No MasterKey!");
                            resolve();  // MasterKeyがない場合
                        }
                    })
                    .catch(error => {
                        console.error("Error: ", error);
                        reject(error);
                    });
            } else {
                resolve();
            }
        }).then(() => new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, interval.MsPut);
        }));
        
    }


    setNum(args, util) {
        return new Promise((resolve, reject) => {
            if (masterSha256 == '') { resolve(); }
            if (args.BANK == '' || args.CARD == '') { resolve(); }

            const variable = util.target.lookupOrCreateVariable(null, args.VAR);

            bankKey = new String(args.BANK);
            bankName = args.BANK;
            cardKey = new String(args.CARD);

            uniKey = bankKey.trim().concat(cardKey.trim());

            if (!crypto || !crypto.subtle) {
                reject("crypto.subtle is not supported.");
            }

            if (bankKey != '' && bankKey != undefined) {
                crypto.subtle.digest('SHA-256', encoder.encode(bankKey))
                    .then(bankStr => {
                        bankSha256 = hexString(bankStr);

                        return crypto.subtle.digest('SHA-256', encoder.encode(cardKey));
                    })
                    .then(cardStr => {
                        cardSha256 = hexString(cardStr);

                        return crypto.subtle.digest('SHA-256', encoder.encode(uniKey));
                    })
                    .then(uniStr => {
                        uniSha256 = hexString(uniStr);

                        return sleep(1);
                    })
                    .then(() => {
                        if (masterSha256 != '' && masterSha256 != undefined) {
                            enqueueApiCall(() => getDoc(doc(db, 'card', uniSha256))
                                .then(docSnapshot => {
                                    if (docSnapshot.exists()) {
                                        let data = docSnapshot.data();
                                        variable.value = data.number;
                                        resolve();
                                    } else {
                                        variable.value = '';
                                        resolve();
                                    }
                                })
                                .catch(error => {
                                    console.error("Error getting document: ", error);
                                    reject();
                                }));
                            
                            resolve();

                        } else {
                            console.log("No MasterKey!");
                            resolve();  // MasterKeyがない場合
                        }
                    }).catch(error => {
                        console.error("Error: ", error);
                        reject(error);
                    });
            } else {
                resolve();
            }
        }).then(() => new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, interval.MsSet);
        }));

    }


    getNum(args) {
        return new Promise((resolve, reject) => {
            if (masterSha256 == '') { resolve(''); }
            if (args.BANK == '' || args.CARD == '') { resolve(''); }

            cloudNum = '';

            bankKey = new String(args.BANK);
            bankName = args.BANK;
            cardKey = new String(args.CARD);

            uniKey = bankKey.trim().concat(cardKey.trim());

            if (!crypto || !crypto.subtle) {
                reject("crypto.subtle is not supported.");
            }

            if (bankKey != '' && bankKey != undefined) {
                crypto.subtle.digest('SHA-256', encoder.encode(bankKey))
                    .then(bankStr => {
                        bankSha256 = hexString(bankStr);

                        return crypto.subtle.digest('SHA-256', encoder.encode(cardKey));
                    })
                    .then(cardStr => {
                        cardSha256 = hexString(cardStr);

                        return crypto.subtle.digest('SHA-256', encoder.encode(uniKey));
                    })
                    .then(uniStr => {
                        uniSha256 = hexString(uniStr);

                        return sleep(1);
                    })
                    .then(() => {
                        if (masterSha256 != '' && masterSha256 != undefined) {
                            enqueueApiCall(() => getDoc(doc(db, 'card', uniSha256))
                                .then(docSnapshot => {
                                    if (docSnapshot.exists()) {
                                        let data = docSnapshot.data();
                                        cloudNum = data.number;
                                        resolve(cloudNum);
                                    } else {
                                        cloudNum = '';
                                        resolve(cloudNum);
                                    }
                                })
                                .catch(error => {
                                    console.error("Error getting document: ", error);
                                    reject(error);
                                }));

                        } else {
                            console.log("No MasterKey!");
                            resolve('');  // MasterKeyがない場合
                        }
                    }).catch(error => {
                        console.error("Error: ", error);
                        reject(error);
                    });
            } else {
                resolve('');
            }
        }).then(ret => new Promise(resolve => {
            setTimeout(() => {
                resolve(ret);
            }, interval.MsGet);
        }));
    }


    repNum(args, util) {
        return cloudNum;
    }


    repCloudNum(args) {
        return new Promise((resolve, reject) => {
            if (masterSha256 == '') { resolve(''); }
            if (args.BANK == '' || args.CARD == '') { resolve(''); }
    
            let rep_cloudNum = '';
    
            bankKey = new String(args.BANK);
            bankName = args.BANK;
            cardKey = new String(args.CARD);
    
            uniKey = bankKey.trim().concat(cardKey.trim());
    
            if (!crypto || !crypto.subtle) {
                reject("crypto.subtle is not supported.");
            }
    
            if (bankKey != '' && bankKey != undefined) {
                crypto.subtle.digest('SHA-256', encoder.encode(bankKey))
                    .then(bankStr => {
                        bankSha256 = hexString(bankStr);
    
                        return crypto.subtle.digest('SHA-256', encoder.encode(cardKey));
                    })
                    .then(cardStr => {
                        cardSha256 = hexString(cardStr);
    
                        return crypto.subtle.digest('SHA-256', encoder.encode(uniKey));
                    })
                    .then(uniStr => {
                        uniSha256 = hexString(uniStr);
    
                        return sleep(1);
                    })
                    .then(() => {
                        if (masterSha256 != '' && masterSha256 != undefined) {
                            enqueueApiCall(() => getDoc(doc(db, 'card', uniSha256))
                                .then(docSnapshot => {
                                    if (docSnapshot.exists()) {
                                        let data = docSnapshot.data();
                                        rep_cloudNum = data.number;
                                        resolve(rep_cloudNum);
                                    } else {
                                        rep_cloudNum = '';
                                        resolve(rep_cloudNum);
                                    }
                                })
                                .catch(error => {
                                    console.error("Error getting document: ", error);
                                    reject(error);
                                }));

                        } else {
                            console.log("No MasterKey!");
                            resolve('');  // MasterKeyがない場合
                        }
                    })
                    .catch(error => {
                        console.error("Error: ", error);
                        reject(error);
                    });
            } else {
                resolve('');  // bankKeyがない場合
            }
        }).then(ret => new Promise(resolve => {
            setTimeout(() => {
                resolve(ret);
            }, interval.MsRep);
        }));

    }


    boolAvl(args, util) {
        return new Promise((resolve, reject) => {
            if (masterSha256 == '') { resolve(''); }
            if (args.BANK == '' || args.CARD == '') { resolve(false); }
    
            bankKey = new String(args.BANK);
            bankName = args.BANK;
            cardKey = new String(args.CARD);
    
            uniKey = bankKey.trim().concat(cardKey.trim());
    
            if (!crypto || !crypto.subtle) {
                reject("crypto.subtle is not supported.");
            }
    
            if (bankKey != '' && bankKey != undefined) {
                crypto.subtle.digest('SHA-256', encoder.encode(uniKey))
                .then(uniStr => {
                    uniSha256 = hexString(uniStr);
    
                    return sleep(1);
                })
                .then(() => {
                    if (masterSha256 != '' && masterSha256 != undefined) {
                        enqueueApiCall(() => getDoc(doc(db, 'card', uniSha256))
                        .then(ckey => {
                            if (ckey.exists()) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        })
                        .catch(error => {
                            console.log("Error checking document:", error);
                            reject(error);
                        }));
                
                    } else {
                        console.log("No MasterKey!");
                        reject('');  // MasterKeyがない場合
                    }
                }).catch(error => {
                    console.error("Error: ", error);
                    reject(error);
                });
            } else {
                resolve('');
            }
        }).then(ret => new Promise(resolve => {
            setTimeout(() => {
                resolve(ret);
            }, interval.MsAvl);
        }));

    }


    setMaster(args) {
        return new Promise((resolve, reject) => {
            if (args.KEY == '') { resolve(''); }
            if (inoutFlag_setting) { resolve(); }

            inoutFlag_setting = true;
            inoutFlag = true;
    
            masterSha256 = '';
            masterSetted = args.KEY;

            mkbUrl = FBaseUrl + 'mkeybank/?mkey=' + masterSetted;
            mkbRequest = new Request(mkbUrl, { mode: 'cors' });
    
            if (!crypto || !crypto.subtle) {
                reject("crypto.subtle is not supported.");
            }
    
            crypto.subtle.digest('SHA-256', encoder.encode(masterSetted))
                .then(masterStr => {
                    masterSha256 = hexString(masterStr);
    
                    enqueueApiCall(() => fetch(mkbRequest)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Unexpected responce status ${response.status} or content type');
                            }
                        
                        }).then((resBody) => {
            
                            cloudConfig_mkey.masterKey = resBody.masterKey;
                            cloudConfig_mkey.cloudType = resBody.cloudType;
                            cloudConfig_mkey.apiKey = resBody.apiKey;
                            cloudConfig_mkey.authDomain = resBody.authDomain;
                            cloudConfig_mkey.databaseURL = resBody.databaseURL;
                            cloudConfig_mkey.projectId = resBody.projectId;
                            cloudConfig_mkey.storageBucket = resBody.storageBucket;
                            cloudConfig_mkey.messagingSenderId = resBody.messagingSenderId;
                            cloudConfig_mkey.appId = resBody.appId;
                            cloudConfig_mkey.measurementId = resBody.measurementId;
                            cloudConfig_mkey.cccCheck = resBody.cccCheck;
                            interval.MsPut = resBody.intervalMsPut;
                            interval.MsSet = resBody.intervalMsSet;
                            interval.MsGet = resBody.intervalMsGet;
                            interval.MsRep = resBody.intervalMsRep;
                            interval.MsAvl = resBody.intervalMsAvl;
            
            
                            inoutFlag = false;
                            crypt_decode(cloudConfig_mkey, firebaseConfig);
                            return ioWaiter(1);
            
                        })
                        .then(() => {
                            inoutFlag = true;
            
                            // Initialize Firebase
                            try {
                                if (!getApps().length){ // V9
                                    // if (!firebase.apps.length) {
                
                                    fbApp = initializeApp(firebaseConfig, masterSetted); // V9
                                    // db = initializeFirestore(fbApp, {localCache: PersistentLocalCache});
                                    db = initializeFirestore(fbApp, {});

                                    inoutFlag_setting = false;
                                    inoutFlag = false;
            
                                } else {
            
                                    deleteApp(fbApp)
                                        .then(() => {

                                            fbApp = initializeApp(firebaseConfig, masterSetted); // V9
                                            // db = initializeFirestore(fbApp, {localCache: PersistentLocalCache});
                                            db = initializeFirestore(fbApp, {});

                                            inoutFlag_setting = false;
                                        })
                                        .catch(error => {
                                            console.error('Error deleting fbApp:', error);
                                            inoutFlag_setting = false;
                                        });

                                    inoutFlag = false;

                                }

                            } catch (error) {
                                console.error('Error initializing or deleting fbApp:', error);
                                inoutFlag = false;
                                inoutFlag_setting = false;
                                reject();
                            }
            
                            return sleep(1);
            
                        }).then(() => {
                            ResponseMaster = masterKey = masterSetted;
                            console.log("= MasterKey:", masterSetted);
                            console.log('= Interval:', interval);
                            console.log("= MasterKey Accepted =");

                            resolve(ResponseMaster);
            
                        })
                        .catch((error) => {
                            ResponseMaster = 'No masterkey';  // MasterKeyがマッチしない場合
                            console.log("= No such MasterKey =");
                            inoutFlag_setting = false;
                            resolve(ResponseMaster);
                        }),
                    );

                })
                .catch(error => {
                    console.log('Erorr:', error);
                    reject(error);
                });
        })
        .then(() => ioSettingWaiter(1))
        .then(() => ResponseMaster);

    }


    lisningNum(args, util) {
        if (masterSha256 == '') { return false; }
        if (args.BANK == '' || args.CARD == '') { return false; }

        const state = args.LISNING_STATE;

        if(state === Lisning.ON) {

            //onSnapshotに登録

            return new Promise((resolve, reject) => {
        
                bankKey = bankName = new String(args.BANK);
                cardKey = new String(args.CARD);
    
                uniKey = bankKey.trim().concat(cardKey.trim());
    
                if (!crypto || !crypto.subtle) {
                    reject("crypto.subtle is not supported.");
                }
    
                if (bankKey != '' && bankKey != undefined) {
                    crypto.subtle.digest('SHA-256', encoder.encode(bankKey))
                        .then(bankStr => {
                            bankSha256 = Lisning.BANK = hexString(bankStr);
    
                            return crypto.subtle.digest('SHA-256', encoder.encode(cardKey));
                        })
                        .then(cardStr => {
                            cardSha256 = Lisning.CARD = hexString(cardStr);
    
                            return crypto.subtle.digest('SHA-256', encoder.encode(uniKey));
                        })
                        .then(uniStr => {
                            uniSha256 = Lisning.UNI = hexString(uniStr);

                            if (masterSha256 != '' && masterSha256 != undefined) {
    
                                this.unsubscribe();
                                Lisning.FIRST = true;
                                this.unsubscribe = onSnapshot(doc(db, 'card', uniSha256), (doc) => {
                                    this.lisningState();
                                    //console.log("Current data: ", doc.data());
                                },
                                (err) => {
                                    console.log("onSnapshot Error:",err);
                                
                                });

                                console.log("= Lisning ON =");

                                resolve(state);
                                                                    
                            } else {
                                console.log("No MasterKey!");
                                resolve();  // MasterKeyがない場合
                            }
    
                        }).catch(error => {
                            console.error("Error: ", error);
                            reject(error);
                        });

                } else {
                    resolve(state);
                }
            });


        } else {

            console.log("= Lisning OFF =");

            //onSnapshotを解除
            this.unsubscribe();
         
        }

        return state;
    }


    snapshotCalled() {

        for (let [blockId, callCount] of this.whenUpdatedCallCountMap.entries()) {
            callCount += 1;
            this.whenUpdatedCallCountMap.set(blockId, callCount);
        }

    }


    //onSnapshot設定時にトリガーしてしまう初回を回避
    lisningState () {
        const first = Lisning.FIRST;
        if (first) {
            Lisning.FIRST = false;
            this.LisningBankCard_flag = false;
        } else {
            this.LisningBankCard_flag = true;
            this.snapshotCalled();
        }
    }
        

    static get Lisning () {
        return Lisning;
    }
    

    whenUpdatedCalled(blockId) {
        //console.log('Called:', instanceId);
        let callCount = this.whenUpdatedCallCountMap.get(blockId) || 0;

        if (this.LisningBankCard_flag) {
            if(callCount > 0){
                callCount -= 1;
                this.whenUpdatedCallCountMap.set(blockId, callCount);
            } 
            //console.log('checkCalled', Array.from(this.whenUpdatedCallCountMap));
            this.checkAllWhenUpdatedCalled();
        } else {
            this.whenUpdatedCallCountMap.set(blockId, callCount);
        }

    }

    
    checkAllWhenUpdatedCalled() {
        const allCalled = Array.from(this.whenUpdatedCallCountMap.values()).every(count => count === 0);
        //console.log('checkCalled', Array.from(this.whenUpdatedCallCountMap));

        if (allCalled) {
            this.LisningBankCard_flag = false;
        } 
    }


    whenUpdated(args, util) {
        const blockId = util.thread.topBlock;
        //console.log('util:', util.thread.topBlock);

        let callCount = this.whenUpdatedCallCountMap.get(blockId) || 0;

        this.whenUpdatedCalled(blockId);

        return callCount > 0;
    }


    /**
     * An array of info on video state options for the "lisning" block.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the state menu
     * @param {string} value - the serializable value stored in the block
     */
    get LISNING_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'lisning.off',
                    default: 'off',
                    description: 'Option for the "lisning [STATE]" block'
                }),
                value: Lisning.OFF
            },
            {
                name: formatMessage({
                    id: 'lisning.on',
                    default: 'on',
                    description: 'Option for the "lisning [STATE]" block'
                }),
                value: Lisning.ON
            }
        ];
    }



    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        this.setupTranslations();

        return {
            id: Scratch3NumberbankBlocks.EXTENSION_ID,
            name: Scratch3NumberbankBlocks.EXTENSION_NAME, // 'NumberBank',
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            showStatusButton: false,
            color1: '#78A0B4',
            color2: '#78A0B4',
            blocks: [
                {
                    opcode: 'putNum',
                    text: formatMessage({
                        id: 'numberbank.putNum',
                        default: 'put [VAL] to [CARD]of[BANK]',
                        description: 'put value to Firebase'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BANK: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.bank',
                                default: 'bank'
                            })
                        },
                        CARD: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.card',
                                default: 'card'
                            })
                        },
                        VAL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '10'
                        }
                    }
                },
                '---',
                {
                    opcode: 'setNum',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'numberbank.setNum',
                        default: 'set [VAR] to [CARD]of[BANK]',
                        description: 'set variable by Firebase'
                    }),
                    arguments: {
                        BANK: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.bank',
                                default: 'bank'
                            })
                        },
                        CARD: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.card',
                                default: 'card'
                            })
                        },
                        VAR: {
                            type: ArgumentType.STRING,
                            fieldName: 'VARIABLE',
                            variableType: Variable.SCALAR_TYPE,
                            menu: 'varMenu'
                        }
                    }
                },
                '---',
                {
                    opcode: 'getNum',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'numberbank.getNum',
                        default: 'get [CARD]of[BANK]',
                        description: 'get value from Firebase'
                    }),
                    arguments: {
                        BANK: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.bank',
                                default: 'bank'
                            })
                        },
                        CARD: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.card',
                                default: 'card'
                            })
                        }
                    }
                },
                {
                    opcode: 'repNum',
                    text: formatMessage({
                        id: 'numberbank.repNum',
                        default: 'cloud value',
                        description: 'report value'
                    }),
                    blockType: BlockType.REPORTER
                },
                '---',
                {
                    opcode: 'repCloudNum',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'numberbank.repCloudNum',
                        default: 'value of [CARD]of[BANK]',
                        description: 'report cloud value'
                    }),
                    arguments: {
                        BANK: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.bank',
                                default: 'bank'
                            })
                        },
                        CARD: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.card',
                                default: 'card'
                            })
                        }
                    }
                },
                '---',
                {
                    opcode: 'boolAvl',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'numberbank.boolAvl',
                        default: '[CARD]of[BANK] available?',
                        description: 'report value'
                    }),
                    arguments: {
                        BANK: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.bank',
                                default: 'bank'
                            })
                        },
                        CARD: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.card',
                                default: 'card'
                            })
                        }
                    }
                },
                '---',
                {
                    opcode: 'setMaster',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'numberbank.setMaster',
                        default: 'set Master[KEY]',
                        description: 'initFirebase'
                    }),
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.key',
                                default: 'key'
                            })
                        }
                    }

                },
                '---',
                {
                    opcode: 'lisningNum',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'numberbank.lisningNum',
                        default: 'turn lisning [CARD]of[BANK] [LISNING_STATE]',
                        description: 'lisning value by Firebase'
                    }),
                    arguments: {
                        BANK: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.bank',
                                default: 'bank'
                            })
                        },
                        CARD: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: 'numberbank.argments.card',
                                default: 'card'
                            })
                        },
                        LISNING_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'lisningMenu',
                            defaultValue: Lisning.ON
                        }
                    }
                },
                {
                    opcode: 'whenUpdated',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'numberbank.whenUpdated',
                        default: 'when updated',
                        description: 'whenFirebaseUpdated'
                    }),
                },
            ],
            menus: {
                varMenu: {
                    acceptReporters: true,
                    items: 'getDynamicMenuItems'
                },
                lisningMenu: {
                    acceptReporters: true,
                    items: this._buildMenu(this.LISNING_INFO)
                }
            }
        };
    }


    getDynamicMenuItems() {
        return this.runtime.getEditingTarget().getAllVariableNamesInScopeByType(Variable.SCALAR_TYPE);
    }



    setupTranslations() {
        const localeSetup = formatMessage.setup();
        const extensionTranslations = {
            'en': {
                'numberbank.name': 'NumberBank',
                'numberbank.argments.bank': 'bank',
                'numberbank.argments.card': 'card',
                'numberbank.argments.key': 'key',
                'numberbank.putNum': 'put [VAL] to [CARD]of[BANK]',
                'numberbank.setNum': 'set [VAR] to [CARD]of[BANK]',
                'numberbank.getNum': 'get [CARD]of[BANK]',
                'numberbank.repNum': 'cloud value',
                'numberbank.repCloudNum': 'value of [CARD]of[BANK]',
                'numberbank.boolAvl': '[CARD]of[BANK] available?',
                'numberbank.setMaster': 'set Master[KEY]',
                'numberbank.lisningNum': 'turn lisning value of[CARD]of[BANK] [LISNING_STATE]',
                'numberbank.whenUpdated': 'when updated',
                'lisning.off': 'off',
                'lisning.on': 'on'
            },
            'ja': {
                'numberbank.name': 'NumberBank',
                'numberbank.argments.bank': 'バンク',
                'numberbank.argments.card': 'カード',
                'numberbank.argments.key': 'key',
                'numberbank.putNum': '[BANK]の[CARD]を[VAL]にする',
                'numberbank.setNum': '[VAR]を[BANK]の[CARD]にする',
                'numberbank.getNum': '[BANK]の[CARD]を読む',
                'numberbank.repNum': 'クラウドの値',
                'numberbank.repCloudNum': '[BANK]の[CARD]の値',
                'numberbank.boolAvl': '[BANK]の[CARD]がある',
                'numberbank.setMaster': 'マスター[KEY]をセット',
                'numberbank.lisningNum': '[BANK]の[CARD]の更新確認を[LISNING_STATE]にする',
                'numberbank.whenUpdated': '更新されたとき',
                'lisning.off': '切',
                'lisning.on': '入'
            },
            'ja-Hira': {
                'numberbank.name': 'なんばーばんく',
                'numberbank.argments.bank': 'ばんく',
                'numberbank.argments.card': 'かーど',
                'numberbank.argments.key': 'key',
                'numberbank.putNum': '[BANK]の[CARD]を[VAL]にする',
                'numberbank.setNum': '[VAR]を[BANK]の[CARD]にする',
                'numberbank.getNum': '[BANK]の[CARD]をよむ',
                'numberbank.repNum': 'クラウドのあたい',
                'numberbank.repCloudNum': '[BANK]の[CARD]のあたい',
                'numberbank.boolAvl': '[BANK]の[CARD]がある',
                'numberbank.setMaster': 'ますたー[KEY]をセット',
                'numberbank.lisningNum': '[BANK]の[CARD]のこうしんかくにんを[LISNING_STATE]にする',
                'numberbank.whenUpdated': 'こうしんされたとき',
                'lisning.off': 'きり',
                'lisning.on': 'いり'
            }
        };

        for (const locale in extensionTranslations) {
            if (!localeSetup.translations[locale]) {
                localeSetup.translations[locale] = {};
            }
            Object.assign(localeSetup.translations[locale], extensionTranslations[locale]);
        }
    }


}



//
function processQueue() {
    if (processing || apiCallQueue.length === 0) {
        return;
    }
    processing = true;
    const apiCall = apiCallQueue.shift();
  
    apiCall().then(() => {
        processing = false;
        processQueue();
    })
    .catch(error => {
        console.error(error);
        processing = false;
        processQueue();
    });
}
  
  
//
function enqueueApiCall (apiCall) {
    return new Promise((resolve, reject) => {
        apiCallQueue.push(() => apiCall().then(resolve)
            .catch(reject));
        processQueue();
    });
}
  
  
function resetQueue () {
    apiCallQueue = [];
    processing = false;
}

    

function sleep (msec) {
    return new Promise(resolve =>
        setTimeout(() => {
            resolve();
        }, msec)
    );
}


function ioWaiter (msec) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if (inoutFlag) {
                reject();
            } else {
                resolve();
            }
        }, msec)
    )
    .catch(() => ioWaiter(msec));
}

function ioSettingWaiter (msec) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if (inoutFlag_setting) {
                reject();
            } else {
                resolve();
            }
        }, msec)
    )
    .catch(() => ioSettingWaiter(msec));
}


//
function hexString (textStr) {
    const byteArray = new Uint8Array(textStr);
    const hexCodes = [...byteArray].map(value => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, '0');
        return paddedHexCode;
    });
    return hexCodes.join('');
}



// Firebase関連
var fbApp;
var db;

// API呼び出し管理キュー
let apiCallQueue = [];
let processing = false;

//onSnapshot対象
const Lisning = {
    OFF: 'off',
    ON: 'on',
    BANK:'',
    CARD:'',
    UNI:'',
    FIRST:false
}

// Variables
let masterSetted = '';
let bankName = '';
let bankKey = '';
let cardKey = '';
let uniKey = '';
let cloudNum = '';
let settingNum = '';
let masterSha256 = '';
let bankSha256 = '';
let cardSha256 = '';
let uniSha256 = '';
let inoutFlag = false;
let inoutFlag_setting = false;
let mkbRequest;
let mkbUrl;
const FBaseUrl = 'https://us-central1-masterkey-bank.cloudfunctions.net/';


const interval = {
    MsPut: 1500,
    MsSet: 1000,
    MsGet: 1000,
    MsRep: 1000,
    MsAvl: 100,
}

const firebaseConfig = {
    masterKey: '',
    cloudType: '',
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// 格納用予備
const cloudConfig_mkb = {
    masterKey: '',
    cloudType: '',
    apiKey: '',
    authDomain: '',
    databaseURL: "",
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
    Version: '',
    AccessKeyId: '',
    SecretAccessKey: '',
    SessionToken: '',
    Expiration: '',
    cccCheck: '',
};


// mKey格納用
const cloudConfig_mkey = {
    masterKey: '',
    cloudType: '',
    apiKey: '',
    authDomain: '',
    databaseURL: "",
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
    Version: '',
    AccessKeyId: '',
    SecretAccessKey: '',
    SessionToken: '',
    Expiration: '',
    cccCheck: '',
};



// データ暗号化の下処理
/////////////////////////////////
/////////////////////////////////

function en_org(data) {
    return encoder.encode(data);
}

function en_store(data) {
    return firestore.Bytes.fromUint8Array(new Uint8Array(data)).toBase64();
}

function de_get(data) {
    return firestore.Bytes.fromBase64String(data).toUint8Array();
}

function de_disp(data) {
    return decoderUtf8.decode(data);
}

function en_crt(data) {
    return firestore.Bytes.fromUint8Array(data).toBase64();
}

function de_crt(data) {
    return firestore.Bytes.fromBase64String(data).toUint8Array();
}

////////////////////////////////
///////////////////////////////


function crypt_decode(cryptedConfigData, decodedConfigData) {

    decodedConfigData.cccCheck = cryptedConfigData.cccCheck;
    const cccCheck = de_crt(cryptedConfigData.cccCheck);

    const masterStr = crypto.subtle.digest('SHA-256', encoder.encode(masterSetted));
    const ckeyPromise = masterStr.then(masterStr => crypto.subtle.importKey('raw', masterStr, 'AES-CTR', false, ['encrypt', 'decrypt']));

    const propertiesToDecrypt = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId'];

    const decryptPromises = propertiesToDecrypt.map(property => {
        return ckeyPromise.then(ckey => {
            const cryptedData = de_get(cryptedConfigData[property]);
            return crypto.subtle.decrypt({ name: 'AES-CTR', counter: cccCheck, length: 64 }, ckey, cryptedData);
        }).then(decodedData => {
            decodedConfigData[property] = de_disp(decodedData);
        }).catch(error => {
            console.error(`Error decrypting ${property}:`, error);
        });
    });

    return Promise.all(decryptPromises);
}


module.exports = Scratch3NumberbankBlocks;