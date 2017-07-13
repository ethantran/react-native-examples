import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import SvgInterpolatePointAtLength from '../components/AnimatedSvgInterpolatePointAtLength';
import { d as TwitterIconSvgPath } from '../components/TwitterIconSvgPath';

const d = TwitterIconSvgPath;

export default class SvgInterpolatePointAlongPathAnimation extends Component {
    constructor(props) {
        super(props);
        this.t = new Animated.Value(0);
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        Animated.parallel([
            Animated.timing(this.t, {
                toValue: this.t.__getValue() === 0 ? 1 : 0,
                duration: 5000
            })
        ]).start(() => this.animate());
    }

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Svg.Path d={d} fill="none" stroke="black" />
                    <SvgInterpolatePointAtLength d={d} t={this.t} r={12} />
                </Svg>
            </View>
        );
    }
}
