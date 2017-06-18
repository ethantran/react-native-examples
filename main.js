import Expo from 'expo';
import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Main from './src/screens/Main';
import LolaTravelChat from './src/screens/LolaTravelChat';
import OperatorChat from './src/screens/OperatorChat';

const App = StackNavigator(
  {
    Main: { screen: Main },
    LolaTravelChat: { screen: LolaTravelChat },
    OperatorChat: { screen: OperatorChat },
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
);

Expo.registerRootComponent(App);
