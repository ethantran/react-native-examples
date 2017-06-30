import React, { Component } from 'react';
import { Svg } from 'expo';
import { Animated } from 'react-native';
import * as d3 from 'd3-path';

import AnimatedSvgFix from './AnimatedSvgFix';
import D3PathCommand from './D3PathCommand';

/**
 * Problem: What is the best way to animate a path with animated.value?
 * Solution: This demonstrates how you can do it with d3-path
 */

const D3Args = {
    moveTo: ['x', 'y'],
    closePath: [],
    lineTo: ['x', 'y'],
    quadraticCurveTo: ['cpx', 'cpy', 'x', 'y'],
    bezierCurveTo: ['cpx1', 'cpy1', 'cpx2', 'cpy2', 'x', 'y'],
    arcTo: ['x1', 'y1', 'x2', 'y2', 'radius'],
    arc: ['x', 'y', 'radius', 'startAngle', 'endAngle', 'anticlockwise'],
    rect: ['x', 'y', 'w', 'h']
};

const NativeSvgPath = Svg.Path;

class SvgD3Path extends Component {
    constructor(props) {
        super(props);
        this.listeners = [];
        this.steps = [];
        this.listenToChildren(props);
    }
    setNativeProps = (props = {}) => {
        if (props.useD3Path) {
            props.d = this.createPathFromSteps();
        }
        this._component && this._component.setNativeProps(props);
    }
    createPathFromSteps = () => {
        let path = d3.path();
        this.steps.forEach((step) => {
            const args = D3Args[step.command].map((key) => step[key]);
            path[step.command](...args);
        });
        return path.toString();
    }
    listenToChildren = ({ children }) => {
        this.steps = [];
        React.Children.forEach(children, (child, i) => {
            this.steps[i] = {};
            if (child.type === D3PathCommand) {
                this.steps[i].command = child.props.command;
                D3Args[child.props.command].forEach((key) => {
                    const prop = child.props[key];
                    if (prop instanceof Animated.Value || prop instanceof Animated.Interpolation) {
                        const addListener = prop._parent ? prop._parent.addListener.bind(prop._parent) : prop.addListener.bind(prop);
                        const interpolator = prop._interpolation;
                        // initial value
                        this.steps[i][key] = prop.__getValue();
                        let callback = e => e;
                        if (interpolator) {
                            callback = _value => interpolator(_value);
                        }
                        let prevCallback = callback;
                        callback = e => {
                            this.steps[i][key] = prevCallback(e.value);
                            this.setNativeProps({ useD3Path: true });
                        };
                        const listener = addListener(callback);
                        this.listeners.push(listener);
                    } else {
                        this.steps[i][key] = prop;
                    }
                });
            }
        });
    }
    removeAllListeners = ({ children }) => {
        React.Children.forEach(children, (child) => {
            D3Args[child.props.command].forEach((key) => {
                const prop = child.props[key];
                if (prop instanceof Animated.Value) {
                    this.listeners.forEach(listener => prop.removeListener(listener));
                } else if (prop instanceof Animated.Interpolation) {
                    this.listeners.forEach(listener => prop._parent.removeListener(listener));
                }
            });
        });
        this.listeners = [];
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.children !== this.props.children) {
            this.removeAllListeners(this.props);
            this.listenToChildren(nextProps);
            const d = this.createPathFromSteps();
            this.setNativeProps({ d });
        }
    }
    componentWillUnmount() {
        this.removeAllListeners(this.props);
    }
    render() {
        const { children, ...props } = this.props; // eslint-disable-line no-unused-vars
        const d = this.createPathFromSteps();
        return (
            <NativeSvgPath
                ref={component => (this._component = component)}
                {...props}
                d={d}
            />
        );
    }
}
SvgD3Path = AnimatedSvgFix(SvgD3Path);
export default SvgD3Path;
