import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Message from './OperatorMessage'
import MessageText from './OperatorMessageText'
import MessageButton from './OperatorMessageButton'

const colorLight = '#E8E8E8'
const colorPrimary = '#4EAAF0'

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: colorLight
    },
    containerSelected: {
        backgroundColor: colorPrimary,
        borderColor: colorPrimary
    },
    text: {
        fontWeight: 'bold',
        color: colorPrimary
    },
    textSelected: {
        color: 'white'
    }
})

const SelectMessage = ({ text, items, selected, onPress, buttonTitle, valid, ...props }) => (
    <Message {...props}>
        {!!text && <MessageText text={text} />}
        {items.map((item, i) => {
            return (
                <View key={i} style={[
                    styles.container,
                    selected === item && styles.containerSelected
                ]}>
                    <Text style={[
                        styles.text,
                        selected === item && styles.textSelected
                    ]}>{item}</Text>
                </View>
            )
        })}
        <MessageButton title={buttonTitle} onPress={onPress} valid={valid} />
    </Message>
)
export default SelectMessage