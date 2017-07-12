import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomColor from '../randomColor';
import FlubberPath from '../components/AnimatedSvgFlubberPath';
import { d as GithubIconSvgPath } from '../components/GithubIconSvgPath';
import { d as TwitterIconSvgPath } from '../components/TwitterIconSvgPath';

const fromShape = GithubIconSvgPath;
const toShape = TwitterIconSvgPath;
const interpolatorType = 'interpolate';
const options = { maxSegmentLength: 1 };

export default class SvgFlubberAnimation extends Component {
    constructor(props) {
        super(props);
        this.t = new Animated.Value(Math.random());
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        Animated.parallel([
            Animated.spring(this.t, {
                toValue: this.t.__getValue() === 0 ? 1 : 0
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <FlubberPath
                        t={this.t}
                        interpolatorType={interpolatorType}
                        options={options}
                        fromShape={fromShape}
                        toShape={toShape}
                        fill="none"
                        stroke={randomColor()}
                        strokeWidth={5}
                    />
                </Svg>
            </View>
        );
    }
}
