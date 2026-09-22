import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    ActivityIndicator,
    Text,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import { theme } from '../../theme/tokens';
import { productService } from '../../services/products';
import { ProductCard } from '../../components/ProductCard';
import { Product } from './types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CategoryProductsScreen = ({ route, navigation }: any) => {
    const { categoryId, categoryName } = route.params;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const fetchedProducts = await productService.getProductsByCategory(categoryId);
            setProducts(fetchedProducts);
        } catch (error: any) {
            console.error('Detailed Error fetching products by category:', JSON.stringify(error, null, 2));
            alert(`Error: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.productWrap}>
                        <ProductCard
                            product={item}
                            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="package-variant-closed" size={64} color={theme.colors.textSecondary} />
                        <Text style={styles.emptyText}>No products found in {categoryName}.</Text>
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 12,
    },
    productWrap: {
        width: '48%',
        marginHorizontal: '1%',
        marginBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        marginTop: 16,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    backButton: {
        marginTop: 24,
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    }
});

export default CategoryProductsScreen;
