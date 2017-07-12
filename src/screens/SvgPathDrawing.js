import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';
import { svgPathProperties } from 'svg-path-properties';

import randomColor from '../randomColor';
import Path from '../components/AnimatedSvgPath';
import VivusHi from '../components/VivusHi';

export default class SvgCircleAnimation extends Component {
    constructor(props) {
        super(props);
        const properties = svgPathProperties(VivusHi);
        this.length = properties.getTotalLength();
        this.strokeDashoffset = new Animated.Value(this.length);
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        this.strokeDashoffset.setValue(this.length);
        Animated.sequence([
            Animated.delay(1000),
            Animated.timing(this.strokeDashoffset, {
                toValue: 0,
                duration: 2000
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Path
                        d={VivusHi}
                        fill="none"
                        stroke={randomColor()}
                        strokeDashoffset={this.strokeDashoffset}
                        strokeDasharray={[this.length, this.length]}
                    />
                </Svg>
            </View>
        );
    }
}
