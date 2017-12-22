import React from 'react';
import { TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ROW_COUNT = 3;
const SIZE = width / ROW_COUNT - 12;

export default ({ furniture, onPress, index }) => (
    <TouchableOpacity
        key={furniture.name}
        style={{
            flexDirection: 'row',
            marginBottom: 8
        }}
        onPress={() => onPress(furniture)}
    >
        <Image
            source={{
                uri: furniture.thumb
            }}
            style={{
                width: SIZE,
                height: SIZE,
                borderRadius: 8,
                backgroundColor: '#fff'
            }}
            resizeMode="contain"
        />
    </TouchableOpacity>
);
