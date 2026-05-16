/* eslint-env node */
/* eslint-disable no-console */

const path = require('node:path');

const awaitEvent = require('../util/await-event');
const {resolvePath} = require('./resolve-path');

const setupFileSecurity = (securityManager, permissions) => {
    const canAccessFolder = fileLocation => {
        if (typeof fileLocation !== 'string') throw new TypeError('"fileLocation" must be a string.');
        const location = resolvePath(fileLocation);

        for (let i = 0; i < permissions.fileScope.length; i++) {
            const folder = path.resolve(permissions.fileScope[i]);
            const relative = path.relative(folder, location);
            if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
                return true;
            }
        }
        
        return false;
    };

    /* eslint-disable-next-line prefer-template */
    const warn = (message, last) => process.stdout.write('\n\x1b[93m' + message + '\x1b[0m' + (last ? '' : '\n'));

    // FILE ACCESS

    securityManager.canReadFile = async function (fileLocation) {
        if (!permissions.fileReadAccess) {
            if (!process.stdin.isTTY || !process.stdout.isTTY) return false;

            /* eslint-disable max-len */
            warn('This project wants read access to your filesystem. Allowing read access will mean the project will be able to read ANY file you can.');
            warn('This includes personal documents and files, app settings, passwords saved in the browser, browser cookies, and more.');
            warn('If you don\'t trust this project, or you are not sure, you should not give permission.');
            warn('Are you sure you want to allow filesystem read access? (Y/N)', true);
            /* eslint-enable max-len */

            process.stdin.setRawMode(true);
            const key = (await awaitEvent(process.stdin, 'data'))[0];
            process.stdin.setRawMode(false);
            process.stdout.write(` ${String(key)}\n`);

            if (String(key).toLowerCase() !== 'y') return false;

            if (!permissions.fileReadAccess) permissions.fileReadAccess = true;
        }

        if (!canAccessFolder(fileLocation)) {
            /* eslint-disable max-len */
            warn('The project attempted to read a file outside of the allowed file scope. The read has been prevented.');
            warn('If the project needs to read a file outside the file scope, append "--file-scope /path/to/folder /add/more/folders/if/you/want --" to the command.');
            warn('You should not let the folder read outside of the home folder, unless it is absolutely necessary.');
            /* eslint-enable max-len */
            return false;
        }

        return true;
    };

    securityManager.canWriteFile = async function (fileLocation) {
        if (!permissions.fileWriteAccess) {
            if (!process.stdin.isTTY || !process.stdout.isTTY) return false;

            /* eslint-disable max-len */
            warn('This project wants write access to your filesystem. Allowing write access will mean the project will be able to write to and replace ANY file you can.');
            warn('This includes personal documents and files, program settings, and more.');
            warn('If you don\'t trust this project, or you are not sure, you should not give permission.');
            warn('Are you sure you want to allow filesystem write access? (Y/N)', true);
            /* eslint-enable max-len */

            process.stdin.setRawMode(true);
            const key = (await awaitEvent(process.stdin, 'data'))[0];
            process.stdin.setRawMode(false);
            process.stdout.write(` ${String(key)}\n`);

            if (String(key).toLowerCase() !== 'y') return false;

            if (!permissions.fileWriteAccess) permissions.fileWriteAccess = true;
        }

        if (!canAccessFolder(fileLocation)) {
            /* eslint-disable max-len */
            warn('The project attempted to write to a file outside of the allowed file scope. The write has been prevented.');
            warn('If the project needs to write to a file outside the file scope, append "--file-scope /path/to/folder /add/more/folders/if/you/want --" to the command.');
            warn('You should not let the folder write outside of the home folder, unless it is absolutely necessary.');
            /* eslint-enable max-len */
            return false;
        }

        return true;
    };

    // NETWORK ACCESS

    securityManager.canFetch = async function () {
        if (!permissions.networkAccess) {
            if (!process.stdin.isTTY || !process.stdout.isTTY) return false;

            /* eslint-disable max-len */
            warn('This project wants network access. Allowing network access will mean the project will be able to access ANY website on the internet and ANY website on your local network.');
            warn('This includes websites, your router, your intranet, and more.');
            warn('If you don\'t trust this project, or you are not sure, you should not give permission.');
            warn('Are you sure you want to allow network access? (Y/N)', true);
            /* eslint-enable max-len */

            process.stdin.setRawMode(true);
            const key = (await awaitEvent(process.stdin, 'data'))[0];
            process.stdin.setRawMode(false);
            process.stdout.write(` ${String(key)}\n`);

            if (String(key).toLowerCase() !== 'y') return false;

            if (!permissions.networkAccess) permissions.networkAccess = true;
        }

        return true;
    };
	
	//
const isTrustedExtensionOrigin = url => (
    /* Always trust the official extension repostiories */
  url.startsWith('https://extensions.turbowarp.org/') ||
    url.startsWith('https://extensions.penguinmod.com/') ||
    url.startsWith('https://penguinmod-extensions-gallery.vercel.app/') ||
    url.startsWith('https://gaiamod-main.github.io/') ||
    url.startsWith('https://gaiamod-main.github.io/GaiaMod-Extensions/') ||
    url.startsWith('https://raw.githubusercontent.com/GaiaMod-Main/GaiaMod-Extensions/refs/heads/main/src/extensions/') ||
    url.startsWith('https://raw.githubusercontent.com/champierre/') ||
    url.startsWith('https://snail-ide.js.org/') ||
    url.startsWith('https://snail-ide.vercel.app/') ||
    url.startsWith('https://snail-ide.com/') ||
    url.startsWith('https://editor.snail-ide.com/') ||
    url.startsWith('https://sharkpools-extensions.vercel.app/') || // SharkPool
    url.startsWith('https://sharkpool-sp.github.io/SharkPools-Extensions/') || // SharkPool (github link)
    url.startsWith('https://sharkpools-extensions.vercel.app/extension-code/') || // SharkPool 2
    url.startsWith('https://pen-group.github.io/') || // Pen-Group / ObviousAlexC
    url.startsWith('https://rubyteam.tech/cdn/extensions/') ||
    url.startsWith('https://ruby-devs.vercel.app/gallery/') ||
    url.startsWith('https://ruby-devs.vercel.app/cdn/extensions/') ||
    url.startsWith('https://nmsderp.is-a.dev/') ||
    url.startsWith('https://opensnail.snail-ide.com/api/download/') ||
    url.startsWith('https://raw.githubusercontent.com/Gandi-IDE/custom-extension/refs/heads/main/extensions/QuakeStudio/BetterQuake/') ||
    url.startsWith('https://dumo.is-a.dev/') ||
    url.startsWith('https://ba4x.pro/') ||
    url.startsWith('https://adacraft.notion.site/') ||
    url.startsWith('https://adacraft.org/') ||
    url.startsWith('https://electramod-extensions-gallery.vercel.app/') ||
    url.startsWith('https://electramod.vercel.app/') ||
    url.startsWith('https://streamilator.github.io/') ||
    url.startsWith('https://dinosaurmod.github.io/') ||
    url.startsWith('https://mikedev101.github.io/') ||
    url.startsWith('https://turbololder.vercel.app/') ||
    url.startsWith('https://sayamindu.github.io/scratch-extensions/') ||
    url.startsWith('https://extensions.mistium.com/') ||
    url.startsWith('https://ldsjvg.webwave.dev/') ||
    url.startsWith('https://axolaydev.github.io/') ||
    url.startsWith('https://axolaydev.github.io/extensions/') ||
    url.startsWith('https://raw.githubusercontent.com/axolayDev/extensions/refs/heads/main/resources/extensions/') ||
    url.startsWith('https://p7scratchextensions.pages.dev/ext/') ||
    url.startsWith('https://logiseextensions.netlify.app/') ||
    url.startsWith('https://github.com/DashBlocks/extensions/blob/dff7d864c8e404ac7b028517d281f839c34c4b76/static/extensions/timaaos/') ||
    url.startsWith('https://dashblocks.github.io/extensions/') ||
    url.startsWith('https://raw.githubusercontent.com/khanning/scratch-extensions/master/') ||
    url.startsWith('https://dinosaurmod.github.io/extensions/') ||
    url.startsWith('https://banana-mod.github.io/extensions/') ||
    url.startsWith('https://raw.githubusercontent.com/Logise1123/myextensions/') ||
    url.startsWith('https://raw.githubusercontent.com/Dinosaurmod/extensions/refs/heads/main/src/extensions/') ||
    url.startsWith('https://raw.githubusercontent.com/banana-mod/extensions/refs/heads/main/src/extensions/') ||
    url.startsWith('https://banana-mod.github.io/') ||
    url.startsWith('https://omniblocks.github.io/') ||
    url.startsWith('https://raw.githubusercontent.com/David-Orangemoon/Modified-Extension-Loader-Turbowarp/main/custom%20extensions') ||
    url.startsWith('https://raw.githubusercontent.com/ningqi24/TurbowarpExtension/refs/heads/main/.js/') ||
    url.startsWith('https://editors.astras.top/extensions/') ||
    url.startsWith('https://huggingface.co/datasets/soiz1/my-scratch-ai-extensions/raw/main/') ||

    /* For development */
    url.startsWith('http://localhost:3000') ||
    url.startsWith('http://localhost:8000') ||
    url.startsWith('http://localhost:6000') || // Launcher Home
    url.startsWith('http://localhost:6001') || // Launcher Extensions
    url.startsWith('http://localhost:5173') || // Local Home or Extensions
    url.startsWith('http://localhost:5174') || // Local Home or Extensions
);

    securityManager.canLoadExtensionFromProject = function (url) {
        // Allow trusted hosts.
        if (isTrustedExtensionOrigin(url)) return Promise.resolve(true);

        /* eslint-disable-next-line max-len */
        warn('This project attempted to load an extension from an untrusted host. For security reasons, the extension will not be loaded.');

        return Promise.resolve(false);
    };
};

module.exports = setupFileSecurity;
