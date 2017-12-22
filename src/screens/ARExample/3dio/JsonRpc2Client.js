import runtime from './runtime';
import uuid from '3dio/src/utils/uuid.js';

// main

export default function JsonRpc2Client() {
    this._openRequests = {}; // open request cache (indexed by request id)
    this._closedRequestIds = [];
}

JsonRpc2Client.prototype = {
    // private methods

    _handleError: function(message, additionalInfo) {
        console.error(message, additionalInfo);
    },

    _closeRequest: function(id) {
        // remove request from open request cache
        delete this._openRequests[id];
        // remember closed request
        this._closedRequestIds.push(id);
    },

    // public methods

    createRequest: function(methodName, params) {
        var self = this;

        var id = uuid.generate();
        var timestamp = Date.now();
        var message = {
            jsonrpc: '2.0',
            method: methodName,
            params: params,
            id: id
        };
        var request = {
            id: id,
            message: message,
            timestamp: timestamp
        };
        var promise = new Promise(function(resolve, reject) {
            request._resolve = resolve;
            request._reject = reject;
            request.cancel = reject;
        });
        request.promise = promise;

        // remember open request
        self._openRequests[id] = request;

        // handle closing of request independent of promise fate
        promise
            .finally(function() {
                self._closeRequest(id);
            })
            .catch(function() {
                self._closeRequest(id);
            });

        // return request
        return request;
    },

    handleResponse: function(response) {
        var id = response.id;
        var request = this._openRequests[id];

        if (id === undefined) {
            // not valid JSON-RPC2 response
            if (runtime.isDebugMode)
                {console.error(
                    'Incoming message is not a valid JSON-RPC2 response (ID should be present as string, number or null).',
                    response
                );}
        } else if (request) {
            // response to an open request
            if (response.error) {
                if (response.error.message) {
                    // valid JSON-RPC2 error message. log only in debug mode
                    if (runtime.isDebugMode)
                        {console.error(
                            'API error response: "' +
                                response.error.message +
                                '"\nResponse JSON-RPC2 ID: ' +
                                id +
                                '\nOriginal JSON-RPC2 request: ' +
                                JSON.stringify(request.message, null, 2)
                        );}
                    request._reject(response.error.message);
                } else {
                    // non-standard (unexpected) error: log everything into console
                    console.error(
                        'API error (not JSON-RPC2 standard): ' +
                            JSON.stringify(response) +
                            '\nOriginal JSON-RPC2 request: ' +
                            JSON.stringify(request.message, null, 2)
                    );
                    request._reject(
                        'Undefined Error. Check console for details.'
                    );
                }
            } else {
                // success
                request._resolve(response.result);
            }
        } else if (this._closedRequestIds.indexOf(id) !== -1) {
            // Request has been closed already or timed out
            if (runtime.isDebugMode)
                {console.error(
                    'JSON-RPC2 request has already been responded, canceled or timed out.',
                    id
                );}
        } else if (id === null) {
            // id = null (valid according to JSON-RPC2 specs. but can not be matched with request. should be avoided!)
            if (runtime.isDebugMode)
                {console.error(
                    'Incoming JSON-RPC2 response has ID = null.',
                    response
                );}
        } else {
            // unknown id
            if (runtime.isDebugMode)
                {console.error(
                    'Incoming JSON-RPC2 response has an unknown ID.',
                    id
                );}
        }
    }
};
