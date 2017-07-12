// BUG: SVG ClipPath and Images do not work
import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput } from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';
import { EvilIcons } from '@expo/vector-icons';

import randomUser from '../randomUser';
import randomNumber from '../randomNumber';

import QuickChatItem from '../components/SnapchatQuickChatItem';
import SearchItem from '../components/SnapchatSearchItem';

const quickChatFriends = Array(5).fill().map(() => ({
    name: loremipsum({count: 1, units: 'words'}),
    source: { uri: randomUser() }
}));

const friends = Array(5).fill().map(() => ({
    name: loremipsum({count: 1, units: 'words'}),
    username: loremipsum({count: 1, units: 'words'}),
    count: Math.floor(randomNumber(1, 1000)),
    source: { uri: randomUser() }
}));

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black'
    },
    searchbar: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    searchbarIcon: {
        padding: 10
    },
    textInput: {
        height: 50,
        flex: 1,
        color: 'white',
        fontSize: 20
    },
    dividerContainer: {
        height: 10,
        marginBottom: 15
    },
    divider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        position: 'absolute',
        top: 5,
        left: 0,
        right: 0
    },
    dividerLabel: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 2,
        color: 'white',
        backgroundColor: 'black',
        alignSelf: 'center',
        paddingHorizontal: 10
    },
    quickChatContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        marginBottom: 20
    },
    friendsContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 15
    },
    tabbar: {
        flexDirection: 'row',
        marginBottom: 15
    },
    tabbarItem: {

    },
    tabbarItemText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 10,
        marginRight: 20,
        fontWeight: '600',
        letterSpacing: 2
    },
    tabbarItemTextSelected: {
        color: 'white',
    }
});

const SearchIcon = () => <EvilIcons style={styles.searchbarIcon} name="search" size={30} color="white" />;

const CloseIcon = () => <EvilIcons style={styles.searchbarIcon} name="close" size={30} color="white" />;

export default class FlipboardCover extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.searchbar}>
                    <SearchIcon />
                    <TextInput style={styles.textInput} placeholder="Search" placeholderTextColor="rgba(255, 255, 255, 0.5)"/>
                    <CloseIcon />
                </View>
                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerLabel}>QUICK CHAT</Text>
                </View>
                <ScrollView style={styles.quickChatContainer} horizontal showsHorizontalScrollIndicator={false}>
                    {quickChatFriends.map((item, i) => <QuickChatItem key={i} {...item}/>)}
                </ScrollView>
                <ScrollView style={styles.tabbar} horizontal showsHorizontalScrollIndicator={false} contentInset={{top: 0, left: 150, bottom: 0, right: 0}} contentOffset={{x: -150, y: 0}}>
                    <View style={styles.tabbarItem}>
                        <Text style={[
                            styles.tabbarItemText,
                            styles.tabbarItemTextSelected
                            ]}>NEW FRIENDS</Text>
                    </View>
                    <View style={styles.tabbarItem}>
                        <Text style={styles.tabbarItemText}>QUICK ADD</Text>
                    </View>
                </ScrollView>
                <View style={styles.friendsContainer}>
                    {friends.map((item, i) => <SearchItem key={i} {...item}/>)}
                </View>
            </ScrollView>
        );
    }
}
