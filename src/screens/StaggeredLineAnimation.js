import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import { svgPathProperties } from 'svg-path-properties';

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import Path from '../components/AnimatedSvgPath';
import Circle from '../components/AnimatedSvgCircle';

const dataLength = 10;
const min = 0;
const max = 100;
const speed = 40;
const staggerLength = 250;
const strokeDashoffsetDuration = 2000;
const radius = 5;
const lineStrokeWidth = 5;
const pointStrokeWidth = 3;

function createLineProps(path) {
    const properties = svgPathProperties(path);
    const length = properties.getTotalLength();
    return {
        d: path,
        strokeDashoffset: new Animated.Value(length),
        strokeDasharray: [length, length]
    };
}

export default class StaggeredLineAnimation extends Component {
    constructor(props) {
        super(props);
        const { width, height } = Dimensions.get('window');
        const data = Array(dataLength).fill().map((_, index) => ({
            index,
            value: randomNumber(min, max)
        }));
        const data2 = Array(dataLength).fill().map((_, index) => ({
            index,
            value: randomNumber(min, max)
        }));
        const curve = d3Shape.curveCatmullRom.alpha(0.5);
        const x = d3Scale
            .scaleLinear()
            .range([0, width - 10])
            .domain([0, dataLength - 1]);
        const y = d3Scale
            .scaleLinear()
            .range([0, width / 2])
            .domain([min, max]);
        const lineGenerator = d3Shape
            .line()
            .curve(curve)
            .x(d => x(d.index))
            .y(d => y(d.value));
        this.linePath = createLineProps(lineGenerator(data));
        this.linePath2 = createLineProps(lineGenerator(data2));
        this.points = data.map(d => ({
            r: new Animated.Value(0),
            cx: x(d.index),
            cy: y(d.value),
            stroke: 'gray',
            strokeWidth: pointStrokeWidth,
            fill: 'white'
        }));
        this.points2 = data2.map(d => ({
            r: new Animated.Value(0),
            cx: x(d.index),
            cy: y(d.value),
            stroke: 'gray',
            strokeWidth: pointStrokeWidth,
            fill: 'white'
        }));
    }
    componentDidMount() {
        this.animate();
    }
    animate() {
        const animation = Animated.sequence([
            Animated.delay(1000),
            Animated.parallel([
                Animated.timing(this.linePath.strokeDashoffset, {
                    toValue: 0,
                    duration: strokeDashoffsetDuration
                }),
                Animated.stagger(
                    staggerLength,
                    this.points.map(point =>
                        Animated.spring(point.r, {
                            toValue: radius,
                            speed
                        })
                    )
                )
            ]),
            Animated.parallel([
                Animated.timing(this.linePath2.strokeDashoffset, {
                    toValue: 0,
                    duration: strokeDashoffsetDuration
                }),
                Animated.stagger(
                    staggerLength,
                    this.points2.map(point =>
                        Animated.spring(point.r, {
                            toValue: radius,
                            speed
                        })
                    )
                )
            ])
        ]);
        animation.start();
    }
    render() {
        const { width, height } = Dimensions.get('window');
        const color = randomColor();
        const color2 = randomColor();
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Svg width={width} height={height}>
                    <Path
                        {...this.linePath}
                        stroke={color}
                        strokeWidth={lineStrokeWidth}
                        fill="none"
                    />
                    <Path
                        {...this.linePath2}
                        stroke={color2}
                        strokeWidth={lineStrokeWidth}
                        fill="none"
                    />
                    {this.points.map((point, i) =>
                        <Circle key={'point' + i} {...point} />
                    )}
                    {this.points2.map((point, i) =>
                        <Circle key={'point_2' + i} {...point} />
                    )}
                </Svg>
            </View>
        );
    }
}
