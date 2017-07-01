import { Animated } from 'react-native';
import AnimatedSvgBrushFix from './AnimatedSvgBrushFix';
import AnimatedSvgPropStringFix from './AnimatedSvgPropStringFix';
import AnimatedSvgStateFix from './AnimatedSvgStateFix';
import AnimatedSvgTransformFix from './AnimatedSvgTransformFix';

export default function (Component, { state, propString } = {}) {
    Component = AnimatedSvgStateFix(Component, state);
    Component = AnimatedSvgBrushFix(Component);
    Component = AnimatedSvgPropStringFix(Component, propString);
    Component = AnimatedSvgTransformFix(Component);
    Component = Animated.createAnimatedComponent(Component);
    return Component;
}
