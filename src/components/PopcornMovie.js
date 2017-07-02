import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const styles = StyleSheet.create({
    container: {

    },
    image: {

    },
    overlay: {

    },
    meta: {

    },
    name: {
        backgroundColor: 'transparent'
    },
    stars: {

    }
});

const Movie = ({ name, stars, source }) => (
    <View style={styles.container}>
        <Image style={styles.image} source={source} />
        <View style={styles.overlay} />
        <View style={styles.meta}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.stars}>{stars}</Text>
        </View>
    </View>
);
export default Movie;
