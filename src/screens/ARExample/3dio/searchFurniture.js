import callService from './callService';
import normalizeFurnitureInfo from './normalizeFurnitureInfo';

var dimRange = [
    'lengthMin',
    'lengthMax',
    'widthMin',
    'widthMax',
    'heightMin',
    'heightMax'
];
var dimFix = ['length', 'width', 'height'];

export default function searchFurniture(query, options) {
    // API
    options = options || {};
    var limit = options.limit || 50;
    // TODO: add this param once #251 https://github.com/archilogic-com/services/issues/251 is resolved
    //var offset = options.offset || 0

    // internals
    var apiErrorCount = 0;
    var reg;

    var params = {
        searchQuery: {
            // only published furniture & let's make sure we don't have trailing or double spaces
            query: 'isPublished:true ' + query.trim().replace(/\s+/g, ' ')
        },
        limit: 500
        // TODO: add this param once #251 https://github.com/archilogic-com/services/issues/251 is resolved
        //offset: offset
    };

    // extract dimension queries for range search
    dimRange.forEach(function iteratee(key) {
        reg = new RegExp(key + ':([0-9.*]+)');
        if (reg.test(params.searchQuery.query)) {
            // set range queries
            params.searchQuery[key] = parseFloat(
                reg.exec(params.searchQuery.query)[1]
            );
            // cleanup search query
            params.searchQuery.query = params.searchQuery.query
                .replace(reg.exec(params.searchQuery.query)[0], '')
                .trim();
        }
    });

    // extract dimension queries for precise search
    dimFix.forEach(function iteratee(key) {
        reg = new RegExp(key + ':([0-9.*]+)');
        var margin = 0.04;
        if (reg.test(params.searchQuery.query)) {
            var dim = parseFloat(reg.exec(params.searchQuery.query)[1]);
            // set range queries
            params.searchQuery[key + 'Min'] = dim > margin ? dim - margin : dim;
            params.searchQuery[key + 'Max'] = dim + margin;
            // cleanup search query
            params.searchQuery.query = params.searchQuery.query
                .replace(reg.exec(params.searchQuery.query)[0], '')
                .trim();
        }
    });

    // call API
    function callApi() {
        return callService('Product.search', params).then(
            function onSuccess(rawResults) {
                apiErrorCount = 0;
                // normalize furniture data coming from server side endpoint
                return rawResults.map(normalizeFurnitureInfo);
            },
            function onReject(err) {
                console.error('Error fetching furniture:', err);
                // try again 3 times
                return ++apiErrorCount < 3
                    ? callApi()
                    : Promise.reject(
                          'Whoops, that did not work, please try another query.'
                      );
            }
        );
    }
    // expose
    return callApi();
}
