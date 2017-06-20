import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { Svg } from 'expo'

import IconSvgPath from '../components/SnapchatIconSvgPath'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 10
    },
    imageContainer: {
        marginRight: 20,
    },
    image: {
        ...StyleSheet.absoluteFillObject
    },
    meta: {
        justifyContent: 'center'
    },
    name: {
        backgroundColor: 'transparent',
        fontSize: 20
    },
    username: {
        color: '#D3D5D9',
        fontSize: 10
    },
    count: {
        color: '#D3D5D9',
        fontSize: 10
    }
})

const QuickChatItem = ({ source, name, username, count }) => (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image style={styles.image} source={source} />
            <Svg height={50} width={50}>
                <Svg.ClipPath id="clip">
                    <IconSvgPath />
                </Svg.ClipPath>
                <Svg.Rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    clipPath="url(#clip)"
                />
            </Svg>
        </View>
        <View style={styles.meta}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.username}>{username}   {count}</Text>
        </View>
    </View>
)
export default QuickChatItem
