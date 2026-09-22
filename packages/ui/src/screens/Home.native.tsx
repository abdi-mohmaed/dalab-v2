import React from 'react';
import {
    ScrollView,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import { useProducts, useDashboard, useStore } from '@dalab/shared';
import { styles } from '../styles/Home.styles';
import { theme } from '../theme/tokens';
import { MarketplaceTabs } from '../components/MarketplaceTabs.native';
import { SearchBar } from '../components/SearchBar.native';
import { BigBanner } from '../components/BigBanner.native';
import { CategoryGrid } from '../components/CategoryGrid.native';
import { ProductCard } from '../components/ProductCard.native';

export const HomeScreen: React.FC = () => {
    const { currentStore } = useStore();
    const selectedStore = currentStore?.slug || 'dalab';
    const { homepageSections, categories, isLoading: isDashboardLoading } = useDashboard();

    const { products: globalProducts, isLoading: isProductsLoading } = useProducts({
        store: selectedStore === 'dalab' ? undefined : selectedStore,
        pageSize: 10
    });

    if (isDashboardLoading || (isProductsLoading && globalProducts.length === 0)) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* 1. Header & Tabs */}
            <View style={styles.gradientHeader}>
                <MarketplaceTabs
                    selectedStore={selectedStore}
                    onSelectStore={(id) => console.log('Store selected:', id)}
                />
            </View>

            {/* 2. Main Content Area */}
            <View style={styles.contentArea}>
                <SearchBar />

                {homepageSections
                    ?.filter((s: any) => s.active)
                    .sort((a: any, b: any) => a.order - b.order)
                    .map((section: any) => {
                        const banners = section.config?.banners || [];
                        switch (section.type) {
                            case 'BANNERS':
                                return (
                                    <ScrollView
                                        key={section.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        pagingEnabled
                                        contentContainerStyle={{ paddingHorizontal: 0 }}
                                    >
                                        {banners.map((banner: any, idx: number) => (
                                            <BigBanner key={idx} src={banner.image || banner.src} />
                                        ))}
                                    </ScrollView>
                                );

                            case 'CATEGORIES':
                                return (
                                    <View key={section.id}>
                                        <Text style={styles.sectionTitle}>{section.title}</Text>
                                        <CategoryGrid categories={categories} />
                                    </View>
                                );

                            case 'SMALL_BANNERS':
                            case 'MIDDLE_BANNERS':
                                return (
                                    <View key={section.id} style={{ paddingVertical: 8 }}>
                                        {banners.map((banner: any, idx: number) => (
                                            <BigBanner key={idx} src={banner.image || banner.src} />
                                        ))}
                                    </View>
                                );

                            case 'PRODUCTS':
                                const sectionProducts = section.products || [];
                                if (sectionProducts.length === 0) return null;
                                return (
                                    <View key={section.id} style={{ padding: 16 }}>
                                        <Text style={styles.sectionTitle}>{section.title}</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                            <View style={styles.productRow}>
                                                {sectionProducts.map((product: any) => (
                                                    <ProductCard
                                                        key={product.id}
                                                        id={product.id}
                                                        name={product.title}
                                                        price={`$${product.price}`}
                                                        rating={product.rating || 4.5}
                                                        image={product.image}
                                                    />
                                                ))}
                                            </View>
                                        </ScrollView>
                                    </View>
                                );

                            default:
                                return null;
                        }
                    })}
            </View>
        </ScrollView>
    );
};
