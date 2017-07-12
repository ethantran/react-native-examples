import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomNumber from '../randomNumber';
import randomColor from '../randomColor';
import LinkHorizontal from '../components/AnimatedSvgD3ShapeLinkHorizontal';
import LinkRadial from '../components/AnimatedSvgD3ShapeLinkRadial';
import LinkVertical from '../components/AnimatedSvgD3ShapeLinkVertical';

export default class SvgD3LineAnimation extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        this.source = [
            new Animated.Value(randomNumber(0, width)),
            new Animated.Value(randomNumber(0, height))
        ];
        this.target = [
            new Animated.Value(randomNumber(0, width)),
            new Animated.Value(randomNumber(0, height))
        ];
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        const { width, height } = Dimensions.get('window');
        Animated.sequence([
            Animated.spring(this.source[0], {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.source[1], {
                toValue: randomNumber(0, height)
            }),
            Animated.spring(this.target[0], {
                toValue: randomNumber(0, width)
            }),
            Animated.spring(this.target[1], {
                toValue: randomNumber(0, height)
            })
        ]).start(() => this.animate());
    }

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <LinkHorizontal
                        source={this.source}
                        target={this.target}
                        fill="none"
                        stroke={randomColor()}
                        strokeWidth={10}
                    />
                    <LinkRadial
                        source={this.source}
                        target={this.target}
                        fill="none"
                        stroke={randomColor()}
                        strokeWidth={10}
                    />
                    <LinkVertical
                        source={this.source}
                        target={this.target}
                        fill="none"
                        stroke={randomColor()}
                        strokeWidth={10}
                    />
                </Svg>
            </View>
        );
    }
}
