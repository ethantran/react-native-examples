import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Svg } from 'expo';

import IconSvgPath from '../components/SnapchatIconSvgPath';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        width: 80,
        marginRight: 10
    },
    imageContainer: {
        marginBottom: 10
    },
    image: {
        ...StyleSheet.absoluteFillObject
    },
    name: {
        backgroundColor: 'transparent',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 11
    }
});

const QuickChatItem = ({ name, source }) => (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image style={styles.image} source={source} />
            <Svg height={50} width={50}>
                <Svg.ClipPath id="clip">
                    <IconSvgPath/>
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
        <Text style={styles.name} ellipsizeMode="tail">{name}</Text>
    </View>
);
export default QuickChatItem;
