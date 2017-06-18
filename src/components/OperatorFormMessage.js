import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Message from './OperatorMessage'
import MessageText from './OperatorMessageText'
import MessageButton from './OperatorMessageButton'
import MessageFormInput from './OperatorMessageFormInput'
import MessageFormSelect from './OperatorMessageFormSelect'

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

const FormMessage = ({ text, items, onPress, buttonTitle, selected, valid, ...props }) => (
    <Message {...props}>
        {!!text && <MessageText text={text} />}
        {items.map((item, i) => {
            if (item.type === 'input') {
                return <MessageFormInput key={i} {...item}/>
            } else if (item.type === 'select') {
                return <MessageFormSelect key={i} {...item} selected={selected} />
            }
        })}
        <MessageButton title={buttonTitle} onPress={onPress} valid={valid} />
    </Message>
)
export default FormMessage