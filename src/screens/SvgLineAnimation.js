import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import Line from '../components/AnimatedSvgLine';

export default class SvgLineAnimation extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        this.x1 = new Animated.Value(randomNumber(0, width));
        this.y1 = new Animated.Value(randomNumber(0, height));
        this.x2 = new Animated.Value(randomNumber(0, width));
        this.y2 = new Animated.Value(randomNumber(0, height));
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        const { width, height } = Dimensions.get('window');
        Animated.parallel([
            Animated.spring(this.x1, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.y1, {
                toValue: randomNumber(0, height)
            }),
            Animated.spring(this.x2, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.y2, {
                toValue: randomNumber(0, height)
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Line
                        stroke={randomColor()}
                        x1={this.x1}
                        y1={this.y1}
                        x2={this.x2}
                        y2={this.y2}
                    />
                </Svg>
            </View>
        );
    }
}
