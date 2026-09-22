import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { theme } from '../theme/tokens';

interface ButtonProps {
    title: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    type = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const getButtonStyle = () => {
        const baseStyle: ViewStyle = {
            ...styles.button,
            ...styles[size],
        };

        if (disabled || loading) {
            baseStyle.opacity = 0.6;
        }

        switch (type) {
            case 'primary':
                return { ...baseStyle, backgroundColor: theme.colors.primary };
            case 'secondary':
                return { ...baseStyle, backgroundColor: theme.colors.secondary };
            case 'outline':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                };
            case 'danger':
                return { ...baseStyle, backgroundColor: theme.colors.error };
            default:
                return baseStyle;
        }
    };

    const getTextColor = () => {
        if (type === 'outline') return theme.colors.primary;
        return theme.colors.white;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    sm: { paddingVertical: 8, paddingHorizontal: 16 },
    md: { paddingVertical: 12, paddingHorizontal: 24 },
    lg: { paddingVertical: 16, paddingHorizontal: 32 },
    text: {
        fontWeight: '700',
        fontSize: 16,
    },
});
