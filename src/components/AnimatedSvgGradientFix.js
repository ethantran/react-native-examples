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
        listeners = []
        getStateForChildren = (props) => {
            let newState = {};
            React.Children.forEach(props.children, (child, index) => {
                childPropKeys.forEach((key) => {
                    const prop = child.props[key];
                    if (prop != null) {
                        if (prop instanceof Animated.Value) {
                            if (key === 'offset') {
                                this.listeners.push(
                                    prop.addListener((e) => {
                                        this.setState({ ['child' + index + key]: clamp(e.value).toString() });
                                    })
                                );
                            } else {
                                this.listeners.push(
                                    prop.addListener((e) => {
                                        this.setState({ ['child' + index + key]: e.value.toString() });
                                    })
                                );
                            }
                        } else if (prop instanceof Animated.Interpolation) {
                            this.listeners.push(
                                prop._parent.addListener((e) => {
                                    this.setState({ ['child' + index + key]: prop._interpolation(e.value).toString() });
                                })
                            );
                        } else {
                            newState['child' + index + key] = prop;
                        }
                    }
                });
                if (newState['child' + index + 'offset']) {
                    newState['child' + index + 'offset'] = clamp(newState['child' + index + 'offset']).toString();
                }
            });
            return newState;
        }
        removeAllListeners = (children) => {
            React.Children.forEach(children, (child) => {
                childPropKeys.forEach((key) => {
                    const prop = child.props[key];
                    if (prop instanceof Animated.Value) {
                        this.listeners.forEach(listener => prop.removeListener(listener));
                    } else if (prop instanceof Animated.Interpolation) {
                        this.listeners.forEach(listener => prop._parent.removeListener(listener));
                    }
                });
            });
        }
        state = this.getStateForChildren(this.props)
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
                acc[key] = this.state['child' + index + key];
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
