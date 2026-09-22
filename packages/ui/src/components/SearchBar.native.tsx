import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme/tokens';

interface SearchBarProps {
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = "Search products, brands and categories"
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#999"
                style={styles.input}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    input: {
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 20,
        fontSize: 14,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
});
