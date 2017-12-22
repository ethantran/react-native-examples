import runtime from './runtime';
import configs from './configs';
import JsonRpc2Client from './JsonRpc2Client';
// import cache from './common/promise-cache.js'

// internals
var rpcClient = new JsonRpc2Client();

// main

// TODO: add api.onMethod('methodName')
// TODO: add api.onNotification('methodName')

export default function callService(methodName, params, options) {
    // API
    params = params || {};
    options = options || {};
    var secretApiKey = options.secretApiKey || configs.secretApiKey;
    var publishableApiKey =
        options.publishableApiKey || configs.publishableApiKey;

    // try cache
    // var cacheKey
    // if (useCache) {
    //   cacheKey = JSON.stringify([methodName, params, options])
    //   var promiseFromCache = cache.get(cacheKey)
    //   if (promiseFromCache) {
    //     return promiseFromCache
    //   }
    // }

    // internals
    var rpcRequest = rpcClient.createRequest(methodName, params);

    sendHttpRequest(rpcRequest, secretApiKey, publishableApiKey);

    // add to cache
    // if (useCache) {
    //   cache.add(cacheKey, rpcRequest.promise)
    // }

    return rpcRequest.promise;
}

// private

function handleError(error, additionalInfo) {
    console.warn(error || 'API Connection Error', additionalInfo);
}

function handleIncomingMessage(event) {
    var message;
    try {
        message = JSON.parse(event.data);
    } catch (e) {
        // non-valid JSON
        handleError('Incoming message is not valid JSON format.', event.data);
        return;
    }

    if (message && !message.method) {
        // has no method = it's a response
        rpcClient.handleResponse(message);
    } else if (message.method) {
        if (message.id) {
            // method call
            // TODO: trigger onMethod event
        } else {
            // notification call
            // TODO: trigger onNotification event
        }
    }
}

function sendHttpRequest(rpcRequest, secretApiKey, publishableApiKey) {
    var isTrustedOrigin = true;
    var headers = { 'Content-Type': 'application/json' };
    if (secretApiKey) {
        headers['X-Secret-Key'] = secretApiKey;
    }
    if (publishableApiKey) {
        headers['X-Publishable-Key'] = publishableApiKey;
    }

    // send request
    fetch(configs.servicesUrl, {
        body: JSON.stringify(rpcRequest.message),
        method: 'POST',
        headers: headers,
        credentials: isTrustedOrigin ? 'include' : 'omit' //TODO: Find a way to allow this more broadly yet safely
    })
        .then(function(response) {
            return response
                .text()
                .then(function onParsingSuccess(body) {
                    // try to parse JSON in any case because valid JSON-RPC2 errors do have error status too
                    var message;
                    try {
                        message = JSON.parse(body);
                    } catch (error) {
                        return Promise.reject(
                            'JSON parsing Error: "' +
                                error +
                                '" Response body: "' +
                                body +
                                '"'
                        );
                    }
                    // rpc client will handle JSON-RPC2 success messages and errors and resolve or reject prcRequest promise accordingly
                    rpcClient.handleResponse(message);
                })
                .catch(function onParsingError(error) {
                    var errorString = '';
                    if (error instanceof Error || typeof error === 'string') {
                        errorString = error;
                    } else {
                        try {
                            errorString = JSON.stringify(error, null, 2);
                        } catch (e) {
                            errorString =
                                error && error.toString ? error.toString() : '';
                        }
                    }
                    // response is not a valid json error message. (most likely a network error)
                    var errorMessage =
                        'API request to ' +
                        configs.servicesUrl +
                        ' failed: ' +
                        response.status +
                        ': ' +
                        response.statusText +
                        '\n' +
                        errorString +
                        '\nOriginal JSON-RPC2 request to 3d.io: ' +
                        JSON.stringify(rpcRequest.message, null, 2);
                    rpcRequest.cancel(errorMessage);
                });
        })
        .catch(function(error) {
            rpcRequest.cancel(
                'Error sending request to 3d.io API: "' +
                    (error.code || JSON.stringify(error)) +
                    '"'
            );
        });
}
