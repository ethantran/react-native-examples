import React, { Component } from 'react';
import { Animated } from 'react-native';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import isNil from 'lodash/isNil';
import defaults from 'lodash/defaults';
import AnimatedSvgBrushFix from './AnimatedSvgBrushFix';
import AnimatedSvgPropStringFix from './AnimatedSvgPropStringFix';
import AnimatedSvgTransformFix from './AnimatedSvgTransformFix';

/**
 * Problem: Animating dx and dy with a list of values is not possible, fontSize and startOffset do not animate
 * Solution: Combine props dx0, dx1, dx2, ..., dxn into deltaX array, use extractText, and use setNativeProps
 * BUG: startOffset not working not even with setState
 */

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractText.js

function getKeysWithString(props, str) {
    return Object.keys(props).filter(key => key.includes(str));
}

// modified for setNativeProps
const fontRegExp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?)[ptexm%]*(?:\s*\/.*?)?\s+)?\s*"?([^"]*)/i;
const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;
const spaceReg = /\s+/;
const commaReg = /,/g;
let cachedFontObjectsFromString = {};
function extractSingleFontFamily(fontFamilyString) {
    // SVG on the web allows for multiple font-families to be specified.
    // For compatibility, we extract the first font-family, hoping
    // we'll get a match.
    return fontFamilyString ? fontFamilyString.split(commaReg)[0]
        .replace(fontFamilyPrefix, '')
        .replace(fontFamilySuffix, '') : null;
}
function parseFontString(font) {
    if (cachedFontObjectsFromString.hasOwnProperty(font)) {
        return cachedFontObjectsFromString[font];
    }
    let match = fontRegExp.exec(font);
    if (!match) {
        return null;
    }
    let fontFamily = extractSingleFontFamily(match[3]);
    let fontSize = +match[2] || 12;
    let isBold = /bold/.exec(match[1]);
    let isItalic = /italic/.exec(match[1]);
    cachedFontObjectsFromString[font] = {
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal'
    };
    return cachedFontObjectsFromString[font];
}
function extractFont(props, prevProps) {
    let font = props.font || prevProps.font;
    let fontSize = +props.fontSize || +prevProps.fontSize;
    let fontFamily = props.fontFamily || prevProps.fontFamily;
    let ownedFont = {
        fontFamily: extractSingleFontFamily(fontFamily),
        fontSize: isNaN(fontSize) ? null : fontSize,
        fontWeight: props.fontWeight || prevProps.fontWeight,
        fontStyle: props.fontStyle || prevProps.fontStyle
    };
    if (typeof font === 'string') {
        font = parseFontString(font);
    }
    ownedFont = pickBy(ownedFont, prop => !isNil(prop));
    return defaults(ownedFont, font);
}
function _parseDelta(delta) {
    if (typeof delta === 'string') {
        if (isNaN(+delta)) {
            return delta.trim().replace(commaReg, ' ').split(spaceReg).map(d => +d || 0);
        } else {
            return [+delta];
        }
    } else if (typeof delta === 'number') {
        return [delta];
    } else {
        return [];
    }
}
function parseDelta(key, nextProps, prevProps) {
    return _parseDelta(nextProps[key]).length ? _parseDelta(nextProps[key]) : _parseDelta(prevProps[key]);
}

function getPosition(key, nextProps, prevProps) {
    const next = nextProps[key];
    if (next != null) {
        return next.toString();
    }
    const prev = prevProps[key];
    if (prev != null) {
        return prev.toString();
    }
    return null;
}

function getStartOffset(props, prevProps) {
    return (props.startOffset || this.prevProps.startOffset || 0).toString();
}

const KEYS = [
    'startOffset',
    'fontSize', 'fontFamily', 'fontWeight', 'fontStyle',
    'positionX', 'positionY', 'x', 'y',
    'content', 'children'
];

export default function SvgTextFix(WrappedComponent, { container } = {}) {
    WrappedComponent = AnimatedSvgBrushFix(WrappedComponent);
    WrappedComponent = AnimatedSvgPropStringFix(WrappedComponent);
    WrappedComponent = AnimatedSvgTransformFix(WrappedComponent);
    class HOComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.updateCache(props);
        }
        updateCache(props) {
            this.deltaXKeys = getKeysWithString(props, 'dx');
            this.deltaYKeys = getKeysWithString(props, 'dy');
            this.totalKeys = [...KEYS, ...this.deltaXKeys, ...this.deltaYKeys];
            this.prevDeltaXProps = pick(props, this.deltaXKeys);
            this.prevDeltaYProps = pick(props, this.deltaYKeys);
            this.prevProps = pick(props, KEYS);
        }
        setNativeProps = (props) => {
            if (props.dx != null) {
                props.deltaX = parseDelta('dx', props, this.prevDeltaXProps);
            }
            // if some dxn exists in props that means we need to recreate deltaX
            else if (this.deltaXKeys.some((key, index) => props[key] != null)) {
                props.deltaX = this.createDeltaArray(props, this.prevDeltaXProps, this.deltaXKeys);
            }
            // cache dynamic values since all deltas are required to generate a new delta list
            if (props.deltaX != null) {
                this.prevDeltaXProps = Object.assign(this.prevDeltaXProps, pick(props, this.deltaXKeys));
            }

            if (props.dy != null) {
                props.deltaY = parseDelta('dy', props, this.prevDeltaYProps);
            }
            // if some dyn exists in props that means we need to recreate deltaY
            else if (this.deltaYKeys.some((key, index) => props[key] != null)) {
                props.deltaY = this.createDeltaArray(props, this.prevDeltaYProps, this.deltaYKeys);
            }
            // cache dynamic values since all deltas are required to generate a new delta list
            if (props.deltaY) {
                this.prevDeltaYProps = Object.assign(this.prevDeltaYProps, pick(props, this.totalDeltaYKeys));
            }

            if (props.startOffset != null) {
                props.startOffset = getStartOffset(props, this.prevProps);
                this.prevProps.startOffset = props.startOffset;
                // this.setState({startOffset: props.startOffset});
            }

            if (props.x != null) {
                props.positionX = getPosition('x', props, this.prevProps);
                // ONLY DO THIS FOR TEXT OR MATRIX WILL MESS UP
                props.x = null;
                this.prevProps.positionX = props.positionX;
                this.prevProps.x = props.x;
            }
            if (props.y != null) {
                props.positionY = getPosition('y', props, this.prevProps);
                // ONLY DO THIS FOR TEXT OR MATRIX WILL MESS UP
                props.y = null;
                this.prevProps.positionY = props.positionY;
                this.prevProps.y = props.y;
            }
            if (props.fontSize != null) {
                props.font = extractFont(props, this.prevProps);
            }
            this._component && this._component.setNativeProps(props);
        }
        createDeltaArray = (props, prevProps, keys) => {
            return keys.map((key) => {
                const newDelta = props[key];
                if (typeof newDelta === 'number') {
                    return newDelta;
                }
                return +newDelta || prevProps[key] || 0;
            });
        }
        componentWillReceiveProps(nextProps) {
            this.updateCache(nextProps);
        }
        render() {
            return (
                <WrappedComponent
                    ref={component => (this._component = component)}
                    {...this.props}
                    {...this.state}
                />
            );
        }
    }
    HOComponent = AnimatedSvgTransformFix(HOComponent);
    HOComponent = Animated.createAnimatedComponent(HOComponent);
    return HOComponent;
}
