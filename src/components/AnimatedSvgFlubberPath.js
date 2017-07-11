import React, { Component } from 'react';
import { Svg } from 'expo';
import * as flubber from 'flubber';
import omit from 'lodash/omit';
import AnimatedSvgFix from './AnimatedSvgFix';

/**
 * Problem: What is the best way to animate a path with animated.value?
 * Solution: This demonstrates how you can do it with flubber
 * BUG: array interpolators doesn't work (options.single = false)
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
    }
    setNativeProps = (props) => {
        if (props.t) {
            if (Array.isArray(this.interpolator)) {
                this.interpolator.forEach((childInterpolator, i) => {
                    const component = this._components[i];
                    component && component.setNativeProps({ d: childInterpolator(props.t) });
                });
            } else {
                props.d = this.interpolator(props.t);
            }
        }
        this._component && this._component.setNativeProps(props);
    }
    shouldComponentUpdate(nextProps) {
        const typeChanged = nextProps.interpolatorType !== this.props.interpolatorType;
        const interpolatorChanged = nextProps.interpolator !== this.props.interpolator;
        const args = flubberArgsForType[nextProps.interpolatorType] || [];
        const argChanged = args.some((key, index) => nextProps[key] !== this.props[key]);
        if (typeChanged || interpolatorChanged || argChanged) {
            this.interpolator = createInterpolator(nextProps);
            return true;
        }
        return false;
    }
    render() {
        const args = flubberArgsForType[this.props.interpolatorType];
        const filteredProps = omit(this.props, args);
        const { t, interpolatorType, interpolator, children, ...rest } = filteredProps;  // eslint-disable-line no-unused-vars
        if (Array.isArray(this.interpolator)) {
            return (
                <Svg.G
                    ref={component => (this._component = component)}
                    {...rest}>
                    {this.interpolator.map((childInterpolator, i) => {
                        return (
                            <SvgFlubberPath
                                ref={component => (this._components[i] = component)}
                                key={i}
                                t={t}
                                interpolator={childInterpolator}
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
}
SvgFlubberPath = AnimatedSvgFix(SvgFlubberPath);
export default SvgFlubberPath;
