const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
// const Cast = require('../../util/cast');
// const formatMessage = require('format-message');
const console = require('../../util/log');
const WebSocketClient = require('./websocket_client');
//const { buildingBlockOptions, colorBlockOptions, natureBlockOptions, functionalBlockOptions, redstoneBlockOptios, toolItemsOptios } = require('./blocks');
const formatMessage = require('format-message');
const {translation, localse} = require('./language');

// 👇先程作成したアイコン画像
const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMDEuNjgzMzciIGhlaWdodD0iMTAxLjY4MzM3IiB2aWV3Qm94PSIwLDAsMTAxLjY4MzM3LDEwMS42ODMzNyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4OS4xNTgzMSwtMTI5LjE1ODMxKSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMTg5LjQwODMxLDE4MGMwLC0yNy45NDEwMiAyMi42NTA2NywtNTAuNTkxNjkgNTAuNTkxNjksLTUwLjU5MTY5YzI3Ljk0MTAyLDAgNTAuNTkxNjksMjIuNjUwNjcgNTAuNTkxNjksNTAuNTkxNjljMCwyNy45NDEwMiAtMjIuNjUwNjcsNTAuNTkxNjkgLTUwLjU5MTY5LDUwLjU5MTY5Yy0yNy45NDEwMiwwIC01MC41OTE2OSwtMjIuNjUwNjcgLTUwLjU5MTY5LC01MC41OTE2OXoiIGZpbGw9IiM2NWM3NTAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48ZyBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTIyNS4xODUsMTY1LjA0di04Ljc3aDI5Ljh2OC43N3oiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMjIxLjM4NSwxNzAuNjF2LTkuOTVoMzcuNHY5Ljk1eiIgZmlsbD0iI2ZmZmZmZiIvPjxwYXRoIGQ9Ik0yMTcuNTQ1LDIwMC4zNXYtMzQuMTZoNDUuMDh2MzQuMTZ6IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIyMi4xMDUsMjAyLjJ2LTI5LjczaDM1Ljk3djI5LjczeiIgZmlsbD0iI2Q2NmU0ZSIvPjxwYXRoIGQ9Ik0yMDEuNjA1LDIwMy43M3YtMTcuNDhoMTcuNDh2MTcuNDh6IiBmaWxsPSIjZDg2NjRhIi8+PHBhdGggZD0iTTI2MS4wNzUsMjAzLjY1di0xNy4zM2gxNy4zM3YxNy4zM3oiIGZpbGw9IiNkODY2NGEiLz48L2c+PGc+PHBhdGggZD0iTTI1Mi40NjUsMTg2LjMydjEwLjE1aC03LjE5di0xMC4xNXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzIzMTgxNSIgc3Ryb2tlLXdpZHRoPSIxLjI4Ii8+PHBhdGggZD0iTTI1Mi40NjUsMTg4LjIydjguMjVoLTkuMzV2LTguMjV6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMyMzE4MTUiIHN0cm9rZS13aWR0aD0iMS4yOCIvPjxwYXRoIGQ9Ik0yNTIuNDY1LDE4My4yN3Y0Ljk1aC05LjM1di00Ljk1eiIgZmlsbD0iIzk0Yzk2OSIgc3Ryb2tlPSIjMjMxODE1IiBzdHJva2Utd2lkdGg9IjEuMjgiLz48cGF0aCBkPSJNMjQzLjk3NSwxOTUuODJ2LTYuOTZoNC45NXY2Ljk2eiIgZmlsbD0iIzIzMTgxNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjQ4LjI3NSwxODkuNDZoLTMuNjZ2NS42OGgzLjY2di01LjY0TTI0OS41NjUsMTg4LjE4djguMjVoLTYuMjN2LTguMjVoNi4yMnoiIGZpbGw9IiMyMzE4MTUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTIzNy4wNjUsMTg4LjIydjguMjVoLTkuMzV2LTguMjV6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMyMzE4MTUiIHN0cm9rZS13aWR0aD0iMS4yOCIvPjxwYXRoIGQ9Ik0yMzcuMDY1LDE4My4yN3Y0Ljk1aC05LjM1di00Ljk1eiIgZmlsbD0iIzk0Yzk2OSIgc3Ryb2tlPSIjMjMxODE1IiBzdHJva2Utd2lkdGg9IjEuMjgiLz48cGF0aCBkPSJNMjI4LjU3NSwxOTUuODJ2LTYuOTZoNC45NXY2Ljk2eiIgZmlsbD0iIzIzMTgxNSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjMyLjg3NSwxODkuNDZoLTMuNjZ2NS42OGgzLjY3di01LjY0TTIzNC4xNjUsMTg4LjE4djguMjVoLTYuMjN2LTguMjVoNi4yMnoiIGZpbGw9IiMyMzE4MTUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvZz48L2c+PC9zdmc+';
const blockRedIconURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3OC43OSA0OS40NiI+PGRlZnM+PHN0eWxlPi5jbHMtMSwuY2xzLTR7ZmlsbDojZmZmO30uY2xzLTEsLmNscy0yLC5jbHMtM3tzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6MnB4O30uY2xzLTEsLmNscy0yLC5jbHMtMywuY2xzLTQsLmNscy01e3N0cm9rZS1taXRlcmxpbWl0OjEwO30uY2xzLTJ7ZmlsbDojZDY2ZTRlO30uY2xzLTN7ZmlsbDojZDg2NjRhO30uY2xzLTQsLmNscy01e3N0cm9rZTojMjMxODE1O3N0cm9rZS13aWR0aDoxLjI4cHg7fS5jbHMtNXtmaWxsOiM5NGM5Njk7fS5jbHMtNntmaWxsOiMyMzE4MTU7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT44eDlDcmFmdF9oYWtrdW5fY29sb3I8L3RpdGxlPjxnIGlkPSLjg6zjgqTjg6Tjg7xfMSIgZGF0YS1uYW1lPSLjg6zjgqTjg6Tjg7wgMSI+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSIyNC41OCIgeT0iMSIgd2lkdGg9IjI5LjgiIGhlaWdodD0iOC43NyIvPjxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iMjAuNzgiIHk9IjUuMzkiIHdpZHRoPSIzNy40IiBoZWlnaHQ9IjkuOTUiLz48cmVjdCBjbGFzcz0iY2xzLTEiIHg9IjE2Ljk0IiB5PSIxMC45MiIgd2lkdGg9IjQ1LjA4IiBoZWlnaHQ9IjM0LjE2Ii8+PHJlY3QgY2xhc3M9ImNscy0yIiB4PSIyMS41IiB5PSIxNy4yIiB3aWR0aD0iMzUuOTciIGhlaWdodD0iMjkuNzMiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjEiIHk9IjMwLjk4IiB3aWR0aD0iMTcuNDgiIGhlaWdodD0iMTcuNDgiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9IjYwLjQ3IiB5PSIzMS4wNSIgd2lkdGg9IjE3LjMzIiBoZWlnaHQ9IjE3LjMzIi8+PC9nPjxnIGlkPSLjg6zjgqTjg6Tjg7xfMyIgZGF0YS1uYW1lPSLjg6zjgqTjg6Tjg7wgMyI+PHJlY3QgY2xhc3M9ImNscy00IiB4PSI5OS40NyIgeT0iMjAxLjE4IiB3aWR0aD0iNy4xOSIgaGVpZ2h0PSIxMC4xNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUxLjMzIDI0Mi4zOCkgcm90YXRlKDE4MCkiLz48cmVjdCBjbGFzcz0iY2xzLTQiIHg9Ijk3LjMxIiB5PSIyMDMuMDgiIHdpZHRoPSI5LjM1IiBoZWlnaHQ9IjguMjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0OS4xNyAyNDQuMjgpIHJvdGF0ZSgxODApIi8+PHJlY3QgY2xhc3M9ImNscy01IiB4PSI5Ny4zMSIgeT0iMTk4LjEzIiB3aWR0aD0iOS4zNSIgaGVpZ2h0PSI0Ljk1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDkuMTcgMjMxLjA4KSByb3RhdGUoMTgwKSIvPjxyZWN0IGNsYXNzPSJjbHMtNiIgeD0iNDMuMzciIHk9IjMzLjU5IiB3aWR0aD0iNC45NSIgaGVpZ2h0PSI2Ljk2Ii8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMTAyLjQ4LDIwNC4zNlYyMTBIOTguODJ2LTUuNjhoMy42Nm0xLjI4LTEuMjhIOTcuNTR2OC4yNWg2LjIzdi04LjI1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU0LjgxIC0xNzAuMTMpIi8+PHJlY3QgY2xhc3M9ImNscy00IiB4PSI4MS45MiIgeT0iMjAzLjA4IiB3aWR0aD0iOS4zNSIgaGVpZ2h0PSI4LjI1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMTguMzggMjQ0LjI4KSByb3RhdGUoMTgwKSIvPjxyZWN0IGNsYXNzPSJjbHMtNSIgeD0iODEuOTIiIHk9IjE5OC4xMyIgd2lkdGg9IjkuMzUiIGhlaWdodD0iNC45NSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTE4LjM4IDIzMS4wOCkgcm90YXRlKDE4MCkiLz48cmVjdCBjbGFzcz0iY2xzLTYiIHg9IjI3Ljk3IiB5PSIzMy41OSIgd2lkdGg9IjQuOTUiIGhlaWdodD0iNi45NiIvPjxwYXRoIGNsYXNzPSJjbHMtNiIgZD0iTTg3LjA5LDIwNC4zNlYyMTBIODMuNDJ2LTUuNjhoMy42Nm0xLjI4LTEuMjhIODIuMTR2OC4yNWg2LjIzdi04LjI1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU0LjgxIC0xNzAuMTMpIi8+PC9nPjwvc3ZnPg==';
const svgNormal = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="78.82037" height="69.3397" viewBox="0,0,78.82037,69.3397"><g transform="translate(-200.58463,-135.3903)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><g stroke="#000000" stroke-width="2"><path d="M225.185,165.04001v-8.77h29.8v8.77z" fill="#ffffff"/><path d="M221.385,170.61001v-9.95h37.4v9.95z" fill="#ffffff"/><path d="M217.545,200.35001v-34.16h45.08v34.16z" fill="#ffffff"/><path d="M222.105,202.20001v-29.73h35.97v29.73z" fill="#66a3ff"/><path d="M201.605,203.73001v-17.48h17.48v17.48z" fill="#66a3ff"/><path d="M261.075,203.65001v-17.33h17.33v17.33z" fill="#66a3ff"/></g><g><path d="M252.465,186.32001v10.15h-7.19v-10.15z" fill="#ffffff" stroke="#231815" stroke-width="1.28"/><path d="M252.465,188.22001v8.25h-9.35v-8.25z" fill="#ffffff" stroke="#231815" stroke-width="1.28"/><path d="M252.465,183.27001v4.95h-9.35v-4.95z" fill="#94c969" stroke="#231815" stroke-width="1.28"/><path d="M243.975,195.82001v-6.96h4.95v6.96z" fill="#231815" stroke="none" stroke-width="1"/><path d="M248.275,189.46001h-3.66v5.68h3.66v-5.64M249.565,188.18001v8.25h-6.23v-8.25h6.22z" fill="#231815" stroke="none" stroke-width="1"/><path d="M237.065,188.22001v8.25h-9.35v-8.25z" fill="#ffffff" stroke="#231815" stroke-width="1.28"/><path d="M237.065,183.27001v4.95h-9.35v-4.95z" fill="#94c969" stroke="#231815" stroke-width="1.28"/><path d="M228.575,195.82001v-6.96h4.95v6.96z" fill="#231815" stroke="none" stroke-width="1"/><path d="M232.875,189.46001h-3.66v5.68h3.67v-5.64M234.165,188.18001v8.25h-6.23v-8.25h6.22z" fill="#231815" stroke="none" stroke-width="1"/></g><path d="M226.64573,141.98055v0v0v0z" fill="#fff500" stroke="none" stroke-width="0"/><path d="M201.08463,180.36574v-38.91041h41.72061v38.91041z" fill="#ffffff" stroke="#000000" stroke-width="1"/><text transform="translate(208.78797,173.48683) scale(0.98275,0.75439)" font-size="40" xml:space="preserve" fill="#000000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="Pixel" font-weight="normal" text-anchor="start" style="mix-blend-mode: normal"><tspan x="0" dy="0">$number</tspan></text></g></g></svg>`;
const svgAIOnly = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="78.82037" height="69.33988" viewBox="0,0,78.82037,69.33988"><g transform="translate(-200.58463,-135.39014)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><g stroke="#000000" stroke-width="2"><path d="M225.185,165.04001v-8.77h29.8v8.77z" fill="#ffffff"/><path d="M221.385,170.61001v-9.95h37.4v9.95z" fill="#ffffff"/><path d="M217.545,200.35001v-34.16h45.08v34.16z" fill="#ffffff"/><path d="M222.105,202.20001v-29.73h35.97v29.73z" fill="#d66e4e"/><path d="M201.605,203.73001v-17.48h17.48v17.48z" fill="#d66e4e"/><path d="M261.075,203.65001v-17.33h17.33v17.33z" fill="#d66e4e"/></g><g><path d="M252.465,186.32001v10.15h-7.19v-10.15z" fill="#ffffff" stroke="#231815" stroke-width="1.28"/><path d="M252.465,188.22001v8.25h-9.35v-8.25z" fill="#ffffff" stroke="#231815" stroke-width="1.28"/><path d="M252.465,183.27001v4.95h-9.35v-4.95z" fill="#94c969" stroke="#231815" stroke-width="1.28"/><path d="M243.975,195.82001v-6.96h4.95v6.96z" fill="#231815" stroke="none" stroke-width="1"/><path d="M248.275,189.46001h-3.66v5.68h3.66v-5.64M249.565,188.18001v8.25h-6.23v-8.25h6.22z" fill="#231815" stroke="none" stroke-width="1"/><path d="M237.065,188.22001v8.25h-9.35v-8.25z" fill="#ffffff" stroke="#231815" stroke-width="1.28"/><path d="M237.065,183.27001v4.95h-9.35v-4.95z" fill="#94c969" stroke="#231815" stroke-width="1.28"/><path d="M228.575,195.82001v-6.96h4.95v6.96z" fill="#231815" stroke="none" stroke-width="1"/><path d="M232.875,189.46001h-3.66v5.68h3.67v-5.64M234.165,188.18001v8.25h-6.23v-8.25h6.22z" fill="#231815" stroke="none" stroke-width="1"/></g><path d="M226.64573,141.98055v0v0z" fill="#fff500" stroke="none" stroke-width="0"/><path d="M201.08463,180.36574v-38.91041h41.72061v38.91041z" fill="#ffffff" stroke="#000000" stroke-width="1"/><text transform="translate(208.78797,173.48683) scale(0.98275,0.75439)" font-size="40" xml:space="preserve" fill="#000000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="Pixel" font-weight="normal" text-anchor="start" style="mix-blend-mode: normal"><tspan x="0" dy="0">$number</tspan></text></g></g></svg>`;

function getIconURI (level, type) {
    // SVG文字列の<tspan>の内容を引数の数字に置き換える
    const svgTemplate = type=="ai"?svgAIOnly:svgNormal;
    const updatedSvg = svgTemplate.replace('$number', level);

    // Base64にエンコードする
    const base64Svg = btoa(updatedSvg);

    return 'data:image/svg+xml;base64,'+base64Svg;    
}

class Scratch3hackCraft2 {
    
    
    constructor (runtime) {
        console.log('Scratch3hackCraft2');
        this.runtime = runtime;
        this.locale = this.setLocale();

        // 最後のスラッシュを除去したパスを基に、ルート相対の静的パスを生成
        const pathname = window.location.pathname.replace(/\/[^/]*$/, ''); 
        this.staticUrl = `${pathname}/static`;


        this.runtime.on('PROJECT_START', this.onStart.bind(this));
        this.runtime.on('PROJECT_RUN_STOP', this.onRunStop.bind(this));
        const urlParams = new URLSearchParams(window.location.search);
        this.player_name = urlParams.get('player_name') || 'self';
        this.player_id = urlParams.get('player_id') || 'uuid';
        this.entity_id = urlParams.get('entity_id') || 'uuid';
        this.entity_name = urlParams.get('entity_name') || 'hello';
        this.host = urlParams.get('host') || 'localhost';
        this.port = urlParams.get('scratchPort') || '25570';
        this.ssl = urlParams.get('ssl') === 'true' || false;
        this.level = urlParams.get('level') || 0;

        this.connection = new WebSocketClient(this.host, this.port, this.ssl);
        this.connection.connect(this.player_id, this.entity_id);

        document.title = document.title+" {"+this.entity_name+"}";

        console.log('constructor');

        this._initUI();
    }

    /**
     * @param {string} className className
     * @returns {Promise<Element>} Element
     */
    _waitForUI (className) {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const element = document.querySelector(`[class^="${className}"]`);
                if (element) {
                    resolve(element);
                    clearInterval(checkInterval);
                }
            }, 100);
        });
    }

    /**
     * @param {string} className className
     * @returns {Promise<Element[]>} Elements
     */
    _waitForUIAll (className) {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const elements = document.querySelectorAll(`[class^="${className}"]`);
                if (elements.length) {
                    resolve(elements);
                    clearInterval(checkInterval);
                }
            }, 100);
        });
    }

    async _initUI () {
        this.display3D = true;

        this._addCSS();

        this.uiHeader = await this._waitForUI('stage-header_stage-size-row');
        this.uiCanvasWrapper = await this._waitForUI('stage-wrapper_stage-canvas-wrapper');
        this.uiCanvasWrapper.classList.add('hackcraft', 'canvas-wrapper');
        this.uiStageWrapper = await this._waitForUI('stage_stage-wrapper');
        this.uiCanvas = this.uiStageWrapper.getElementsByTagName('canvas')[0];
        // this.uiControlsWrapper = await this._waitForUI('gui_target-wrapper');

        this._add3dViewToggleButton();
        this._addReloadButton();
        // this._addOpacitySlider();

        this._add3dView();

        this._addEventListeners();
    }

    _addCSS () {
        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', this.staticUrl+'/hackcraft.css');

        document.getElementsByTagName('head')[0].appendChild(linkElem);
    }

    _add3dViewToggleButton () {
        const self = this;

        const otherButton = this.uiHeader.querySelector('[class^="toggle-buttons_button"]');
        
        const button = document.createElement('button');
        button.className = `${otherButton.className} hackcraft button toggle3d on`;
        button.textContent = '3D';
        button.addEventListener('click', () => {
            self._toggle3dView();
            if (self.display3D) {
                button.classList.add('on');
            } else {
                button.classList.remove('on');
            }
        });

        this.uiToggleButton = button;
        this.uiHeader.prepend(button);
    }

    _addReloadButton () {
        const self = this;

        const otherButton = this.uiHeader.querySelector(
            '[class^="toggle-buttons_row"] ' +
            '[class^="toggle-buttons_button"]'
        );
        
        const button = document.createElement('button');
        button.className = `${otherButton.className} hackcraft button reload`;
        button.addEventListener('click', () => {
            self._reload();
        });

        this.uiReloadButton = button;
        this.uiHeader.prepend(button);
    }

    _addOpacitySlider () {
        const self = this;
        
        const slider = document.createElement('input');
        slider.setAttribute('type', 'range');
        slider.setAttribute('min', '0');
        slider.setAttribute('max', '1');
        slider.setAttribute('step', '0.1');
        const setOpacity = () => {
            self.uiThreedView.style.opacity = slider.value;
        };
        slider.addEventListener('change', setOpacity);
        slider.addEventListener('input', setOpacity);

        // this.uiToggleButton = slider;
        this.uiHeader.prepend(slider);
    }

    _add3dView () {
        require('./3dview/3dview.umd.cjs');

        const threedview = document.createElement('threed-view');
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        const pathPrefix = pathname.substring(0, pathname.lastIndexOf('/'));
        threedview.setAttribute('assets-location', `${origin}${pathPrefix}/static`);

        threedview.addEventListener('setup', it => {
            const api = it.detail[0];
            this.threedviewApi = api;
        }, false);
        
        this.uiCanvasWrapper.prepend(threedview);
        this.uiThreedView = threedview;
    }

    _addGlobalClickListener (className, callback) {
        document.addEventListener('click', e => {
            if (e.target instanceof HTMLElement) {
                const target = e.target.closest(`[class^="${className}"]`);
                if (target) {
                    callback(e.target);
                }
            }
        });
    }

    _forwardEventsToCanvas () {
        const eventList = ['mousedown', 'touchstart'];
        for (const eventName of eventList) {
            this.uiThreedView.addEventListener(eventName, e => {
                const eventClone = new e.constructor(e.type, e);
                this.uiCanvas.dispatchEvent(eventClone);
            });
        }
    }

    _addEventListeners () {
        // Toggle fullscreen stage button, also: stage-header_stage-button
        this._addGlobalClickListener('button_outlined-button', () => {
            // Fixes 3d view not resizing properly.
            window.dispatchEvent(new Event('resize'));
        });

        this._forwardEventsToCanvas();
    }

    _toggle3dView () {
        this.display3D = !this.display3D;
        if (this.display3D) {
            this.uiThreedView.style.display = 'flex';
        } else {
            this.uiThreedView.style.display = 'none';
        }
    }

    _reload () {
        this.threedviewApi.reload();
    }

    getBlocks () {
        this.locale = this.setLocale();
        return [
            /*{
                opcode: 'setRenderView',
                text: translation.render_view_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: blockBlueIconURI,
                arguments: {
                    FLAG: {
                        type: 'string',
                        defaultValue: 'on',
                        menu: 'FLAG_MENU_OPTIONS'
                    }
                }
            },*/
            {
                opcode: 'onEntityCustomEvent',
                blockType: BlockType.HAT,
                blockIconURI: getIconURI(5, 'normal'),
                text: translation.onEntityCustomEvent_text[this.locale],
                level: 5,
                arguments: {
                    MESSAGE: {
                        type: ArgumentType.STRING,
                        defaultValue: translation.default_message_text[this.locale],
                    }
                },
                isEdgeActivated: true,
            },{
                opcode: 'onInteractEvent',
                blockType: BlockType.HAT,
                blockIconURI: getIconURI(5, 'normal'),
                text: translation.onInteractEvent_text[this.locale],
                level: 5,
                arguments: {
                    EVENT: {
                        type: ArgumentType.STRING,
                        defaultValue: translation.default_event_text[this.locale],
                    }
                },
                isEdgeActivated: true
            },{
                opcode: 'sendEvent',
                text: translation.sendEvent_text[this.locale],
                level: 5,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(5, 'normal'),
                arguments: {
                    TARGET: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    },
                    MESSAGE: {
                        type: ArgumentType.STRING,
                        defaultValue: translation.default_message_text[this.locale]
                    }
                }
            },{
                opcode: 'waitForRedstone',
                text: translation.waitForRedstone_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal'),
            },{
                opcode: 'waitForChat',
                text: translation.waitForChat_text[this.locale],
                level: 2,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(2, 'normal'),
            },{
                opcode: 'waitForBreakBlock',
                text: translation.waitForBreakBlock_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'normal'),
            },{
                opcode: 'grabItem',
                text: translation.grabItem_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal'),
                arguments: {
                    SLOT: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0                    }
                }
            },{
                opcode: 'passItem',
                text: translation.passItem_text[this.locale],
                level: 2,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(2, 'normal'),
                arguments: {
                    SLOT: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    TARGET: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    }
                }
            },{
                opcode: 'setItem',
                text: translation.setItem_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    SLOT: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: 'dirt'
                    }
                }
            },
            {
                opcode: 'reset',
                text: translation.reset_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal'),
            },
            {
                opcode: 'move',
                text: translation.move_text[this.locale],
                level: 0,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(0, 'normal'),
                arguments: {
                    MOVE_MENU: {
                        type: 'string',
                        defaultValue: 'forward',
                        menu: 'MOVE_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'turn',
                text: translation.turn_text[this.locale],
                level: 0,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(0, 'normal'),
                arguments: {
                    TURN_MENU: {
                        type: 'string',
                        defaultValue: 'turnLeft',
                        menu: 'TURN_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'place',
                text: translation.place_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    },
                    SIDE_MENU: {
                        type: 'string',
                        defaultValue: 'Default',
                        menu: 'SIDE_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'dig',
                text: translation.dig_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'useItem',
                text: translation.useItem_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'action',
                text: translation.action_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'putToChest',
                text: translation.putToChest_text[this.locale],
                level: 6,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(6, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'takeFromChest',
                text: translation.takeFromChest_text[this.locale],
                level: 6,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(6, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'getPosition',
                text: translation.getPosition_text[this.locale],
                level: 6,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(6, 'normal')
            },{
                opcode: 'moveRun',
                text: translation.moveRun_text[this.locale],
                level: 3,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(3, 'ai'),
                arguments: {
                    V: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0.5'
                    },
                }
            },{
                opcode: 'jump',
                text: translation.jump_text[this.locale],
                level: 3,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(3, 'ai'),
                arguments: {
                    V: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0.5'
                    },
                }
            },{
                opcode: 'turnX',
                text: translation.turnX_text[this.locale],
                level: 3,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(3, 'normal'),
                arguments: {
                    degrees: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '90'
                    }
                }
            },{
                opcode: 'makeSound',
                text: translation.makeSound_text[this.locale],
                level: 1,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(1, 'normal')
            },{
            
                opcode: 'attack',
                text: translation.attack_text[this.locale],
                level: 3,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(3, 'normal')
            },{
                opcode: 'sendChat',
                text: translation.sendChat_text[this.locale],
                level: 2,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(2, 'normal'),
                arguments: {
                    TEXT: {
                        type: ArgumentType.STRING,
                        defaultValue: translation.default_hello_text[this.locale]
                    }
                }
            },{
                opcode: 'setMark',
                text: translation.setMark_text[this.locale],
                level: 3,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(3, 'normal'),
                arguments: {
                    name: {
                        type: ArgumentType.STRING,
                        defaultValue: translation.default_home_text[this.locale]
                    }
                }
            },{
                opcode: 'moveMark',
                text: translation.moveMark_text[this.locale],
                level: 3,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(3, 'normal'),
                arguments: {
                    name: {
                        type: ArgumentType.STRING,
                        defaultValue: translation.default_home_text[this.locale]
                    }
                }
            },{
                opcode: 'hasItemInSlot',
                text: translation.hasItemInSlot_text[this.locale],
                level: 4,
                blockType: BlockType.BOOLEAN,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    SLOT: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                }
            },{
                opcode: 'isBlocked',
                text: translation.isBlocked_text[this.locale],
                level: 0,
                blockType: BlockType.BOOLEAN,
                blockIconURI: getIconURI(0, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'isCanDig',
                text: translation.isCanDig_text[this.locale],
                level: 0,
                blockType: BlockType.BOOLEAN,
                blockIconURI: getIconURI(0, 'normal'),
                arguments: {
                    DIR_MENU: {
                        type: 'string',
                        defaultValue: 'Front',
                        menu: 'DIR_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'blockColor',
                text: translation.blockColor_text[this.locale],
                level: 4,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    color: {
                        type: ArgumentType.COLOR,
                    },
                }
            },{
                opcode: 'getTargetDistance',
                level: 3,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(3, 'normal'),
                text: translation.getTargetDistance_text[this.locale],
                arguments: {
                    TARGET: {
                        type: 'string',
                        defaultValue: 'Owner',
                        menu: 'TARGET_MENU_OPTIONS'
                    }
                }
            },
            
            //高度なブロック
            {
                opcode: 'teleport',
                text: translation.teleport_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    COORDINATE: {
                        type: 'string',
                        defaultValue: '^',
                        menu: 'COORDINATE_SYSTEM_OPTIONS'
                    },
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    }
                }
            },{
                opcode: 'lookAtPosition',
                text: translation.lookAtPosition_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    COORDINATE: {
                        type: 'string',
                        defaultValue: '^',
                        menu: 'COORDINATE_SYSTEM_OPTIONS'
                    },
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    }
                }
            },{
                opcode: 'placeX',
                text: translation.placeX_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    COORDINATE: {
                        type: 'string',
                        defaultValue: '^',
                        menu: 'COORDINATE_SYSTEM_OPTIONS'
                    },
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    SIDE_MENU: {
                        type: 'string',
                        defaultValue: 'Default',
                        menu: 'SIDE_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'digX',
                text: translation.digX_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    COORDINATE: {
                        type: 'string',
                        defaultValue: '^',
                        menu: 'COORDINATE_SYSTEM_OPTIONS'
                    },
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    }
                }
            },{
                opcode: 'useItemX',
                text: translation.useItemX_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    COORDINATE: {
                        type: 'string',
                        defaultValue: '^',
                        menu: 'COORDINATE_SYSTEM_OPTIONS'
                    },
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    }
                }
            },{
                opcode: 'addForce',
                text: translation.addForce_text[this.locale],
                level: 4,
                blockType: BlockType.COMMAND,
                blockIconURI: getIconURI(4, 'ai'),
                arguments: {
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    }
                }
            },{
                opcode: 'getChatData',
                level: 2,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(2, 'normal'),
                text: translation.getChatData_text[this.locale],
                arguments: {
                    CHAT_MENU: {
                        type: 'string',
                        defaultValue: 'player',
                        menu: 'CHAT_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'getRedStoneData',
                level: 1,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(1, 'normal'),
                text: translation.getRedStoneData_text[this.locale],
                arguments: {
                    REDSTONE_MENU: {
                        type: 'string',
                        defaultValue: 'newCurrent',
                        menu: 'REDSTONE_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'getBreakBlockData',
                level: 4,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(4, 'normal'),
                text: translation.getBreakBlockData_text[this.locale],
                arguments: {
                    BREAK_BLOCK_MENU: {
                        type: 'string',
                        defaultValue: 'name',
                        menu: 'BLOCK_INFO_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'getTargetData',
                level: 5,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(5, 'normal'),
                text: translation.getTargetData_text[this.locale],
                arguments: {
                    TARGET_MENU: {
                        type: 'string',
                        defaultValue: 'x',
                        menu: 'CLICKED_TARGET_MENU_OPTIONS'
                    }
                }
            },{
                opcode: 'inspect',
                text: translation.inspect_text[this.locale],
                level: 4,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    COORDINATE: {
                        type: 'string',
                        defaultValue: '^',
                        menu: 'COORDINATE_SYSTEM_OPTIONS'
                    },
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    }
                }
            },{
                opcode: 'distanceTo',
                text: translation.distanceTo_text[this.locale],
                level: 4,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(4, 'normal'),
                arguments: {
                    COORDINATE: {
                        type: 'string',
                        defaultValue: '^',
                        menu: 'COORDINATE_SYSTEM_OPTIONS'
                    },
                    X: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Y: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    },
                    Z: {
                        type: ArgumentType.NUMBER,
                        defaultValue: '0'
                    }
                }
            },{
                opcode: 'chatGPT',
                text: translation.chatGPT_text[this.locale],
                level: 2,
                blockType: BlockType.REPORTER,
                rank: 1,
                blockIconURI: getIconURI(2, 'normal'),
                arguments: {
                    TEXT: {
                        type: ArgumentType.STRING,
                        defaultValue: translation.default_ai_text[this.locale]
                    }
                }
            },{
                opcode: 'execCommand',
                text: translation.execCommand_text[this.locale],
                level: 7,
                blockType: BlockType.COMMAND,
                rank: 1,
                blockIconURI: getIconURI(7, 'normal'),
                arguments: {
                    TEXT: {
                        type: ArgumentType.STRING,
                        defaultValue: ' '
                    }
                }
            }
            ,{
                opcode: 'getResult',
                level: 7,
                blockType: BlockType.REPORTER,
                blockIconURI: getIconURI(7, 'normal'),
                text: translation.getResult_text[this.locale]
            },
        ].filter(block => block.level <= this.level);
    }

    getInfo () {
        return {
            id: 'hackcraft2',
            name: 'hackCraft2',
            menuIconURI: menuIconURI,
            blockIconURI: blockRedIconURI,
            blocks: this.getBlocks(),
            menus: {    
                FLAG_MENU_OPTIONS: [
                    {
                        text: translation.mnu_on_text[this.locale],
                        value: 'on'
                    },
                    {
                        text: translation.mnu_off_text[this.locale],
                        value: 'off'
                    },
                ],            
                POSITION_MENU_OPTIONS: [
                    {
                        text: 'X',
                        value: 'x'
                    },
                    {
                        text: 'Y',
                        value: 'y'
                    },
                    {
                        text: 'Z',
                        value: 'z'
                    }
                ],
                MOVE_MENU_OPTIONS: [
                    {
                        text: translation.mnu_front_text[this.locale],
                        value: 'forward'
                    },
                    {
                        text: translation.mnu_back_text[this.locale],
                        value: 'back'
                    },
                    {
                        text: translation.mnu_up_text[this.locale],
                        value: 'up'
                    },
                    {
                        text: translation.mnu_down_text[this.locale],
                        value: 'down'
                    },
                    {
                        text: translation.mnu_right_text[this.locale],
                        value: 'stepRight'
                    },
                    {
                        text: translation.mnu_left_text[this.locale],
                        value: 'stepLeft'
                    }
                ],
                TURN_MENU_OPTIONS: [
                    {
                        text: translation.mnu_right_text[this.locale],
                        value: 'turnRight'
                    },
                    {
                        text: translation.mnu_left_text[this.locale],
                        value: 'turnLeft'
                    },
                    {
                        text: translation.mnu_owner_text[this.locale],
                        value: 'facingOwner'
                    }
                ],
                DIR_MENU_OPTIONS: [
                    {
                        text: translation.mnu_front_text[this.locale],
                        value: 'Front'
                    },
                    {
                        text: translation.mnu_up_text[this.locale],
                        value: 'Up'
                    },
                    {
                        text: translation.mnu_down_text[this.locale],
                        value: 'Down'
                    }
                ],
                SIDE_MENU_OPTIONS: [
                    {
                        text: translation.mnu_side_none_text[this.locale],
                        value: 'Default'
                    },
                    {
                        text: translation.mnu_side_top_text[this.locale],
                        value: 'Top'
                    },
                    {
                        text: translation.mnu_side_bottom_text[this.locale],
                        value: 'Bottom'
                    },
                    {
                        text: translation.mnu_side_right_text[this.locale],
                        value: 'Right'
                    },
                    {
                        text: translation.mnu_side_left_text[this.locale],
                        value: 'Left'
                    },
                    {
                        text: translation.mnu_side_front_text[this.locale],
                        value: 'Front'
                    },
                    {
                        text: translation.mnu_side_back_text[this.locale],
                        value: 'Back'
                    }
                ],
                CLICKED_TARGET_MENU_OPTIONS:[
                    {
                        text: translation.mnu_world_text[this.locale],
                        value: 'world'
                    },
                    {
                        text: translation.mnu_x_text[this.locale],
                        value: 'x'
                    },
                    {
                        text: translation.mnu_y_text[this.locale],
                        value: 'y'
                    },
                    {
                        text: translation.mnu_z_text[this.locale],
                        value: 'z'
                    },
                    {
                        text: translation.mnu_player_name_text[this.locale],
                        value: 'player'
                    },
                    {
                        text: translation.mnu_target_name_text[this.locale],
                        value: 'name'
                    },
                    {
                        text: translation.mnu_target_type_text[this.locale],
                        value: 'type'
                    },
                ],
                BLOCK_INFO_MENU_OPTIONS: [
                    {
                        text: translation.mnu_name_text[this.locale],
                        value: 'name'
                    },
                    {
                        text: translation.mnu_world_text[this.locale],
                        value: 'world'
                    },
                    {
                        text: translation.mnu_x_text[this.locale],
                        value: 'x'
                    },
                    {
                        text: translation.mnu_y_text[this.locale],
                        value: 'y'
                    },
                    {
                        text: translation.mnu_z_text[this.locale],
                        value: 'z'
                    }
                ],
                SELECTOR_MENU_OPTIONS: [
                    {
                        text: translation.mnu_ap_text[this.locale],
                        value: '@p'
                    },
                    {
                        text: translation.mnu_ar_text[this.locale],
                        value: '@r'
                    },
                    {
                        text: translation.mnu_aa_text[this.locale],
                        value: '@a'
                    },
                    {
                        text: translation.mnu_ae_text[this.locale],
                        value: '@e'
                    },
                ],
                COORDINATE_SYSTEM_OPTIONS: [
                    {
                        text: '',
                        value: ''
                    },
                    {
                        text: '~',
                        value: '~'
                    },
                    {
                        text: '^',
                        value: '^'
                    }
                ],
                TARGET_MENU_OPTIONS: [
                    {
                        text: translation.mnu_owner_text[this.locale],
                        value: 'Owner'
                    },
                    {
                        text: translation.mnu_front_any_text[this.locale],
                        value: 'Front'
                    },
                    {
                        text: translation.mnu_up_any_text[this.locale],
                        value: 'Up'
                    },
                    {
                        text: translation.mnu_down_any_text[this.locale],
                        value: 'Down'
                    }
                ],
                CHAT_MENU_OPTIONS: [
                    {
                        text: translation.mnu_player_name_text[this.locale],
                        value: 'player'
                    },
                    {
                        text: translation.mnu_content_text[this.locale],
                        value: 'message'
                    }
                ],
                REDSTONE_MENU_OPTIONS: [
                    {
                        text: translation.mnu_old_value_text[this.locale],
                        value: 'oldCurrent'
                    },
                    {
                        text: translation.mnu_new_value_text[this.locale],
                        value: 'newCurrent'
                    }
                ],
                /*BUILDING_BLOCKS_OPTIONS: buildingBlockOptions,
                COLOR_BLOCKS_OPTIONS: colorBlockOptions,
                NATURE_BLOCKS_OPTIONS: natureBlockOptions,
                FUNCTIONAL_BLOCKS_OPTIONS: functionalBlockOptions,
                REDSTONE_BLOCKS_OPTIONS: redstoneBlockOptios,
                TOOL_ITEMS_OPTIONS: toolItemsOptios,*/
            }
        };
    }

    setLocale() {
        const locale = formatMessage.setup().locale;
        if (localse.includes(locale)) {
            return locale;
        }
        return 'en';

    }

    async makeSound () {
        console.log('onStart ');

        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'sound'
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async attack () {
        console.log('onStart ');

        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'attack'
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async onStart () {
        console.log('onStart ');

        try {
            const ret = await this.sendMessage({
                type: 'start'
            });
        } catch (error) {
            console.error(error);
        }
    }

    onRunStop () {
        // 終了処理を実装
        /*console.log('onRunStop');
        if(this.connection !== null) {
            this.connection.close();
        }*/
    }

    connect (args, util) {
        
        if (this.connection === null || this.connection === undefined) {
            this.connection = new WebSocketClient(this.host, this.ssl);
        }

        return this.connection.connect(this.player_id, this.entity_id);
    }

    async sendMessage(json) {
        if (this.connection !== null && this.connection !== undefined) {
            try {
                console.log(json)
                json.data = json.data || {};
                json.data.entity = this.entity_id;
                let response = await this.connection.send(json);
                console.log(response);
                return response; // 結果を返す
            } catch (error) {
                console.log("dfasdfadfasdfasdfa")
                console.error(error);
                throw error; // エラーを再スローする
            }
        }
    }
    
    printLog (spriteId, message) {
        if (this.connection !== null && this.connection !== undefined) {
            this.connection.result = message;
            this.connection.eventChanged.onResult = true;
        }
    }

////////////////////////////// ブロック操作 //////////////////////////////

    onEntityEvent (args, util) {
        if (this.connection !== null && this.connection !== undefined) {
            const ret = this.connection.eventChanged[args.EVENT_MENU];
            if(args.EVENT_MENU == 'onEntityRedstone'){
                if (this.connection.eventData && this.connection.eventData['onEntityRedstone']) {
                    var newCurrent = this.connection.eventData['onEntityRedstone'].newCurrent
                    var oldCurrent = this.connection.eventData['onEntityRedstone'].oldCurrent
                    if(oldCurrent ==  0 && newCurrent > 0){
                        this.connection.eventChanged[args.EVENT_MENU] = false;
                        return true;    
                    }
                }
            }else{
                this.connection.eventChanged[args.EVENT_MENU] = false;
                return ret;    
            }
        }
        return false;

    }

    onEntityCustomEvent (args, util) {
        if (this.connection !== null && this.connection !== undefined) {
            const ret = this.connection.eventChanged[args.MESSAGE];
            this.connection.eventChanged[args.MESSAGE] = false;
            return ret;
        }
        return false;

    }

    onInteractEvent (args, util) {
        if (this.connection !== null && this.connection !== undefined) {
            const ret = this.connection.eventChanged[args.EVENT];
            this.connection.eventChanged[args.EVENT] = false;
            return ret;
        }
        return false;

    }

    async waitForRedstone(args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            this.connection.eventData['onEntityRedstone'] = undefined;
            const ret = await this.sendMessage({
                type: 'hook',
                data: {
                    name: 'onEntityRedstone',
                    }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async waitForChat(args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            this.connection.eventData['onPlayerChat'] = undefined;
            const ret = await this.sendMessage({
                type: 'hook',
                data: {
                    name: 'onPlayerChat',
                    }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async waitForBreakBlock(args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            this.connection.eventData['onPlayerBlockBreak'] = undefined;
            const ret = await this.sendMessage({
                type: 'hook',
                data: {
                    name: 'onPlayerBlockBreak',
                    }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async setAI (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'setAI',
                    args: [args.flag]
                    }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async getAI (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'getAI'
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async setup (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'setup'
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async teardown (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'teardown'
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async setRenderView (args, util) {
        this.display3D = !this.display3D;
        if (this.display3D) {
            this._drawBackgroundAndText();
        } else {
            this._clearCanvas();
        }
    }

    async reset(args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'restoreArea'
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async move (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: args.MOVE_MENU
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'なにかにぶつかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async turn (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            if(args.TURN_MENU === 'facingTalker'){
                if(this.connection.eventData['onPlayerChat'] !== undefined){
                    const ret = await this.sendMessage({
                        type: 'call',
                        data: {
                            name: 'facingTarget',
                            args: [this.connection.eventData['onPlayerChat'].uuid]
                        }
                    });
                }
            }else{
                const ret = await this.sendMessage({
                    type: 'call',
                    data: {
                        name: args.TURN_MENU
                    }
                });
            }
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'なにかにぶつかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async stop (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'stop'
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'なにかにぶつかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async digX (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'digX',
                    args: [args.X, args.Y, args.Z, args.COORDINATE]
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async useItemX (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'useItemX',
                    args: [args.X, args.Y, args.Z, args.COORDINATE]
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async teleport (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'teleport',
                    args: [args.X, args.Y, args.Z, args.COORDINATE]
                    }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'なにかにぶつかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async addForce (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'addForce',
                    args: [args.X, args.Y, args.Z]
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async moveRun (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'addForce',
                    args: [0, 0, args.V]
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'なにかの力でうごけなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async turnX (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'turn',
                    args: [args.degrees]
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'なにかの力でうごけなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async jump (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'addForce',
                    args: [0, args.V, 0]
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'なにかの力でうごけなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async sendChat (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'sendChat',
                    args: [args.TEXT]
                    }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, '空中にいてジャンプできなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async sendPlayerChat (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'sendPlayerChat',
                    args: [this.connection.eventData['onPlayerChat'].player, args.TEXT]
                        }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, '空中にいてジャンプできなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async chatGPT (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'chatGPT',
                    args: [args.TEXT]
                }
            });
            const response = JSON.parse(ret);
            if (response.type === 'result') {
                return response.data;
            }else{
                return "";
            }
        } catch (error) {
            console.error(error);
            return "";
        }
    }

    async blockColor (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'blockColor',
                    args: [args.color]
                }
            });
            const response = JSON.parse(ret);
            if (response.type === 'result') {
                const data = JSON.parse(response.data);
                return data.name;
            } else {
                return "";
            }
        } catch (error) {
            console.error(error);
            return "";
        }        
    }

    async place (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `place${args.DIR_MENU}`,
                    args: [args.SIDE_MENU]
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'そこにおけなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async lookAtPosition (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'lookAtPosition',
                    args: [args.X, args.Y, args.Z, args.COORDINATE]
                    }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'そこに向けられなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async placeX (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'placeX',
                    args: [args.X, args.Y, args.Z, args.COORDINATE, args.SIDE_MENU]
                    }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'そこにおけなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async execCommand (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'executeCommand',
                    args: [args.TEXT]
                    }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, '実行エラー');
        } catch (error) {
            console.error(error);
        }
    }

    async inspect (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'inspect',
                    args: [args.X, args.Y, args.Z, args.COORDINATE]
                }
            });
            const response = JSON.parse(ret);
            if (response.type === 'result') {
                const data = JSON.parse(response.data);
                if(data.data === undefined || data.data == 0) return data.name;
                return data.name+":"+data.data;
            } else {
                return "";
            }   
        } catch (error) {
            console.error(error);
        }
    }

    async distanceTo (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'distance',
                    args: [args.X, args.Y, args.Z, args.COORDINATE]
                }
            });
            const response = JSON.parse(ret);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    async action (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `action${args.DIR_MENU}`
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'そこにおけなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async useItem (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `useItem${args.DIR_MENU}`
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'これは使えなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async dig (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `dig${args.DIR_MENU}`
                }
            });
            const response = JSON.parse(ret);
            if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async putToChest (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `putToChest${args.DIR_MENU}`
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async takeFromChest (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `takeFromChest${args.DIR_MENU}`
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async hasItemInSlot (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'getItemCountInSlot',
                    args: [args.SLOT]
                }
            });
            const response = JSON.parse(ret);
            return response.data > 0;
        } catch (error) {
            console.error(error);
        }
    }

    async isBlocked (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `isBlocked${args.DIR_MENU}`
                }
            });
            const response = JSON.parse(ret);
            console.log("isBlocked response=", response.data);
            return response.data == 'true';
        } catch (error) {
            console.error(error);
        }
    }

    async isCanDig (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `isCanDig${args.DIR_MENU}`
                }
            });
            const response = JSON.parse(ret);
            console.log("isCanDig response=", response.data);
            return response.data == 'true';
        } catch (error) {
            console.error(error);
        }
    }

    async getTargetDistance(args, util) {
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: `getTargetDistance${args.TARGET}`
                }
            });
            const response = JSON.parse(ret);
            return response.data;
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    getChatData (args, util) {
        if(!this.connection || !this.connection.eventData || !this.connection.eventData['onPlayerChat']){
            // 適切なエラーメッセージを返すか、または0や空文字を返すなどして処理を終了する
            return ""; // ここは状況に応じて適切な値を返す
        }
        console.log(this.connection.eventData['onPlayerChat']);
        if(args.CHAT_MENU == 'player'){
            return this.connection.eventData['onPlayerChat'].player;
        } else if(args.CHAT_MENU == 'uuid'){
            return this.connection.eventData['onPlayerChat'].uuid;
        } else if(args.CHAT_MENU == 'message'){
            return this.connection.eventData['onPlayerChat'].message;
        }
        return "";
    }

    getRedStoneData(args, util) {
        // まず、this.connection.eventData['onEntityRedstone']がundefinedかどうかをチェック
        if(!this.connection || !this.connection.eventData || !this.connection.eventData['onEntityRedstone']){
            // 適切なエラーメッセージを返すか、または0や空文字を返すなどして処理を終了する
            return 0; // ここは状況に応じて適切な値を返す
        }
    
        if(args.REDSTONE_MENU == 'newCurrent'){
            if(this.connection.eventData['onEntityRedstone'].newCurrent === undefined) return 0;
            return this.connection.eventData['onEntityRedstone'].newCurrent;
        } else if(args.REDSTONE_MENU == 'oldCurrent'){
            if(this.connection.eventData['onEntityRedstone'].oldCurrent === undefined) return 0;
            return this.connection.eventData['onEntityRedstone'].oldCurrent;
        }
        return "";
    }

    getTargetData(args, util) {
        // まず、this.connection.eventData['onCustomEvent']がundefinedかどうかをチェック
        if(!this.connection || !this.connection.eventData || !this.connection.eventData['onInteractEvent']){
            // 適切なエラーメッセージを返すか、または0や空文字を返すなどして処理を終了する
            return 0; // ここは状況に応じて適切な値を返す
        }
    
        if(args.TARGET_MENU == 'world'){
            if(this.connection.eventData['onInteractEvent'].world === undefined) return "";
            return this.connection.eventData['onInteractEvent'].world;
        } else if(args.TARGET_MENU == 'x'){
            if(this.connection.eventData['onInteractEvent'].x === undefined) return 0;
            return this.connection.eventData['onInteractEvent'].x;
        } else if(args.TARGET_MENU == 'y'){
            if(this.connection.eventData['onInteractEvent'].y === undefined) return 0;
            return this.connection.eventData['onInteractEvent'].y;
        } else if(args.TARGET_MENU == 'z'){
            if(this.connection.eventData['onInteractEvent'].z === undefined) return 0;
            return this.connection.eventData['onInteractEvent'].z;
        } else if(args.TARGET_MENU == 'player'){
            if(this.connection.eventData['onInteractEvent'].player === undefined) return '';
            return this.connection.eventData['onInteractEvent'].player;
        } else if(args.TARGET_MENU == 'name'){
            if(this.connection.eventData['onInteractEvent'].name === undefined) return '';
            return this.connection.eventData['onInteractEvent'].name;
        } else if(args.TARGET_MENU == 'type'){
            if(this.connection.eventData['onInteractEvent'].type === undefined) return '';
            return this.connection.eventData['onInteractEvent'].type;
        }
        return "";
    }

    getBreakBlockData(args, util) {
        // まず、this.connection.eventData['onPlayerBlockBreak']がundefinedかどうかをチェック
        if(!this.connection || !this.connection.eventData || !this.connection.eventData['onPlayerBlockBreak']){
            // 適切なエラーメッセージを返すか、または0や空文字を返すなどして処理を終了する
            return 0; // ここは状況に応じて適切な値を返す
        }
    
        if(args.BREAK_BLOCK_MENU == 'name'){
            if(this.connection.eventData['onPlayerBlockBreak'].block['name'] === undefined) return "air";
            return this.connection.eventData['onPlayerBlockBreak'].block['name'];
        } else if(args.BREAK_BLOCK_MENU == 'world'){
            if(this.connection.eventData['onPlayerBlockBreak'].block['world'] === undefined) return "";
            return this.connection.eventData['onPlayerBlockBreak'].block['world'];
        } else if(args.BREAK_BLOCK_MENU == 'x'){
            if(this.connection.eventData['onPlayerBlockBreak'].block['x'] === undefined) return 0;
            return this.connection.eventData['onPlayerBlockBreak'].block['x'];
        } else if(args.BREAK_BLOCK_MENU == 'y'){
            if(this.connection.eventData['onPlayerBlockBreak'].block['y'] === undefined) return 0;
            return this.connection.eventData['onPlayerBlockBreak'].block['y'];
        } else if(args.BREAK_BLOCK_MENU == 'z'){
            if(this.connection.eventData['onPlayerBlockBreak'].block['z'] === undefined) return 0;
            return this.connection.eventData['onPlayerBlockBreak'].block['z'];
        }
        return "";
    }

    getResult (args, util) {
        if (this.connection !== null && this.connection !== undefined) {
            return this.connection.result === undefined ? '' : this.connection.result;
        }
        return '';
    }

    async getPosition (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'getPosition'
                }
            });
            const response = JSON.parse(ret);
            if (response.type === 'result') {
                const data = JSON.parse(response.data);
                this.connection.position = data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async setMark (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'getPosition'
                }
            });
            const response = JSON.parse(ret);
            if (response.type === 'result') {
                const data = JSON.parse(response.data);
                this.connection.marks[args.name] = data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async moveMark (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const pos = this.connection.marks[args.name]
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'teleport',
                    args: ['', pos.x, pos.y, pos.z]
                    }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'なにかにぶつかったよ');
        } catch (error) {
            console.error(error);
        }
    }


    async setItem (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'setItem',
                    args: [args.SLOT, args.NAME]
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async sendEvent(args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'sendEvent',
                    args: [args.TARGET, args.MESSAGE]
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async grabItem (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'grabItem',
                    args: [args.SLOT]
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    async passItem (args, util) {
        const spriteId = util.target.sprite.spriteId;
        try {
            const ret = await this.sendMessage({
                type: 'call',
                data: {
                    name: 'passItem',
                    args: [args.SLOT, args.TARGET]
                }
            });
            //const response = JSON.parse(ret);
            //if (response.data !== "true") this.printLog(spriteId, 'それは壊せなかったよ');
        } catch (error) {
            console.error(error);
        }
    }

    buildingBlocks (type) {
        return type.BLOCK;
    }
    colorBlocks (type) {
        return type.BLOCK;
    }
    natureBlocks (type) {
        return type.BLOCK;
    }
    functionalBlocks (type) {
        return type.BLOCK;
    }
    redstoneBlocks (type) {
        return type.BLOCK;
    }
    toolItems (type) {
        return type.ITEM;
    }

    selector (type) {
        return type.SELECTOR_BLOCK;
    }

}

module.exports = Scratch3hackCraft2;
