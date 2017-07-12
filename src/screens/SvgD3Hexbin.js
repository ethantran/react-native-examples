import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Random from 'd3-random';
import * as d3Array from 'd3-array';

import Hexbin from '../components/AnimatedSvgD3Hexbin';

const numPoints = 5;
const radius = 20;
const stdev = 80;

export default class SvgContourDensityBasic extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        const rx = d3Random.randomNormal(width / 2, stdev);
        const ry = d3Random.randomNormal(height / 2, stdev);
        this.points = d3Array
            .range(numPoints)
            .map(_ => [rx(), ry()])
            .map(value => [
                new Animated.Value(value[0]),
                new Animated.Value(value[1])
            ]);
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        const { width, height } = Dimensions.get('window');
        const rx = d3Random.randomNormal(width / 2, stdev);
        const ry = d3Random.randomNormal(height / 2, stdev);
        Animated.sequence(
            this.points.map(value =>
                Animated.sequence([
                    Animated.timing(value[0], {
                        toValue: rx(),
                        duration: 1000
                    }),
                    Animated.timing(value[1], {
                        toValue: ry(),
                        duration: 1000
                    })
                ])
            )
        ).start(() => this.animate());
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const extent = [[0, 0], [width, height]];
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Hexbin
                        points={this.points}
                        radius={radius}
                        extent={extent}
                    />
                </Svg>
            </View>
        );
    }
}
