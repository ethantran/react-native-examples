import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

import Message from './OperatorMessage';
import MessageText from './OperatorMessageText';
import MessageButton from './OperatorMessageButton';

const colorLight = '#E8E8E8';

const styles = StyleSheet.create({
    inputContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colorLight,
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    label: {
        fontWeight: 'bold',
        color: '#666666',
        marginHorizontal: 5,
        marginBottom: 15
    },
    input: {
        fontSize: 30,
        color: '#666666',
        height: 30,
        marginLeft: -5,
        marginBottom: 15
    },
    help: {
        color: '#C7C7C7',
        fontWeight: '100',
        marginHorizontal: 5
    }
});

const InputMessage = ({ text, labelText, placeholder, onPress, buttonTitle, helpText, valid, ...props }) => (
    <Message {...props}>
        <MessageText text={text} />
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{labelText.toUpperCase()}</Text>
            <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={colorLight} />
            {!!helpText && <Text style={styles.help}>{helpText}</Text>}
        </View>
        <MessageButton title={buttonTitle} onPress={onPress} valid={valid} />
    </Message>
);
export default InputMessage;
