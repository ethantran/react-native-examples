import React, { Component } from 'react';

/**
 * Problem: Animating dx and dy with a list of values is not possible
 * Solution: Use a higher order component to combine props dx0, dx1, dx2, ..., dxn into deltaX and use setNativeProps or setState
 * BUG: setNativeProps and setState do not animate deltaX, deltaY, dx, and dy
 */

function getTotalKeys(props, str) {
    return Object.keys(props).filter(key => key.includes(str));
}

export default function SvgDeltaFix(WrappedComponent) {
    return class extends Component {
        state = {}
        totalDeltaXKeys = getTotalKeys(this.props, 'dx')
        totalDeltaYKeys = getTotalKeys(this.props, 'dy')
        // componentDidMount() {
        //     this.setNativeProps(this.props);
        // }
        componentWillReceiveProps(nextProps) {
            const dxChanged = this.totalDeltaXKeys.some((key, index) => nextProps[key] !== this.props[key]);
            const dyChanged = this.totalDeltaYKeys.some((key, index) => nextProps[key] !== this.props[key]);
            if (dxChanged) {
                this.totalDeltaXKeys = getTotalKeys(nextProps, 'dx');
            }
            if (dyChanged) {
                this.totalDeltaYKeys = getTotalKeys(nextProps, 'dy');
            }
            if (dxChanged || dyChanged) {
                this.setNativeProps(nextProps);
            }
        }
        setNativeProps = (props) => {
            let newState = {};
            // if some dx exists in props that means we need to recreate deltaX
            if (this.totalDeltaXKeys.some((key, index) => props[key] != null)) {
                const deltaArray = this.createDeltaArray(props, this.totalDeltaXKeys);
                const deltaString = this.createDeltaString(props, this.totalDeltaXKeys);
                props.deltaX = deltaArray;
                // newState.deltaX = deltaArray;
                newState.dx = deltaString;
            }
            // if some dy exists in props that means we need to recreate deltaY
            if (this.totalDeltaYKeys.some((key, index) => props[key] != null)) {
                const deltaArray = this.createDeltaArray(props, this.totalDeltaYKeys);
                const deltaString = this.createDeltaString(props, this.totalDeltaYKeys);
                props.deltaY = deltaArray;
                // newState.deltaY = deltaArray;
                newState.dy = deltaString;
            }
            this._component && this._component.setNativeProps(props);
            // this.setState(newState);
        }
        createDeltaArray = (props, keys) => {
            return keys.map((key) => {
                const newDelta = props[key];
                if (newDelta != null) {
                    return newDelta;
                }
                return this.props[key];
            });
        }
        createDeltaString = (props, keys) => {
            return keys.reduce((acc, key) => {
                const newDelta = props[key];
                if (newDelta != null) {
                    return acc + newDelta + ' ';
                }
                return acc + this.props[key] + ' ';
            }, '');
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
