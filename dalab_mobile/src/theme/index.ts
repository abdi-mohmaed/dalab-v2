export const theme = {
    colors: {
        primary: '#111827',
        secondary: '#4B5563',
        accent: '#3B82F6',
        background: '#F3F4F6',
        surface: '#FFFFFF',
        text: '#111827',
        placeholder: '#9CA3AF',
        error: '#EF4444',
        success: '#10B981',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold' as const,
        },
        h2: {
            fontSize: 24,
            fontWeight: '600' as const,
        },
        body: {
            fontSize: 16,
        },
        caption: {
            fontSize: 12,
            color: '#6B7280',
        },
    },
};
