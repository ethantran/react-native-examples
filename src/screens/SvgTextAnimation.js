import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import Text from '../components/AnimatedSvgText';

const min = 1;
const max = 50;
const text = 'abc';

export default class SvgTextAnimation extends Component {
    constructor(props) {
        super(props);
        this.dx = Array(text.length)
            .fill()
            .map(_ => new Animated.Value(randomNumber(min, max)));
        this.dy = Array(text.length)
            .fill()
            .map(_ => new Animated.Value(randomNumber(min, max)));
        this.fontSize = new Animated.Value(randomNumber(12, 50));
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        Animated.parallel([
            ...this.dx.map(animValue =>
                Animated.spring(animValue, {
                    toValue: randomNumber(min, max)
                })
            ),
            ...this.dy.map(animValue =>
                Animated.spring(animValue, {
                    toValue: randomNumber(min, max)
                })
            ),
            Animated.spring(this.fontSize, {
                toValue: randomNumber(12, 50)
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Text
                        stroke={randomColor()}
                        fill={randomColor()}
                        dx={this.dx}
                        dy={this.dy}
                        fontSize={this.fontSize}
                    >
                        {text}
                    </Text>
                </Svg>
            </View>
        );
    }
}
