// hud when an object is selected

import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import {
    translate,
    scaleUp,
    scaleDown,
    copy,
    remove,
    close
} from './actions/hudSelection';

class HUDSelection extends React.Component {
    handleTranslate = () => this.props.onTranslate(this.props.selection);
    handleScaleUp = () => this.props.onScaleUp(this.props.selection);
    handleScaleDown = () => this.props.onScaleDown(this.props.selection);
    handleDelete = () => this.props.onDelete(this.props.selection);
    handleCopy = () => this.props.onCopy(this.props.selection);
    handleDone = () => this.props.onDone(this.props.selection);
    render() {
        return this.props.visible ? (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={this.handleTranslate}
                    style={styles.button}
                >
                    <MaterialCommunityIcons
                        size={24}
                        color="#000"
                        name="move-resize-variant"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.handleScaleUp}
                    style={styles.button}
                >
                    <MaterialIcons size={24} color="#000" name="add" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.handleScaleDown}
                    style={styles.button}
                >
                    <MaterialIcons size={24} color="#000" name="remove" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.handleDelete}
                    style={styles.button}
                >
                    <MaterialIcons size={24} color="#000" name="delete" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.handleCopy}
                    style={styles.button}
                >
                    <MaterialIcons size={24} color="#000" name="content-copy" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.handleDone}
                    style={styles.button}
                >
                    <MaterialIcons size={24} color="#000" name="done" />
                </TouchableOpacity>
            </View>
        ) : null;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 8,
        right: 8
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    image: { width: 24, height: 24 }
});

const mapStateToProps = state => ({
    ...state.hudSelection,
    selection: state.three.selection
});

const mapDispatchToProps = {
    onTranslate: translate,
    onScaleUp: scaleUp,
    onScaleDown: scaleDown,
    onCopy: copy,
    onDelete: remove,
    onDone: close
};

export default connect(mapStateToProps, mapDispatchToProps)(HUDSelection);
