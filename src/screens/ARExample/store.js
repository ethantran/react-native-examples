import { createStore as reduxCreateStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import reducers from './reducers';

const config = {
    key: 'root',
    storage,
    blacklist: ['ar', 'hudSelection', 'polyObject3Ds']
};

const reducer = persistCombineReducers(config, reducers);

let createStore = reduxCreateStore;

// if (__DEV__) {
//     require('reactotron-react-native');
//     //$FlowFixMe
//     const Reactotron = require('reactotron-react-native').default;
//     createStore = Reactotron.createStore;
// }

export const store = createStore(reducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
