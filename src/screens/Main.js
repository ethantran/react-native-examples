import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'

export default class Main extends Component {
    render() {
        return (
            <View style={{ marginTop: 20 }}>
                <Button
                    title="LolaTravelConv1"
                    onPress={() => this.props.navigation.navigate('LolaTravelConv1')}
                />
            </View>
        )
    }
}