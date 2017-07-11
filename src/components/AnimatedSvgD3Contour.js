// @flow
/**
 * TODO: animate values
 */
import React, { Component } from 'react';
// $FlowFixMe
import { Svg } from 'expo';
import * as d3 from 'd3-contour';
import * as d3Geo from 'd3-geo';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

type Contours = typeof d3.contours;

type GeoJSONMultiPolygonGeometry = {
    coordinates: any[][],
    type: string,
    value: number
};

type Props = Contours & {
    values: any[],
    renderContours: (contours: GeoJSONMultiPolygonGeometry[], i: number) => ?ReactElement<any>,
    renderContour: (contour: GeoJSONMultiPolygonGeometry, i: number) => ?ReactElement<any>,
    contourProps: (contour: GeoJSONMultiPolygonGeometry, i: number) => Object
};

export const args = ['size', 'smooth', 'thresholds'];

function createGenerator(props, generator?: Contours): Contours {
    generator = generator || d3.contours();
    return args.reduce((acc: Contours, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getContours(generator: Contours, values): GeoJSONMultiPolygonGeometry[] {
    return generator(values);
}

const defaultProps = {
    renderContours: null,
    renderContour: null,
    contourProps: () => ({})
};

class SvgD3Contour extends Component {
    props: Props;
    generator: Contours;
    contours: GeoJSONMultiPolygonGeometry[];
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.contours = getContours(this.generator, this.props.values);
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
            this.contours = getContours(this.generator, this.props.values);
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const valuesChanged = nextProps.values !== this.props.values;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (valuesChanged) {
            this.contours = getContours(this.generator, nextProps.values);
        }
        return argChanged || valuesChanged;
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
                            d={d3Geo.geoPath(d3Geo.geoIdentity())(contour)}
                            {...this.props.contourProps(contour, i)}
                        />
                    );
                })}
            </Svg.G>
        );
    }
}
SvgD3Contour.defaultProps = defaultProps;
SvgD3Contour = AnimatedSvgFix(SvgD3Contour);
export default SvgD3Contour;
