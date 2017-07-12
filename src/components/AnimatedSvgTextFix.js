// @flow
/**
 * BUG: startOffset not working not even with setState
 * BUG: does not animate unless you have a fill or stroke
 */
// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractText.js

import React, { Component } from 'react';
import { Animated } from 'react-native';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import isNil from 'lodash/isNil';
import defaults from 'lodash/defaults';
import AnimatedSvgBrushFix from './AnimatedSvgBrushFix';
import AnimatedSvgPropStringFix from './AnimatedSvgPropStringFix';
import AnimatedSvgTransformFix from './AnimatedSvgTransformFix';
import { listen, removeListeners } from '../animatedListener';
import type { AnimatedListener } from '../animatedListener';

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
    return fontFamilyString
        ? fontFamilyString
              .split(commaReg)[0]
              .replace(fontFamilyPrefix, '')
              .replace(fontFamilySuffix, '')
        : null;
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
function parseDelta(delta) {
    if (typeof delta === 'string') {
        if (isNaN(+delta)) {
            return delta
                .trim()
                .replace(commaReg, ' ')
                .split(spaceReg)
                .map(d => +d || 0);
        } else {
            return [+delta];
        }
    } else if (typeof delta === 'number') {
        return [delta];
    } else if (Array.isArray(delta)) {
        // have to clone array for mutable animation updates
        return [...delta];
    } else {
        return [];
    }
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
    'fontSize',
    'fontFamily',
    'fontWeight',
    'fontStyle',
    'positionX',
    'positionY',
    'x',
    'y',
    'content',
    'children',
    'deltaX',
    'deltaY'
];

const defaultProps = {
    fill: '#000'
};

export default function SvgTextFix(WrappedComponent, { container } = {}) {
    WrappedComponent = AnimatedSvgBrushFix(WrappedComponent);
    WrappedComponent = AnimatedSvgPropStringFix(WrappedComponent);
    WrappedComponent = AnimatedSvgTransformFix(WrappedComponent);
    class HOComponent extends Component {
        dx: AnimatedListener;
        dy: AnimatedListener;
        static defaultProps = typeof defaultProps;
        constructor(props) {
            super(props);
            this.updateCache(props);
            this.dx = listen(props.dx, _ => this.setNativeProps({ _dx: true }));
            this.dy = listen(props.dy, _ => this.setNativeProps({ _dy: true }));
        }
        updateCache(props) {
            this.prevProps = pick(props, KEYS);
        }
        setNativeProps = props => {
            if (props.dx != null) {
                props.deltaX = parseDelta(props.dx);
            } else if (props._dx) {
                props.deltaX = parseDelta(this.dx.values);
            }

            if (props.dy != null) {
                props.deltaY = parseDelta(props.dy);
            } else if (props._dy) {
                props.deltaY = parseDelta(this.dy.values);
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
        };
        componentWillReceiveProps(nextProps) {
            this.updateCache(nextProps);
            if (nextProps.dx !== this.props.dx) {
                removeListeners(this.dx);
                this.dx = listen(nextProps.dx, _ =>
                    this.setNativeProps({ _dx: true })
                );
            }
            if (nextProps.dy !== this.props.dy) {
                removeListeners(this.dy);
                this.dy = listen(nextProps.dy, _ =>
                    this.setNativeProps({ _dy: true })
                );
            }
        }
        componentWillUnmount() {
            removeListeners(this.dx);
            removeListeners(this.dy);
        }
        render() {
            const deltaX = parseDelta(this.dx.values);
            const deltaY = parseDelta(this.dy.values);
            return (
                <WrappedComponent
                    ref={component => (this._component = component)}
                    {...this.props}
                    deltaX={deltaX}
                    deltaY={deltaY}
                />
            );
        }
    }
    HOComponent.defaultProps = defaultProps;
    HOComponent = AnimatedSvgTransformFix(HOComponent);
    HOComponent = Animated.createAnimatedComponent(HOComponent);
    return HOComponent;
}
