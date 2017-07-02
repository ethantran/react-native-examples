import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

import MessageMeta from './OperatorMessageMeta';

const colorLight = '#E8E8E8';
const colorPrimary = '#4EAAF0';

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10
    },
    containerMe: {
        backgroundColor: colorPrimary,
        marginLeft: 50,
        justifyContent: 'flex-end',
        borderRadius: 10,
    },
    containerOther: {
        backgroundColor: 'white',
        marginRight: 50
    },
    fullWidth: {
        marginLeft: 0,
        marginRight: 0
    },
    avatarContainer: {
        position: 'absolute',
        top: -18,
        borderTopRightRadius: 7,
        borderTopLeftRadius: 7,
        borderBottomRightRadius: 7,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: colorLight,
        overflow: 'hidden'
    },
    avatar: {
        width: 30,
        height: 30,
        borderTopRightRadius: 7,
        borderTopLeftRadius: 7,
        borderBottomRightRadius: 7,
        overflow: 'hidden'
    }
});

const Message = ({ me, fullWidth, user, children }) => (
    <MessageMeta me={me}>
        <View style={[
            styles.container,
            me ? styles.containerMe : styles.containerOther,
            fullWidth && styles.fullWidth,
        ]}>
            {!me && <View style={styles.avatarContainer}><Image style={styles.avatar} source={user.source} /></View>}
            {children}
        </View>
    </MessageMeta>
);
export default Message;
