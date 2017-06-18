import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Message from './OperatorMessage'

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10
    },
    text: {
        fontSize: 18,
        fontWeight: '100',
        marginBottom: 10,
    },
    time: {
        fontWeight: '100',
    }
})

const QuoteMessage = ({ text, time, ...props }) => (
    <Message fullWidth {...props}>
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <Text style={styles.time}>{time}</Text>
        </View>
    </Message>
)
export default QuoteMessage