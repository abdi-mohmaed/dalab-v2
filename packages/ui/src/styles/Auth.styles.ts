import { StyleSheet } from 'react-native';
import { theme } from '../theme/tokens';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000000',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 24,
        backgroundColor: theme.colors.secondary, // Purple from web
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    linkText: {
        color: theme.colors.secondary,
        fontSize: 14,
        fontWeight: '700',
    },
});
