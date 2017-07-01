import React, { Component } from 'react';
import { Svg } from 'expo';
import * as flubber from 'flubber';
import omit from 'lodash/omit';
import AnimatedSvgFix from './AnimatedSvgFix';

/**
 * Problem: What is the best way to animate a path with animated.value?
 * Solution: This demonstrates how you can do it with flubber
 * BUG: separate
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
const allFlubberArgs = ['fromShape', 'fromShapeList', 'toShape', 'toShapeList', 'x', 'y', 'r', 'width', 'height', 'options'];

function createInterpolator(props) {
    if (props.interpolator) {
        return props.interpolator;
    }
    const argsForType = flubberArgs[props.interpolatorType];
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
                this._components.forEach((component, i) => {
                    props.d = this.interpolator[i](props.t);
                    component && component.setNativeProps(props);
                });
                return;
            } else {
                props.d = this.interpolator(props.t);
            }
        }
        this._component && this._component.setNativeProps(props);
    }
    createRender = (props) => {
        const filteredProps = omit(props, allFlubberArgs);
        const { t, interpolatorType, children, ...rest } = filteredProps;  // eslint-disable-line no-unused-vars
        if (Array.isArray(this.interpolator)) {
            return (
                <Svg.G>
                    {this.interpolator.map((interpolator, i) => {
                        const d = interpolator(t);
                        return (
                            <NativeSvgPath
                                ref={component => (this._components[i] = component)}
                                key={i}
                                {...rest}
                                d={d}
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
        if (nextProps.interpolatorType !== this.props.interpolatorType) {
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
