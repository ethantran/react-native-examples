// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-geo';
import omit from 'lodash/omit';

import Path from './AnimatedSvgPath';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

type GeoPath = d3.GeoPath;

type Props = GeoPath & {
    object?: Object
};

export const args = [
    'area',
    'bounds',
    'centroid',
    'measure',
    'projection',
    'pointRadius'
];

function createGenerator(props, generator?: GeoPath): GeoPath {
    generator = generator || d3.geoPath();
    return args.reduce((acc: GeoPath, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function getPath(generator: GeoPath, object): string {
    return generator(object);
}

class SvgD3GeoPath extends Component {
    props: Props;
    generator: GeoPath;
    object: AnimatedListener;
    _component: any;
    _components: Object;

    constructor(props: Props) {
        super(props);
        this.generator = createGenerator(props);
        this.object = listen(props.object, _ =>
            this.setNativeProps({ _listener: true })
        );
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props.object || props._listener) {
            props.d = getPath(
                this.generator,
                props.object || this.object.values
            );
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps: Props) {
        const argChanged = args.some(
            (key, index) => nextProps[key] !== this.props[key]
        );
        const objectChanged = nextProps.object !== this.props.object;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (objectChanged) {
            removeListeners(this.object);
            this.object = listen(nextProps.object, _ =>
                this.setNativeProps({ _listener: true })
            );
        }
        return argChanged || objectChanged;
    }
    componentWillUnmount() {
        removeListeners(this.object);
    }
    render() {
        const filteredProps = omit(this.props, args);
        const d = getPath(this.generator, this.object.values);
        return (
            <Path
                ref={component => (this._component = component)}
                {...filteredProps}
                d={d}
            />
        );
    }
}
SvgD3GeoPath = Animated.createAnimatedComponent(SvgD3GeoPath);
export default SvgD3GeoPath;
