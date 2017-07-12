import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import Chord from '../components/AnimatedSvgD3Chord';

const innerRadius = 100;
const outerRadius = innerRadius + 10;
const matrixSizeMin = 2;
const matrixSizeMax = 4;
const matrixSize = Math.round(randomNumber(matrixSizeMin, matrixSizeMax));
const min = 1;
const max = 100;
const chordColors = Array(matrixSize).fill().map(_ => randomColor());

export default class SvgChordAnimation extends Component {
    constructor(props) {
        super(props);
        this.matrix = Array(matrixSize)
            .fill()
            .map(_ =>
                Array(matrixSize)
                    .fill()
                    .map(__ => new Animated.Value(randomNumber(min, max)))
            );
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        Animated.sequence(
            this.matrix.map(animValues =>
                Animated.sequence(
                    animValues.map(animValue =>
                        Animated.spring(animValue, {
                            toValue: randomNumber(min, max)
                        })
                    )
                )
            )
        ).start(() => this.animate());
    }

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Chord
                        matrix={this.matrix}
                        groupProps={group => ({
                            fill: chordColors[group.index],
                            innerRadius,
                            outerRadius
                        })}
                        chordProps={chord => ({
                            fill: chordColors[chord.source.index],
                            fillOpacity: 0.5,
                            radius: innerRadius
                        })}
                        translate={width / 2}
                    />
                </Svg>
            </View>
        );
    }
}
