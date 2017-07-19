import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Scale from 'd3-scale';

import SvgD3Axis from '../components/SvgD3Axis';

export default class SvgD3AxisExample extends Component {
    render() {
        const { width, height } = Dimensions.get('window');
        const minTranslateX = 50;
        const minTranslateY = 50;
        const max = Math.min(width, height) / 1.5;
        const scale = d3Scale.scaleLinear().range([0, max]);
        return (
            <View style={{ padding: 10 }}>
                <Svg width={width} height={height}>
                    <SvgD3Axis
                        axisRight
                        scale={scale}
                        translateX={minTranslateX + max}
                        translateY={minTranslateY}
                    />
                    <SvgD3Axis
                        axisLeft
                        scale={scale}
                        translateX={minTranslateX}
                        translateY={minTranslateY}
                    />
                    <SvgD3Axis
                        axisTop
                        scale={scale}
                        translateX={minTranslateX}
                        translateY={minTranslateY}
                    />
                    <SvgD3Axis
                        axisBottom
                        scale={scale}
                        translateX={minTranslateX}
                        translateY={minTranslateY + max}
                    />
                </Svg>
            </View>
        );
    }
}
