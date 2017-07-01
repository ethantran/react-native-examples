import { Animated } from 'react-native';
import { Components } from 'expo';
const { BlurView } = Components;
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
export default AnimatedBlurView;
