import React, { Component } from 'react';
import { View, Button } from 'react-native';

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
                <Button
                    title="FlipboardCover"
                    onPress={() => this.props.navigation.navigate('FlipboardCover')}
                />
                <Button
                    title="SnapchatSearch"
                    onPress={() => this.props.navigation.navigate('SnapchatSearch')}
                />
                <Button
                    title="AnchorWalkthrough"
                    onPress={() => this.props.navigation.navigate('AnchorWalkthrough')}
                />
                <Button
                    title="PixelBlurAnimation"
                    onPress={() => this.props.navigation.navigate('PixelBlurAnimation')}
                />
                <Button
                    title="SvgAnimation"
                    onPress={() => this.props.navigation.navigate('SvgAnimation')}
                />
            </View>
        );
    }
}
