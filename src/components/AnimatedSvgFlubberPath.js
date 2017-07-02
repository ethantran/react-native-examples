import React, { Component } from 'react';
import { Svg } from 'expo';
import * as flubber from 'flubber';
import omit from 'lodash/omit';
import AnimatedSvgFix from './AnimatedSvgFix';

/**
 * Problem: What is the best way to animate a path with animated.value?
 * Solution: This demonstrates how you can do it with flubber
 */

const NativeSvgPath = Svg.Path;

export const flubberArgsForType = {
    interpolate: ['fromShape', 'toShape', 'options'],
    toCircle: ['fromShape', 'x', 'y', 'r', 'options'],
    toRect: ['fromShape', 'x', 'y', 'width', 'height', 'options'],
    fromCircle: ['x', 'y', 'r', 'toShape', 'options'],
    fromRect: ['x', 'y', 'width', 'height', 'toShape', 'options'],
    separate: ['fromShape', 'toShapeList', 'options'],
    combine: ['fromShapeList', 'toShape', 'options'],
    interpolateAll: ['fromShapeList', 'toShapeList', 'options'],
};

function createInterpolator(props) {
    if (props.interpolator) {
        return props.interpolator;
    }
    const argsForType = flubberArgsForType[props.interpolatorType];
    const args = argsForType.map(key => props[key]);
    return flubber[props.interpolatorType](...args);
}

class SvgFlubberPath extends Component {
    static defaultProps = {
        t: 0,
        interpolatorType: 'interpolate'
    }
    constructor(props) {
        super(props);
        this._components = [];
        this.interpolator = createInterpolator(props);
        this.cachedRender = this.createRender(props);
    }
    setNativeProps = (props) => {
        if (props.t) {
            if (Array.isArray(this.interpolator)) {
                return;
            } else {
                props.d = this.interpolator(props.t);
            }
        }
        this._component && this._component.setNativeProps(props);
    }
    createRender = (props) => {
        const filteredProps = omit(props, flubberArgsForType[props.interpolatorType]);
        const { t, interpolatorType, children, ...rest } = filteredProps;  // eslint-disable-line no-unused-vars
        if (Array.isArray(this.interpolator)) {
            return (
                <Svg.G>
                    {this.interpolator.map((interpolator, i) => {
                        return (
                            <SvgFlubberPath
                                key={i}
                                {...rest}
                                interpolator={interpolator}
                            />
                        );
                    })}
                </Svg.G>
            );
        }
        const d = this.interpolator(t);
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...rest}
                d={d}
            />
        );
    }
    componentWillReceiveProps(nextProps) {
        if ((nextProps.interpolatorType !== this.props.interpolatorType) || (nextProps.interpolator !== this.props.interpolator)) {
            this.interpolator = createInterpolator(nextProps);
            this.cachedRender = this.createRender(nextProps);
        }
    }
    render() {
        return this.cachedRender;
    }
}
SvgFlubberPath = AnimatedSvgFix(SvgFlubberPath);
export default SvgFlubberPath;
