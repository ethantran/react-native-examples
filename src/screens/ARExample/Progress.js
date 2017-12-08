import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

const Progress = ({ visible, progress }) =>
    visible ? (
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
            <Text style={{ fontSize: 24 }}>{`Loading... ${progress}`}</Text>
        </View>
    ) : null;

const mapStateToProps = state => state.progress;

export default connect(mapStateToProps)(Progress);
