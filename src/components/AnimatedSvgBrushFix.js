import React, { Component } from 'react';
import omit from 'lodash/omit';
import Color from 'color';

/**
 * Problem: Color props such as fill and stroke cannot be animated through setNativeProps. They can be animated through state, but setNativeProps is better
 * Solution: Extract brush, update propList
 */

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/patternReg.js
function extractBrush(colorOrBrush) {
    /*eslint eqeqeq:0*/
    if (colorOrBrush === 'none' || colorOrBrush == null) {
        return null;
    }

    try {
        let matched = colorOrBrush.match(/^url\(#(.+?)\)$/);
        // brush
        if (matched) {
            return [1, matched[1]];
            //todo:
        } else { // solid color
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
            // console.log(props.fill)
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

