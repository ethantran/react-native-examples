import runtime from './runtime';

// decodes Uint8Array to String

// TODO: use StringDecoder in Node environment

// from https://github.com/mrdoob/three.js/blob/master/examples/js/loaders/GLTFLoader.js
function decodeArrayToStringUtf8(a) {
    // FIXME: give this some more testing (i.e. inside gblock component)
    // Avoid the String.fromCharCode.apply(null, array) shortcut, which
    // throws a "maximum call stack size exceeded" error for large arrays.
    for (var i = 0, l = a.length, s = ''; i < l; i++) {
        s += String.fromCharCode(a[i]);
    }
    return s;
}

function decodeArrayToStringUtf16(a) {
    var s = '',
        // ignore any initial character other than '{' = 123 and '[' = 91 (>> bug #9818)
        i = a[0] === 123 || a[1] === 91 ? 0 : 1,
        l20 = a.length - 20,
        l2 = a.length;
    // passing 20 arguments into fromCharCode function provides fastest performance
    // (based on practical performance testing)
    for (; i < l20; i += 20) {
        s += String.fromCharCode(
            a[i],
            a[i + 1],
            a[i + 2],
            a[i + 3],
            a[i + 4],
            a[i + 5],
            a[i + 6],
            a[i + 7],
            a[i + 8],
            a[i + 9],
            a[i + 10],
            a[i + 11],
            a[i + 12],
            a[i + 13],
            a[i + 14],
            a[i + 15],
            a[i + 16],
            a[i + 17],
            a[i + 18],
            a[i + 19]
        );
    }
    // the rest we do char by char
    for (; i < l2; i++) {
        s += String.fromCharCode(a[i]);
    }
    return s;
}

var decodeArrayToStringShims = {
    // UTF-8
    'utf-8': decodeArrayToStringUtf8,
    'UTF-8': decodeArrayToStringUtf8,
    // UTF-16
    'utf-16': decodeArrayToStringUtf16,
    'UTF-16': decodeArrayToStringUtf16
};

function makeArrayToStringDecoder(enc) {
    // use shim
    return decodeArrayToStringShims[enc];
}

// API

var decodeTextArray = {
    utf8: makeArrayToStringDecoder('utf-8'),
    utf16: makeArrayToStringDecoder('utf-16')
};

// expose API

export default decodeTextArray;
