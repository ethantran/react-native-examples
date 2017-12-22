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

import IO3DFurnitureListView from './IO3DFurnitureListView';
import { close, selectFurniture, listFurnitures } from './actions/io3d';

class IO3DSearchView extends React.Component {
    static defaultProps = {
        furnitures: []
    };

    state = {};

    handleChangeText = text => {
        this.setState({ text });
    };

    handleSubmitEditing = () => {
        this.props.onSubmitEditing(this.state.text);
    };

    render() {
        return this.props.visible ? (
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
                {this.props.furnitures.length > 0 && (
                    <IO3DFurnitureListView
                        furnitures={this.props.furnitures}
                        onPress={this.props.onSelectFurniture}
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

const mapStateToProps = state => state.io3d;

const mapDispatchToProps = {
    onClose: close,
    onSelectFurniture: selectFurniture,
    onSubmitEditing: listFurnitures
};

export default connect(mapStateToProps, mapDispatchToProps)(IO3DSearchView);
