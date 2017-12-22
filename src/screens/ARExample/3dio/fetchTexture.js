import fetchDdsTexture from '3dio/src/aframe/three/data3d-view/set-material/fetch-texture/fetch-dds-texture.js';
import fetchImageTexture from './fetchImageTexture';
import queueManager from '3dio/src/utils/io/common/queue-manager.js';
import PromiseCache from '3dio/src/utils/promise-cache.js';

var cache = new PromiseCache();

var fetchTextureByType = {
    '.dds': fetchDdsTexture,
    '.jpg': fetchImageTexture,
    '.jpeg': fetchImageTexture,
    '.jpe': fetchImageTexture,
    '.png': fetchImageTexture,
    '.gif': fetchImageTexture,
    '.svg': fetchImageTexture
};

export default function fetchTexture(url, queueName) {
    // internals
    var cacheKey = url;

    // try cache
    var promiseFromCache = cache.get(cacheKey);
    if (promiseFromCache) {return promiseFromCache;}

    // get file extension
    var extSearch = url.match(/\.[A-Za-z]+(?=\?|$)/i);
    var type = extSearch ? extSearch[0].toLowerCase() : '.jpg';

    if (!fetchTextureByType[type]) {
        // unknown texture type. fallback to JPG
        console.warn(
            'Unknown texture type ' + type + '. Trying to load as JPG.'
        );
        type = '.jpg';
    }

    var promise = queueManager
        .enqueue(queueName, url)
        .then(function() {
            return fetchTextureByType[type](url);
        })
        .then(function(texture) {
            queueManager.dequeue(queueName, url);
            return texture;
        })
        .catch(function(error) {
            queueManager.dequeue(queueName, url);
            return Promise.reject(error);
        });

    // add to cache
    cache.add(cacheKey, promise);

    return promise;
}
