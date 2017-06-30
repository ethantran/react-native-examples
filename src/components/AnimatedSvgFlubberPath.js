import React, { Component } from 'react';
import { Svg } from 'expo';
// import * as flubber from 'flubber';
import omit from 'lodash/omit';
import AnimatedSvgFix from './AnimatedSvgFix';
const flubber = {}

/**
 * Problem: What is the best way to animate a path with animated.value?
 * Solution: This demonstrates how you can do it with flubber
 */

const NativeSvgPath = Svg.Path;

const flubberArgs = {
    toCircle: ['fromShape', 'x', 'y', 'r', 'options'],
    toRect: ['fromShape', 'x', 'y', 'width', 'height', 'options'],
    fromCircle: ['x', 'y', 'r', 'toShape', 'options'],
    fromRect: ['x', 'y', 'width', 'height', 'toShape', 'options'],
    separate: ['fromShape', 'toShapeList', 'options'],
    combine: ['fromShapeList', 'toShape', 'options'],
    interpolateAll: ['fromShapeList', 'toShapeList', 'options'],
    interpolate: ['fromShape', 'toShape', 'options'],
};

function createInterpolator(props) {
    const args = flubberArgs[props.interpolatorType].map(key => props[key]);
    return flubber[props.interpolatorType](...args);
}

class SvgFlubberPath extends Component {
    static defaultProps = {
        t: 0,
        interpolatorType: 'interpolate'
    }
    constructor(props) {
        super(props);
        this.interpolator = createInterpolator(props);
    }
    setNativeProps = (props) => {
        if (props.t) {
            props.d = this.interpolator(props.t);
        }
        this._component && this._component.setNativeProps(props);
    }
    componentWillReceiveProps(nextProps) {
        this.interpolator = createInterpolator(nextProps);
    }
    render() {
        const { t, interpolatorType, ...props } = omit(this.props, flubberArgs[this.props.interpolatorType]);  // eslint-disable-line no-unused-vars
        const d = this.interpolator(t);
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...props}
                d={d}
            />
        );
    }
}
SvgFlubberPath = AnimatedSvgFix(SvgFlubberPath);
export default SvgFlubberPath;
