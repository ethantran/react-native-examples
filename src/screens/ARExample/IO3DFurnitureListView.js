import React from 'react';
import { ScrollView } from 'react-native';
import IO3DFurnitureView from './IO3DFurnitureView';

export default ({ furnitures, onPress }) => (
    <ScrollView
        style={{ flex: 1, borderRadius: 8 }}
        contentContainerStyle={{
            borderRadius: 8,
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: 8,
            justifyContent: 'space-between'
        }}
    >
        {furnitures.map((furniture, i) => (
            <IO3DFurnitureView
                key={furniture.id}
                furniture={furniture}
                onPress={onPress}
            />
        ))}
    </ScrollView>
);
