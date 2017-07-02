import React, { Component } from 'react';
import { Animated } from 'react-native';
import { Svg } from 'expo';
import AnimatedSvgStateFix from './AnimatedSvgStateFix';
import AnimatedSvgGradientFix from './AnimatedSvgGradientFix';

const NativeSvgLinearGradient = Svg.LinearGradient;

export const args = ['x1', 'y1', 'x2', 'y2'];

class SvgLinearGradient extends Component {
    render() {
        return (
            <NativeSvgLinearGradient
                {...this.props}
            />
        );
    }
}
SvgLinearGradient = AnimatedSvgGradientFix(SvgLinearGradient);
SvgLinearGradient = AnimatedSvgStateFix(SvgLinearGradient, args, { cancelSetNativeProps: true });
SvgLinearGradient = Animated.createAnimatedComponent(SvgLinearGradient);
export default SvgLinearGradient;
