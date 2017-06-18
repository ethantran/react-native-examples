import React from 'react'
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native'

const colorLight = '#E8E8E8'
const colorPrimary = '#4EAAF0'

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        padding: 20
    },
    buttonTitle: {
        fontWeight: 'bold',
        color: '#CCCCCC'
    },
    valid: {
        color: '#61B56B'
    },
    primary: {
        color: colorPrimary
    }
})

const MessageButton = ({onPress, title, style, valid, primary}) => (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.button, style]}>
            <Text style={[
                styles.buttonTitle,
                valid && styles.valid,
                primary && styles.primary
                ]}>{title}</Text>
        </View>
    </TouchableOpacity>
)
export default MessageButton
