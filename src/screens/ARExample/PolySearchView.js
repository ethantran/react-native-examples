import React from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Poly from '../../Poly';
import PolyAssetListView from './PolyAssetListView';

export default class PolySearchView extends React.Component {
    state = {};

    handleChangeText = text => {
        this.setState({ text });
    };

    handleSubmitEditing = async () => {
        this.setState({ loading: true });
        const results = await Poly.listAssets({
            key: this.props.apiKey,
            keywords: this.state.text
        });
        this.setState({ results, loading: false });
    };

    render() {
        return (
            <View style={[StyleSheet.absoluteFill, { padding: 8 }]}>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <TextInput
                        style={{
                            flex: 1,
                            height: 48,
                            borderRadius: 8,
                            backgroundColor: '#fff',
                            marginRight: 8,
                            padding: 8
                        }}
                        value={this.state.text}
                        onChangeText={this.handleChangeText}
                        onSubmitEditing={this.handleSubmitEditing}
                    />
                    <TouchableOpacity
                        onPress={this.props.close}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <MaterialIcons size={24} color="#000" name="close" />
                    </TouchableOpacity>
                </View>
                {this.state.results && (
                    <PolyAssetListView
                        results={this.state.results}
                        onPress={this.props.selectAsset}
                    />
                )}
                {this.state.loading && (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: '#fff',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        ]}
                    >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )}
            </View>
        );
    }
}
