import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import ARExample from './ARExample';
import { store, persistor } from './store';

export default class ARApp extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor}>
                    <ARExample />
                </PersistGate>
            </Provider>
        );
    }
}
