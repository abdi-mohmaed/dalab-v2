import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme/tokens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SmallStripBanner = () => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9}>
            <View style={styles.content}>
                <View style={styles.leftContent}>
                    <Icon name="tag-multiple" size={18} color="#FFF" style={styles.icon} />
                    <Text style={styles.title}>Special Offer | ZAAD SALE</Text>
                </View>
                <View style={styles.ctaContainer}>
                    <Text style={styles.ctaText}>Shop Now</Text>
                    <Icon name="chevron-right" size={16} color="#00A859" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        height: 48,
        backgroundColor: '#00A859', // ZAAD Brand Green
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 6,
    },
    title: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    ctaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    ctaText: {
        color: '#00A859',
        fontSize: 12,
        fontWeight: '700',
        marginRight: 2,
    }
});
