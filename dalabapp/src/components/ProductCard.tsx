import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/tokens';
import { Product } from '../types/database';
import { useWishlistStore } from '../store/wishlistStore';

interface ProductCardProps {
    product: Product;
    onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
}) => {
    const { toggleItem, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);

    // Mock values for visual parity if they are missing from DB
    const isBestSeller = product.isBestSeller ?? Math.random() > 0.6;
    const originalPrice = product.originalPrice ?? (product.price * 1.5);
    const discount = product.discountPercentage ?? 36;
    const reviewCount = product.reviewCount ?? "(11.9K)";
    const hasFreeDelivery = product.hasFreeDelivery ?? true;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                {product.image ? (
                    <FastImage
                        source={{ uri: product.image, priority: FastImage.priority.normal }}
                        style={styles.image}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                ) : (
                    <View style={styles.placeholderImage} />
                )}

                {/* Best Seller Badge */}
                {isBestSeller && (
                    <View style={styles.bestSellerBadge}>
                        <Text style={styles.bestSellerText}>Best Seller</Text>
                    </View>
                )}


                {/* Wishlist Button */}
                <TouchableOpacity
                    style={styles.wishlistButton}
                    onPress={() => toggleItem(product)}
                >
                    <Icon
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={18}
                        color={isWishlisted ? "#EF4444" : "#1F2937"}
                    />
                </TouchableOpacity>

                {/* PLUS Button */}
                <TouchableOpacity style={styles.plusButton}>
                    <Icon name="plus" size={20} color="#000000" />
                </TouchableOpacity>
            </View>

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                    {product.title}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={styles.currency}>$</Text>
                    <Text style={styles.price}>{product.price.toLocaleString()}</Text>
                    <Text style={styles.originalPrice}>{originalPrice.toLocaleString()}</Text>
                    <Text style={styles.discountText}>{discount}%</Text>
                </View>

                {/* Free Delivery */}
                {hasFreeDelivery && (
                    <View style={styles.deliveryRow}>
                        <Icon name="truck-delivery" size={14} color="#3B82F6" />
                        <Text style={styles.deliveryText}>Free Delivery</Text>
                    </View>
                )}

                {/* Tags */}
                <View style={styles.tagRow}>
                    <View style={[styles.tag, { backgroundColor: '#FDE047' }]}>
                        <Text style={styles.tagText}>express</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 12,
        width: '100%',
    },
    imageContainer: {
        width: '100%',
        height: 160,
        backgroundColor: '#f9f9f9',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f3f4f6',
    },
    bestSellerBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#064E3B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    bestSellerText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    wishlistButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    plusButton: {
        position: 'absolute',
        bottom: -16,
        right: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 10,
    },
    info: {
        padding: 10,
        paddingTop: 20, // Space for the plus button overlap
    },
    name: {
        fontSize: 13,
        fontWeight: '400',
        color: '#111827',
        lineHeight: 18,
        height: 36,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#111827',
    },
    reviewCountText: {
        fontSize: 12,
        color: '#6B7280',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 8,
        gap: 4,
        flexWrap: 'wrap',
    },
    currency: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    originalPrice: {
        fontSize: 12,
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    discountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#10B981',
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    deliveryText: {
        fontSize: 12,
        color: '#4B5563',
    },
    saveBanner: {
        backgroundColor: '#ECFDF5',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    saveText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#059669',
    },
    tagRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
    },
});
