import React, { Component } from 'react';
import { ScrollView, Button } from 'react-native';
import routeConfig from '../routeConfig';

export default class MainScreen extends Component {
    render() {
        const { Main, ...routes } = routeConfig;
        return (
            <ScrollView style={{ marginTop: 20 }}>
                {Object.keys(routes).map(route => (
                    <Button
                        key={route}
                        title={route}
                        onPress={() => this.props.navigation.navigate(route)}
                    />
                ))}
            </ScrollView>
        );
    }
}
