import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Hierarchy from 'd3-hierarchy';

import Treemap from '../components/AnimatedSvgD3HierarchyTreemap';
import LinkHorizontal from '../components/AnimatedSvgD3ShapeLinkHorizontal';
import data from '../data/hierarchyData';

export default class SvgTreemapBasic extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const root = d3Hierarchy
            .stratify()
            .parentId(d => d.id.substring(0, d.id.lastIndexOf('.')))(data).sort(
            (a, b) => a.height - b.height || a.id.localeCompare(b.id)
        );
        const size = [width, width];
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Treemap
                        root={root}
                        size={size}
                        renderLink={link =>
                            <LinkHorizontal
                                source={link.source}
                                target={link.target}
                                x={d => d.y}
                                y={d => d.x}
                                fill="none"
                                stroke="black"
                            />}
                    />
                </Svg>
            </View>
        );
    }
}
