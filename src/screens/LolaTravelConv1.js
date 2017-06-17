import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, Image, ScrollView } from 'react-native'

import randomuser from '../randomuser'
import randomimage from '../randomimage'
import ProfileMessage from '../components/LolaTravelProfileMessage'
import SliderItem from '../components/LolaTravelSliderItem'
import TextMessage from '../components/LolaTravelTextMessage'

const userSandra = { name: 'Sandra', image: randomuser() }
const userRobin = { name: 'Robin' }

const messages = [
    { type: 'text', user: userSandra, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl urna, imperdiet iaculis bibendum eu, scelerisque quis enim. Donec ut magna eu ligula gravida convallis quis sed leo. Nulla gravida fermentum nulla, sed rutrum augue ultricies nec. Donec lacinia efficitur tellus at ultricies. Proin porttitor pharetra efficitur. Sed consectetur, felis quis posuere laoreet, purus tortor ultricies metus, sed vehicula metus odio in sem. In accumsan, urna in pretium pellentesque, dui tortor tincidunt dui, non porttitor tellus ex eu nunc. Curabitur fermentum rutrum purus, quis volutpat purus feugiat eget.' },
    { type: 'text', user: userRobin, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { type: 'profile', source: { uri: userSandra.image }, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { type: 'text', user: userSandra, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nisl urna, imperdiet iaculis bibendum eu, scelerisque quis enim. ' },
    {
        type: 'slider', items: [{
            title: 'Lorem ipsum', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', source: {
                uri: randomimage(400, 300)
            }
        }]
    }
]

const colorSandra = '#1363FB'
const colorRobin = '#AFAFA5'

const styles = StyleSheet.create({
    containerSlider: {
        padding: 25
    }
})

function renderMessage(message, i) {
    if (message.type === 'text') {
        return <TextMessage key={i} {...message} me={message.user.name === 'Robin'}/>
    } else if (message.type === 'profile') {
        return <ProfileMessage key={i} {...message}/>
    } else if (message.type === 'slider') {
        return (
            <View key={i} style={styles.containerSlider}>
                {message.items.map(renderSliderItem)}
            </View>
        )
    }
}

function renderSliderItem(item, i) {
    return <SliderItem key={i} {...item} />
}

export default class LolaTravelConv1 extends Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: 'white' }}>
                {messages.map(renderMessage)}
            </ScrollView>
        )
    }
}