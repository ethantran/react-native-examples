import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

const NativeSvgPath = Svg.Path;

export const args = ['innerRadius', 'outerRadius', 'startAngle', 'endAngle', 'centroid', 'cornerRadius', 'padAngle', 'padRadius'];

function createGenerator(props) {
    return d3.arc(pick(props, args));
}

function createPath(generator, props, prevProps) {
    return generator({
        ...prevProps,
        ...pick(props, args)
    });
}

class SvgD3ShapeArc extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.prevProps = pick(props, args);
        this.d = createPath(this.generator, this.props, this.prevProps);
    }
    setNativeProps = (props = {}) => {
        if (args.some((key, index) => props[key] != null)) {
            props.d = createPath(this.generator, props, this.prevProps);
            this.prevProps = Object.assign(this.prevProps, pick(props, args));
        }
        this._component && this._component.setNativeProps(props);
    }
    shouldComponentUpdate(nextProps) {
        const argChanged = args.some((key, index) => nextProps[key] !== this.props[key]);
        if (argChanged) {
            this.d = createPath(this.generator, this.props, this.prevProps);
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
