import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import ContourDensity from '../components/AnimatedSvgD3ContourDensity';
import data from '../data/contourDensityData';

export default class SvgContourDensityBasic extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const x = d3Scale.scaleLinear().rangeRound([10, width - 10]);
        const y = d3Scale.scaleLinear().rangeRound([height - 10, 10]);
        x.domain(d3Array.extent(data, d => d.waiting)).nice();
        y.domain(d3Array.extent(data, d => d.eruptions)).nice();
        const size = [width, height];
        const bandwidth = 10;
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <ContourDensity
                        data={data}
                        size={size}
                        bandwidth={bandwidth}
                        x={d => x(d.waiting)}
                        y={d => y(d.eruptions)}
                        contourProps={contour => ({
                            fill: 'none',
                            stroke: 'black'
                        })}
                    />
                </Svg>
            </View>
        );
    }
}
