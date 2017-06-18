import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'

export default class Main extends Component {
    render() {
        return (
            <View style={{ marginTop: 20 }}>
                <Button
                    title="LolaTravelChat"
                    onPress={() => this.props.navigation.navigate('LolaTravelChat')}
                />
                <Button
                    title="OperatorChat"
                    onPress={() => this.props.navigation.navigate('OperatorChat')}
                />
            </View>
        )
    }
}