import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/tokens';

export const ProductHeader: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.icon}>←</Text>
            </TouchableOpacity>

            <View style={styles.rightActions}>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.icon}>🔍</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.icon}>♡</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.icon}>↗</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        backgroundColor: 'transparent',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    rightActions: {
        flexDirection: 'row',
    },
    icon: {
        fontSize: 20,
        color: '#000',
    },
});
