import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Hierarchy from 'd3-hierarchy';
import * as d3Scale from 'd3-scale';

import Partition from '../components/AnimatedSvgD3HierarchyPartition';
import Rect from '../components/AnimatedSvgRect';
import data from '../data/hierarchyData';

export default class SvgPartitionBasic extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const root = d3Hierarchy
            .stratify()
            .parentId(d => d.id.substring(0, d.id.lastIndexOf('.')))(data)
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);
        const color = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);
        const size = [height, width];
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Partition
                        root={root}
                        size={size}
                        padding={1}
                        round={true}
                        renderDescendant={(descendant, i) => {
                            let d = descendant;
                            while (d.depth > 1) {
                                d = d.parent;
                            }
                            return (
                                <Rect
                                    key={i}
                                    r={descendant.r}
                                    translateX={descendant.y0}
                                    translateY={descendant.x0}
                                    width={descendant.y1 - descendant.y0}
                                    height={descendant.x1 - descendant.x0}
                                    fill={color(d.id)}
                                    fillOpacity={descendant.children ? 0.5 : 1}
                                />
                            );
                        }}
                    />
                </Svg>
            </View>
        );
    }
}
