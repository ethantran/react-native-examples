/**
 * @flow
 * TODO: animate object
 */

import React, { Component } from 'react';
// $FlowFixMe
import { Svg } from 'expo';
import * as d3 from 'd3-geo';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

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
     _component: any;
    _components: Object;

    constructor(props: Props) {
        super(props);
        this.generator = createGenerator(props);
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
            props.d = getPath(this.generator, this.props.object);
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
        return argChanged || objectChanged;
    }
    render() {
        const filteredProps = omit(this.props, args);
        const d = getPath(this.generator, this.props);
        return (
            <Svg.Path
                ref={component => (this._component = component)}
                {...filteredProps}
                d={d}
            />
        );
    }
}
SvgD3GeoPath = AnimatedSvgFix(SvgD3GeoPath);
export default SvgD3GeoPath;
