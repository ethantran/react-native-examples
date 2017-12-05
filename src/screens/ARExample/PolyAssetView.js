import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';

export default ({ asset, onPress }) => (
    <TouchableOpacity
        key={asset.name}
        style={{
            flexDirection: 'row',
            padding: 8,
            marginBottom: 8
        }}
        onPress={() => onPress(asset)}
    >
        <Image
            source={{
                uri: asset.thumbnail.url
            }}
            style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                marginRight: 8
            }}
        />
        <Text style={{ fontSize: 24 }}>{asset.displayName}</Text>
    </TouchableOpacity>
);
