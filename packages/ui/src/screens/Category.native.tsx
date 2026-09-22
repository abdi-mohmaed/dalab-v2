import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useDashboard, useProducts } from '@dalab/shared';
import { theme } from '../theme/tokens';
import { commonStyles } from '../styles/Common.styles';
import { ProductCard } from '../components/ProductCard.native';
import { useNavigation } from '@react-navigation/native';

export const CategoryScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { categories } = useDashboard();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0].name);
        }
    }, [categories]);

    const { products, isLoading } = useProducts({
        category: selectedCategory || undefined,
        pageSize: 20,
    });

    const renderCategoryItem = ({ item }: { item: any }) => {
        const isSelected = selectedCategory === item.name;
        return (
            <TouchableOpacity
                onPress={() => setSelectedCategory(item.name)}
                style={{ alignItems: 'center', marginRight: theme.spacing.md, width: 80 }}
            >
                <View style={{
                    width: 70, height: 70, borderRadius: theme.borderRadius.md,
                    backgroundColor: '#F7CD07', justifyContent: 'center', alignItems: 'center',
                    marginBottom: 8, borderWidth: isSelected ? 3 : 0, borderColor: '#000',
                    ...theme.shadows.sm
                }}>
                    {item.image && (
                        <Image source={{ uri: item.image }} style={{ width: '70%', height: '70%' }} resizeMode="contain" />
                    )}
                </View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: isSelected ? '#000' : '#6B7280', textAlign: 'center', textTransform: 'lowercase' }}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={commonStyles.safeContainer}>
            <View style={{ height: 120, backgroundColor: theme.colors.accent, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, justifyContent: 'center', paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ fontSize: 24, color: '#000', fontWeight: 'bold' }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1 }}>Categories</Text>
                </View>
            </View>

            <View style={{ marginTop: -30, zIndex: 10 }}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCategoryItem}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </View>

            <View style={{ padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '900', textTransform: 'uppercase' }}>{selectedCategory}</Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>{products.length} Items</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={commonStyles.cardWrapper}>
                            <ProductCard {...item} name={item.title} price={`$${item.price}`} onPress={() => navigation.navigate('ProductDetail', { id: item.id })} />
                        </View>
                    )}
                    contentContainerStyle={commonStyles.gridList}
                    columnWrapperStyle={commonStyles.gridColumnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};
