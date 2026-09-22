import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { theme } from '../../theme/tokens';
import { supabase } from '../../services/supabase';
import { useAuthStore } from '../../store/authStore';

const OrdersScreen = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('Order')
                .select('*')
                .eq('userId', user?.id)
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.orderCard}>
            <View style={styles.header}>
                <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.amount}>${item.totalAmount.toLocaleString()}</Text>
            </View>
        </View>
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'delivered':
                return theme.colors.success;
            case 'pending':
                return '#B45309';
            case 'cancelled':
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
                        </View>
                    }
                />
            )}
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
    },
    orderCard: {
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
    },
    status: {
        fontSize: 12,
        fontWeight: '800',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    date: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    amount: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
});

export default OrdersScreen;
