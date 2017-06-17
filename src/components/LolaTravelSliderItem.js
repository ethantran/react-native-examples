import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

const colorSandra = '#1363FB'
const colorRobin = '#AFAFA5'

const styles = StyleSheet.create({
    container: {
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOpacity: 0.8,
        shadowRadius: 6,
        shadowOffset: {
            height: 1,
            width: 2,
        },
        borderRadius: 15
    },
    imageContainer: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden'
    },
    image: {
        height: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: 'hidden'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'transparent'
    },
    textBorderRadiusFix: {
        // https://github.com/facebook/react-native/issues/29
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden'
    },
    text: {
        padding: 10,
    }
})

const SliderItem = ({source, title, text}) => (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image style={styles.image} source={source}/>
            <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.textBorderRadiusFix}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </View>
)
export default SliderItem