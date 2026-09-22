import { StyleSheet } from 'react-native';
import { theme } from '../theme/tokens';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    headerWrapper: {
        backgroundColor: theme.colors.white,
    },
    imageCarousel: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F9FAFB',
    },
    carouselImage: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        marginTop: theme.spacing.md,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.border,
    },
    activeDot: {
        backgroundColor: theme.colors.primary,
    },
    detailsContainer: {
        padding: theme.spacing.lg,
    },
    storeName: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        textTransform: 'uppercase',
        marginBottom: theme.spacing.sm,
        fontWeight: '700',
    },
    title: {
        ...theme.typography.body,
        fontSize: 18,
        lineHeight: 24,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.success,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: theme.borderRadius.xs,
        gap: 2,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.white,
    },
    starSmall: {
        fontSize: 10,
        color: theme.colors.white,
    },
    verifiedText: {
        fontFamily: theme.typography.caption.fontFamily,
        fontSize: theme.typography.caption.fontSize,
        fontWeight: theme.typography.caption.fontWeight,
        color: theme.colors.textSecondary,
    },
    price: {
        fontFamily: theme.typography.h2.fontFamily,
        fontSize: theme.typography.h2.fontSize,
        fontWeight: theme.typography.h2.fontWeight,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.lg,
    },
    sectionTitle: {
        fontFamily: theme.typography.h3.fontFamily,
        fontSize: 14,
        fontWeight: theme.typography.h3.fontWeight,
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
    },
    footerPriceWrapper: {
        flexDirection: 'column',
    },
    footerLabel: {
        fontFamily: theme.typography.caption.fontFamily,
        fontSize: theme.typography.caption.fontSize,
        fontWeight: theme.typography.caption.fontWeight,
        color: theme.colors.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        paddingBottom: 34, // Safe area fallback
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    footerPrice: {
        fontFamily: theme.typography.h2.fontFamily,
        fontSize: 20,
        fontWeight: theme.typography.h2.fontWeight,
    },
    buyButton: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        minWidth: 160,
        alignItems: 'center',
    },
    buyButtonText: {
        ...theme.typography.body,
        fontWeight: '700',
        color: '#000',
    }
});
