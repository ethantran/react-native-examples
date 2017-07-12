import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import Polygon from '../components/AnimatedSvgPolygon';

export default class SvgPolygonAnimation extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        this.x1 = new Animated.Value(randomNumber(0, width));
        this.y1 = new Animated.Value(randomNumber(0, height));
        this.x2 = new Animated.Value(randomNumber(0, width));
        this.y2 = new Animated.Value(randomNumber(0, height));
        this.x3 = new Animated.Value(randomNumber(0, width));
        this.y3 = new Animated.Value(randomNumber(0, height));
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
            }),
            Animated.spring(this.x3, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.y3, {
                toValue: randomNumber(0, height)
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Polygon
                        stroke={randomColor()}
                        fill={randomColor()}
                        points={[
                            [this.x1, this.y1],
                            [this.x2, this.y2],
                            [this.x3, this.y3]
                        ]}
                    />
                </Svg>
            </View>
        );
    }
}
