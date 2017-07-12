import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomNumber from '../randomNumber';
import randomColor from '../randomColor';
import Rect from '../components/AnimatedSvgRect';

const widthMin = 1;
const widthMax = 10;
const offsetMin = 0;
const offsetMax = 10;
const arrayMin = 0;
const arrayMax = 10;
const limitMin = 0;
const limitMax = 10;

export default class SvgBrushAnimation extends Component {
    constructor(props) {
        super(props);
        this.inputFill = new Animated.Value(Math.random());
        this.fill = this.inputFill.interpolate({
            inputRange: [0, 1],
            outputRange: [randomColor(), randomColor()]
        });
        this.fillOpacity = new Animated.Value(Math.random());
        this.inputStroke = new Animated.Value(Math.random());
        this.stroke = this.inputStroke.interpolate({
            inputRange: [0, 1],
            outputRange: [randomColor(), randomColor()]
        });
        this.strokeOpacity = new Animated.Value(Math.random());
        this.strokeWidth = new Animated.Value(randomNumber(widthMin, widthMax));
        this.strokeDashoffset = new Animated.Value(
            randomNumber(offsetMin, offsetMax)
        );
        this.strokeDasharray1 = new Animated.Value(
            randomNumber(arrayMin, arrayMax)
        );
        this.strokeDasharray2 = new Animated.Value(
            randomNumber(arrayMin, arrayMax)
        );
        this.strokeMiterlimit = new Animated.Value(
            randomNumber(limitMin, limitMax)
        );
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        Animated.sequence([
            Animated.spring(this.inputFill, {
                toValue: Math.random()
            }),
            Animated.spring(this.fillOpacity, {
                toValue: Math.random()
            }),
            Animated.spring(this.inputStroke, {
                toValue: Math.random()
            }),
            Animated.spring(this.strokeOpacity, {
                toValue: Math.random()
            }),
            Animated.spring(this.strokeWidth, {
                toValue: randomNumber(widthMin, widthMax)
            }),
            Animated.spring(this.strokeDashoffset, {
                toValue: randomNumber(offsetMin, offsetMax)
            }),
            Animated.spring(this.strokeDasharray1, {
                toValue: randomNumber(arrayMin, arrayMax)
            }),
            Animated.spring(this.strokeDasharray2, {
                toValue: randomNumber(arrayMin, arrayMax)
            }),
            Animated.spring(this.strokeMiterlimit, {
                toValue: randomNumber(limitMin, limitMax)
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        const strokeDasharray = [this.strokeDasharray1, this.strokeDasharray2];
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Rect
                        width={width / 2}
                        height={width / 2}
                        translateX={width / 4}
                        translateY={width / 4}
                        fill={this.fill}
                        fillOpacity={this.fillOpacity}
                        stroke={this.stroke}
                        strokeOpacity={this.strokeOpacity}
                        strokeWidth={this.strokeWidth}
                        strokeDashoffset={this.strokeDashoffset}
                        strokeDasharray={strokeDasharray}
                    />
                </Svg>
            </View>
        );
    }
}
