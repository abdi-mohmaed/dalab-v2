import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/tokens';
import { SearchBar } from '../../components/SearchBar';
import { ProductCard } from '../../components/ProductCard';
import { supabase } from '../../services/supabase';
import { Product } from '../../types/database';

const SearchScreen = ({ navigation }: any) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length < 2) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('Product')
                .select('*')
                .eq('status', 'ACTIVE')
                .ilike('title', `%${text}%`)
                .limit(20);

            if (error) throw error;
            
            const mappedResults = (data || []).map(p => ({
                ...p,
                price: p.originalPrice ?? 0,
                category_id: p.categoryId,
                store_id: p.storeId
            }));
            
            setResults(mappedResults);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                value={query}
                onChangeText={handleSearch}
                onClear={() => {
                    setQuery('');
                    setResults([]);
                }}
                placeholder="Search for products or categories..."
            />

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ProductCard
                        product={item}
                        onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                    />
                )}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                ListHeaderComponent={
                    query.length === 0 ? (
                        <View style={styles.initialState}>
                            <Text style={styles.sectionTitle}>Popular Categories</Text>
                            {/* Add category chips here if needed */}
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    query.length > 0 && !loading ? (
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No results found for "{query}"</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: 12,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    initialState: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});

export default SearchScreen;
