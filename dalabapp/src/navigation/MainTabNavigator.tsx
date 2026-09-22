import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme/tokens';
import HomeScreen from '../screens/main/HomeScreen';
import CategoryScreen from '../screens/main/CategoryScreen';
import WishlistScreen from '../screens/main/WishlistScreen';
import CartScreen from '../screens/main/CartScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused, color }: any) => {
    let iconName = 'home';
    switch (label) {
        case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
        case 'Search': iconName = focused ? 'magnify' : 'magnify'; break;
        case 'Wishlist': iconName = focused ? 'heart' : 'heart-outline'; break;
        case 'Cart': iconName = focused ? 'cart' : 'cart-outline'; break;
        case 'Profile': iconName = focused ? 'account' : 'account-outline'; break;
    }
    return <Icon name={iconName} size={24} color={color} />;
};

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: any }) => ({
                tabBarIcon: (props: any) => <TabIcon {...props} label={route.name} />,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    paddingBottom: 8,
                    height: 64,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                },
                headerTitleStyle: {
                    fontWeight: '800',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dalab' }} />
            <Tab.Screen name="Search" component={CategoryScreen} options={{ title: 'Explore' }} />
            <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'My Favorites' }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Shopping Cart' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Account' }} />
        </Tab.Navigator>
    );
};
