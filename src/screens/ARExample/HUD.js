import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import PolyIcon from '../../assets/icons/poly.png';
import PredictHQIcon from '../../assets/icons/predicthq.png';
import ArchilogicIcon from '../../assets/icons/archilogic.png';

import { open as openPoly } from './actions/poly';
import { open as openGeometry } from './actions/geometry';
import { open as openIO3D } from './actions/io3d';
import {
    toggleMap,
    googlePlacesNearbySearch,
    instagramLocationMediaSearch,
    predictHQEventsSearch
} from './actions/hud';

class HUD extends React.Component {
    render() {
        return (
            <View
                style={[styles.container, !this.props.visible && styles.hide]}
            >
                <TouchableOpacity
                    onPress={this.props.onGeometry}
                    style={styles.button}
                >
                    <MaterialCommunityIcons
                        size={24}
                        color="#000"
                        name="shape-plus"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.props.onPoly}
                    style={styles.button}
                >
                    <Image
                        source={PolyIcon}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.props.onIO3D}
                    style={styles.button}
                >
                    <Image
                        source={ArchilogicIcon}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.props.onMap}
                    style={styles.button}
                >
                    <MaterialIcons size={24} color="#000" name="map" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.props.onGooglePlaces}
                    style={styles.button}
                >
                    <MaterialCommunityIcons
                        size={24}
                        color="#000"
                        name="google-maps"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.props.onPredictHQ}
                    style={styles.button}
                >
                    <Image
                        source={PredictHQIcon}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 8,
        right: 8
    },
    // returning render null makes image icons not show for some reason
    hide: {
        right: '-100%'
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

const mapStateToProps = state => state.hud;

const mapDispatchToProps = {
    onGeometry: openGeometry,
    onPoly: openPoly,
    onIO3D: openIO3D,
    onMap: toggleMap,
    onGooglePlaces: googlePlacesNearbySearch,
    onInstagram: instagramLocationMediaSearch,
    onPredictHQ: predictHQEventsSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(HUD);
