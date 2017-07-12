import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

const Defs = Svg.Defs;
const Rect = Svg.Rect;

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import LinearGradient from '../components/AnimatedSvgLinearGradient';
import RadialGradient from '../components/AnimatedSvgRadialGradient';
import Stop from '../components/AnimatedSvgStop';

export default class SvgPolygonAnimation extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        this.x1 = new Animated.Value(randomNumber(0, width));
        this.y1 = new Animated.Value(randomNumber(0, height));
        this.x2 = new Animated.Value(randomNumber(0, width));
        this.y2 = new Animated.Value(randomNumber(0, height));

        this.fx = new Animated.Value(randomNumber(0, width));
        this.fy = new Animated.Value(randomNumber(0, height));
        this.rx = new Animated.Value(randomNumber(0, width));
        this.ry = new Animated.Value(randomNumber(0, height));
        this.cx = new Animated.Value(randomNumber(0, width));
        this.cy = new Animated.Value(randomNumber(0, height));
        this.r = new Animated.Value(randomNumber(0, width / 2));

        this.offset = new Animated.Value(Math.random());
        this.inputStopColor = new Animated.Value(Math.random());
        this.stopColor = this.inputStopColor.interpolate({
            inputRange: [0, 1],
            outputRange: [randomColor(), randomColor()]
        });
        this.stopOpacity = new Animated.Value(Math.random());
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
            Animated.spring(this.fx, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.fy, {
                toValue: randomNumber(0, height)
            }),
            Animated.spring(this.rx, {
                toValue: randomNumber(0, width / 2)
            }),
            Animated.spring(this.ry, {
                toValue: randomNumber(0, width / 2)
            }),
            Animated.spring(this.cx, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.cy, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.r, {
                toValue: randomNumber(0, width / 2)
            }),
            Animated.spring(this.offset, {
                toValue: Math.random()
            }),
            Animated.spring(this.inputStopColor, {
                toValue: Math.random()
            }),
            Animated.spring(this.stopOpacity, {
                toValue: Math.random()
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient
                            id="lgrad"
                            x1={this.x1}
                            y1={this.y1}
                            x2={this.x2}
                            y2={this.y2}
                        >
                            <Stop
                                offset={Math.random()}
                                stopColor={randomColor()}
                                stopOpacity={Math.random()}
                            />
                            <Stop
                                offset={this.offset}
                                stopColor={this.stopColor}
                                stopOpacity={this.stopOpacity}
                            />
                        </LinearGradient>
                        <RadialGradient
                            id="rgrad"
                            fx={this.fx}
                            fy={this.fy}
                            rx={this.rx}
                            ry={this.ry}
                            cx={this.cx}
                            cy={this.cy}
                            r={this.r}
                        >
                            <Stop
                                offset={Math.random()}
                                stopColor={randomColor()}
                                stopOpacity={Math.random()}
                            />
                            <Stop
                                offset={this.offset}
                                stopColor={this.stopColor}
                                stopOpacity={this.stopOpacity}
                            />
                        </RadialGradient>
                    </Defs>
                    <Rect
                        fill="url(#lgrad)"
                        width={width}
                        height={height / 2}
                    />
                    <Rect
                        fill="url(#rgrad)"
                        width={width}
                        height={height / 2}
                        translateY={height / 2}
                    />
                </Svg>
            </View>
        );
    }
}
