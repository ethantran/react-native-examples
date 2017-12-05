import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default ({ progress }) => (
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
);
