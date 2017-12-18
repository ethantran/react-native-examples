// Reference: https://itunes.apple.com/us/app/quartz/id1076683233?mt=8
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

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

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
const updateScrollAction = height => ({
    type: 'updateScrollAction',
    height
});
const animationReducer = (state = { diff: 0, height: 0 }, action) => {
    switch (action.type) {
        case 'updateAction':
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
        case 'updateScrollAction':
            return {
                ...state,
                diff: action.height - state.height,
                height: action.height
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
                            duration: 500
                        }),
                        Animated.timing(this.style.left, {
                            toValue: this.props.end.x,
                            duration: 500
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
                    Animated.delay(500),
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
                this.props.updateAnimationData(
                    pageX,
                    pageY -
                        HEADER_OFFSET -
                        (this.props.animationType === 'end' &&
                        this.props.scrollViewHeight > WINDOW_HEIGHT &&
                        this.props.scrollDiff > 0
                            ? this.props.scrollDiff
                            : 0),
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
    const mapStateToProps = (state, props) => ({
        ...(state.animation[props.animationId] || {}),
        scrollViewHeight: state.animation.height,
        scrollDiff: state.animation.diff
    });
    const mapDispatchToProps = {
        updateAnimationData: updateAction
    };
    return connect(mapStateToProps, mapDispatchToProps)(AnimationHOC);
};

class MessageLeft extends Component {
    constructor(props) {
        super(props);
        this.translateX = new Animated.Value(-1);
        this.style = {
            left: this.translateX.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
            })
        };
    }

    componentDidMount() {
        Animated.spring(this.translateX, {
            toValue: 0
        }).start(this.props.onAnimationEnd);
    }

    render() {
        const props = this.props;
        return (
            <Animated.View
                ref={c => (this.component = c)}
                {...props}
                style={[styles.messageLeftContainer, this.style]}
            >
                <View style={styles.messageLeft}>
                    <Text style={styles.messageLeftText}>{props.text}</Text>
                </View>
            </Animated.View>
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

    constructor(props) {
        super(props);
        this.replyOptionStyle = [
            {
                bottom: new Animated.Value(-100)
            },
            {
                bottom: new Animated.Value(-100)
            }
        ];
        this.scrollY = new Animated.Value(0);
    }

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
            this.scrollView.scrollToEnd();
        }, 1000);
    }

    selectReplyOption = replyOption => {
        this.setState({ selectedReply: replyOption });
        this.hideReplyOptions();
    };

    showReplyOptions = () => {
        Animated.stagger(
            100,
            this.state.replyOptions.map((replyOption, i) =>
                Animated.spring(this.replyOptionStyle[i].bottom, {
                    toValue: 0
                })
            )
        ).start();
    };

    hideReplyOptions = () => {
        Animated.stagger(
            100,
            this.state.replyOptions.map((replyOption, i) =>
                Animated.spring(this.replyOptionStyle[i].bottom, {
                    toValue: -100
                })
            )
        ).start();
    };

    renderMessage = message => {
        if (message.user === 'left') {
            return (
                <MessageLeft
                    key={message.id}
                    text={message.text}
                    onAnimationEnd={this.handleMessageLeftAnimationEnd}
                />
            );
        }
        return <MessageRight key={message.id} text={message.text} />;
    };

    handleMessageLeftAnimationEnd = () => {
        this.showReplyOptions();
    };

    renderReplyOption = (replyOption, i) => {
        return (
            <AnimatedButton
                key={replyOption.id}
                animationId={replyOption.id}
                animationType="start"
                onPress={() => this.selectReplyOption(replyOption)}
                style={[{ marginRight: 10 }, this.replyOptionStyle[i]]}
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
                <ScrollView
                    ref={c => (this.scrollView = c)}
                    style={styles.messages}
                    contentContainerStyle={styles.messagesContentContainer}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        this.props.updateScrollData(contentHeight);
                        this.scrollView.scrollToEnd({ animated: true });
                    }}
                >
                    {this.state.messages.map(this.renderMessage)}
                    <View style={{ height: 40 }}>
                        {this.state.replyOptions.map(
                            this.renderReplyOptionAsRightMessage
                        )}
                    </View>
                    <View style={{ height: 100 }} />
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
    animate: animateAction,
    updateScrollData: updateScrollAction
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
        flex: 1
    },
    messagesContentContainer: {
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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
