import React, { Component } from 'react';
import omit from 'lodash/omit';
import Matrix2D from '../Matrix2D';

/**
 * Problem: Animating transform props is not easy
 * Solution: Use Animated.ValueXY, create matrix, use setNativeProps
 */

// https://github.com/react-native-community/react-native-svg/blob/master/lib/extract/extractTransform.js
// modified to deal with nextProps and prevProps situations with both static props on this.props and dynamic props passing through setNativeProps
function _universal2axis(universal, axisX, axisY, defaultValue) {
    let x;
    let y;
    if (typeof universal === 'object') {
        x = universal.x;
        y = universal.y;
    } else if (typeof universal === 'number') {
        x = y = universal;
    }

    axisX = +axisX;
    if (!isNaN(axisX)) {
        x = axisX;
    }

    axisY = +axisY;
    if (!isNaN(axisY)) {
        y = axisY;
    }

    return [x || defaultValue || 0, y || defaultValue || 0];
}
function universal2axis(key, nextProps, prevProps, defaultValue) {
    let [nextX, nextY] = _universal2axis(nextProps[key], nextProps[key + 'X'], nextProps[key + 'Y']);
    let [prevX, prevY] = _universal2axis(prevProps[key], prevProps[key + 'X'], prevProps[key + 'Y'], defaultValue);
    return [nextX || nextY, prevX || prevY];
}
function createTransformObject(nextProps, prevProps) {
    const [originX, originY] = universal2axis('origin', nextProps, prevProps);
    const [scaleX, scaleY] = universal2axis('scale', nextProps, prevProps, 1);
    const [skewX, skewY] = universal2axis('skew', nextProps, prevProps);
    const [translateX, translateY] = universal2axis('translate', nextProps, prevProps);
    const x = translateX || nextProps.x || prevProps.x || 0;
    const y = translateY || nextProps.y || prevProps.y || 0;
    const rotation = +nextProps.rotation || +nextProps.rotate || +prevProps.rotation || +prevProps.rotate || 0;
    return {
        rotation,
        originX,
        originY,
        scaleX,
        scaleY,
        skewX,
        skewY,
        x,
        y
    };
}
let pooledMatrix = new Matrix2D();
function createTransformMatrix(props, transform) {
    pooledMatrix.reset();
    appendTransform(props);

    if (transform) {
        appendTransform(transform);
    }

    return pooledMatrix.toArray();
}
function appendTransform(transform) {
    pooledMatrix
        .appendTransform(
        transform.x + transform.originX,
        transform.y + transform.originY,
        transform.scaleX, transform.scaleY,
        transform.rotation,
        transform.skewX,
        transform.skewY,
        transform.originX,
        transform.originY
        );
}

const UNIVERSAL_KEYS = ['origin', 'scale', 'skew', 'translate'];
const KEYS = [...UNIVERSAL_KEYS, 'originX', 'originY', 'scaleX', 'scaleY', 'skewX', 'skewY', 'translateX', 'translateY', 'x', 'y', 'rotation', 'rotate'];

export default function SvgTransformFix(WrappedComponent) {
    return class extends Component {
        setNativeProps = (props) => {
            const matrix = createTransformMatrix(createTransformObject(props, this.props));
            props = omit(props, KEYS);
            this._component && this._component.setNativeProps({
                ...props,
                matrix
            });
        }
        render() {
            // throws warning if transform props are objects
            let { origin, scale, skew, translate, ...props } = this.props;
            if (typeof origin === 'object') {
                origin = origin.x + ', ' + origin.y;
            }
            if (typeof scale === 'object') {
                scale = scale.x + ', ' + scale.y;
            }
            if (typeof skew === 'object') {
                skew = skew.x + ', ' + skew.y;
            }
            if (typeof translate === 'object') {
                translate = translate.x + ', ' + translate.y;
            }
            return (
                <WrappedComponent
                    ref={component => (this._component = component)}
                    {...props}
                    origin={origin}
                    scale={scale}
                    skew={skew}
                    translate={translate}
                />
            );
        }
    };
}
