// @flow
import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

type Props = {
    texts: string[],
    startDelay: number,
    typeSpeed: number,
    backspaceSpeed: number,
    cursorDelay: number,
    cursorHeightPadding: number,
    cursorDuration: number,
    pauseDuration: number,
    textStyle?: StyleSheet.Style,
    cursorStyle?: StyleSheet.Style
};

type State = {
    text: string
};

const defaultProps = {
    startDelay: 0,
    typeSpeed: 100,
    backspaceSpeed: 80,
    cursorDelay: 500,
    cursorHeightPadding: 5,
    cursorDuration: 0,
    pauseDuration: 1600
};

export default class TypingText extends Component {
    props: Props;
    state: State;
    opacity: typeof Animated.Value;
    timeout: number;
    isAnimateCursor: boolean;
    static defaultProps = typeof defaultProps;
    constructor(props) {
        super(props);
        this.state = { text: '' };
        this.opacity = new Animated.Value(1);
        this.isAnimateCursor = false;
        this.start(props);
    }
    start(props) {
        this.opacity.resetAnimation();
        this.animation && this.animation.stop();
        this.toggleAnimateCursor(false);
        this.timeout = setTimeout(() => {
            this.type(props.texts[0], 0, 0);
            this.animateCursor();
        }, props.startDelay);
    }
    type(currText, currIndex, currArrayIndex) {
        this.timeout = setTimeout(() => {
            this.toggleAnimateCursor(false);
            this.setState(
                {
                    text: currText.substr(0, currIndex)
                },
                () => {
                    if (currIndex === currText.length) {
                        this.toggleAnimateCursor(true);
                        // backspace only if there is more text to write
                        if (currArrayIndex < this.props.texts.length - 1) {
                            this.timeout = setTimeout(() => {
                                this.backspace(
                                    currText,
                                    currIndex - 1,
                                    currArrayIndex
                                );
                            }, this.props.pauseDuration);
                        }
                    } else {
                        this.type(currText, currIndex + 1, currArrayIndex);
                    }
                }
            );
        }, this.randomizeSpeed(this.props.typeSpeed));
    }
    backspace(currText, currIndex, currArrayIndex) {
        this.timeout = setTimeout(() => {
            this.toggleAnimateCursor(false);
            this.setState(
                {
                    text: currText.substr(0, currIndex)
                },
                () => {
                    if (currIndex === 0) {
                        this.type(
                            this.props.texts[currArrayIndex + 1],
                            currIndex + 1,
                            currArrayIndex + 1
                        );
                    } else {
                        this.backspace(currText, currIndex - 1, currArrayIndex);
                    }
                }
            );
        }, this.randomizeSpeed(this.props.backspaceSpeed));
    }
    toggleAnimateCursor(animate) {
        this.isAnimateCursor = animate;
        if (animate) {
            this.animateCursor();
        } else {
            this.opacity.setValue(1);
        }
    }
    animateCursor() {
        let toValue = 1;
        if (this.isAnimateCursor) {
            toValue = this.opacity.__getValue() ? 0 : 1;
        }
        this.animation = Animated.sequence([
            Animated.delay(this.props.cursorDelay),
            Animated.timing(this.opacity, {
                toValue,
                duration: this.props.cursorDuration
            })
        ]).start(() => this.isAnimateCursor && this.animateCursor());
    }
    randomizeSpeed(speed) {
        return Math.round(Math.random() * speed / 2) + speed;
    }
    componentWillReceiveProps(nextProps) {
        clearInterval(this.timeout);
        this.start(nextProps);
    }
    componentWillUnmount() {
        clearInterval(this.timeout);
    }
    render() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={this.props.textStyle}>
                    {this.state.text}
                    <Animated.Text
                        style={[
                            {
                                opacity: this.opacity
                            },
                            this.props.cursorStyle
                        ]}
                    >
                        |
                    </Animated.Text>
                </Text>
            </View>
        );
    }
}
TypingText.defaultProps = defaultProps;
