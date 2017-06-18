import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native'

const colorLight = '#E8E8E8'
const colorPrimary = '#4EAAF0'

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
    selectContainer: {
        flexDirection: 'row'
    },
    container: {
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#DCDCDC',
        borderRadius: 7,
        marginRight: 10
    },
    containerSelected: {
        borderColor: colorPrimary
    },
    text: {
        fontSize: 16,
        color: '#DCDCDC'
    },
    textSelected: {
        color: colorPrimary
    }
})

const MessageFormSelect = ({ labelText, optional, items, selected, onPress }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{labelText.toUpperCase()}{optional && <Text style={styles.optional}> (optional)</Text>}</Text>
        <TouchableOpacity onPress={onPress}>
            <View style={styles.selectContainer}>
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
            </View>
        </TouchableOpacity>
    </View>
)
export default MessageFormSelect