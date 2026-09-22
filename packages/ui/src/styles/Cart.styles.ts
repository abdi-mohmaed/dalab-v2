import { StyleSheet } from 'react-native';
import { theme } from '../theme/tokens';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontFamily: theme.typography.h2.fontFamily,
        fontSize: 20,
        fontWeight: theme.typography.h2.fontWeight,
    },
    list: {
        padding: theme.spacing.md,
        paddingBottom: 120, // Space for sticky footer
    },
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        ...theme.shadows.sm,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: '#F9FAFB',
    },
    itemDetails: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
    itemName: {
        ...theme.typography.body,
        fontWeight: '700' as const,
        marginBottom: 4,
    },
    itemPrice: {
        fontFamily: theme.typography.h3.fontFamily,
        fontSize: theme.typography.h3.fontSize,
        fontWeight: theme.typography.h3.fontWeight,
        color: theme.colors.primary,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    quantityBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        marginHorizontal: theme.spacing.md,
        fontWeight: '700' as const,
    },
    removeBtn: {
        marginLeft: 'auto',
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.white,
        padding: theme.spacing.lg,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        ...theme.shadows.lg,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    totalLabel: {
        fontFamily: theme.typography.h2.fontFamily,
        fontSize: 18,
        fontWeight: theme.typography.h2.fontWeight,
    },
    totalValue: {
        fontFamily: theme.typography.h2.fontFamily,
        fontSize: 18,
        fontWeight: theme.typography.h2.fontWeight,
        color: theme.colors.primary,
    },
    checkoutBtn: {
        backgroundColor: theme.colors.accent,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    checkoutBtnText: {
        ...theme.typography.body,
        fontWeight: '800',
        color: '#000',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xxl,
    },
    emptyText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.md,
    },
    deleteAction: {
        backgroundColor: theme.colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
        borderTopRightRadius: theme.borderRadius.md,
        borderBottomRightRadius: theme.borderRadius.md,
    },
    deleteActionText: {
        color: theme.colors.white,
        fontWeight: '700',
        fontSize: 14,
    }
});
