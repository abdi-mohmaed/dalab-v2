import React from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { styles } from '../styles/Cart.styles';
import { theme } from '../theme/tokens';

interface CartItemProps {
    item: any;
    onUpdateQty: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQty, onRemove }) => {
    const renderRightActions = (progress: any, dragX: any) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.deleteAction}>
                <Animated.Text style={[styles.deleteActionText, { transform: [{ translateX: trans }] }]}>
                    Delete
                </Animated.Text>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={[styles.card, { flexDirection: 'row' }]}>
                <Image source={{ uri: item.image }} style={{ width: 70, height: 70, borderRadius: theme.borderRadius.sm, backgroundColor: '#F3F4F6', marginRight: theme.spacing.md }} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                        {/* Fallback delete button for accessibility or if swipe isn't obvious */}
                        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}>
                            <Text style={{ color: '#EF4444', fontSize: 16 }}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.itemPrice}>${item.price}</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityBtn}
                                onPress={() => onUpdateQty(item.id, -1)}
                            >
                                <Text>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{item.quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityBtn}
                                onPress={() => onUpdateQty(item.id, 1)}
                            >
                                <Text>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Swipeable>
    );
};
