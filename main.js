import Expo from 'expo';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Main from './src/screens/Main';
import LolaTravelChat from './src/screens/LolaTravelChat';
import OperatorChat from './src/screens/OperatorChat';
import FlipboardCover from './src/screens/FlipboardCover';
import SnapchatSearch from './src/screens/SnapchatSearch';
import AnchorWalkthrough from './src/screens/AnchorWalkthrough';

const App = StackNavigator(
  {
    Main: { screen: Main },
    LolaTravelChat: { screen: LolaTravelChat },
    OperatorChat: { screen: OperatorChat },
    FlipboardCover: { screen: FlipboardCover },
    SnapchatSearch: { screen: SnapchatSearch },
    AnchorWalkthrough: { screen: AnchorWalkthrough }
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
);

Expo.registerRootComponent(App);
