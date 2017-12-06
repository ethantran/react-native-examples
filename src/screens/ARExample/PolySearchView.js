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
    state = {
        assets: []
    };

    handleChangeText = text => {
        this.setState({ text });
    };

    handleSubmitEditing = async () => {
        this.setState({ loading: true });
        const results = await Poly.listAssets({
            key: this.props.apiKey,
            keywords: this.state.text
        });
        const assets = results.assets.filter(asset =>
            asset.formats.find(format => format.formatType === 'OBJ')
        );
        this.setState({ ...results, assets, loading: false });
    };

    handleLoadMore = async () => {
        this.setState({ loadingMore: true });
        const results = await Poly.listAssets({
            key: this.props.apiKey,
            pageToken: this.state.nextPageToken
        });
        const assets = results.assets.filter(asset =>
            asset.formats.find(format => format.formatType === 'OBJ')
        );
        this.setState({
            ...results,
            assets: [...this.state.assets, ...assets],
            loadingMore: false
        });
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
                {this.state.assets.length > 0 && (
                    <PolyAssetListView
                        assets={this.state.assets}
                        onPress={this.props.selectAsset}
                        canLoadMore={this.state.nextPageToken}
                        onLoadMore={this.handleLoadMore}
                        loadingMore={this.state.loadingMore}
                    />
                )}
                {this.state.loading && (
                    <View
                        style={[
                            StyleSheet.absoluteFill,
                            {
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
