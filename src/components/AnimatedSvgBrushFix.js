import React, { Component } from 'react';
import Color from 'color';

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

const KEYS = ['fill', 'stroke'];

export default function SvgStateFix(WrappedComponent) {
    return class extends Component {
        setNativeProps = (props) => {
            props.propList = getPropList(props, this.props);
            KEYS.reduce((acc, key) => {
                const value = acc[key];
                if (value) {
                    acc[key] = extractBrush(value);
                }
                return acc;
            }, props);
            this._component && this._component.setNativeProps(props);
        }
        render() {
            return (
                <WrappedComponent
                    ref={component => (this._component = component)}
                    {...this.props}
                />
            );
        }
    };
}

