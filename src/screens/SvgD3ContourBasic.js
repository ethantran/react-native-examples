import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { Svg } from 'expo';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

import Contour from '../components/AnimatedSvgD3Contour';
import contourData from '../data/contourData';

const contourWidth = 10;
const contourHeight = 10;
const thresholdMin = 1;
const thresholdMax = 21;

export default class SvgContourBasic extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const data = contourData(contourWidth, contourHeight);
        const thresholds = d3Array
            .range(thresholdMin, thresholdMax)
            .map(p => Math.pow(2, p));
        const color = d3Scale
            .scaleLog()
            .domain(d3Array.extent(thresholds))
            .interpolate(() => d3ScaleChromatic.interpolateYlGnBu);
        const size = [contourWidth, contourHeight];
        const scale = width / 10;
        return (
            <View style={{ marginTop: 40 }}>
                <Svg width={width} height={height}>
                    <Contour
                        values={data}
                        extent={[[1, 1], [width - 1, height - 6]]}
                        size={size}
                        contourProps={contour => ({
                            fill: color(contour.value)
                        })}
                        scale={scale}
                    />
                </Svg>
            </View>
        );
    }
}
