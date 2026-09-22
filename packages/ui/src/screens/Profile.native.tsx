import React from 'react';
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { useAuth } from '@dalab/shared';
import { theme } from '../theme/tokens';
import { commonStyles } from '../styles/Common.styles';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                }
            },
        ]);
    };

    const menuItems = [
        { title: 'My Orders', icon: '📦', screen: 'Orders' },
        { title: 'Wishlist', icon: '❤️', screen: 'Wishlist' },
        { title: 'Notifications', icon: '🔔', screen: 'Notifications' },
        { title: 'Shipping Addresses', icon: '📍', screen: 'Address' },
        { title: 'Payment Methods', icon: '💳', screen: 'Payment' },
        { title: 'Settings', icon: '⚙️', screen: 'Settings' },
    ];

    return (
        <SafeAreaView style={commonStyles.safeContainer}>
            <View style={commonStyles.screenHeader}>
                <Text style={commonStyles.headerTitle}>My Account</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={{ color: theme.colors.error, fontWeight: '700' }}>Logout</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: theme.spacing.md }}>
                <View style={[commonStyles.infoCard, { alignItems: 'center', paddingVertical: 32 }]}>
                    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 40 }}>👤</Text>
                    </View>
                    <Text style={theme.typography.h2}>{user?.user_metadata?.full_name || 'User'}</Text>
                    <Text style={{ color: theme.colors.textSecondary }}>{user?.email}</Text>
                </View>

                <Text style={[theme.typography.h3, { marginBottom: 16, marginTop: 16 }]}>Account Overview</Text>

                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[commonStyles.infoCard, { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }]}
                        onPress={() => item.screen && navigation.navigate(item.screen)}
                    >
                        <Text style={{ fontSize: 24, marginRight: 16 }}>{item.icon}</Text>
                        <Text style={{ ...theme.typography.body, fontWeight: '600', flex: 1 }}>{item.title}</Text>
                        <Text style={{ color: theme.colors.border, fontSize: 18 }}>›</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
