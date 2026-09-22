import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/tokens';
import { ProductCard } from '../../components/ProductCard';
import { useWishlistStore } from '../../store/wishlistStore';

const WishlistScreen = ({ navigation }: any) => {
    const { items } = useWishlistStore();

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={items}
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
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
                    </View>
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listContent: {
        padding: 12,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
});

export default WishlistScreen;
