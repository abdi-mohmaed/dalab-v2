import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useProducts } from '@dalab/shared';
import { theme } from '../theme/tokens';
import { SearchBar } from '../components/SearchBar.native';
import { ProductCard } from '../components/ProductCard.native';
import { useNavigation } from '@react-navigation/native';

export const SearchResultsScreen: React.FC<any> = ({ route }: any) => {
    const navigation = useNavigation<any>();
    const query = route?.params?.query || '';

    const { products, isLoading } = useProducts({
        searchQuery: query,
        pageSize: 20,
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.searchWrapper}>
                    <SearchBar placeholder="Search results..." />
                </View>
            </View>

            <View style={styles.filterBar}>
                <Text style={styles.resultsText}>{products.length} Results found for "{query}"</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterText}>Filter ▽</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={styles.cardWrapper}>
                        <ProductCard
                            {...item}
                            name={item.title}
                            price={`$${item.price}`}
                            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                        />
                    </View>
                )}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        fontSize: 24,
        color: theme.colors.text,
    },
    searchWrapper: {
        flex: 1,
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    resultsText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    list: {
        padding: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    cardWrapper: {
        flex: 0.48,
        marginBottom: 16,
    },
});
