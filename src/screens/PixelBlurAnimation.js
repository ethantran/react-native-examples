import React, { Component } from 'react';
import { StyleSheet, View, Image, Dimensions, Animated } from 'react-native';

import randomImage from '../randomImage';
import randomArrayElement from '../randomArrayElement';
import AnimatedBlurView from '../components/AnimatedBlurView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const source = { uri: randomImage() };

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'gray',
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
});

const tints = ['light', 'default', 'dark'];

export default class PixelBlurAnimation extends Component {
    static defaultProps = {
        numColumns: 2
    }
    size = SCREEN_WIDTH / this.props.numColumns
    numRows = Math.round(SCREEN_HEIGHT / this.size) + 1
    numBoxes = this.props.numColumns * this.numRows
    state = {
        values: Array(this.numBoxes).fill().map(_ => new Animated.Value(0))
    }
    componentDidMount() {
        this.animate();
    }
    animate = () => {
        Animated.parallel(this.state.values.map(value => {
            return Animated.timing(value, {
                toValue: Math.round(100 * Math.random()),
                duration: 500
            });
        })).start(this.animate);
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={source} style={StyleSheet.absoluteFill} />
                {this.state.values.map((value, i) => {
                    return (
                        <AnimatedBlurView
                            key={i}
                            tint={randomArrayElement(tints)}
                            intensity={value}
                            style={{
                                width: this.size,
                                height: this.size
                            }} />
                    );
                })}
            </View>
        );
    }
}
