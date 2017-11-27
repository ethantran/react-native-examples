import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomNumber from '../randomNumber';
import Metaball from '../components/AnimatedSvgMetaball';
import Circle from '../components/AnimatedSvgCircle';

const radiusMin = 10;
const radiusMax = 100;
const centerMin = radiusMax;
const centerMax = Math.min(
    Dimensions.get('window').width,
    Dimensions.get('window').height
) - radiusMax;
const sizeMin = 2.5;
const sizeMax = 100;
const duration = 1000;

export default class SvgMetaball extends Component {
    constructor(props) {
        super(props);
        this.radius1 = new Animated.Value(randomNumber(radiusMin, radiusMax));
        this.radius2 = new Animated.Value(randomNumber(radiusMin, radiusMax));
        this.radius3 = new Animated.Value(randomNumber(radiusMin, radiusMax));
        this.center1X = new Animated.Value(randomNumber(centerMin, centerMax));
        this.center1Y = new Animated.Value(randomNumber(centerMin, centerMax));
        this.center2X = new Animated.Value(randomNumber(centerMin, centerMax));
        this.center2Y = new Animated.Value(randomNumber(centerMin, centerMax));
        this.center3X = new Animated.Value(randomNumber(centerMin, centerMax));
        this.center3Y = new Animated.Value(randomNumber(centerMin, centerMax));
        this.handleSize = new Animated.Value(randomNumber(sizeMin, sizeMax));
        this.v = new Animated.Value(Math.random());
    }

    componentDidMount() {
        this.animate();
    }

    animate = () => {
        Animated.sequence([
            Animated.timing(this.radius1, {
                toValue: randomNumber(radiusMin, radiusMax),
                duration
            }),
            Animated.timing(this.radius2, {
                toValue: randomNumber(radiusMin, radiusMax),
                duration
            }),
            Animated.timing(this.radius3, {
                toValue: randomNumber(radiusMin, radiusMax),
                duration
            }),
            Animated.timing(this.center1X, {
                toValue: randomNumber(centerMin, centerMax),
                duration
            }),
            Animated.timing(this.center1Y, {
                toValue: randomNumber(centerMin, centerMax),
                duration
            }),
            Animated.timing(this.center2X, {
                toValue: randomNumber(centerMin, centerMax),
                duration
            }),
            Animated.timing(this.center2Y, {
                toValue: randomNumber(centerMin, centerMax),
                duration
            }),
            Animated.timing(this.center3X, {
                toValue: randomNumber(centerMin, centerMax),
                duration
            }),
            Animated.timing(this.center3Y, {
                toValue: randomNumber(centerMin, centerMax),
                duration
            }),
            Animated.timing(this.handleSize, {
                toValue: randomNumber(sizeMin, sizeMax),
                duration
            }),
            Animated.timing(this.v, {
                toValue: Math.random(),
                duration
            })
        ]).start(() => this.animate());
    };

    render() {
        const { width, height } = Dimensions.get('window');
        const center1 = [this.center1X, this.center1Y];
        const center2 = [this.center2X, this.center2Y];
        const center3 = [this.center3X, this.center3Y];
        return (
            <View style={{ padding: 10 }}>
                <Svg width={width} height={height}>
                    <Circle
                        cx={this.center1X}
                        cy={this.center1Y}
                        r={this.radius1}
                    />
                    <Circle
                        cx={this.center2X}
                        cy={this.center2Y}
                        r={this.radius2}
                    />
                    <Circle
                        cx={this.center3X}
                        cy={this.center3Y}
                        r={this.radius3}
                    />
                    <Metaball
                        radius1={this.radius1}
                        radius2={this.radius2}
                        center1={center1}
                        center2={center2}
                        handleSize={this.handleSize}
                        v={this.v}
                    />
                    <Metaball
                        radius1={this.radius1}
                        radius2={this.radius3}
                        center1={center1}
                        center2={center3}
                        handleSize={this.handleSize}
                        v={this.v}
                    />
                    <Metaball
                        radius1={this.radius2}
                        radius2={this.radius3}
                        center1={center2}
                        center2={center3}
                        handleSize={this.handleSize}
                        v={this.v}
                    />
                </Svg>
            </View>
        );
    }
}
