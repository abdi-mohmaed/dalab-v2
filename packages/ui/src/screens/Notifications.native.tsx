import React from 'react';
import {
    View,
    Text,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useNotifications } from '@dalab/shared';
import { theme } from '../theme/tokens';
import { commonStyles } from '../styles/Common.styles';
import { useNavigation } from '@react-navigation/native';

export const NotificationsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { notifications, isLoading, unreadCount, markAllAsRead, markAsRead } = useNotifications();

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={commonStyles.safeContainer}>
            <View style={commonStyles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButton}>
                    <Text style={commonStyles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Text>
                <TouchableOpacity onPress={() => markAllAsRead()}>
                    <Text style={{ fontSize: 12, color: theme.colors.primary, fontWeight: '600' }}>Mark all</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={commonStyles.emptyStateContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => markAsRead(item.id)}
                            style={[
                                commonStyles.infoCard,
                                { marginBottom: 1, borderRadius: 0 },
                                !item.is_read && { backgroundColor: '#F0F9FF', borderLeftWidth: 4, borderLeftColor: theme.colors.primary }
                            ]}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={{ ...theme.typography.body, fontWeight: '700' }}>{item.title}</Text>
                                <Text style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>{formatTime(item.created_at)}</Text>
                            </View>
                            <Text style={{ color: '#4B5563', lineHeight: 18 }}>{item.message}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    ListEmptyComponent={
                        <View style={commonStyles.emptyStateContainer}>
                            <Text style={commonStyles.emptyStateText}>No notifications yet.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};
