import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

const colorSandra = '#1363FB'
const colorRobin = '#AFAFA5'

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10
    },
    text: {
        textAlign: 'center',
        width: 200,
        color: colorRobin,
        fontWeight: 'bold'
    }
})

const ProfileMessage = ({source, text}) => (
    <View style={styles.container}>
        <Image style={styles.image} source={source} />
        <Text style={styles.text}>{text}</Text>
    </View>
)
export default ProfileMessage