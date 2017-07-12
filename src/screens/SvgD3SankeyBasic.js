import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Scale from 'd3-scale';

import Sankey from '../components/AnimatedSvgD3Sankey';
import data from '../data/sankeyData';

export default class SvgSankeyBasic extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const extent = [[1, 1], [width - 1, height - 6]];
        const color = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Sankey
                        values={data}
                        extent={extent}
                        linkProps={link => ({
                            fill: 'none',
                            stroke: 'black',
                            strokeOpacity: 0.2,
                            strokeWidth: Math.max(1, link.width)
                        })}
                        nodeProps={node => ({
                            stroke: 'black',
                            fill: color(node.name.replace(/ .*/, ''))
                        })}
                    />
                </Svg>
            </View>
        );
    }
}
