// @flow
import React, { Component } from 'react';
import { Animated } from 'react-native';
import { svgPathProperties } from 'svg-path-properties';

import Circle from './AnimatedSvgCircle';

type Props = {
    d: string,
    t: number
};

const defaultProps = {
    t: 0
};

class SvgInterpolatePointAtLength extends Component {
    props: Props;
    properties: typeof svgPathProperties;
    length: number;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.properties = svgPathProperties(props.d);
        this.length = this.properties.getTotalLength();
    }
    setNativeProps(props) {
        if (props.t) {
            const point = this.properties.getPointAtLength(
                this.length * props.t
            );
            props.translateX = point.x;
            props.translateY = point.y;
        }
        this._component && this._component.setNativeProps(props);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.d !== this.props.d) {
            this.properties = svgPathProperties(nextProps.d);
            this.length = this.properties.getTotalLength();
        }
    }
    render() {
        const { d, t, ...props } = this.props;
        const point = this.properties.getPointAtLength(this.length * t);
        const translateX = point.x;
        const translateY = point.y;
        return (
            <Circle
                ref={component => (this._component = component)}
                {...props}
                translateX={translateX}
                translateY={translateY}
            />
        );
    }
}
SvgInterpolatePointAtLength.defaultProps = defaultProps;
SvgInterpolatePointAtLength = Animated.createAnimatedComponent(
    SvgInterpolatePointAtLength
);
export default SvgInterpolatePointAtLength;
