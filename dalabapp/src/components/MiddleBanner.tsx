import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

interface MiddleBannerProps {
    src: string;
}

const { width } = Dimensions.get('window');

export const MiddleBanner: React.FC<MiddleBannerProps> = ({ src }) => {
    return (
        <View style={styles.container}>
            <FastImage
                source={{ uri: src, priority: FastImage.priority.high }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.stretch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        height: 48, // Matches SmallStripBanner
        marginVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

