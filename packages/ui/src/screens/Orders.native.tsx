import React from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useOrders } from '@dalab/shared';
import { commonStyles } from '../styles/Common.styles';
import { theme } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';

export const OrdersScreen: React.FC = () => {
    const navigation = useNavigation();
    const { orders, isLoading } = useOrders();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return theme.colors.success;
            case 'Processing': return theme.colors.primary;
            case 'Shipped': return theme.colors.accent;
            case 'Cancelled': return theme.colors.error;
            default: return theme.colors.textSecondary;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <SafeAreaView style={commonStyles.safeContainer}>
            <View style={commonStyles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButton}>
                    <Text style={commonStyles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>Order History</Text>
                <View style={{ width: 24 }} />
            </View>

            {isLoading ? (
                <View style={commonStyles.emptyStateContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={commonStyles.infoCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                <Text style={{ fontWeight: '800', fontSize: 16 }}>#{item.id.slice(0, 8)}</Text>
                                <View style={[commonStyles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                                    <Text style={commonStyles.badgeText}>{item.status}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: theme.colors.textSecondary }}>
                                    {formatDate(item.created_at)} • {item.items_count} items
                                </Text>
                                <Text style={{ fontWeight: '700', color: theme.colors.primary }}>
                                    ${item.total.toFixed(2)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ padding: theme.spacing.md }}
                    ListEmptyComponent={
                        <View style={commonStyles.emptyStateContainer}>
                            <Text style={commonStyles.emptyStateText}>No orders found.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};
