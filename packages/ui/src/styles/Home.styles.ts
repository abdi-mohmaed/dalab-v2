import { StyleSheet } from 'react-native';
import { theme } from '../theme/tokens';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    gradientHeader: {
        paddingTop: 60,
        paddingBottom: theme.spacing.lg,
        backgroundColor: theme.colors.accent,
    },
    contentArea: {
        backgroundColor: theme.colors.white,
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        marginTop: -theme.spacing.md,
        flex: 1,
        paddingTop: theme.spacing.sm,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
        ...theme.typography.h2,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        color: theme.colors.text,
        textTransform: 'uppercase',
    },
    horizontalScroll: {
        paddingLeft: theme.spacing.lg,
        paddingRight: theme.spacing.sm,
    },
    productRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    }
});
