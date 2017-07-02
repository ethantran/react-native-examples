import { Animated } from 'react-native';
export default function (val) {
    return val instanceof Animated.Value || val instanceof Animated.ValueXY || val instanceof Animated.AnimatedInterpolation;
}
