import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
    container: {

    },
    containerMe: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    text: {
        fontSize: 10,
        color: '#9B9B9B'
    }
});

const MessageMeta = ({ me, children }) => (
    <View style={[
        styles.container,
        me && styles.containerMe
        ]}>
        {children}
        {me && <Text style={styles.text}>Lorem Ipsum</Text>}
    </View>
);
export default MessageMeta;
