import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Border from './LolaTravelBorder'

const colorSandra = '#1363FB'
const colorRobin = '#AFAFA5'

const styles = StyleSheet.create({
    container: { 
        marginBottom: 20 
    },
    name: {
        fontWeight: 'bold'
    },
    text: {
        lineHeight: 23
    },
})

const TextMessage = ({user, text, me}) => (
    <View style={styles.container}>
        <Border me={me}>
            <View>
                <Text style={[styles.name, { color: me ? colorRobin : colorSandra }]}>{user.name.toUpperCase()}</Text>
                <Text style={styles.text}>{text}</Text>
            </View>
        </Border>
    </View>
)

export default TextMessage