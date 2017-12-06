import React from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import PolyAssetListView from './PolyAssetListView';
import { close, selectAsset, listAssets, loadMore } from './actions/poly';

class PolySearchView extends React.Component {
    static defaultProps = {
        assets: []
    };

    state = {};

    handleChangeText = text => {
        this.setState({ text });
    };

    handleSubmitEditing = () => {
        this.props.onSubmitEditing(this.state.text);
    };

    handleLoadMore = () => {
        this.props.onLoadMore();
    };

    render() {
        return this.props.show ? (
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
                        onPress={this.props.onClose}
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
                {this.props.assets.length > 0 && (
                    <PolyAssetListView
                        assets={this.props.assets}
                        onPress={this.props.onSelectAsset}
                        canLoadMore={this.props.nextPageToken}
                        onLoadMore={this.handleLoadMore}
                        loadingMore={this.props.loadingMore}
                    />
                )}
                {this.props.loading && (
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
        ) : null;
    }
}

const mapStateToProps = state => state.poly;

const mapDispatchToProps = {
    onClose: close,
    onSelectAsset: selectAsset,
    onSubmitEditing: listAssets,
    onLoadMore: loadMore
};

export default connect(mapStateToProps, mapDispatchToProps)(PolySearchView);
