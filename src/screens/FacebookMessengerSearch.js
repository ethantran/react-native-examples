import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TextInput } from 'react-native';
import { Components } from 'expo';
const { BlurView } = Components;

import randomImage from '../randomImage';

const items1 = [randomImage(100, 200), randomImage(100, 200), randomImage(100, 200), randomImage(100, 200)];
const items2 = [randomImage(100, 200), randomImage(100, 200), randomImage(100, 200), randomImage(100, 200)];
const items3 = [randomImage(100, 200), randomImage(100, 200), randomImage(100, 200), randomImage(100, 200)];

const styles = StyleSheet.create({
    container: {

    },
    textInput: {
        textAlign: 'center',
        marginBottom: 10
    },
    category: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
        padding: 10
    },
    categoryText: {
        color: 'white',
        backgroundColor: 'transparent',
        marginBottom: 10
    },
    itemContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        marginRight: 10
    },
    image: {
        width: 100,
        height: 200
    }
});

export default class FlipboardCover extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput style={styles.textInput} placeholder="Search" />
                <View style={styles.category}>
                    <Text style={styles.categoryText}>Lorem</Text>
                    {items1.map((item, i) => (
                        <ScrollView style={styles.itemContainer}>
                            <Image style={styles.image} source={{ uri: item }} />
                        </ScrollView>
                    ))}
                </View>
                <View style={styles.category}>
                    <Text style={styles.categoryText}>Ipsum</Text>
                    {items2.map((item, i) => (
                        <ScrollView style={styles.itemContainer}>
                            <Image style={styles.image} source={{ uri: item }} />
                        </ScrollView>
                    ))}
                </View>
                <View style={styles.category}>
                    <Text style={styles.categoryText}>Dolor</Text>
                    {items3.map((item, i) => (
                        <ScrollView style={styles.itemContainer}>
                            <Image style={styles.image} source={{ uri: item }} />
                        </ScrollView>
                    ))}
                </View>
            </ScrollView>
        );
    }
}
