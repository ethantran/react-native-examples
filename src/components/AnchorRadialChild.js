import React, { Component } from 'react'
import { StyleSheet, View, Animated } from 'react-native'

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderColor: '#7BF9DA'
    }
})

export default class AnchorRadialChild extends React.Component {
    static defaultProps = {
        borderWidth: 3,
        playing: false
    }
    borderWidth = new Animated.Value(0)
    componentDidMount() {
        this.onPlayingUpdate(this.props.playing)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.playing !== this.props.playing) {
            this.onPlayingUpdate(nextProps.playing)
        }
    }
    onPlayingUpdate(playing) {
        Animated.spring(this.borderWidth, {
            toValue: playing ? this.props.borderWidth : 0,
            friction: 5
        }).start()
    }
    render() {
        return (
            <Animated.View
                style={[
                    styles.container,
                    { borderWidth: this.borderWidth },
                    this.props.style
                ]}>
                {this.props.children}
            </Animated.View>
        )
    }
}