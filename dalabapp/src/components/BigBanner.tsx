import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

interface BigBannerProps {
    src?: any;
}

export const BigBanner: React.FC<BigBannerProps> = ({ src }) => {
    return (
        <View style={styles.container}>
            <FastImage
                source={{ uri: src, priority: FastImage.priority.high }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width - 32, // Allow peek of next banner by making it slightly narrower
        alignSelf: 'center',
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    image: {
        width: '100%',
        height: 180, // Fixed height for consistency
        borderRadius: 16,
    },
});
