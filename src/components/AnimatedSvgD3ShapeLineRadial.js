import React, { Component } from 'react';
import { Svg } from 'expo';
import * as d3 from 'd3-shape';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

type LineRadial = d3.LineRadial;

const NativeSvgPath = Svg.Path;

export const args = ['angle', 'radius', 'defined', 'curve'];

function createGenerator(props, generator?: LineRadial): LineRadial {
    generator = generator || d3.lineRadial();
    return args.reduce((acc: LineRadial, arg) => {
        const prop = props[arg];
        if (prop) {
            return acc[arg](prop);
        }
        return acc;
    }, generator);
}

function createPath(generator: LineRadial, data): string {
    return generator(data);
}

class SvgD3ShapeLineRadial extends Component {
    generator: LineRadial;
    data: AnimatedListener;
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.data = listen(props.data, _ => this.setNativeProps({ _listener: true }));
    }
    setNativeProps = (props = {}) => {
        const argChanged = args.some((key, index) => props[key] != null);
        if (argChanged) {
            this.generator = createGenerator(props, this.generator);
        }
        if (argChanged || props._listener) {
            props.d = createPath(this.generator, this.data.values);
        }
        this._component && this._component.setNativeProps(props);
    }
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some((key, index) => nextProps[key] !== this.props[key]);
        const dataChanged = nextProps.data !== this.props.data;
        if (argChanged) {
            this.generator = createGenerator(nextProps, this.generator);
        }
        if (dataChanged) {
            removeListeners(this.data);
            this.data = listen(nextProps.data, _ => this.setNativeProps({ _listener: true }));
        }
        return argChanged || dataChanged;
    }
    componentWillUnmount() {
        removeListeners(this.data);
    }
    render() {
        const filteredProps = omit(this.props, args);
        const d = createPath(this.generator, this.data.values);
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...filteredProps}
                d={d}
            />
        );
    }
}
SvgD3ShapeLineRadial = AnimatedSvgFix(SvgD3ShapeLineRadial);
export default SvgD3ShapeLineRadial;
