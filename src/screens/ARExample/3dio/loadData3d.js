import decodeBinary from './decodeBinary';
import PromiseCache from '3dio/src/utils/promise-cache.js';

// private shared

var cache = new PromiseCache();

// main

export default async function loadData3d(url, options) {
    // prevent loading of unsupported formats
    if (url.indexOf('data3d.buffer') < 0) {
        return Promise.reject(url + ' no data3d');
    }
    // try cache
    var cacheKey = url;
    var promiseFromCache = cache.get(cacheKey);
    if (promiseFromCache) {
        return promiseFromCache;
    }

    // fetch
    // var promise = fetch(url, options)
    var promise = getArrayBuffer(url).then(function(buffer) {
        return decodeBinary(buffer, { url: url });
    });

    // add to cache
    cache.add(cacheKey, promise);

    return promise;
}

function getArrayBuffer(url) {
    return new Promise((accept, reject) => {
        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';

        req.onload = function(event) {
            var resp = req.response;
            if (resp) {
                accept(resp);
            }
        };

        req.onerror = function() {
            reject({ request: req });
        };

        req.send(null);
    });
}
