import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { theme } from '../../theme/tokens';
import { VariantSelector } from '../../components/VariantSelector';
import { Button } from '../../components/Button';
import { supabase } from '../../services/supabase';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../types/database';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: any) => {
    const { id } = route.params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('Product')
                .select('*, store:storeId(name), images:ProductImage(*)')
                .eq('id', id)
                .single();

            if (error) throw error;
            
            // Map data for UI compatibility and type safety
            const mappedProduct = {
                ...data,
                price: data.originalPrice ?? 0,
                category_id: data.categoryId,
                store_id: data.storeId,
            };
            
            setProduct(mappedProduct);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addItem(product);
            // Optional: Navigate to Cart or show localized success toast
            navigation.navigate('Cart');
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.loader}>
                <Text>Product not found.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <FastImage
                    source={{ uri: product.image, priority: FastImage.priority.high }}
                    style={styles.mainImage}
                    resizeMode={FastImage.resizeMode.cover}
                />

                <View style={styles.content}>
                    <Text style={styles.category}>Category</Text>
                    <Text style={styles.title}>{product.title}</Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>${product.price.toLocaleString()}</Text>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>★ {product.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <View style={styles.divider} />

                    {/* This would be dynamically populated if the database has attributes */}
                    {/* <VariantSelector 
            attributes={[]} 
            selectedVariants={selectedVariants}
            onSelect={(id, val) => setSelectedVariants({...selectedVariants, [id]: val})}
          /> */}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    style={styles.addButton}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImage: {
        width: width,
        height: width,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    category: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.text,
        lineHeight: 30,
        marginBottom: 12,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    price: {
        fontSize: 22,
        fontWeight: '900',
        color: theme.colors.text,
    },
    ratingBadge: {
        backgroundColor: theme.colors.accent + '20',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B45309',
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.white,
    },
    addButton: {
        width: '100%',
    }
});

export default ProductDetailScreen;
