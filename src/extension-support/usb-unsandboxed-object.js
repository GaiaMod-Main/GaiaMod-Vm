const ContextMenuContext = require('./context-menu-context');
const hasOwn_ = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
/* eslint-disable no-undefined */
const catchError_ = (promise, errors) => {
    if (!(promise instanceof Promise)) {
        throw new TypeError('Expected "promise" to be PromiseLike.');
    }
    if (errors !== undefined) {
        if (!Array.isArray(errors)) {
            throw new TypeError('Expected "errors" to be undefined or an array.');
        }
        if (!errors[0]) {
            throw new RangeError('Expected "errors" array to be bigger than 0.');
        }
    }
    return promise.then(v => [undefined, v]).catch(e => {
        if (
            errors !== undefined ||
            !errors.some(p => (e instanceof p))
        ) return;
        return [e, undefined];
    });
};
/* eslint-enable no-undefined */

module.exports = function (vm, isAprematureLoad) {
    const vmD = require('../exports');

    return {
        json: {
            five: vmD.modules.json5(),
            extendedjson: vmD.modules.tw_json(),
            Clone: require('../util/cast').Clone
        },

        base64: vmD.modules.base64_js(),
        immutable: vmD.modules.immutable(),

        Math: vmD.util.Math(),
        Strings: vmD.util.String(),
        Clone: vmD.util.Clone(),
        Color: vmD.util.Color(),
        Cast: vmD.util.Cast(),

        customTypes: {
            register: (typeId, registration) => vm.runtime.registerCustomType(typeId, registration),
            registerFromClass: (typeId, classConstructor, options) =>
                vm.runtime.registerCustomTypeFromClass(typeId, classConstructor, options),
            unregister: typeId => vm.runtime.unregisterCustomType(typeId),
            list: () => vm.runtime.getCustomTypeIds()
        },

        resolves: vm.resolversTool,

        helpers: Object.assign({
            hasOwn: hasOwn_,
            catchError: catchError_,

            uid: vmD.help.uid(),
            xmlEscape: vmD.help.xmlEscape(),
            maybeFormatMessage: vmD.help.maybeFormatMessage()
        }, vmD.flow()),

        vmd: vmD,

        isAprematureLoad,
        ContextMenuContext
    };
};
