/**
 * Problem: What is the best way to animate a path with animated.value?
 * Solution: This demonstrates how you can do it with d3 interpolate
 */
import React, { Component } from 'react';
import { Animated } from 'react-native';
import * as d3 from 'd3-interpolate-path';

import Path from './AnimatedSvgPath';

function createInterpolator(props) {
    return d3.interpolatePath(props.d1, props.d2);
}

class SvgD3InterpolatePath extends Component {
    static defaultProps = {
        t: 0
    };
    constructor(props) {
        super(props);
        this.interpolator = createInterpolator(props);
    }
    setNativeProps = props => {
        if (props.t) {
            props.d = this.interpolator(props.t);
        }
        this._component && this._component.setNativeProps(props);
    };
    shouldComponentUpdate(nextProps) {
        if (nextProps.d1 !== this.props.d1 || nextProps.d2 !== this.props.d2) {
            this.interpolator = createInterpolator(nextProps);
            return true;
        }
        return false;
    }
    render() {
        const { t, ...props } = this.props;
        const d = this.interpolator(t);
        return (
            <Path
                ref={component => (this._component = component)}
                {...props}
                d={d}
            />
        );
    }
}
SvgD3InterpolatePath = Animated.createAnimatedComponent(SvgD3InterpolatePath);
export default SvgD3InterpolatePath;
