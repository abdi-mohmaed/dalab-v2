import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { theme } from '../theme/tokens';
import { AnimatedSlotIcon } from './AnimatedSlotIcon';

interface Tab {
    id: string;
    label: string;
    description: string;
    logo?: any; // local require
    bgColor: string;
    isAnimated?: boolean;
    topWords?: [string, string];
    bottomWord?: string;
}

const TABS: Tab[] = [
    {
        id: 'dalab',
        label: 'Dalab',
        description: 'Dalab Marketplace',
        logo: require('../assets/app_images/dalab-logo.png'),
        bgColor: '#FFC644'
    },
    {
        id: 'supermarket',
        label: 'Supermarket',
        description: 'Dalab Supermarket',
        bgColor: '#FFC644',
        isAnimated: true,
        topWords: ['super', 'Dalab'],
        bottomWord: 'market'
    },
    {
        id: 'global',
        label: 'Shop Global',
        description: 'Global Marketplace',
        bgColor: '#FFC644',
        isAnimated: true,
        topWords: ['shop', 'Dalab'],
        bottomWord: 'global'
    },
    {
        id: 'services',
        label: 'Services',
        description: 'Dalab Services',
        bgColor: '#FFC644',
        isAnimated: true,
        topWords: ['Dalab', 'home'],
        bottomWord: 'services'
    },
    {
        id: 'shein',
        label: 'SHEIN',
        description: 'Women Clothing',
        logo: require('../assets/app_images/shein.png'),
        bgColor: '#000000'
    },
    {
        id: 'amazon',
        label: 'amazon',
        description: 'US Products',
        logo: require('../assets/app_images/amazon.png'),
        bgColor: '#000000'
    },
    {
        id: 'temu',
        label: 'TEMU',
        description: 'Global Deals',
        logo: require('../assets/app_images/temu.png'),
        bgColor: '#FF5722'
    }
];

export const MarketplaceTabs = () => {
    const [activeTab, setActiveTab] = useState('dalab');

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const isBrandStack = tab.id === 'shein' || tab.id === 'amazon' || tab.id === 'temu';

                let backgroundColor = isActive ? tab.bgColor : '#EEEEEE';
                if (tab.id === 'shein' || tab.id === 'amazon') {
                    backgroundColor = '#000000';
                }

                return (
                    <TouchableOpacity
                        key={tab.id}
                        activeOpacity={0.8}
                        onPress={() => setActiveTab(tab.id)}
                        style={[
                            styles.tabContainer,
                            {
                                backgroundColor,
                                transform: [{ scale: isActive ? 1.05 : 1 }],
                                elevation: isActive ? 4 : 0,
                                shadowOpacity: isActive ? 0.15 : 0,
                            }
                        ]}
                    >
                        {tab.isAnimated ? (
                            <AnimatedSlotIcon
                                topWords={tab.topWords!}
                                bottomWord={tab.bottomWord!}
                            />
                        ) : (
                            <Image
                                source={tab.logo}
                                style={[
                                    styles.logo,
                                    isBrandStack && styles.logoFill
                                ]}
                                resizeMode={isBrandStack ? "cover" : "contain"}
                            />
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
    },
    tabContainer: {
        width: 80,
        height: 54,
        borderRadius: 15, // Reduced radius per user request earlier to fix discoloration
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: 'hidden',
    },
    logo: {
        width: '70%',
        height: '70%',
    },
    logoFill: {
        width: '100%',
        height: '100%',
    }
});
