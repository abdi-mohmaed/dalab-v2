import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { theme } from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    loading,
    disabled,
    style,
    textStyle,
    variant = 'primary',
}) => {
    const isOutline = variant === 'outline';
    const isSecondary = variant === 'secondary';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                isOutline && styles.outlineButton,
                isSecondary && styles.secondaryButton,
                disabled && styles.disabledButton,
                style,
            ]}
            activeOpacity={0.7}>
            {loading ? (
                <ActivityIndicator color={isOutline ? theme.colors.primary : '#fff'} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isOutline && styles.outlineText,
                        textStyle,
                    ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    secondaryButton: {
        backgroundColor: theme.colors.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    disabledButton: {
        opacity: 0.5,
    },
    text: {
        color: '#fff',
        fontSize: theme.typography.body.fontSize,
        fontWeight: '600',
    },
    outlineText: {
        color: theme.colors.primary,
    },
});
