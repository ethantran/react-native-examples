import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

export default ({ geometry, onPress, index }) => (
    <TouchableOpacity
        style={{
            padding: 8,
            marginRight: 8,
            marginBottom: 8,
            borderRadius: 8,
            backgroundColor: '#fff'
        }}
        onPress={() => onPress(geometry)}
    >
        <Text
            style={{
                fontSize: 24,
                fontWeight: 'bold'
            }}
        >
            {geometry.name}
        </Text>
    </TouchableOpacity>
);
