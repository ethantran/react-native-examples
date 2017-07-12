import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import randomNumber from '../randomNumber';
import randomColor from '../randomColor';
import Area from '../components/AnimatedSvgD3ShapeArea';
import AreaRadial from '../components/AnimatedSvgD3ShapeAreaRadial';

const dataLength = 10;
const min = 0;
const max = 100;

export default class SvgD3AreaAnimation extends Component {
    constructor(props) {
        super(props);
        this.data = Array(dataLength).fill().map((_, index) => ({
            index,
            value: new Animated.Value(randomNumber(min, max))
        }));
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        Animated.sequence([
            Animated.delay(2000),
            ...this.data.map(item =>
                Animated.timing(item.value, {
                    toValue: randomNumber(min, max),
                    duration: 1000
                })
            )
        ]).start();
    }

    render() {
        const { width, height } = Dimensions.get('window');
        let x = d3Scale.scaleLinear().range([0, width - 10]).domain([0, dataLength - 1]);
        let y = d3Scale.scaleLinear().range([0, width / 2]).domain([min, max]);
        const outerRadius = width / 2;
        const innerRadius = 120;
        let angle = d3Scale.scaleLinear().range([0, 2 * Math.PI]).domain([0, dataLength - 1]);
        let r = d3Scale.scaleLinear().range([innerRadius, outerRadius]).domain([min, max]);
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Area
                        data={this.data}
                        x={d => x(d.index)}
                        y1={d => y(d.value)}
                        fill={randomColor()}
                        scaleY={-1}
                        translateX={5}
                        translateY={width / 2}
                    />
                    <AreaRadial
                        curve={d3Shape.curveCatmullRom.alpha(0.5)}
                        data={this.data}
                        angle={d => angle(d.index)}
                        outerRadius={d => r(d.value)}
                        innerRadius={d => innerRadius}
                        fill={randomColor()}
                        translateX={width / 2}
                        translateY={width}
                    />
                </Svg>
            </View>
        );
    }
}
