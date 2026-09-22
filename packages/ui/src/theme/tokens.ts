import { TextStyle } from 'react-native';

export const theme = {
    colors: {
        primary: '#1a237e', // Navy blue
        secondary: '#9c27b0', // Purple
        accent: '#FFC644', // Yellow
        background: '#FDFBF7',
        white: '#FFFFFF',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        error: '#EF4444',
        success: '#10B981',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        full: 9999,
    },
    typography: {
        h1: {
            fontFamily: 'Inter-Black',
            fontSize: 32,
            fontWeight: '900' as TextStyle['fontWeight'],
            letterSpacing: -1,
        },
        h2: {
            fontFamily: 'Inter-Bold',
            fontSize: 24,
            fontWeight: '800' as TextStyle['fontWeight'],
        },
        h3: {
            fontFamily: 'Inter-Bold',
            fontSize: 20,
            fontWeight: '700' as TextStyle['fontWeight'],
        },
        body: {
            fontFamily: 'Inter-Regular',
            fontSize: 16,
            fontWeight: '400' as TextStyle['fontWeight'],
        },
        caption: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
            fontWeight: '500' as TextStyle['fontWeight'],
        },
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 8,
        },
    }
};
