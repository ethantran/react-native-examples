import log from 'js-logger';
import runtime from './runtime';

// default configs values

var defaults = Object.freeze({
    logLevel: 'warn',
    publishableApiKey: '82e4ae99-0351-4605-9ce9-ddab0753e741',
    secretApiKey: '189c0af0-b56d-4d2e-9f66-0e98521c91e8',
    servicesUrl: 'https://spaces.archilogic.com/api/v2',
    storageDomain: 'storage.3d.io',
    storageDomainNoCdn: 'storage-nocdn.3d.io'
});

// constants

var LOG_STRING_TO_ENUM = {
    error: log.ERROR,
    warn: log.WARN,
    info: log.INFO,
    debug: log.DEBUG
};

// main

var configs = function configs(args) {
    if (!args) {
        // no arguments: return copy of configs object
        return JSON.parse(JSON.stringify(this));
    }

    // apply log level if among arguments
    if (args.logLevel) {
        setLogLevel(args.logLevel);
        delete args.logLevel;
    }

    // prevent secret API key to be included in browser environments
    if (runtime.isBrowser && args.secretApiKey) {
        log.error(
            'The secret API key is not supposed to be used in browser environments!\nPlease see https://3d.io/docs/api/1/get-started-browser.html#secret-api-key for more information.'
        );
    }

    // simply copy over the other configs
    var key,
        keys = Object.keys(args);
    for (var i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        if (defaults[key] !== undefined) {
            configs[key] = args[key];
        } else {
            log.warn(
                'Unknown config param "' +
                    key +
                    '". Available params are: ' +
                    Object.keys(defaults).join(', ')
            );
        }
    }

    return this;
};

// private methods

function setLogLevel(val) {
    // update logger
    var logLevelEnum = LOG_STRING_TO_ENUM[val];
    if (logLevelEnum) {
        // set log level
        log.setLevel(logLevelEnum);
        configs.logLevel = val;
    } else {
        // handle error
        var errorMessage =
            'Unknown log level "' +
            val +
            '". Possible are: "' +
            Object.keys(LOG_STRING_TO_ENUM).join('", "') +
            '". ';
        if (configs.logLevel) {
            // do not change current log level
            errorMessage += 'Log level remains "' + configs.logLevel;
        } else {
            // set default log level
            var defaultVal = defaults.logLevel;
            errorMessage += 'Fallback to default "' + defaultVal + '".';
            log.setLevel(LOG_STRING_TO_ENUM[defaultVal]);
            configs.logLevel = defaultVal;
        }
        console.error(errorMessage);
    }
}

// init

configs(JSON.parse(JSON.stringify(defaults)));

// api

export default configs;
