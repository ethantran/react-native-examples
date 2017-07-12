import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Hierarchy from 'd3-hierarchy';

import Pack from '../components/AnimatedSvgD3HierarchyPack';
import Circle from '../components/AnimatedSvgCircle';
import data from '../data/packData';

export default class SvgPackCircles extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const root = d3Hierarchy
            .hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => b.value - a.value);
        const size = [width, width];
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Pack
                        root={root}
                        size={size}
                        renderDescendant={(descendant, i) =>
                            <Circle
                                key={i}
                                r={descendant.r}
                                translateX={descendant.x}
                                translateY={descendant.y}
                                fill={descendant.children ? 'blue' : 'orange'}
                                fillOpacity={descendant.children ? 0.5 : 1}
                            />}
                    />
                </Svg>
            </View>
        );
    }
}
