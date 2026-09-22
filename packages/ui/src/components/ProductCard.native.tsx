import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { theme } from '../theme/tokens';

interface ProductCardProps {
    id: string;
    name: string;
    price: string;
    rating?: number;
    image?: string;
    onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    name,
    price,
    rating = 4.5,
    image,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage} />
                )}
            </View>

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                    {name}
                </Text>

                <View style={styles.ratingRow}>
                    <Text style={styles.star}>★</Text>
                    <Text style={styles.ratingText}>{rating}</Text>
                </View>

                <Text style={styles.price}>{price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 8,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#f5f5f5',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
    },
    info: {
        padding: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text,
        lineHeight: 18,
        minHeight: 36,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    star: {
        color: theme.colors.accent,
        fontSize: 14,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.text,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginTop: 8,
    },
});
