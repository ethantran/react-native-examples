import React, { Component } from 'react';
import { Animated } from 'react-native';
import { Svg } from 'expo';
import AnimatedSvgStateFix from './AnimatedSvgStateFix';
import AnimatedSvgGradientFix from './AnimatedSvgGradientFix';

const NativeSvgLinearGradient = Svg.LinearGradient;

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
SvgLinearGradient = AnimatedSvgStateFix(SvgLinearGradient, ['x1', 'y1', 'x2', 'y2'], { cancelSetNativeProps: true });
SvgLinearGradient = Animated.createAnimatedComponent(SvgLinearGradient);
export default SvgLinearGradient;
