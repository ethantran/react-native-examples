import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { EvilIcons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import randomUser from '../randomUser';
import randomImage from '../randomImage';

const article = {
    source: { uri: randomImage() }, imageCredit: 'unsplash.com', authors: [
        { name: 'Lorem Ipsum', source: { uri: randomUser() } },
        { name: 'Dolor Sit', source: { uri: randomUser() } }
    ], views: '43K', flips: '406K', followers: '2.7K', stories: '1.3K', name: 'Lorem Ipsum', categories: ['Lorem', 'Ipsum', 'Dolor', 'Sit']
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },
    image: {
        flex: 1
    },
    toolbar: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        marginBottom: 30
    },
    toolbarItem: {
        marginLeft: 30
    },
    categories: {
        color: 'white',
        backgroundColor: 'transparent',
        marginBottom: 10
    },
    authors: {
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 10
    },
    author: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: -10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#333333'
    },
    authorsText: {
        color: 'white',
    },
    tint: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, .3)'
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        padding: 20
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'transparent',
        marginBottom: 10
    },
    meta: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row'
    },
    metaItem: {
        marginRight: 20
    },
    count: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 3
    },
    label: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 10
    },
    credit: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 9
    }
});

const GearIcon = () => <EvilIcons style={styles.toolbarItem} name="gear" size={30} color="white" />;

const ShareIcon = () => <EvilIcons style={styles.toolbarItem} name="share-apple" size={30} color="white" />;

const LeftArrowIcon = () => <MaterialCommunityIcons name="arrow-left" size={30} color="white" />;

const CreateIcon = () => <MaterialIcons name="create" size={30} color="white" />;

const HeartIcon = () => <MaterialCommunityIcons name="heart-outline" size={30} color="white" />;

const AddIcon = () => <MaterialIcons name="add" size={30} color="white" />;

const MoreVertIcon = () => <MaterialIcons name="more-vert" size={30} color="white" />;

export default class FlipboardCover extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={article.source} />
                <View style={styles.tint} />
                <View style={styles.overlay}>
                    <View style={styles.toolbar}>
                        <GearIcon />
                        <ShareIcon />
                    </View>
                    <Text style={styles.name}>{article.name}</Text>
                    <Text style={styles.categories}>{article.categories.join(', ')}</Text>
                    <View style={styles.authors}>
                        {article.authors.map((author, i) => (
                            <Image key={i} style={styles.author} source={author.source} />
                        ))}
                    </View>
                    <Text style={styles.credit}>Photo: {article.imageCredit}</Text>
                    <View style={styles.meta}>
                        <View style={styles.metaItem}>
                            <Text style={styles.count}>{article.views}</Text>
                            <Text style={styles.label}>VIEWERS</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.count}>{article.flips}</Text>
                            <Text style={styles.label}>PAGE FLIPS</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.count}>{article.followers}</Text>
                            <Text style={styles.label}>FOLLOWERS</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.count}>{article.stories}</Text>
                            <Text style={styles.label}>STORIES</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
