import Expo from 'expo';
import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Main from './src/screens/Main';
import LolaTravelConv1 from './src/screens/LolaTravelConv1';

const App = StackNavigator(
  {
    Main: { screen: Main },
    LolaTravelConv1: { screen: LolaTravelConv1 }
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
);

Expo.registerRootComponent(App);
