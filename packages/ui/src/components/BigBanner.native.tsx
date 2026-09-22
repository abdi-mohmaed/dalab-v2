import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface BigBannerProps {
    src?: any;
}

export const BigBanner: React.FC<BigBannerProps> = ({ src }) => {
    const imageSource = typeof src === 'string' ? { uri: src } : src || require('../assets/big-banner.png');

    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.92,
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        marginHorizontal: 4,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        aspectRatio: 2, // Approximate aspect ratio from web
        borderRadius: 20,
    },
});
