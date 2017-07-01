import React from 'react';
import { StyleSheet, View } from 'react-native';

const colorSandra = '#1363FB';
const colorRobin = '#AFAFA5';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    border: {
        width: 5,
        borderRadius: 2,
        alignItems: 'stretch',
    },
    children: {
        paddingHorizontal: 20,
        paddingVertical: 3
    }
});
const Border = ({ me, children, style }) => (
    <View style={[styles.container, style]}>
        <View style={[styles.border, { backgroundColor: me ? colorRobin : colorSandra }]} />
        <View style={styles.children}>
            {children}
        </View>
    </View>
);
export default Border;
