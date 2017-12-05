import React from 'react';
import { TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ROW_COUNT = 3;
const SIZE = width / ROW_COUNT - 8 * 2;

export default ({ asset, onPress }) => (
    <TouchableOpacity
        key={asset.name}
        style={{
            flexDirection: 'row',
            marginBottom: 8,
            marginRight: 8
        }}
        onPress={() => onPress(asset)}
    >
        <Image
            source={{
                uri: asset.thumbnail.url
            }}
            style={{
                width: SIZE,
                height: SIZE,
                borderRadius: 8
            }}
        />
    </TouchableOpacity>
);
