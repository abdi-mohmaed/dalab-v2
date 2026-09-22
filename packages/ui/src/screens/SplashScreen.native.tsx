import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { theme } from '../theme/tokens';

export const SplashScreen: React.FC = () => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Image
                    source={require('../assets/dalab-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.tagline}>Global Marketplace in Your Pocket</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFC644',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 80,
    },
    tagline: {
        marginTop: 16,
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
