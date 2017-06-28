import React, { Component } from 'react';
import { Animated } from 'react-native';
import { Svg } from 'expo';
import AnimatedSvgStateFix from './AnimatedSvgStateFix';
import AnimatedSvgGradientFix from './AnimatedSvgGradientFix';

const NativeSvgRadialGradient = Svg.RadialGradient;

class SvgRadialGradient extends Component {
    render() {
        return (
            <NativeSvgRadialGradient
                {...this.props}
            />
        );
    }
}
SvgRadialGradient = AnimatedSvgGradientFix(SvgRadialGradient);
SvgRadialGradient = AnimatedSvgStateFix(SvgRadialGradient, ['fx', 'fy', 'rx', 'ry', 'cx', 'cy', 'r'], { cancelSetNativeProps: true });
SvgRadialGradient = Animated.createAnimatedComponent(SvgRadialGradient);
export default SvgRadialGradient;
