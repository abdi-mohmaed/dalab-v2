import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/tokens';

interface VariantSelectorProps {
    attributes: {
        id: string;
        name: string;
        type: string;
        values: string[];
    }[];
    selectedVariants: Record<string, string>;
    onSelect: (attributeId: string, value: string) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
    attributes,
    selectedVariants,
    onSelect,
}) => {
    return (
        <View style={styles.container}>
            {attributes.map((attr) => (
                <View key={attr.id} style={styles.attributeSection}>
                    <Text style={styles.attributeTitle}>{attr.name}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.valuesContainer}>
                        {attr.values.map((val) => {
                            const isActive = selectedVariants[attr.id] === val;
                            return (
                                <TouchableOpacity
                                    key={val}
                                    onPress={() => onSelect(attr.id, val)}
                                    style={[
                                        styles.valueButton,
                                        isActive && styles.valueButtonActive,
                                        attr.type === 'COLOR' && { backgroundColor: val.toLowerCase() }
                                    ]}
                                >
                                    {attr.type !== 'COLOR' && (
                                        <Text style={[styles.valueText, isActive && styles.valueTextActive]}>
                                            {val}
                                        </Text>
                                    )}
                                    {attr.type === 'COLOR' && isActive && (
                                        <View style={styles.colorActiveIndicator} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    attributeSection: {
        marginBottom: 20,
    },
    attributeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
    },
    valuesContainer: {
        flexDirection: 'row',
    },
    valueButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: 10,
        minWidth: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueButtonActive: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.primary + '10', // 10% opacity
    },
    valueText: {
        fontSize: 14,
        color: theme.colors.text,
    },
    valueTextActive: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    colorActiveIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    },
});
