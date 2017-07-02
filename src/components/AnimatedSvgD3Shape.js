import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-shape';
console.log(d3)
import pick from 'lodash/pick';
import omit from 'lodash/omit';

import AnimatedSvgFix from './AnimatedSvgFix';

/**
 * Problem: What is the best way to animate a path with animated.value?
 * Solution: This demonstrates how you can do it with d3-shape
 */
const NativeSvgPath = Svg.Path;

export const argsForShape = {
    arc: ['innerRadius', 'outerRadius', 'startAngle', 'endAngle', 'centroid', 'cornerRadius', 'padAngle', 'padRadius'],
    pie: ['startAngle', 'endAngle', 'padAngle'],
};

function createGenerator(props) {
    const argsForType = argsForShape[props.generatorType];
    if (!argsForType) {
        return null;
    }
    const args = argsForType.map(key => props[key]);
    return d3[props.generatorType](...args);
}

function createPath(generator, props, prevProps) {
    return generator ? generator({
        ...prevProps,
        ...props
    }) : '';
}

class SvgD3Shape extends Component {
    constructor(props) {
        super(props);
        this.generator = createGenerator(props);
        this.prevProps = pick(props, argsForShape[props.generatorType]);
    }
    setNativeProps = (props = {}) => {
        const argsForType = argsForShape[this.props.generatorType];
        if (props.updateD3Shape || argsForType.some((key, index) => props[key] != null)) {
            props.d = createPath(this.generator, props, this.prevProps);
            this.prevProps = Object.assign(this.prevProps, pick(props, argsForShape[this.props.generatorType]));
        }
        this._component && this._component.setNativeProps(props);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.generatorType !== this.props.generatorType) {
            this.generator = createGenerator(nextProps);
        }
    }
    render() {
        const props = omit(this.props, argsForShape[this.props.generatorType]);
        const d = createPath(this.generator, props, this.prevProps);
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...props}
                d={d}
            />
        );
    }
}
SvgD3Shape = AnimatedSvgFix(SvgD3Shape);
export default SvgD3Shape;
