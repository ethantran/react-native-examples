import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import reducers from './reducers';

const config = {
    key: 'root',
    storage,
    blacklist: ['ar']
};

const reducer = persistCombineReducers(config, reducers);

export const store = createStore(reducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
