import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import Message from './OperatorMessage';
import MessageButton from './OperatorMessageButton';

const colorLight = '#E8E8E8';

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colorLight
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15
    },
    text: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '100'
    },
    productContainer: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colorLight
    },
    image: {
        width: 100,
        height: 100,
        margin: 15,
    },
    metaContainer: {
        justifyContent: 'center'
    },
    label: {
        fontWeight: 'bold',
        color: '#666666'
    },
    meta: {
        fontWeight: '100',
        fontSize: 18,
        color: '#666666'
    }
});

const ProductMessage = ({ avatar, text, source, creator, name, price, buttonTitle, onPress, ...props }) => (
    <Message fullWidth {...props}>
        <View style={styles.profileContainer}>
            <Image style={styles.avatar} source={avatar} />
            <Text style={styles.text}>{text}</Text>
        </View>
        <View style={styles.productContainer}>
            <Image style={styles.image} source={source} />
            <View style={styles.metaContainer}>
                <Text style={styles.label}>{creator.toUpperCase()}</Text>
                <Text style={styles.meta}>{name}</Text>
                <Text style={styles.meta}>{price}</Text>
            </View>
        </View>
        <MessageButton title={buttonTitle} onPress={onPress} primary />
    </Message>
);
export default ProductMessage;
