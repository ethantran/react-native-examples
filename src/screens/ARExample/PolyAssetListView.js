import React from 'react';
import { ScrollView } from 'react-native';
import PolyAssetView from './PolyAssetView';
export default ({ results, onPress }) => (
    <ScrollView
        style={{ flex: 1, borderRadius: 8 }}
        contentContainerStyle={{
            backgroundColor: '#fff',
            borderRadius: 8
        }}
    >
        {results.assets.map((asset, i) => (
            <PolyAssetView asset={asset} onPress={onPress} />
        ))}
    </ScrollView>
);
