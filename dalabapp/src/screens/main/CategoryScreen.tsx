import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, ImageBackground, SafeAreaView } from 'react-native';
import { theme } from '../../theme/tokens';
import { categoryService } from '../../services/categories';
import { Category, Product } from './types';
import { productService } from '../../services/products';
import { ProductCard } from '../../components/ProductCard';

export default function CategoryScreen({ navigation }: any) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('Fetching categories and products...');
            const [fetchedCategories, fetchedProducts] = await Promise.all([
                categoryService.getCategories(),
                productService.getProducts()
            ]);
            console.log('Fetched Categories:', fetchedCategories?.length || 0);
            console.log('Fetched Products:', fetchedProducts?.length || 0);

            setCategories(fetchedCategories || []);
            setProducts(fetchedProducts || []);

            if (fetchedCategories && fetchedCategories.length > 0) {
                // Select first category by default
                setSelectedCategoryId(fetchedCategories[0].id);
            }
        } catch (error: any) {
            console.error('Error fetching categories and products:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const displayProducts = selectedCategoryId
        ? products.filter(p => p.category_id === selectedCategoryId)
        : products;

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Explore Categories</Text>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.categoryCard}
                        onPress={() => navigation.navigate('CategoryProducts', { categoryId: item.id, categoryName: item.name })}
                    >
                        <ImageBackground
                            source={require('../../assets/app_images/yellow_white_gradient.png')}
                            style={styles.cardGradient}
                            imageStyle={styles.cardGradientImage}
                        >
                            {item.image ? (
                                <Image source={{ uri: item.image }} style={styles.categoryImage} />
                            ) : (
                                <View style={styles.placeholderIcon} />
                            )}
                        </ImageBackground>
                        <Text style={styles.categoryName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No categories found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 20,
    },
    categoryCard: {
        width: '46%',
        marginHorizontal: '2%',
        marginBottom: 24,
        alignItems: 'center',
    },
    cardGradient: {
        width: '100%',
        aspectRatio: 1.3, // Slightly more rectangle to fit more content
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        overflow: 'hidden',
    },
    cardGradientImage: {
        borderRadius: 24,
    },
    categoryImage: {
        width: '85%',
        height: '85%',
        resizeMode: 'contain',
    },
    placeholderIcon: {
        width: '60%',
        height: '60%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 15,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000000',
        marginTop: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
});
