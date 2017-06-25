import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, Animated, Easing, Dimensions, PanResponder } from 'react-native'

function toRadians(angle) {
    return angle * Math.PI / 180
}

const styles = StyleSheet.create({
    big: {
        backgroundColor: 'transparent'
    }
})

const SCREEN_WIDTH = Dimensions.get('window').width

export default class AnchorRadial extends Component {
    static defaultProps = {
        moveThreshold: 0.5,
        dragThreshold: 7.5,
        velocityThreshold: 0.2,
        radius: 300,
        childRadius: 40,
        offsetAngle: 35 * 5 + 5,
        clockwise: true,
        sizeMultiplier: 1.7,
        angle: 35,
        maxAngle: 360,
        value: null,
        onValueChanged: () => { },
        xOffset: new Animated.Value(0),
        clampValue: true
    }
    numChild = React.Children.count(this.props.children)
    angle = this.props.angle || (this.props.maxAngle / this.numChild)
    state = {
        value: this.props.initialValue
    }
    onMoveShouldSetPanResponderCapture = (e, { dx }) => {
        const draggedLeft = dx < -1 * this.props.dragThreshold
        const draggedRight = dx > this.props.dragThreshold
        if (draggedLeft || draggedRight) {
            return true
        }
        return false
    }
    onPanResponderGrant = () => {
        this.props.xOffset.stopAnimation((value) => {
            this.props.xOffset.setOffset(value)
            this.props.xOffset.setValue(0)
        })
    }
    onPanResponderMove = Animated.event(
        [null, { dx: this.props.xOffset }]
    )
    onPanResponderRelease = (e, { dx, vx }) => {
        const ratio = dx / SCREEN_WIDTH
        if (ratio >= this.props.moveThreshold || vx > this.props.velocityThreshold) {
            let amount = Math.max(1, Math.round(ratio))
            if (this.props.clockwise)
                amount *= -1
            this.requestValueChange(amount)
        } else if (ratio <= -1 * this.props.moveThreshold || vx < -1 * this.props.velocityThreshold) {
            let amount = Math.min(-1, Math.round(ratio))
            if (this.props.clockwise)
                amount *= -1
            this.requestValueChange(amount)
        } else {
            this.onValueUpdate(this.props.value)
        }
    }
    panResponder = PanResponder.create({
        onMoveShouldSetPanResponderCapture: this.onMoveShouldSetPanResponderCapture,
        onPanResponderGrant: this.onPanResponderGrant,
        onPanResponderMove: this.onPanResponderMove,
        onPanResponderRelease: this.onPanResponderRelease
    })
    componentWillReceiveProps(nextProps) {
        if (nextProps.children !== this.props.children) {
            this.numChild = React.Children.count(this.props.children)
            this.angle = this.props.angle || (this.props.maxAngle / this.numChild)
        }
        if (nextProps.value !== this.props.value) {
            this.onValueUpdate(nextProps.value)
        }
    }
    requestValueChange = (amount) => {
        let newValue = this.props.value + amount
        if (this.props.clampValue)
            if (newValue < 0 || newValue >= this.numChild)
                return this.onValueUpdate(this.props.value)
        this.props.onValueChanged(newValue)
    }
    onValueUpdate = (value) => {
        let toValue = (this.props.clockwise && -1) * (SCREEN_WIDTH) * value
        this.props.xOffset.flattenOffset()
        let sequence = []
        sequence.push(
            Animated.timing(this.props.xOffset, { toValue, duration: 150 })
        )
        const animation = Animated.sequence(sequence)
        animation.start(() => this.props.xOffset.extractOffset())

    }
    rotateTransform = (animatedValue) => {
        const input = SCREEN_WIDTH * this.numChild
        const output = this.numChild * this.angle
        return animatedValue.interpolate({
            inputRange: [
                -1 * input,
                0,
                1 * input
            ],
            outputRange: [
                '-' + output + 'deg',
                0 + 'deg',
                output + 'deg'
            ]
        })
    }
    rotateTransformReverse = (animatedValue) => {
        const input = SCREEN_WIDTH * this.numChild
        const output = this.numChild * this.angle
        return animatedValue.interpolate({
            inputRange: [
                -1 * input,
                0,
                1 * input
            ],
            outputRange: [
                output + 'deg',
                0 + 'deg',
                '-' + output + 'deg'
            ]
        })
    }
    scaleTransform = (animatedValue, i) => {
        if (i === (((this.props.value - 1) % this.numChild) + this.numChild) % this.numChild) {
            i = this.props.value - 1
        } else if (i === (((this.props.value + 1) % this.numChild) + this.numChild) % this.numChild) {
            i = this.props.value + 1
        } else if (i === ((this.props.value % this.numChild) + this.numChild) % this.numChild) {
            i = this.props.value
        }
        let inputRange = [
            (i - 1) * SCREEN_WIDTH,
            i * SCREEN_WIDTH,
            (i + 1) * SCREEN_WIDTH
        ]
        if (this.props.clockwise) {
            inputRange = inputRange.map(e => -1 * e).reverse()
        }
        return animatedValue.interpolate({
            inputRange,
            outputRange: [1, this.props.sizeMultiplier, 1],
            extrapolate: 'clamp'
        })
    }
    cloneChild = (child, i) => {
        const CX = this.props.CX || this.props.radius
        const CY = this.props.CY || this.props.radius
        let radians = toRadians(this.angle * i + this.props.offsetAngle)
        if (this.props.clockwise) {
            radians *= -1
        }
        const extraProps = {
            style: [
                child.props.style,
                {
                    width: this.props.childRadius * 2,
                    height: this.props.childRadius * 2,
                    borderRadius: this.props.childRadius,
                    top: CX + this.props.radius * Math.cos(radians) - this.props.childRadius,
                    left: CY + this.props.radius * Math.sin(radians) - this.props.childRadius,
                    transform: [
                        { rotate: this.rotateTransformReverse(this.props.xOffset) },
                        { scale: this.scaleTransform(this.props.xOffset, i) }
                    ]
                }
            ]
        }
        return React.cloneElement(child, extraProps)
    }
    render() {
        return (
            <Animated.View
                {...this.panResponder.panHandlers}
                style={[
                    {
                        paddingTop: this.props.childRadius * this.props.sizeMultiplier
                    },
                    this.props.style
                ]}>
                <Animated.View
                    style={[
                        styles.big,
                        {
                            width: this.props.radius * 2,
                            height: this.props.radius * 2,
                            borderRadius: this.props.radius,
                            transform: [{ rotate: this.rotateTransform(this.props.xOffset) }]
                        }
                    ]}>
                    {React.Children.map(this.props.children, this.cloneChild)}
                </Animated.View>
            </Animated.View>
        )
    }
}