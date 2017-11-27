// @flow
/**
 * Problem: Color props such as fill and stroke cannot be animated through setNativeProps. They can be animated through state, but setNativeProps is better
 * Solution: Extract brush, update propList (does not seem to do anything but to be consistent extractProps I did it anyway)
 */
import React, { Component } from 'react';
import Color from 'color';
import pick from 'lodash/pick';

import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractBrush.js
const patternReg = /^url\(#(.+?)\)$/;
function extractBrush(colorOrBrush) {
    if (colorOrBrush === 'none' || !colorOrBrush) {
        return null;
    }
    try {
        let matched = colorOrBrush.match(patternReg);
        // brush
        if (matched) {
            return [1, matched[1]];
            //todo:
        } else { // solid color
            let [r, g, b, a = 1] = Color(colorOrBrush).rgb().array();
            return [0, r / 255, g / 255, b / 255, a];
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
    fillKeys.forEach(name => {
        if (nextProps.hasOwnProperty(name) || prevProps.hasOwnProperty(name)) {
            propList.push(name);
        }
    });
    strokeKeys.forEach(name => {
        if (nextProps.hasOwnProperty(name) || prevProps.hasOwnProperty(name)) {
            propList.push(name);
        }
    });
    return propList;
}

const separator = /\s*,\s*/;
function getStrokeDasharray(strokeDasharray) {
    if (typeof strokeDasharray === 'string') {
        strokeDasharray = strokeDasharray.split(separator).map(dash => +dash);
    }
    if (strokeDasharray && strokeDasharray.length === 1) {
        strokeDasharray.push(strokeDasharray[0]);
    }
    // have to clone array to allow animation with mutable changes
    return strokeDasharray ? [...strokeDasharray] : strokeDasharray;
}

function getStrokeDashoffset(nextProps, prevProps) {
    const strokeDasharray =
        getStrokeDasharray(nextProps.strokeDasharray) ||
        getStrokeDasharray(prevProps.strokeDasharray);
    return strokeDasharray
        ? +nextProps.strokeDashoffset || +prevProps.strokeDashoffset || 0
        : null;
}

const KEYS = ['fill', 'stroke', 'strokeDashoffset'];

export default function SvgBrushFix(WrappedComponent) {
    return class extends Component {
        strokeDasharray: AnimatedListener;
        constructor(props) {
            super(props);
            this.updateCache(props);
            this.strokeDasharray = listen(props.strokeDasharray, _ =>
                this.setNativeProps({ updateStrokeDasharray: true })
            );
        }
        updateCache(props) {
            this.prevProps = pick(props, KEYS);
        }
        setNativeProps = props => {
            props.propList = getPropList(props, this.prevProps);
            if (props.fill) {
                props.fill = extractBrush(props.fill);
            }
            if (props.stroke) {
                props.stroke = extractBrush(props.stroke);
            }
            if (props.updateStrokeDasharray || props.strokeDashoffset) {
                props.strokeDasharray = getStrokeDasharray(
                    this.strokeDasharray.values
                );
                props.strokeDashoffset = getStrokeDashoffset(
                    props,
                    this.prevProps
                );
            }
            this._component && this._component.setNativeProps(props);
        };
        componentWillReceiveProps(nextProps) {
            this.updateCache(nextProps);
            if (nextProps.children !== this.props.children) {
                removeListeners(this.strokeDasharray);
                this.strokeDasharray = listen(nextProps.strokeDasharray, _ =>
                    this.setNativeProps({ updateStrokeDasharray: true })
                );
            }
        }
        componentWillUnmount() {
            removeListeners(this.strokeDasharray);
        }
        render() {
            const strokeDasharray = getStrokeDasharray(
                this.strokeDasharray.values
            );
            return (
                <WrappedComponent
                    ref={component => (this._component = component)}
                    {...this.props}
                    strokeDasharray={strokeDasharray}
                />
            );
        }
    };
}
