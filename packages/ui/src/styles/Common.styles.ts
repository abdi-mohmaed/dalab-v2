import { StyleSheet } from 'react-native';
import { theme } from '../theme/tokens';

export const commonStyles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    screenHeader: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontFamily: theme.typography.h3.fontFamily,
        fontSize: theme.typography.h3.fontSize,
        fontWeight: theme.typography.h3.fontWeight,
        color: theme.colors.text,
    },
    gridList: {
        padding: theme.spacing.sm,
    },
    gridColumnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.sm,
    },
    cardWrapper: {
        flex: 0.48,
        marginBottom: theme.spacing.md,
    },
    infoCard: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.xs,
        alignSelf: 'flex-start',
    },
    badgeText: {
        ...theme.typography.caption,
        fontWeight: '700',
        color: theme.colors.white,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xxl,
    },
    emptyStateText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.md,
        textAlign: 'center',
    },
    backButton: {
        padding: theme.spacing.xs,
    },
    backIcon: {
        fontSize: 24,
        color: theme.colors.text,
    },
});
