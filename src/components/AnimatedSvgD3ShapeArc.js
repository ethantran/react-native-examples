// @flow
import React, { Component } from 'react';
import { Svg } from 'expo';
import * as d3 from 'd3-shape';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

type Arc = d3.Arc;

const NativeSvgPath = Svg.Path;

export const args = ['innerRadius', 'outerRadius', 'startAngle', 'endAngle', 'centroid', 'cornerRadius', 'padAngle', 'padRadius'];

function createGenerator(props, generator?: Arc): Arc {
    generator = generator || d3.arc();
    return args.reduce((acc: Arc, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function createPath(generator: Arc, props): string {
    return generator(pick(props, args));
}

class SvgD3ShapeArc extends Component {
    generator: Arc;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
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
            this.generator = createGenerator(nextProps, this.generator);
        }
        return argChanged;
    }
    render() {
        const filteredProps = omit(this.props, args);
        const d = createPath(this.generator, pick(this.props, args));
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...filteredProps}
                d={d}
            />
        );
    }
}
SvgD3ShapeArc = AnimatedSvgFix(SvgD3ShapeArc);
export default SvgD3ShapeArc;
