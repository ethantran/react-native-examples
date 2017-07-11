// @flow
/**
 * TODO: animate data
 */
import React, { Component } from 'react';
// $FlowFixMe
import { Svg } from 'expo';
import * as d3 from 'd3-contour';
import * as d3Geo from 'd3-geo';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

export const args = ['x', 'y', 'size', 'cellSize', 'thresholds', 'bandwidth'];

type ContourDensity = typeof d3.contourDensity;

type GeoJSONMultiPolygonGeometry = {
    coordinates: any[][],
    type: string,
    value: number
};

type Props = ContourDensity & {
    data: any[],
    renderContours: (contours: GeoJSONMultiPolygonGeometry[], i: number) => ?ReactElement<any>,
    renderContour: (contour: GeoJSONMultiPolygonGeometry, i: number) => ?ReactElement<any>,
    contourProps: (contour: GeoJSONMultiPolygonGeometry, i: number) => Object
};

function createGenerator(props, generator?: ContourDensity): ContourDensity {
    generator = generator || d3.contourDensity();
    return args.reduce((acc: ContourDensity, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getContours(generator: ContourDensity, data): GeoJSONMultiPolygonGeometry[] {
    return generator(data);
}

const defaultProps = {
    renderContours: null,
    renderContour: null,
    contourProps: () => ({})
};

class SvgD3ContourDensity extends Component {
    props: Props;
    generator: ContourDensity;
    contours: GeoJSONMultiPolygonGeometry[];
     _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.contours = getContours(this.generator, this.props.data);
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
            this.contours = getContours(this.generator, this.props.data);
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const dataChanged = nextProps.data !== this.props.data;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (dataChanged) {
            this.contours = getContours(this.generator, nextProps.data);
        }
        return argChanged || dataChanged;
    }
    render() {
        const filteredProps = omit(this.props, args);
        if (this.props.renderContours) {
            return this.props.renderContours(this.contours);
        }
        return (
            <Svg.G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {this.contours.map((contour, i) => {
                    if (this.props.renderContour) {
                        return this.props.renderContour(contour, i);
                    }
                    return (
                        <Svg.Path
                            ref={component => (this._components[i] = component)}
                            key={i}
                            d={d3Geo.geoPath()(contour)}
                            {...this.props.contourProps(contour, i)}
                        />
                    );
                })}
            </Svg.G>
        );
    }
}
SvgD3ContourDensity.defaultProps = defaultProps;
SvgD3ContourDensity = AnimatedSvgFix(SvgD3ContourDensity);
export default SvgD3ContourDensity;
