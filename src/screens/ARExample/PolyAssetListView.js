import React from 'react';
import {
    ScrollView,
    TouchableOpacity,
    Text,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import PolyAssetView from './PolyAssetView';

const { width } = Dimensions.get('window');

export default ({ assets, canLoadMore, onLoadMore, loadingMore, onPress }) => (
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
        {assets.map((asset, i) => (
            <PolyAssetView asset={asset} onPress={onPress} />
        ))}
        {canLoadMore && (
            <TouchableOpacity
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    padding: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}
                onPress={onLoadMore}
            >
                {loadingMore ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                ) : (
                    <Text style={{ flex: 1, textAlign: 'center' }}>
                        Load more
                    </Text>
                )}
            </TouchableOpacity>
        )}
    </ScrollView>
);
