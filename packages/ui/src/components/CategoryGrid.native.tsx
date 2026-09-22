import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { theme } from '../theme/tokens';
import { useNavigation } from '@react-navigation/native';

interface Category {
    id: string;
    name: string;
    image?: string;
}

interface CategoryGridProps {
    categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.grid}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.item}
                            onPress={() => navigation.navigate('Category', { categoryId: category.id, categoryName: category.name })}
                        >
                            <View style={styles.imageWrapper}>
                                {category.image ? (
                                    <Image
                                        source={{ uri: category.image }}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View style={styles.placeholder} />
                                )}
                            </View>
                            <Text style={styles.name} numberOfLines={1}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.md,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 220, // Approx height for 2 rows
        width: '100%',
        alignContent: 'flex-start',
        gap: theme.spacing.md,
    },
    item: {
        width: 160,
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    imageWrapper: {
        width: 160,
        height: 160,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        // Matching the web gradient-like feel with a shadow
        shadowColor: '#F7CD07',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F7F8FA',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    placeholder: {
        width: '80%',
        height: '80%',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
    },
    name: {
        fontSize: 14,
        fontWeight: '800',
        color: '#000000',
        textAlign: 'center',
        textTransform: 'lowercase',
    },
});
