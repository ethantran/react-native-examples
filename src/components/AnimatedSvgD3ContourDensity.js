// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-contour';
import omit from 'lodash/omit';

import G from './AnimatedSvgG';
import D3GeoPath from './AnimatedSvgD3GeoPath';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

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
    data: AnimatedListener;
    contours: GeoJSONMultiPolygonGeometry[];
     _component: any;
    _components: Object;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.data = listen(props.data, _ =>
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
            const contours = getContours(this.generator, this.data.values);
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
        const dataChanged = nextProps.data !== this.props.data;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (dataChanged) {
            removeListeners(this.data);
            this.data = listen(nextProps.data, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || dataChanged;
    }
    componentWillUnmount() {
        removeListeners(this.data);
    }
    renderContour = (contour, i) => {
        return (
            <D3GeoPath
                ref={component => (this._components[i] = component)}
                key={i}
                object={contour}
                {...this.props.contourProps(contour, i)}
            />
        );
    };
    render() {
        const filteredProps = omit(this.props, args);
        const contours = getContours(this.generator, this.data.values);
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
SvgD3ContourDensity.defaultProps = defaultProps;
SvgD3ContourDensity = Animated.createAnimatedComponent(SvgD3ContourDensity);
export default SvgD3ContourDensity;
