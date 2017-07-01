import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';

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
    optional: {
        fontSize: 12,
        fontWeight: '100'
    },
    input: {
        fontSize: 25,
        color: '#666666',
        height: 30,
        marginLeft: -5,
        marginBottom: 15
    }
});

const MessageFormInput = ({ labelText, optional, placeholder }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{labelText.toUpperCase()}{optional && <Text style={styles.optional}> (optional)</Text>}</Text>
        <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor={colorLight} />
    </View>
);
export default MessageFormInput;
