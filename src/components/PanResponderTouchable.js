import React, { Component } from 'react';
import { View, PanResponder } from 'react-native';

/* 
Problem: Touchables will activate onPressOut when dragged, sometimes you don't want that
Solution: This component tracks a drag threshold, sets a disabled state, and call onPressOut on release if it is not disabled
*/

export default class PanResponderTouchable extends Component {
    static defaultProps = {
        onStartShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: () => { },
        onPanResponderRelease: () => { },
        onPanResponderTerminationRequest: () => true,
        onPanResponderTerminate: () => { },
        dragThreshold: 1,
        onPressIn: () => { },
        onPress: () => { },
        onPressOut: () => { }
    }
    panResponder = PanResponder.create({
        onStartShouldSetPanResponderCapture: this.props.onStartShouldSetPanResponderCapture,
        onMoveShouldSetPanResponderCapture: (e, gs) => {
            const draggedLeft = gs.dx < -1 * this.props.dragThreshold;
            const draggedRight = gs.dx > this.props.dragThreshold;
            const draggedUp = gs.dy > this.props.dragThreshold;
            const draggedDown = gs.dy < -1 * this.props.dragThreshold;
            if (draggedLeft || draggedRight || draggedUp || draggedDown) {
                this.setState({ disabled: true });
            }
            return this.props.onMoveShouldSetPanResponderCapture(e, gs) || true;
        },
        onPanResponderGrant: () => {
            this.props.onPanResponderGrant();
            this.setState({
                disabled: false,
                tapped: true
            });
            this.props.onPressIn();
            this.props.onPress();
        },
        onPanResponderRelease: () => {
            this.props.onPanResponderRelease();
            if (!this.state.disabled) {
                this.props.onPressOut();
            }
        },
        onPanResponderTerminationRequest: this.props.onPanResponderTerminationRequest,
        onPanResponderTerminate: (evt, gestureState) => {
            this.props.onPanResponderTerminate();
            this.setState({
                disabled: true,
                tapped: false
            });
        }
    })
    render() {
        return <View {...this.props} {...this.panResponder.panHandlers} />;
    }
}
