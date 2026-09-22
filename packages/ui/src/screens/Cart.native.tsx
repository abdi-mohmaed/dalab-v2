import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { styles } from '../styles/Cart.styles';
import { CartItem } from '../components/CartItem.native';
import { theme } from '../theme/tokens';

export const CartScreen: React.FC = () => {
    const [items, setItems] = useState([
        { id: '1', name: 'Premium Wireless Headphones', price: 299.99, quantity: 1, image: 'https://via.placeholder.com/200' },
        { id: '2', name: 'Smart Watch Series 7', price: 399.00, quantity: 2, image: 'https://via.placeholder.com/201' },
    ]);

    const updateQty = (id: string, delta: number) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart</Text>
                <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{items.length} items</Text>
            </View>

            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <CartItem item={item} onUpdateQty={updateQty} onRemove={removeItem} />
                )}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={{ color: theme.colors.textSecondary }}>Subtotal</Text>
                    <Text style={{ color: theme.colors.text, fontWeight: '600' }}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={{ color: theme.colors.textSecondary }}>Shipping</Text>
                    <Text style={{ color: '#10B981', fontWeight: '600' }}>FREE</Text>
                </View>
                <View style={[styles.summaryRow, { marginTop: 8 }]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutBtn}>
                    <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 16, textAlign: 'center' }}>PROCEED TO CHECKOUT</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
