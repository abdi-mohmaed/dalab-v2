import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme/tokens';

interface Attribute {
    id: string;
    name: string;
    type: string;
    values: string[];
}

interface VariantSelectorProps {
    attributes?: Attribute[];
    selectedValues?: Record<string, string>;
    onSelect?: (attrName: string, value: string) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
    attributes = [
        { id: '1', name: 'Color', type: 'COLOR', values: ['Red', 'Blue', 'Black'] },
        { id: '2', name: 'Size', type: 'TEXT', values: ['S', 'M', 'L', 'XL'] }
    ],
    selectedValues = { Color: 'Black', Size: 'L' },
    onSelect = () => { },
}) => {
    return (
        <View style={styles.container}>
            {attributes.map((attr) => (
                <View key={attr.id} style={styles.section}>
                    <Text style={styles.label}>{attr.name}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                        {attr.values.map((val) => {
                            const isSelected = selectedValues[attr.name] === val;
                            const isColor = attr.type === 'COLOR';

                            if (isColor) {
                                return (
                                    <TouchableOpacity
                                        key={val}
                                        style={[
                                            styles.colorDot,
                                            { backgroundColor: val.toLowerCase() },
                                            isSelected && styles.activeColorDot,
                                        ]}
                                        onPress={() => onSelect(attr.name, val)}
                                    />
                                );
                            }

                            return (
                                <TouchableOpacity
                                    key={val}
                                    style={[styles.chip, isSelected && styles.activeChip]}
                                    onPress={() => onSelect(attr.name, val)}
                                >
                                    <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                                        {val}
                                    </Text>
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
        gap: 20,
    },
    section: {
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text,
    },
    row: {
        gap: 12,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        minWidth: 48,
        alignItems: 'center',
    },
    activeChip: {
        borderColor: '#000',
        backgroundColor: '#FFF',
        borderWidth: 2,
    },
    chipText: {
        fontSize: 14,
        color: '#6B7280',
    },
    activeChipText: {
        fontWeight: '700',
        color: '#000',
    },
    colorDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeColorDot: {
        borderWidth: 2,
        borderColor: '#000',
        transform: [{ scale: 1.1 }],
    },
});
