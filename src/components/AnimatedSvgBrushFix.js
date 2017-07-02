import React, { Component } from 'react';
import { Animated } from 'react-native';
import Color from 'color';
import pick from 'lodash/pick';

import StrokeDasharray from './AnimatedSvgStrokeDasharray';

/**
 * Problem: Color props such as fill and stroke cannot be animated through setNativeProps. They can be animated through state, but setNativeProps is better
 * Solution: Extract brush, update propList (does not seem to do anything but to be consistent extractProps I did it anyway)
 */

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractBrush.js
function extractBrush(colorOrBrush) {
    if (colorOrBrush === 'none' || colorOrBrush == null) {
        return null;
    }
    try {
        let matched = colorOrBrush.match(/^url\(#(.+?)\)$/);
        if (matched) {
            return [1, matched[1]];
        } else {
            let c = new Color(colorOrBrush).rgbaArray();
            return [0, c[0] / 255, c[1] / 255, c[2] / 255, c[3]];
        }
    } catch (err) {
        console.warn(`"${colorOrBrush}" is not a valid color or brush`);
        return null;
    }
}

const fillKeys = ['fill', 'fillOpacity', 'fillRule'];
const strokeKeys = [
    'stroke',
    'strokeWidth',
    'strokeOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeMiterlimit'
];

function getPropList(nextProps, prevProps) {
    let propList = [];
    fillKeys.forEach((name) => {
        if (nextProps.hasOwnProperty(name) || prevProps.hasOwnProperty(name)) {
            propList.push(name);
        }
    });
    strokeKeys.forEach((name) => {
        if (nextProps.hasOwnProperty(name) || prevProps.hasOwnProperty(name)) {
            propList.push(name);
        }
    });
    return propList;
}

function getStrokeDasharray(strokeDasharray) {
    if (strokeDasharray && strokeDasharray.length === 1) {
        strokeDasharray.push(strokeDasharray[0]);
    }
    return strokeDasharray;
}

function getStrokeDashoffset(nextProps, prevProps) {
    const strokeDasharray = getStrokeDasharray(nextProps.strokeDasharray) || getStrokeDasharray(prevProps.strokeDasharray);
    return strokeDasharray ? (+nextProps.strokeDashoffset || +prevProps.strokeDashoffset || 0) : null;
}

const KEYS = ['fill', 'stroke', 'strokeDashoffset'];

export default function SvgBrushFix(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.listeners = [];
            this.strokeDasharray = [];
            this.updateCache(props);
            this.listenToChildren(props);
        }
        updateCache(props) {
            this.prevProps = pick(props, KEYS);
        }
        setNativeProps = (props) => {
            props.propList = getPropList(props, this.prevProps);
            if (props.fill) {
                props.fill = extractBrush(props.fill);
            }
            if (props.stroke) {
                props.stroke = extractBrush(props.stroke);
            }
            if (props.updateStrokeDasharray || props.strokeDashoffset) {
                props.strokeDasharray = getStrokeDasharray(this.strokeDasharray);
                props.strokeDashoffset = getStrokeDashoffset(props, this.prevProps);
            }
            this._component && this._component.setNativeProps(props);
        }
        // immutable update 
        updateStrokeDasharrayValueForIndex = (value, index) => {
            let newStrokeDasharray = [...this.strokeDasharray];
            newStrokeDasharray[index] = value;
            return newStrokeDasharray;
        }
        addListenerForAnimatedStrokeDasharrayProp = (prop, index) => {
            const addListener = prop._parent ? prop._parent.addListener.bind(prop._parent) : prop.addListener.bind(prop);
            const interpolator = prop._interpolation;
            let callback = e => e;
            if (interpolator) {
                callback = _value => interpolator(_value);
            }
            let prevCallback = callback;
            callback = e => {
                const value = prevCallback(e.value);
                this.strokeDasharray = this.updateStrokeDasharrayValueForIndex(value, index);
                this.setNativeProps({ updateStrokeDasharray: true });
            };
            return addListener(callback);
        }
        listenToChildren = ({ children }) => {
            let strokeDasharray = [];
            let strokeDasharrayIndex = 0;
            React.Children.forEach(children, (child) => {
                if (child) {
                    if (child.type === StrokeDasharray) {
                        const prop = child.props.value;
                        if (prop instanceof Animated.Value || prop instanceof Animated.Interpolation) {
                            strokeDasharray[strokeDasharrayIndex] = prop.__getValue();
                            const listener = this.addListenerForAnimatedStrokeDasharrayProp(prop, strokeDasharrayIndex);
                            this.listeners.push(listener);
                        } else {
                            strokeDasharray[strokeDasharrayIndex] = prop;
                        }
                        strokeDasharrayIndex += 1;
                    }
                }
            });
            this.strokeDasharray = strokeDasharray;
        }
        removeAllListeners = ({ children }) => {
            React.Children.forEach(children, (child) => {
                if (child) {
                    if (child.type === StrokeDasharray) {
                        const prop = child.props.value;
                        if (prop instanceof Animated.Value) {
                            this.listeners.forEach(listener => prop.removeListener(listener));
                        } else if (prop instanceof Animated.Interpolation) {
                            this.listeners.forEach(listener => prop._parent.removeListener(listener));
                        }
                    }
                }
            });
            this.listeners = [];
        }
        componentWillReceiveProps(nextProps) {
            this.updateCache(nextProps);
            if (nextProps.children !== this.props.children) {
                this.removeAllListeners(this.props);
                this.listenToChildren(nextProps);
                this.setNativeProps({ updateStrokeDasharray: true });
            }
        }
        componentWillUnmount() {
            this.removeAllListeners(this.props);
        }
        render() {
            return (
                <WrappedComponent
                    ref={component => (this._component = component)}
                    {...this.props}
                    strokeDasharray={this.strokeDasharray}
                />
            );
        }
    };
}

