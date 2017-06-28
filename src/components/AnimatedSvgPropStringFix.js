import React, { Component } from 'react';

/**
 * Problem: Props cannot be animated, too many times you have to do val.toString() in setNativeProps
 * Solution: Use a higher order component to do that for you
 */

const KEYS = [
    'strokeWidth', 'strokeOpacity', 'fillOpacity'
];

export default function SvgPropStringFix(WrappedComponent, propKeys = []) {
    propKeys = [...KEYS, ...propKeys];
    return class extends Component {
        // componentDidMount() {
        //     this.setNativeProps(this.props);
        // }
        setNativeProps = (props) => {
            propKeys.reduce((acc, key) => {
                const val = props[key];
                if (val != null) {
                    acc[key] = val.toString();
                }
                return acc;
            }, props);
            // console.log(props.scaleX, props.scaleY)
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
