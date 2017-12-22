import runtime from './runtime';
import * as THREE from 'three';

// internals

// graphic card max supported texture size
var MAX_TEXTURE_SIZE = runtime.has.webGl
    ? runtime.webGl.maxTextureSize || 2048
    : 2048;

// helpers

function checkPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value !== 0;
}

function nearestPowerOfTwoOrMaxTextureSize(n) {
    // max texture size supported by vga
    if (n > MAX_TEXTURE_SIZE) {
        return MAX_TEXTURE_SIZE;
    }
    // next best power of two
    var l = Math.log(n) / Math.LN2;
    return Math.pow(2, Math.round(l));
}

function resizeImage(image, url) {
    var width = nearestPowerOfTwoOrMaxTextureSize(image.width);
    var height = nearestPowerOfTwoOrMaxTextureSize(image.height);

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);

    console.log(
        'Image size not compatible. Image has been resized from ' +
            image.width +
            'x' +
            image.height +
            'px to ' +
            canvas.width +
            'x' +
            canvas.height +
            'px.\n' +
            url
    );

    return canvas;
}

// function

export default function fetchImageTexture(url) {
    return new Promise(function(resolve, reject) {
        var loader = new THREE.TextureLoader();

        // load a resource
        loader.load(
            url,

            // onLoad callback
            function(texture) {
                resolve(texture);
            },

            // onProgress callback currently not supported
            undefined,

            // onError callback
            function(err) {
                reject(err);
            }
        );
    });
}
