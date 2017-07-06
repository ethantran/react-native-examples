import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgPath = Svg.Path;

export const args = ['innerRadius', 'outerRadius', 'startAngle', 'endAngle', 'centroid', 'cornerRadius', 'padAngle', 'padRadius'];

function createGenerator(props, generator) {
    generator = generator || d3.arc();
    return args.reduce((acc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](props[arg]);
        }
        return acc;
    }, generator);
}

function createPath(generator, props) {
    return generator(pick(props, args));
}

class SvgD3ShapeArc extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.d = createPath(this.generator, pick(props, args));
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
            props.d = createPath(this.generator, pick(props, args));
        }
        this._component && this._component.setNativeProps(props);
    }
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some((key, index) => nextProps[key] !== this.props[key]);
        if (argChanged) {
            this.d = createPath(this.generator, pick(nextProps, args));
        }
        return argChanged;
    }
    render() {
        const filteredProps = omit(this.props, args);
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...filteredProps}
                d={this.d}
            />
        );
    }
}
SvgD3ShapeArc = AnimatedSvgFix(SvgD3ShapeArc);
export default SvgD3ShapeArc;
