const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const ProjectPermissionManager = require('../../util/project-permissions');
// const Cast = require('../../util/cast');

const EffectOptions = {
    acceptReporters: true,
    items: [
        { text: "color", value: "color" },
        { text: "grayscale", value: "grayscale" },
        { text: "brightness", value: "brightness" },
        { text: "contrast", value: "contrast" },
        { text: "ghost", value: "ghost" },
        { text: "blur", value: "blur" },
        { text: "invert", value: "invert" },
        { text: "saturate", value: "saturate" },
        { text: "sepia", value: "sepia" }
    ]
};

const urlToReportUrl = (url) => {
    let urlObject;
    try {
        urlObject = new URL(url);
    } catch {
        // we cant really throw an error in this state since it halts any blocks
        // or return '' since thatll just confuse the api likely
        // so just use example.com
        return 'example.com';
    }
    // use host name
    return urlObject.hostname;
};

// to avoid taking 1290 years for each url set
// we save the ones that we already checked
const safeOriginUrls = {};

/**
 * uhhhhhhhhhh
 * @param {Array} array the array
 * @param {*} value the value
 * @returns {Object} an object
 */
const ArrayToValue = (array, value) => {
    const object = {};
    array.forEach(item => {
        object[String(item)] = value;
    });
    return object;
};

const isUrlRatedSafe = (url) => {
    return new Promise((resolve) => {
        const saveUrl = urlToReportUrl(url);
        if (safeOriginUrls.hasOwnProperty(saveUrl)) {
            return resolve(safeOriginUrls[saveUrl]);
        }

        fetch(`https://sn-bapi.vercel.app/api/safeurl?url=${saveUrl}`).then(res => {
            if (!res.ok) {
                resolve(true);
                return;
            }
            res.json().then(status => {
                safeOriginUrls[saveUrl] = status.safe;
                resolve(status.safe);
            }).catch(() => resolve(true));
        }).catch(() => resolve(true));
    })
}

/**
 * Class for IFRAME blocks
 * @constructor
 */
class nmsderpMaps {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.createdIframe = null;
        this.iframeSettings = {
            x: 0,
            y: 0,
            rotation: 90,
            width: 480,
            height: 360
        };
        this.iframeFilters = ArrayToValue(EffectOptions.items.map(item => item.value), 0);
        this.iframeLoadedValue = false;
        this.permission_AllowedWebsites = [];
        this.displayWebsiteUrl = "";
        this.runtime.on('PROJECT_STOP_ALL', () => {
            // stop button clicked so delete the iframe
            this.RemoveIFrame();
        });
    }

    /**
     * dummy function for reseting user provided permisions when a save is loaded
     */
    deserialize () {
        this.permission_AllowedWebsites = [];
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'nmsderpMap',
            name: 'Maps',
            color1: '#F36518',
            color2: '#E64D18',
            blocks: [
                {
                    opcode: 'createMap',
                    text: formatMessage({
                        id: 'nmsderpmap.blocks.createMap',
                        default: 'create new map',
                        description: 'im too lazy to write these anymore tbh'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'deleteMap',
                    text: formatMessage({
                        id: 'nmsderpmap.blocks.deleteMap',
                        default: 'delete map',
                        description: 'im too lazy to write these anymore tbh'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'showMap',
                    text: formatMessage({
                        id: 'nmsderpmap.blocks.showMap',
                        default: 'show map',
                        description: 'im too lazy to write these anymore tbh'
                    }),
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'hideMap',
                    text: formatMessage({
                        id: 'jnmsderpmap.blocks.hideMap',
                        default: 'hide iframe',
                        description: 'im too lazy to write these anymore tbh'
                    }),
                    blockType: BlockType.COMMAND
                },
            ],
            menus: {
                effects: EffectOptions
            }
        };
    }
    // permissions
    async IsWebsiteAllowed (url) {
        if (ProjectPermissionManager.IsDataUrl(url)) return true;
        if (!ProjectPermissionManager.IsUrlSafe(url)) return false;
        const safe = await isUrlRatedSafe(url);
        return safe;
    }

    // utilities
    GetCurrentCanvas () {
        return this.runtime.renderer.canvas;
    }
    createMap () {
        const iframe = document.createElement("iframe");
        iframe.onload = () => {
            this.iframeLoadedValue = true;
        };
        this.createdIframe = iframe;
        return iframe;
    }
    deleteMap () {
        if (this.createdIframe) {
            this.createdIframe.remove();
            this.createdIframe = null;
        }
    }
    GetIFrameState () {
        if (this.createdIframe) {
            return true;
        }
        return false;
    }
    SetIFramePosition (iframe, x, y, width, height, rotation) {
        const frame = iframe;
        const stage = {
            width: this.runtime.stageWidth,
            height: this.runtime.stageHeight
        };
        frame.style.position = "absolute"; // position above canvas without pushing it down
        frame.style.width = `${(width / stage.width) * 100}%`; // convert pixel size to percentage for full screen
        frame.style.height = `${(height / stage.height) * 100}%`;
        frame.style.transformOrigin = "center center"; // rotation and translation begins at center

        let xpos = x + (stage.width - width);
        let ypos = y - (stage.height - height);
        xpos = ((xpos / stage.width) * 100);
        ypos = (((0 - ypos) / stage.height) * 100);

        // epic maths to place x and y at the center
        frame.style.transform = `translate(${xpos}%, ${ypos}%) rotate(${rotation - 90}deg)`; 
        this.iframeSettings = {
            x: x,
            y: y,
            rotation: rotation,
            width: width,
            height: height
        };

        // when switching between project page & editor, we need to place the iframe again since it gets lost
        if (iframe.parentElement !== this.GetCurrentCanvas().parentElement) {
            /* todo: create layers so that iframe appears above 3d every time this is done */
            this.GetCurrentCanvas().parentElement.prepend(iframe);
        }
    }
    GenerateCssFilter (color, grayscale, brightness, contrast, ghost, blur, invert, saturate, sepia) {
        return `hue-rotate(${(color / 200) * 360}deg) ` + // scratch color effect goes back to normal color at 200
            `grayscale(${grayscale}%) ` +
            `brightness(${brightness + 100}%) ` + // brightness at 0 will be 100
            `contrast(${contrast + 100}%) ` + // same thing here
            `opacity(${100 - ghost}%) ` + // opacity at 0 will be 100 but opacity at 100 will be 0
            `blur(${blur}px) ` +
            `invert(${invert}%) ` + // invert is actually a percentage lolol!
            `saturate(${saturate + 100}%) ` + // saturation at 0 will be 100
            `sepia(${sepia}%)`;
    }
    ApplyFilterOptions (iframe) {
        iframe.style.filter = this.GenerateCssFilter(
            this.iframeFilters.color,
            this.iframeFilters.grayscale,
            this.iframeFilters.brightness,
            this.iframeFilters.contrast,
            this.iframeFilters.ghost,
            this.iframeFilters.blur,
            this.iframeFilters.invert,
            this.iframeFilters.saturate,
            this.iframeFilters.sepia,
        );
    }

    createMap () {
        this.deleteMap();
        const iframe = this.createMap();
        iframe.style.zIndex = 500;
        iframe.style.borderWidth = "0px";
        iframe.src = "data:text/html;charset=utf-8;base64,PGh0bWw+DQogICAgICAgICAgIDxoZWFkPg0KICAgICAgICAgICAgICA8dGl0bGU+T1NNIGFuZCBMZWFmbGV0PC90aXRsZT4NCiAgICAgICAgICAgICAgPGxpbmsgcmVsID0gInN0eWxlc2hlZXQiIGhyZWYgPSAiaHR0cDovL2Nkbi5sZWFmbGV0anMuY29tL2xlYWZsZXQtMC43LjMvbGVhZmxldC5jc3MiLz4NCiAgICAgICAgICAgPC9oZWFkPg0KPGJvZHk+DQogICAgICAgICAgICAgIDxkaXYgaWQgPSAibWFwIiBzdHlsZSA9ICJ3aWR0aDogOTAwcHg7IGhlaWdodDogNTgwcHgiPjwvZGl2Pg0KPHNjcmlwdCBzcmMgPSAiaHR0cDovL2Nkbi5sZWFmbGV0anMuY29tL2xlYWZsZXQtMC43LjMvbGVhZmxldC5qcyI+PC9zY3JpcHQ+DQogICAgICAgICAgICAgIDxzY3JpcHQ+DQogICAgICAgICAgICAgICAgIC8vIENyZWF0aW5nIG1hcCBvcHRpb25zDQogICAgICAgICAgICAgICAgIHZhciBtYXBPcHRpb25zID0gew0KICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IFsxNy4zODUwNDQsIDc4LjQ4NjY3MV0sDQogICAgICAgICAgICAgICAgICAgIHpvb206IDEwDQogICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgDQogICAgICAgICAgICAgICAgIC8vIENyZWF0aW5nIGEgbWFwIG9iamVjdA0KICAgICAgICAgICAgICAgICB2YXIgbWFwID0gbmV3IEwubWFwKCdtYXAnLCBtYXBPcHRpb25zKTsNCiAgICAgICAgICAgICAgICAgDQogICAgICAgICAgICAgICAgIC8vIENyZWF0aW5nIGEgTGF5ZXIgb2JqZWN0DQogICAgICAgICAgICAgICAgIHZhciBsYXllciA9IG5ldyBMLlRpbGVMYXllcignaHR0cDovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZycpOw0KICAgICAgICAgICAgICAgICANCiAgICAgICAgICAgICAgICAgLy8gQWRkaW5nIGxheWVyIHRvIHRoZSBtYXANCiAgICAgICAgICAgICAgICAgbWFwLmFkZExheWVyKGxheWVyKTsNCiAgICAgICAgICAgICAgPC9zY3JpcHQ+DQogICAgICAgICAgIDwvYm9keT4NCiAgICAgICAgICAgDQogICAgICAgIDwvaHRtbD4=";
        this.displayWebsiteUrl = iframe.src;
        // positions iframe to fit stage
        this.SetIFramePosition(iframe, 0, 0, this.runtime.stageWidth, this.runtime.stageHeight, 90); 
        this.iframeFilters = ArrayToValue(EffectOptions.items.map(item => item.value), 0); // reset all filter stuff
        this.GetCurrentCanvas().parentElement.prepend(iframe); // adds the iframe above the canvas
        return iframe;
    }
    deleteMap () {
        this.deleteMap();
    }
    iframeElementExists () {
        return this.GetIFrameState();
    }
    setIframeUrl (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        let usingProxy = false;
        let checkingUrl = args.URL;
        if (String(args.URL).startsWith("proxy://")) {
            // use the penguin mod proxy but still say we are on proxy:// since its what the user input
            // replace proxy:// with https:// though since we are still using the https protocol
            usingProxy = true;
            checkingUrl = String(args.URL).replace("proxy://", "https://");
        }
        this.IsWebsiteAllowed(checkingUrl).then(safe => {
            if (!safe) { // website isnt in the permitted sites list?
                this.createdIframe.src = "about:blank";
                this.displayWebsiteUrl = args.URL;
                return;
            }
            this.createdIframe.src = (usingProxy ? `https://detaproxy-1-s1965152.deta.app/?url=${String(args.URL).replace("proxy://", "https://")}` : args.URL);
            // tell the user we are on proxy:// still since it looks nicer than the disgusting deta url
            this.displayWebsiteUrl = (usingProxy ? `${String(this.createdIframe.src).replace("https://detaproxy-1-s1965152.deta.app/?url=https://", "proxy://")}` : this.createdIframe.src);
        })
    }
    setIframePosLeft (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        const iframe = this.createdIframe;
        this.SetIFramePosition(iframe,
            args.X,
            this.iframeSettings.y,
            this.iframeSettings.width,
            this.iframeSettings.height,
            this.iframeSettings.rotation,
        );
    }
    setIframePosTop (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        const iframe = this.createdIframe;
        this.SetIFramePosition(iframe,
            this.iframeSettings.x,
            args.Y,
            this.iframeSettings.width,
            this.iframeSettings.height,
            this.iframeSettings.rotation,
        );
    }
    setIframeSizeWidth (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        const iframe = this.createdIframe;
        this.SetIFramePosition(iframe,
            this.iframeSettings.x,
            this.iframeSettings.y,
            args.WIDTH,
            this.iframeSettings.height,
            this.iframeSettings.rotation,
        );
    }
    setIframeSizeHeight (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        const iframe = this.createdIframe;
        this.SetIFramePosition(iframe,
            this.iframeSettings.x,
            this.iframeSettings.y,
            this.iframeSettings.width,
            args.HEIGHT,
            this.iframeSettings.rotation,
        );
    }
    setIframeRotation (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        const iframe = this.createdIframe;
        this.SetIFramePosition(iframe,
            this.iframeSettings.x,
            this.iframeSettings.y,
            this.iframeSettings.width,
            this.iframeSettings.height,
            args.ROTATE,
        );
    }
    showIframeElement () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        const iframe = this.createdIframe;
        iframe.style.display = "";
    }
    hideIframeElement () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        const iframe = this.createdIframe;
        iframe.style.display = "none";
    }

    getIframeLeft () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        return this.iframeSettings.x;
    }
    getIframeTop () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        return this.iframeSettings.y;
    }
    getIframeWidth () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        return this.iframeSettings.width;
    }
    getIframeHeight () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        return this.iframeSettings.height;
    }
    getIframeRotation () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        return this.iframeSettings.rotation;
    }
    getIframeTargetUrl () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        return this.displayWebsiteUrl;
    }
    iframeElementIsHidden () {
        if (!this.GetIFrameState()) return false; // iframe doesnt exist, stop
        return this.createdIframe.style.display === "none";
    }

    whenIframeIsLoaded () {
        const value = this.iframeLoadedValue;
        this.iframeLoadedValue = false;
        return value;
    }

    // effect functions lolol
    iframeElementSetEffect (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        this.iframeFilters[args.EFFECT] = Number(args.AMOUNT);
        this.ApplyFilterOptions(this.createdIframe);
    }
    iframeElementChangeEffect (args) {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        this.iframeFilters[args.EFFECT] += Number(args.AMOUNT);
        this.ApplyFilterOptions(this.createdIframe);
    }
    iframeElementClearEffects () {
        if (!this.GetIFrameState()) return; // iframe doesnt exist, stop
        this.iframeFilters = ArrayToValue(EffectOptions.items.map(item => item.value), 0); // reset all values to 0
        this.ApplyFilterOptions(this.createdIframe);
    }
    getIframeEffectAmount (args) {
        if (!this.GetIFrameState()) return 0; // iframe doesnt exist, stop
        return this.iframeFilters[args.EFFECT];
    }
}

module.exports = nmsderpMaps;
