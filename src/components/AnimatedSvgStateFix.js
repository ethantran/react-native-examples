import React, { Component } from 'react';
import omit from 'lodash/omit';

/**
 * Problem: Some props cannot be animated through setNativeProps, such as fill and stroke
 * Solution: Use state for those and use setNativeProps for the rest
 */

const KEYS = [
    'fill', 'stroke'
];

function createState(props, keys) {
    return keys.reduce((acc, key) => {
        const value = props[key];
        if (value != null) {
            acc[key] = value;
        }
        return acc;
    }, {});
}

export default function SvgStateFix(WrappedComponent, propToStateKeys = [], { cancelSetNativeProps } = {}) {
    propToStateKeys = [...KEYS, ...propToStateKeys];
    return class extends Component {
        state = createState(this.props, propToStateKeys);
        setNativeProps = (props) => {
            if (!cancelSetNativeProps) {
                const nativeProps = omit(props, propToStateKeys);
                this._component && this._component.setNativeProps(nativeProps);
            }
            const newState = createState(props, propToStateKeys);
            this.setState(newState);
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
    };
}
