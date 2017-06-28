import { Animated } from 'react-native';
// import AnimatedSvgAnimatedPropFix from './AnimatedSvgAnimatedPropFix';
import AnimatedSvgBrushFix from './AnimatedSvgBrushFix';
import AnimatedSvgDeltaFix from './AnimatedSvgDeltaFix';
import AnimatedSvgPropStringFix from './AnimatedSvgPropStringFix';
import AnimatedSvgStateFix from './AnimatedSvgStateFix';
import AnimatedSvgTransformFix from './AnimatedSvgTransformFix';

export default function (Component, { state, propString } = {}) {
    // Component = AnimatedSvgAnimatedPropFix(Component);
    Component = AnimatedSvgStateFix(Component, state);
    Component = AnimatedSvgBrushFix(Component);
    Component = AnimatedSvgDeltaFix(Component);
    Component = AnimatedSvgPropStringFix(Component, propString);
    Component = AnimatedSvgTransformFix(Component);
    // Component = AnimatedSvgAnimatedPropFix(Component);
    Component = Animated.createAnimatedComponent(Component);
    return Component;
}
