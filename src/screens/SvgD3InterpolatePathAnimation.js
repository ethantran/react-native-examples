import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomColor from '../randomColor';
import InterpolatePath from '../components/AnimatedSvgD3InterpolatePath';

const d1 = 'm72.5,167.5c1,0 67,-36 151,2c84,38 166,-15 165.5,-15.5';
const d2 = 'm82.5,187.5c1,0 87,-86 181,2c88,88 186,-15 185.5,-85.5';

export default class SvgD3InterpolatePathAnimation extends Component {
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
                toValue: Math.random()
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <InterpolatePath
                        t={this.t}
                        d1={d1}
                        d2={d2}
                        fill="none"
                        stroke={randomColor()}
                        strokeWidth={5}
                    />
                </Svg>
            </View>
        );
    }
}
