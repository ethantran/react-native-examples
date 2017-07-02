import React, { Component } from 'react';
import { Animated } from 'react-native';
import omitBy from 'lodash/omitBy';

/**
 * Problem: Setting an animated prop on the native components throws errors
 * Solution: Use a higher order component to omit them down the chain this should be wrapped first so you don't accidentally send it to the native component through calling setNativeProps manually such as in componentWillReceiveProps.
 */

function isAnimated(val, key) {
    return val instanceof Animated.Value
        || val instanceof Animated.ValueXY
        || val instanceof Animated.Interpolation;
}

export default function SvgAnimatedPropFix(WrappedComponent) {
    return class extends Component {
        setNativeProps = (props) => {
            this._component && this._component.setNativeProps(props);
        }
        render() {
            const props = omitBy(this.props, isAnimated);
            return (
                <WrappedComponent
                    ref={component => (this._component = component)}
                    {...props}
                />
            );
        }
    };
}
