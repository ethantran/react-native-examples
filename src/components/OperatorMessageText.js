import React from 'react'
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native'

const colorLight = '#E8E8E8'
const colorPrimary = '#4EAAF0'

const styles = StyleSheet.create({
    textContainer: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colorLight,
        padding: 10,
        overflow: 'hidden'
    },
    text: {
        fontSize: 18,
        fontWeight: '200',
        padding: 5,
        color: '#717171'
    },
    textMe: {
        color: 'white',
        textAlign: 'right'
    }
})

const MessageText = ({ text, me }) => (
    <View style={styles.textContainer}>
        <Text style={[styles.text, me && styles.textMe]}>{text}</Text>
    </View>
)
export default MessageText