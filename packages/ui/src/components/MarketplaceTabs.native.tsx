import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { theme } from '../theme/tokens';

const { width } = Dimensions.get('window');

interface StoreOption {
    id: string;
    name: string;
    logo?: any;
    bgColor: string;
    textColor: string;
    isImage?: boolean;
}

const STORES: StoreOption[] = [
    {
        id: 'dalab',
        name: 'dalab',
        bgColor: '#FFC644',
        textColor: '#1A1A1A',
        isImage: true,
        logo: require('../assets/dalab-logo.png'),
    },
    {
        id: 'shein',
        name: 'SHEIN',
        bgColor: '#000000',
        textColor: '#FFFFFF',
        isImage: true,
        logo: require('../assets/shein.png'),
    },
    {
        id: 'amazon',
        name: 'amazon',
        bgColor: '#131921',
        textColor: '#FFFFFF',
        isImage: true,
        logo: require('../assets/amazon.png'),
    },
    {
        id: 'temu',
        name: 'TEMU',
        bgColor: '#FB7701',
        textColor: '#FFFFFF',
        isImage: true,
        logo: require('../assets/temu.png'),
    },
    {
        id: 'supermarket',
        name: 'Super Market',
        bgColor: '#10B981',
        textColor: '#FFFFFF',
        isImage: false,
    },
];

interface MarketplaceTabsProps {
    selectedStore: string;
    onSelectStore: (storeId: string) => void;
}

export const MarketplaceTabs: React.FC<MarketplaceTabsProps> = ({
    selectedStore,
    onSelectStore,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                snapToInterval={125} // width + gap
                decelerationRate="fast"
            >
                {STORES.map((store) => {
                    const isActive = selectedStore === store.id;

                    return (
                        <TouchableOpacity
                            key={store.id}
                            style={[
                                styles.tab,
                                { backgroundColor: store.bgColor },
                                isActive && styles.activeTab,
                            ]}
                            onPress={() => onSelectStore(store.id)}
                            activeOpacity={0.9}
                        >
                            {store.isImage && store.logo ? (
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={store.logo}
                                        style={styles.logo}
                                        resizeMode={store.id === 'amazon' ? 'cover' : 'contain'}
                                    />
                                </View>
                            ) : (
                                <View style={styles.textContainer}>
                                    <Text style={[styles.title, { color: store.textColor }]}>
                                        {store.name.split(' ')[0]}
                                    </Text>
                                    <Text style={[styles.subtitle, { color: store.textColor }]}>
                                        {store.name.split(' ')[1] || ''}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 20,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 15,
        alignItems: 'center',
    },
    tab: {
        width: 110,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    activeTab: {
        transform: [{ scale: 1.08 }],
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    logoContainer: {
        width: '100%',
        height: '100%',
        padding: 10,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
});
