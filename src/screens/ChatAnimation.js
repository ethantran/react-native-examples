// TODO: Scroll animation
// TODO: Reply option animation
// TODO: left message animation
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
    UIManager,
    findNodeHandle,
    Easing
} from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';
import { connect, Provider } from 'react-redux';

import randomUser from '../randomUser';
import randomColor from '../randomColor';
import randomNumber from '../randomNumber';

import { createStore, combineReducers } from 'redux';

const updateAction = (x, y, animationId, animationType) => ({
    type: 'updateAction',
    x,
    y,
    animationId,
    animationType
});
const animateAction = animationId => ({
    type: 'animateAction',
    animationId
});
const animationReducer = (state = {}, action) => {
    switch (action.type) {
        case 'updateAction':
            console.log(action);
            const stateForAnimationId = state[action.animationId] || {};
            const stateForAnimationType =
                stateForAnimationId[action.animationType] || {};
            return {
                ...state,
                [action.animationId]: {
                    ...stateForAnimationId,
                    [action.animationType]: {
                        ...stateForAnimationType,
                        x: action.x,
                        y: action.y
                    }
                }
            };
        case 'animateAction':
            return {
                ...state,
                [action.animationId]: {
                    animate: true
                }
            };
        default:
            return state;
    }
};
const reducers = {
    animation: animationReducer
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);

const HEADER_OFFSET = 64;

const createAnimationHOC = Comp => {
    class AnimationHOC extends Component {
        constructor(props) {
            super(props);
            this.style = { opacity: new Animated.Value(0) };
            if (props.animationType === 'start') {
                this.style.opacity.setValue(1);
            } else if (props.animationType === 'middle') {
                this.style = {
                    ...this.style,
                    position: 'absolute',
                    top: new Animated.Value(0),
                    left: new Animated.Value(0)
                };
            } else if (props.animationType === 'end') {
            }
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.animate !== this.props.animate && nextProps.animate) {
                this.animate();
            }
        }
        animate() {
            if (this.props.animationType === 'start') {
                this.style.opacity.setValue(0);
            } else if (this.props.animationType === 'middle') {
                this.style.opacity.setValue(1);
                this.style.top.setValue(this.props.start.y);
                this.style.left.setValue(this.props.start.x);
                this.animation = Animated.sequence([
                    Animated.parallel([
                        Animated.timing(this.style.top, {
                            toValue: this.props.end.y,
                            duration: 1000
                        }),
                        Animated.timing(this.style.left, {
                            toValue: this.props.end.x,
                            duration: 1000
                        })
                    ]),
                    Animated.timing(this.style.opacity, {
                        toValue: 0,
                        duration: 0
                    })
                ]);
                this.animation.start();
            } else if (this.props.animationType === 'end') {
                this.animation = Animated.sequence([
                    Animated.delay(1000),
                    Animated.timing(this.style.opacity, {
                        toValue: 1,
                        duration: 0
                    })
                ]);
                this.animation.start(this.props.onAnimationEnd);
            }
        }
        handleLayout = event => {
            const handle = findNodeHandle(this.component.component);
            UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
                console.log(x, y, width, height, pageX, pageY);
                this.props.updateAnimationData(
                    pageX,
                    pageY - HEADER_OFFSET,
                    this.props.animationId,
                    this.props.animationType
                );
            });
        };
        render() {
            const { end, start, animationType, style, ...props } = this.props;
            return (
                <Comp
                    ref={c => (this.component = c)}
                    {...props}
                    onLayout={
                        animationType !== 'middle'
                            ? this.handleLayout
                            : undefined
                    }
                    style={[style, this.style]}
                />
            );
        }
    }
    const mapStateToProps = (state, props) =>
        state.animation[props.animationId] || {};
    const mapDispatchToProps = {
        updateAnimationData: updateAction
    };
    return connect(mapStateToProps, mapDispatchToProps)(AnimationHOC);
};

class MessageLeft extends Component {
    render() {
        const props = this.props;
        return (
            <View
                ref={c => (this.component = c)}
                {...props}
                style={styles.messageLeftContainer}
            >
                <View style={styles.messageLeft}>
                    <Text style={styles.messageLeftText}>{props.text}</Text>
                </View>
            </View>
        );
    }
}

class MessageRight extends Component {
    render() {
        const props = this.props;
        return (
            <Animated.View
                ref={c => (this.component = c)}
                {...props}
                style={[styles.messageRight, props.style]}
            >
                <Text style={styles.messageRightText}>{props.text}</Text>
            </Animated.View>
        );
    }
}

class Button extends Component {
    render() {
        const props = this.props;
        return (
            <Animated.View
                ref={c => (this.component = c)}
                {...props}
                style={[styles.button, props.style]}
            >
                <TouchableOpacity onPress={props.onPress}>
                    <Text style={styles.buttonText}>{props.text}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const AnimatedMessageRight = createAnimationHOC(MessageRight);

const AnimatedButton = createAnimationHOC(Button);

class ChatAnimation extends Component {
    state = {
        messages: [],
        replyOptions: []
    };

    componentDidMount() {
        this.addLeftMessage();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.selectedReply !== this.state.selectedReply &&
            this.state.selectedReply
        ) {
            this.props.animate(this.state.selectedReply.id);
        }
    }

    addLeftMessage(reply) {
        setTimeout(() => {
            let newMessages;
            if (reply) {
                newMessages = [
                    ...this.state.messages,
                    reply,
                    {
                        user: 'left',
                        text: loremipsum(),
                        id: randomNumber(1, 99999999)
                    }
                ];
            } else {
                newMessages = [
                    ...this.state.messages,
                    {
                        user: 'left',
                        text: loremipsum(),
                        id: randomNumber(1, 99999999)
                    }
                ];
            }
            this.setState({
                messages: newMessages,
                replyOptions: [
                    {
                        id: randomNumber(1, 99999999),
                        text: loremipsum({ count: 3, units: 'words' })
                    },
                    {
                        id: randomNumber(1, 99999999),
                        text: loremipsum({ count: 2, units: 'words' })
                    }
                ]
            });
        }, 2000);
    }

    selectReplyOption = replyOption => {
        this.setState({ selectedReply: replyOption });
    };

    renderMessage = message => {
        if (message.user === 'left') {
            return <MessageLeft key={message.id} text={message.text} />;
        }
        return <MessageRight key={message.id} text={message.text} />;
    };

    renderReplyOption = replyOption => {
        return (
            <AnimatedButton
                key={replyOption.id}
                animationId={replyOption.id}
                animationType="start"
                onPress={() => this.selectReplyOption(replyOption)}
                style={{ marginRight: 10 }}
                text={replyOption.text}
            />
        );
    };

    renderReplyOptionAsRightMessage = replyOption => {
        return (
            <AnimatedMessageRight
                key={replyOption.id}
                animationId={replyOption.id}
                animationType="end"
                text={replyOption.text}
                style={{ position: 'absolute' }}
                onAnimationEnd={this.handleReplayOptionAnimationEnd}
            />
        );
    };

    handleReplayOptionAnimationEnd = () => {
        this.addLeftMessage(this.state.selectedReply);
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.messages}>
                    {this.state.messages.map(this.renderMessage)}
                    <View>
                        {this.state.replyOptions.map(
                            this.renderReplyOptionAsRightMessage
                        )}
                    </View>
                </ScrollView>
                <View style={styles.buttons}>
                    {this.state.replyOptions.map(this.renderReplyOption)}
                </View>
                {this.state.selectedReply && (
                    <AnimatedMessageRight
                        animationId={this.state.selectedReply.id}
                        animationType="middle"
                        text={this.state.selectedReply.text}
                    />
                )}
            </View>
        );
    }
}

const mapStateToProps = (state, props) =>
    state.animation[props.animationId] || {};
const mapDispatchToProps = {
    animate: animateAction
};
ChatAnimation = connect(mapStateToProps, mapDispatchToProps)(ChatAnimation);

export default class App extends Component {
    // static navigationOptions = {
    //     header: null
    // };
    render() {
        return (
            <Provider store={store}>
                <ChatAnimation />
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messages: {
        flex: 1,
        padding: 10
    },
    messageLeftContainer: {
        alignItems: 'flex-start',
        marginBottom: 10
    },
    messageRightContainer: {
        alignItems: 'flex-end',
        marginBottom: 10
    },
    messageLeft: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignSelf: 'flex-start'
    },
    messageRight: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'blue',
        alignSelf: 'flex-end',
        marginBottom: 10
    },
    messageLeftText: {
        color: '#000'
    },
    messageRightText: {
        color: '#fff',
        textAlign: 'right'
    },
    buttons: {
        flexDirection: 'row',
        padding: 10
    },
    button: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'blue'
    },
    buttonText: {
        color: '#fff'
    }
});
