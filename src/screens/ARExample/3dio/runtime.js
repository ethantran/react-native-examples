import domReady from '3dio/src/core/runtime/dom-ready.js';
import now from 'performance-now';

// detect environment
var isNode = !!(
    typeof module !== 'undefined' &&
    module.exports &&
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
);
var isBrowser = false;
var aframeReady = false;
var threeReady = true;

// create runtime object

var runtime = {
    isDebugMode: false,
    isNode: isNode,

    // browser specific

    isBrowser: isBrowser,
    assertBrowser: assertBrowser,
    isMobile: true,
    domReady: domReady,
    isVisible$: true,
    isFocused$: true,

    has: {
        webGl: true,
        aframe: aframeReady,
        three: threeReady
    },

    webGl: {
        maxTextureSize: 2048,
        supportsDds: true
    },

    libInfo: {}
};

export default runtime;

// helpers

function assertBrowser(message) {
    if (!isBrowser) {
        throw message || 'Sorry this feature requires a browser environment.';
    }
}

window.performance = { now };
