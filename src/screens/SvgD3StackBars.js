import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import randomColor from '../randomColor';
import Stack from '../components/AnimatedSvgD3ShapeStack';
import G from '../components/AnimatedSvgG';
import Rect from '../components/AnimatedSvgRect';
import stackData from '../data/stackData';

const keys = ['apples', 'bananas', 'cherries', 'dates'];

// generate total for each row
stackData.reduce((acc, row, index) => {
    row.total = 0;
    keys.forEach(key => {
        row.total += row[key];
    });
    return stackData;
}, stackData);

export default class SvgD3StackBars extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get('window');
        let x = d3Scale
            .scaleBand()
            .range([0, width / 2])
            .paddingInner(0.05)
            .align(0.1);
        let y = d3Scale.scaleLinear().range([height / 2, 0]);
        let z = d3Scale.scaleOrdinal().range(keys.map(randomColor));
        x.domain(stackData.map(d => d.index));
        y.domain([0, d3Array.max(stackData, d => d.total)]).nice();
        z.domain(keys);
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Stack
                        data={stackData}
                        keys={keys}
                        renderSeries={(seriesItem, i) => {
                            const key = keys[i];
                            return (
                                <G key={i}>
                                    {seriesItem.map((d, j) => {
                                        return (
                                            <Rect
                                                key={j}
                                                x={x(d.data.index)}
                                                y={y(d[1])}
                                                height={y(d[0]) - y(d[1])}
                                                width={x.bandwidth()}
                                                fill={z(key)}
                                            />
                                        );
                                    })}
                                </G>
                            );
                        }}
                    />
                </Svg>
            </View>
        );
    }
}
