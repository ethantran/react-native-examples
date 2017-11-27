import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomNumber from '../randomNumber';
import Rect from '../components/AnimatedSvgRect';
import G from '../components/AnimatedSvgG';

const scaleMin = 1;
const scaleMax = 5;
const skewMin = 1;
const skewMax = 5;
const min = 50;
const max = 100;

export default class SvgTransformAnimation extends Component {
    constructor(props) {
        super(props);
        this.originX = new Animated.Value(randomNumber(0, max));
        this.originY = new Animated.Value(randomNumber(0, max));
        this.scaleX = new Animated.Value(randomNumber(scaleMin, scaleMax));
        this.scaleY = new Animated.Value(randomNumber(scaleMin, scaleMax));
        this.skewX = new Animated.Value(randomNumber(skewMin, skewMax));
        this.skewY = new Animated.Value(randomNumber(skewMin, skewMax));
        this.translateX = new Animated.Value(randomNumber(min, max));
        this.translateY = new Animated.Value(randomNumber(min, max));
        this.rotate = new Animated.Value(randomNumber(0, 360));
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        Animated.sequence([
            Animated.spring(this.originX, {
                toValue: randomNumber(0, max)
            }),
            Animated.spring(this.originY, {
                toValue: randomNumber(0, max)
            }),
            Animated.spring(this.scaleX, {
                toValue: randomNumber(scaleMin, scaleMax)
            }),
            Animated.spring(this.scaleY, {
                toValue: randomNumber(scaleMin, scaleMax)
            }),
            Animated.spring(this.skewX, {
                toValue: randomNumber(skewMin, skewMax)
            }),
            Animated.spring(this.skewY, {
                toValue: randomNumber(skewMin, skewMax)
            }),
            Animated.spring(this.translateX, {
                toValue: randomNumber(min, max)
            }),
            Animated.spring(this.translateY, {
                toValue: randomNumber(min, max)
            }),
            Animated.spring(this.rotate, {
                toValue: randomNumber(0, 360)
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <G
                        originX={this.originX}
                        originY={this.originY}
                        scaleX={this.scaleX}
                        scaleY={this.scaleY}
                        skewX={this.skewX}
                        skewY={this.skewY}
                        translateX={this.translateX}
                        translateY={this.translateY}
                        rotate={this.rotate}
                    >
                        <Rect
                            width={width / 2 / scaleMax}
                            height={width / 2 / scaleMax}
                        />
                        <Rect
                            width={width / 2 / scaleMax}
                            height={width / 2 / scaleMax}
                            translateX={width / 2 / scaleMax}
                            fill="red"
                        />
                    </G>
                </Svg>
            </View>
        );
    }
}
