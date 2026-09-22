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
            fontFamily: 'System', // Fallback since Inter is missing
            fontSize: 32,
            fontWeight: '900',
            letterSpacing: -1,
        },
        h2: {
            fontFamily: 'System',
            fontSize: 24,
            fontWeight: '800',
        },
        h3: {
            fontFamily: 'System',
            fontSize: 20,
            fontWeight: '700',
        },
        body: {
            fontFamily: 'System',
            fontSize: 16,
            fontWeight: '400',
        },
        caption: {
            fontFamily: 'System',
            fontSize: 12,
            fontWeight: '500',
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
