import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';

import randomColor from '../randomColor';
import randomNumber from '../randomNumber';
import Path from '../components/AnimatedSvgPath';

const min = 0;
const max = 100;
const lineStrokeWidth = 5;
const color = randomColor();
const limit = 60 * 1;
const duration = 1000;
const intervalDuration = 1000;
const animationDuration = intervalDuration / 2;

function createLineProps(path) {
    return {
        d: path
    };
}

export default class RealTimeChartExample extends Component {
    constructor(props) {
        super(props);
        this.now = new Date(Date.now() - duration);
        const { width, height } = Dimensions.get('window');
        const curve = d3Shape.curveCatmullRom.alpha(0.5);
        this.x = d3Scale
            .scaleTime()
            .range([0, width - 10])
            .domain([this.now - (limit - 2) * duration, this.now - duration]);
        this.translateXAnimValue = new Animated.Value(0);
        this.y = d3Scale
            .scaleLinear()
            .range([0, width / 2])
            .domain([min, max]);
        this.lineGenerator = d3Shape
            .line()
            .curve(curve)
            .x((d, i) => this.x(this.now - (limit - 1 - i) * duration))
            .y(d => this.y(d));
        this.state = {
            data: Array(limit).fill().map((_, index) => randomNumber(min, max))
        };
        setInterval(_ => {
            this.now = new Date();
            let newData = [...this.state.data, randomNumber(min, max)];
            this.x.domain([this.now - (limit - 2) * duration, this.now - duration]);
            this.setState({
                data: newData
            }, () => {
                Animated.timing(this.translateXAnimValue, {
                    toValue: this.x(this.now - (limit - 1) * duration),
                    duration: animationDuration
                }).start(() => {
                    this.setState(prevState => {
                        let data = prevState.data;
                        data.shift();
                        return { data }
                    }, () => {
                        this.translateXAnimValue.setValue(0);
                    });
                })
            });
         }, intervalDuration);
    }
    render() {
        const { width, height } = Dimensions.get('window');
        this.linePath = createLineProps(this.lineGenerator(this.state.data));
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Svg width={width} height={height}>
                    <Path
                        {...this.linePath}
                        stroke={color}
                        strokeWidth={lineStrokeWidth}
                        fill="none"
                        translateX={this.translateXAnimValue}
                    />
                </Svg>
            </View>
        );
    }
}
