import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { styles } from '../styles/ProductDetail.styles';
import { theme } from '../theme/tokens';
import { ProductHeader } from '../components/ProductHeader.native';
import { VariantSelector } from '../components/VariantSelector.native';

export const ProductDetailScreen: React.FC<any> = ({ route }: any) => {
    const { id } = route?.params || { id: 'test-id' };
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        // Mock fetch for now, will connect to shared api in next step
        setTimeout(() => {
            setProduct({
                id,
                title: "Premium Wireless Headphones - Noise Cancelling with 40h Battery",
                price: 299.99,
                rating: 4.8,
                description: "Experience world-class noise cancellation with these premium headphones. Featuring industry-leading sound quality and a comfortable over-ear design for long listening sessions.",
                images: ["https://via.placeholder.com/600", "https://via.placeholder.com/601"],
                store: { name: "Dalab Official" },
                attributes: [
                    { id: '1', name: 'Color', type: 'COLOR', values: ['Silver', 'Black', 'Blue'] },
                    { id: '2', name: 'Size', type: 'TEXT', values: ['Universal'] }
                ]
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerWrapper}>
                    <ProductHeader />
                </View>

                {/* Image Carousel */}
                <View style={styles.imageCarousel}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const x = e.nativeEvent.contentOffset.x;
                            const idx = Math.round(x / Dimensions.get('window').width);
                            if (idx !== activeImage) setActiveImage(idx);
                        }}
                        scrollEventThrottle={16}
                    >
                        {product.images.map((img: string, i: number) => (
                            <Image key={i} source={{ uri: img }} style={styles.imageCarousel} resizeMode="contain" />
                        ))}
                    </ScrollView>
                    <View style={styles.pagination}>
                        {product.images.map((_: any, i: number) => (
                            <View key={i} style={[styles.dot, i === activeImage && styles.activeDot]} />
                        ))}
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <Text style={styles.storeName}>{product.store.name}</Text>
                    <Text style={styles.title}>{product.title}</Text>

                    <View style={styles.ratingContainer}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingText}>{product.rating}</Text>
                            <Text style={styles.starSmall}>★</Text>
                        </View>
                        <Text style={styles.verifiedText}>(Verified Purchase)</Text>
                    </View>

                    <Text style={styles.price}>${product.price.toLocaleString()}</Text>

                    <View style={styles.divider} />

                    <VariantSelector attributes={product.attributes} />

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Product Overview</Text>
                    <Text style={{ color: '#4B5563', lineHeight: 20 }}>{product.description}</Text>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerPrice}>${product.price}</Text>
                    <Text style={{ fontSize: 10, color: '#10B981', fontWeight: '600' }}>Free Delivery</Text>
                </View>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>ADD TO CART</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
