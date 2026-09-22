import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { theme } from '../../theme/tokens';
import { Button } from '../../components/Button';
import { useCartStore } from '../../store/cartStore';

const CartScreen = ({ navigation }: any) => {
    const { items, updateQuantity, removeItem, totalAmount } = useCartStore();

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <FastImage
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toLocaleString()}</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.qtyBtn}
                    >
                        <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.qtyBtn}
                    >
                        <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                        style={styles.removeBtn}
                    >
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty.</Text>
                <Button
                    title="Start Shopping"
                    onPress={() => navigation.navigate('Home')}
                    style={{ marginTop: 20 }}
                />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 20 }}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>${totalAmount().toLocaleString()}</Text>
                </View>
                <Button
                    title="Proceed to Checkout"
                    onPress={() => navigation.navigate('Checkout')}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    details: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: {
        fontWeight: 'bold',
    },
    qtyText: {
        marginHorizontal: 12,
        fontWeight: '600',
    },
    removeBtn: {
        marginLeft: 'auto',
    },
    removeText: {
        color: theme.colors.error,
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: theme.colors.textSecondary,
    },
    footer: {
        padding: 20,
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '900',
        color: theme.colors.text,
    },
});

export default CartScreen;
