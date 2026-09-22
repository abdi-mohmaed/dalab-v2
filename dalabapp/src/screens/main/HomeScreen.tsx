import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    ImageBackground,
    StatusBar
} from 'react-native';
import { theme } from '../../theme/tokens';
import { SearchBar } from '../../components/SearchBar';
import { SmallStripBanner } from '../../components/SmallStripBanner';
import { ProductCard } from '../../components/ProductCard';
import { MarketplaceTabs } from '../../components/MarketplaceTabs';
import { CategoryGrid } from '../../components/CategoryGrid';
import { BigBanner } from '../../components/BigBanner';
import { MiddleBanner } from '../../components/MiddleBanner';
import { productService } from '../../services/products';
import { homepageService } from '../../services/homepage';
import { categoryService } from '../../services/categories';
import { supabase } from '../../services/supabase';
import { Product, HomepageSection, Category } from './types';

const HomeScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [sections, setSections] = useState<HomepageSection[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        fetchDashboardData();

        // Supabase Realtime Subscriptions
        const channel = supabase
            .channel('dashboard-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'HomepageSection' },
                () => fetchDashboardData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Category' },
                () => fetchDashboardData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Product' },
                () => fetchDashboardData()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [fetchedSections, fetchedCategories, fetchedProducts] = await Promise.all([
                homepageService.getHomepageSections(),
                categoryService.getCategories(),
                productService.getProducts()
            ]);

            setSections(fetchedSections || []);
            setCategories(fetchedCategories || []);
            setProducts(fetchedProducts || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <ScrollView
                style={styles.contentArea}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        fetchDashboardData();
                    }} />
                }
            >
                <View style={styles.headerContainer}>
                    <ImageBackground
                        source={require('../../assets/app_images/home_gradient.png')}
                        style={styles.headerArea}
                        imageStyle={styles.headerGradient}
                        resizeMode="stretch"
                    >
                        <MarketplaceTabs />
                        <SmallStripBanner />
                        <SearchBar
                            value={searchQuery}
                            onChangeText={handleSearch}
                            onClear={() => setSearchQuery('')}
                        />
                    </ImageBackground>
                </View>

                {loading && !refreshing ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <View style={styles.sectionsWrapper}>
                        {searchQuery.length > 0 ? (
                            <View style={styles.searchGrid}>
                                {filteredProducts.map(item => (
                                    <View key={item.id} style={styles.productWrap}>
                                        <ProductCard
                                            product={item}
                                            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                                        />
                                    </View>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <Text style={styles.emptyText}>No products found.</Text>
                                )}
                            </View>
                        ) : (
                            sections.map((section) => {
                                const banners = section.config?.banners || [];

                                switch (section.type) {
                                    case 'BANNERS':
                                        return (
                                            <ScrollView
                                                key={section.id}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                pagingEnabled
                                                style={styles.sectionContainer}
                                            >
                                                {banners.map((banner: any, idx: number) => (
                                                    <BigBanner key={idx} src={banner.image || banner.src} />
                                                ))}
                                            </ScrollView>
                                        );

                                    case 'CATEGORIES':
                                        return (
                                            <View key={section.id} style={styles.sectionContainer}>
                                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                                <CategoryGrid categories={categories} />
                                            </View>
                                        );

                                    case 'SMALL_BANNERS':
                                    case 'MIDDLE_BANNERS':
                                        return (
                                            <View key={section.id} style={[styles.sectionContainer, { paddingVertical: 8 }]}>
                                                {banners.map((banner: any, idx: number) => (
                                                    <MiddleBanner key={idx} src={banner.image || banner.src} />
                                                ))}
                                            </View>
                                        );

                                    case 'PRODUCTS':
                                        return (
                                            <View key={section.id} style={styles.sectionContainer}>
                                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                                                    {products.slice(0, 10).map((product) => (
                                                        <View key={product.id} style={{ width: 160, marginRight: 16 }}>
                                                            <ProductCard
                                                                product={product}
                                                                onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
                                                            />
                                                        </View>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        );

                                    default:
                                        return null;
                                }
                            })
                        )}
                        <View style={{ height: 40 }} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    statusBarFiller: {
        height: 0,
    },
    headerContainer: {
        backgroundColor: '#F7CD07', // Ensure yellow background behind the gradient
    },
    headerArea: {
        paddingTop: 60, // Account for status bar
        paddingBottom: 30,
    },
    headerGradient: {
    },
    contentArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    sectionsWrapper: {
        backgroundColor: '#FFFFFF',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    sectionContainer: {
        marginTop: 16,
    },
    sectionTitle: {
        ...(theme.typography.h2 as any),
        paddingHorizontal: theme.spacing.md,
        color: theme.colors.text,
        marginBottom: 8,
    },
    searchGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        justifyContent: 'space-between',
    },
    productWrap: {
        width: '48%',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        width: '100%',
        marginTop: 20,
    },
});

export default HomeScreen;
