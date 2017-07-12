import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Hierarchy from 'd3-hierarchy';

import Cluster from '../components/AnimatedSvgD3HierarchyCluster';
import G from '../components/AnimatedSvgG';
import Path from '../components/AnimatedSvgPath';
import Circle from '../components/AnimatedSvgCircle';
import data from '../data/hierarchyData';

function project(x, y) {
    const angle = (x - 90) / 180 * Math.PI,
        radius = y;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

export default class SvgClusterBasic extends Component {
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
        const size = [360, width / 2 - 120];
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Cluster
                        translate={width / 2}
                        root={root}
                        size={size}
                        renderDescendant={(descendant, i) => {
                            const [translateX, translateY] = project(
                                descendant.x,
                                descendant.y
                            );
                            if (!descendant.parent) {
                                return null;
                            }
                            const d =
                                'M' +
                                [translateX, translateY] +
                                'C' +
                                project(
                                    descendant.x,
                                    (descendant.y + descendant.parent.y) / 2
                                ) +
                                ' ' +
                                project(
                                    descendant.parent.x,
                                    (descendant.y + descendant.parent.y) / 2
                                ) +
                                ' ' +
                                project(
                                    descendant.parent.x,
                                    descendant.parent.y
                                );
                            return (
                                <G key={i}>
                                    <Path d={d} fill="none" stroke="black" />
                                    <Circle
                                        r={3}
                                        translateX={translateX}
                                        translateY={translateY}
                                    />
                                </G>
                            );
                        }}
                    />
                </Svg>
            </View>
        );
    }
}
