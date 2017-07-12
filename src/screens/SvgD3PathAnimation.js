import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomNumber from '../randomNumber';
import Path from '../components/AnimatedSvgD3Path';
import Command from '../components/D3PathCommand';

export default class SvgD3PathAnimation extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        this.x = new Animated.Value(randomNumber(0, width));
        this.y = new Animated.Value(randomNumber(0, height));
        this.x1 = new Animated.Value(randomNumber(0, width));
        this.y1 = new Animated.Value(randomNumber(0, height));
        this.x2 = new Animated.Value(randomNumber(0, width));
        this.y2 = new Animated.Value(randomNumber(0, height));
        this.cpx = new Animated.Value(randomNumber(0, width));
        this.cpy = new Animated.Value(randomNumber(0, height));
        this.cpx1 = new Animated.Value(randomNumber(0, width));
        this.cpy1 = new Animated.Value(randomNumber(0, height));
        this.cpx2 = new Animated.Value(randomNumber(0, width));
        this.cpy2 = new Animated.Value(randomNumber(0, height));
        this.w = new Animated.Value(randomNumber(0, width));
        this.h = new Animated.Value(randomNumber(0, height));
        this.radius = new Animated.Value(randomNumber(0, width / 2));
        this.startAngle = new Animated.Value(randomNumber(0, 180));
        this.endAngle = new Animated.Value(randomNumber(181, 360));
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        const { width, height } = Dimensions.get('window');
        Animated.sequence([
            Animated.spring(this.x, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.y, {
                toValue: randomNumber(0, height)
            }),
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
            Animated.spring(this.cpx, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.cpy, {
                toValue: randomNumber(0, height)
            }),
            Animated.spring(this.cpx1, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.cpy1, {
                toValue: randomNumber(0, height)
            }),
            Animated.spring(this.cpx2, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.cpy2, {
                toValue: randomNumber(0, height)
            }),
            Animated.spring(this.w, {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.h, {
                toValue: randomNumber(0, height)
            }),
            Animated.spring(this.radius, {
                toValue: randomNumber(0, width / 2)
            }),
            Animated.spring(this.startAngle, {
                toValue: randomNumber(0, 180)
            }),
            Animated.spring(this.endAngle, {
                toValue: randomNumber(181, 360)
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Path>
                        <Command command="moveTo" x={this.x} y={this.y} />,
                        <Command command="lineTo" x={this.x} y={this.y} />,
                        <Command
                            command="quadraticCurveTo"
                            cpx={this.cpx}
                            cpy={this.cpy}
                            x={this.x}
                            y={this.y}
                        />
                        <Command
                            command="bezierCurveTo"
                            cpx1={this.cpx1}
                            cpy1={this.cpy2}
                            cpx2={this.cpx2}
                            cpy2={this.cpy2}
                            x={this.x}
                            y={this.y}
                        />
                        <Command
                            command="arcTo"
                            x1={this.x1}
                            y1={this.y1}
                            x2={this.x2}
                            y2={this.y2}
                        />,
                        <Command
                            command="arc"
                            x={this.x}
                            y={this.y}
                            radius={this.radius}
                            startAngle={this.startAngle}
                            endAngle={this.endAngle}
                        />,
                        <Command
                            command="rect"
                            x={this.x}
                            y={this.y}
                            w={this.w}
                            h={this.h}
                        />
                    </Path>
                </Svg>
            </View>
        );
    }
}
