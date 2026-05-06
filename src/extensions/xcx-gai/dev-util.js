/**
 * Whether debug mode is enabled.
 * @type {boolean}
 */
export let DEBUG;

/**
 * Check if debug mode is enabled.
 * @returns {boolean} - true if debug mode is enabled.
 */
export const checkDebugMode = function () {
    if (typeof DEBUG !== 'undefined') {
        return DEBUG;
    }
    try {
        const urlParams = new URLSearchParams(window.location.href.split('?')[1].toLowerCase());
        if (urlParams.get('debug') === 'true' || urlParams.get('debug') === '') {
            DEBUG = true;
        } else {
            DEBUG = false;
        }
    } catch (error) {
        // ignore
    }
    return DEBUG;
};
