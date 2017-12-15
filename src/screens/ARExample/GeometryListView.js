import React from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import GeometryView from './GeometryView';
import { close, select, creators } from './actions/geometry';

const geometries = Object.keys(creators).map(name => ({ name }));

class GeometryListView extends React.Component {
    render() {
        return this.props.visible ? (
            <View style={[StyleSheet.absoluteFill, { padding: 8 }]}>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
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
                <ScrollView
                    style={{ flex: 1, borderRadius: 8 }}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        borderRadius: 8,
                        paddingTop: 8
                    }}
                >
                    {geometries.map((geometry, i) => (
                        <GeometryView
                            key={geometry.name}
                            geometry={geometry}
                            onPress={this.props.onSelect}
                        />
                    ))}
                </ScrollView>
            </View>
        ) : null;
    }
}

const mapStateToProps = state => state.geometry;

const mapDispatchToProps = {
    onClose: close,
    onSelect: select
};

export default connect(mapStateToProps, mapDispatchToProps)(GeometryListView);
