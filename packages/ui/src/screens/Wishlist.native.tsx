import React from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useWishlist } from '@dalab/shared';
import { theme } from '../theme/tokens';
import { commonStyles } from '../styles/Common.styles';
import { ProductCard } from '../components/ProductCard.native';
import { useNavigation } from '@react-navigation/native';

export const WishlistScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { wishlist } = useWishlist();

    return (
        <SafeAreaView style={commonStyles.safeContainer}>
            <View style={commonStyles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButton}>
                    <Text style={commonStyles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>My Wishlist ({wishlist.length})</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={wishlist}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={commonStyles.cardWrapper}>
                        <ProductCard
                            {...item}
                            name={item.title}
                            price={`$${item.price}`}
                            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                        />
                    </View>
                )}
                contentContainerStyle={commonStyles.gridList}
                columnWrapperStyle={commonStyles.gridColumnWrapper}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={commonStyles.emptyStateContainer}>
                        <Text style={commonStyles.emptyStateText}>Your wishlist is empty.</Text>
                        <TouchableOpacity
                            style={{ marginTop: theme.spacing.md }}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Explore Products</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </SafeAreaView>
    );
};
