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
import { Category } from '../types/database';

interface CategoryGridProps {
    categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
    const navigation = useNavigation<any>();
    const midPoint = Math.ceil(categories.length / 2);
    const topRow = categories.slice(0, midPoint);
    const bottomRow = categories.slice(midPoint);

    const renderItem = (category: Category) => (
        <TouchableOpacity
            key={category.id}
            style={styles.item}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CategoryProducts', { categoryId: category.id, categoryName: category.name })}
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
    );

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.gridContainer}>
                    <View style={styles.row}>
                        {topRow.map(renderItem)}
                    </View>
                    <View style={styles.row}>
                        {bottomRow.map(renderItem)}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    gridContainer: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    item: {
        width: 100,
        alignItems: 'center',
        marginRight: 16,
    },
    imageWrapper: {
        width: 100,
        height: 100,
        backgroundColor: '#FFC644', // Brand yellow matching Dalab
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 2,
    },
    image: {
        width: '75%',
        height: '75%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4FB',
    },
    name: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginTop: 8,
        textTransform: 'lowercase',
    },
});
