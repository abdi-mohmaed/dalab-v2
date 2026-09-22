import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { theme } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase';

const ProfileScreen = ({ navigation }: any) => {
    const { user, signOut } = useAuthStore();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        signOut();
    };

    const menuItems = [
        { id: '1', title: 'My Orders', icon: '📦' },
        { id: '2', title: 'Shipping Addresses', icon: '📍' },
        { id: '3', title: 'Payment Methods', icon: '💳' },
        { id: '4', title: 'Settings', icon: '⚙️' },
        { id: '5', title: 'Help & Support', icon: '🎧' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={styles.email}>{user?.email}</Text>
                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menu}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => item.title === 'My Orders' ? navigation.navigate('Orders') : null}
                        >
                            <Text style={styles.menuIcon}>{item.icon}</Text>
                            <Text style={styles.menuTitle}>{item.title}</Text>
                            <Text style={styles.arrow}>›</Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomWidth: 0 }]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.menuIcon}>🚪</Text>
                        <Text style={[styles.menuTitle, { color: theme.colors.error }]}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.white,
    },
    email: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
    },
    editBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    editBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    menu: {
        marginTop: 20,
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 16,
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text,
    },
    arrow: {
        fontSize: 20,
        color: theme.colors.textSecondary,
    },
});

export default ProfileScreen;
