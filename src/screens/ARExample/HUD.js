import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import PolyIcon from '../../assets/icons/poly.png';
import PredictHQIcon from '../../assets/icons/predicthq.png';

import { open as openPoly } from './actions/poly';
import {
    toggleMap,
    googlePlacesNearbySearch,
    instagramLocationMediaSearch,
    predictHQEventsSearch
} from './actions/hud';

class HUD extends React.Component {
    render() {
        return this.props.show ? (
            <View style={styles.container}>
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
                    onPress={this.props.onInstagram}
                    style={styles.button}
                >
                    <MaterialCommunityIcons
                        size={24}
                        color="#000"
                        name="instagram"
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

const mapStateToProps = state => state.hud;

const mapDispatchToProps = {
    onPoly: openPoly,
    onMap: toggleMap,
    onGooglePlaces: googlePlacesNearbySearch,
    onInstagram: instagramLocationMediaSearch,
    onPredictHQ: predictHQEventsSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(HUD);
