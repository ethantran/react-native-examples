import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import Rect from '../components/AnimatedSvgRect';

export default class SvgRectAnimation extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        this.width = new Animated.Value(randomNumber(50, width));
        this.height = new Animated.Value(randomNumber(50, height));
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        const { width, height } = Dimensions.get('window');
        Animated.parallel([
            Animated.spring(this.width, {
                toValue: randomNumber(50, width)
            }),
            Animated.spring(this.height, {
                toValue: randomNumber(50, height)
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Rect
                        stroke={randomColor()}
                        fill={randomColor()}
                        width={this.width}
                        height={this.height}
                    />
                </Svg>
            </View>
        );
    }
}
