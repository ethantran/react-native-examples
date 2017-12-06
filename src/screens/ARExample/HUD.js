import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import PredictHQIcon from '../../assets/icons/predicthq.png';

export default class HUD extends React.Component {
    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 8,
                    right: 8
                }}
            >
                <TouchableOpacity
                    onPress={() => this.props.onPress('search')}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8
                    }}
                >
                    <MaterialIcons size={24} color="#000" name="search" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.onPress('map')}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8
                    }}
                >
                    <MaterialIcons size={24} color="#000" name="map" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.onPress('predicthq')}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8
                    }}
                >
                    <Image
                        source={PredictHQIcon}
                        style={{ width: 24, height: 24 }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        );
    }
}
