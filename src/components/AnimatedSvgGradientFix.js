/**
 * Problem: Gradients and Stops cannot be animated, cannot use setNativeProps, cannot use setNativeProps for Stops, requires Svg.Stop for children, offset crashes when it goes out of bounds [0, 1]
 * Solution: use setState for everything, replace filler Stop with Svg.Stop, clamp offset
 */

import React, { Component } from 'react';
import { Animated } from 'react-native';
import { Svg } from 'expo';

const childPropKeys = ['offset', 'stopColor', 'stopOpacity'];

function clamp(value) {
    return Math.max(0, Math.min(1, parseFloat(value)));
}

export default function SvgGradientFix(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.listeners = [];
            this.state = this.getStateForChildren(this.props);
        }
        addListenerForStopProp = (prop, stateKey, isClamp) => {
            const addListener = prop._parent ? prop._parent.addListener.bind(prop._parent) : prop.addListener.bind(prop);
            const interpolator = prop._interpolation;
            let callback = e => e;
            if (interpolator) {
                callback = _value => interpolator(_value);
            }
            if (isClamp) {
                let prevCallback = callback;
                callback = _value => clamp(prevCallback(_value));
            }
            let prevCallback = callback;
            callback = e => this.setState({ [stateKey]: prevCallback(e.value).toString() });
            return addListener(callback);
        }
        getStateForChildren = (props) => {
            let newState = {};
            React.Children.forEach(props.children, (child, index) => {
                childPropKeys.forEach((key) => {
                    const prop = child.props[key];
                    const stateKey = 'child' + index + key;
                    if (prop instanceof Animated.Value || prop instanceof Animated.Interpolation) {
                        const isClamp = key === 'offset';
                        let value = prop.__getValue();
                        value = isClamp ? clamp(value) : value;
                        value = value.toString();
                        newState[stateKey] = value;
                        const listener = this.addListenerForStopProp(prop, stateKey, isClamp);
                        this.listeners.push(listener);
                    } else {
                        newState[stateKey] = prop;
                    }
                });
            });
            return newState;
        }
        removeAllListeners = (children) => {
            React.Children.forEach(children, (child) => {
                childPropKeys.forEach((key) => {
                    const prop = child.props[key];
                    if (prop instanceof Animated.Value) {
                        this.listeners.forEach(prop.removeListener);
                    } else if (prop instanceof Animated.Interpolation) {
                        this.listeners.forEach(prop._parent.removeListener);
                    }
                });
            });
            this.listeners = [];
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.children !== this.props.children) {
                this.removeAllListeners(this.props.children);
                this.setState(this.getStateForChildren(nextProps));
            }
        }
        componentWillUnmount() {
            this.removeAllListeners(this.props.children);
        }
        replaceChild = (child, index) => {
            const props = childPropKeys.reduce((acc, key) => {
                acc[key] = this.state['child' + index + key].toString();
                return acc;
            }, {});
            return (
                <Svg.Stop {...props} />
            );
        }
        render() {
            const { children, ...props } = this.props;
            return (
                <WrappedComponent
                    {...props}
                    children={React.Children.map(children, this.replaceChild)}
                />
            );
        }
    };
}
