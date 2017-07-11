// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-contour';
import * as d3Geo from 'd3-geo';
import omit from 'lodash/omit';

import G from './AnimatedSvgG';
import D3GeoPath from './AnimatedSvgD3GeoPath';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

type Contours = typeof d3.contours;

type GeoJSONMultiPolygonGeometry = {
    coordinates: any[][],
    type: string,
    value: number
};

type Props = Contours & {
    values: any[],
    renderContours: (
        contours: GeoJSONMultiPolygonGeometry[],
        i: number
    ) => ?ReactElement<any>,
    renderContour: (
        contour: GeoJSONMultiPolygonGeometry,
        i: number
    ) => ?ReactElement<any>,
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

function getContours(
    generator: Contours,
    values
): GeoJSONMultiPolygonGeometry[] {
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
    values: AnimatedListener;
    contours: GeoJSONMultiPolygonGeometry[];
    _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.values = listen(props.values, _ =>
            this.setNativeProps({ _listener: true })
        );
        this._components = {};
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props._listener) {
            const contours = getContours(this.generator, this.values.values);
            contours.forEach((contour, i) => {
                const component = this._components[i];
                component && component.setNativeProps({ object: contour });
            });
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
            removeListeners(this.values);
            this.values = listen(nextProps.values, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || valuesChanged;
    }
    componentWillUnmount() {
        removeListeners(this.values);
    }
    renderContour = (contour, i) => {
        return (
            <D3GeoPath
                ref={component => (this._components[i] = component)}
                key={i}
                projection={d3Geo.geoIdentity()}
                object={contour}
                {...this.props.contourProps(contour, i)}
            />
        );
    };
    render() {
        const filteredProps = omit(this.props, args);
        const contours = getContours(this.generator, this.values.values);
        if (this.props.renderContours) {
            return this.props.renderContours(contours);
        }
        const renderContour = this.props.renderContour || this.renderContour;
        return (
            <G
                ref={component => (this._component = component)}
                {...filteredProps}
            >
                {contours.map((contour, i) => {
                    const element = renderContour(contour, i);
                    if (element) {
                        return React.cloneElement(element, {
                            ref: component => (this._components[i] = component)
                        });
                    }
                    return element;
                })}
            </G>
        );
    }
}
SvgD3Contour.defaultProps = defaultProps;
SvgD3Contour = Animated.createAnimatedComponent(SvgD3Contour);
export default SvgD3Contour;
