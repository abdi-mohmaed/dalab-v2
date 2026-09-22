import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../theme/tokens';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onClear,
    placeholder = "Search for products...",
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Text style={styles.icon}>🔍</Text>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textSecondary}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={onClear}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.colors.white,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    icon: {
        fontSize: 18,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
    },
    clearIcon: {
        fontSize: 18,
        color: theme.colors.textSecondary,
        marginLeft: 8,
    },
});
