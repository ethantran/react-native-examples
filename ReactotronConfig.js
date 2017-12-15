import { NativeModules } from 'react-native';
import url from 'url';

const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);

let Reactotron;
if (__DEV__) {
    require('reactotron-react-native');
    Reactotron = require('reactotron-react-native').default;
    const reactotronRedux = require('reactotron-redux').reactotronRedux;
    Reactotron.configure({ host: hostname })
        .useReactNative()
        .use(reactotronRedux())
        .connect();
    console.tron = Reactotron;
}
export default Reactotron;
