import React, { Component } from 'react';
import { View } from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';

import randomNumber from '../randomNumber';
import TypingText from '../components/TypingText';

const min = 1;
const max = 5;
const texts = Array(2)
    .fill()
    .map(_ => loremipsum({ count: randomNumber(min, max), units: 'words' }));

export default class TypingAnimation extends Component {
    state = { texts };
    render() {
        return (
            <View>
                <TypingText texts={texts} textStyle={{ fontSize: 32 }} />
            </View>
        );
    }
}
