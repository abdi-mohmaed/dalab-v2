import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useProducts } from '@dalab/shared';
import { theme } from '../theme/tokens';
import { commonStyles } from '../styles/Common.styles';
import { SearchBar } from '../components/SearchBar.native';
import { ProductCard } from '../components/ProductCard.native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface HubScreenProps {
    route?: any;
}

export const HubScreen: React.FC<HubScreenProps> = ({ route }) => {
    const navigation = useNavigation<any>();
    const source = route?.params?.source || 'Amazon';

    const { products, isLoading } = useProducts({
        source,
        pageSize: 12,
    });

    const getSourceConfig = (src: string) => {
        switch (src.toLowerCase()) {
            case 'amazon':
                return {
                    logo: require('../assets/amazon.png'),
                    banner: require('../assets/big-banner.png'),
                    bgColor: '#232F3E',
                    accentColor: '#FF9900',
                };
            case 'shein':
                return {
                    logo: require('../assets/shein.png'),
                    banner: require('../assets/big-banner.png'),
                    bgColor: '#000000',
                    accentColor: '#FFFFFF',
                };
            default:
                return {
                    logo: require('../assets/dalab-logo.png'),
                    banner: require('../assets/big-banner.png'),
                    bgColor: theme.colors.primary,
                    accentColor: theme.colors.accent,
                };
        }
    };


    const config = getSourceConfig(source);

    const renderHeader = () => (
        <View>
            <View style={{ backgroundColor: config.bgColor, paddingTop: 40, paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: '#FFF', fontSize: 24 }}>←</Text>
                    </TouchableOpacity>
                    <Image source={config.logo} style={{ width: 100, height: 30 }} resizeMode="contain" />
                    <View style={{ width: 24 }} />
                </View>
                <View style={{ paddingHorizontal: 16 }}>
                    <SearchBar placeholder={`Search ${source} Products`} />
                </View>
            </View>

            <View style={{ width: '100%', height: 180, position: 'relative' }}>
                <Image source={config.banner} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' }} />
            </View>

            <Text style={{ ...theme.typography.h2, padding: 16, color: '#0F1111' }}>International Deals</Text>
        </View>
    );

    return (
        <SafeAreaView style={commonStyles.safeContainer}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                ListHeaderComponent={renderHeader}
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
                ListFooterComponent={isLoading ? (
                    <ActivityIndicator size="small" color={config.accentColor} style={{ padding: 20 }} />
                ) : null}
                contentContainerStyle={{ paddingBottom: 40 }}
                columnWrapperStyle={commonStyles.gridColumnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const StyleSheet = require('react-native').StyleSheet;
