import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ViewStyle,
    KeyboardTypeOptions,
} from 'react-native';
import { theme } from '../theme';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    error?: string;
    keyboardType?: KeyboardTypeOptions;
    style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    error,
    keyboardType,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
        width: '100%',
    },
    label: {
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.secondary,
        marginBottom: theme.spacing.xs,
        fontWeight: '500',
    },
    input: {
        height: 56,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.text,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        fontSize: 12,
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
    },
});
