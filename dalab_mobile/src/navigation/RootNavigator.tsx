import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@dalab/shared';
import {
    HomeScreen,
    ProductDetailScreen,
    CartScreen,
    LoginScreen,
    SignupScreen,
    ProfileScreen,
    OrdersScreen,
    WishlistScreen,
    HubScreen,
    SearchResultsScreen,
    CheckoutScreen,
    NotificationsScreen,
    CategoryScreen,
    ForgotResetScreen,
    SplashScreen,
    theme
} from '@dalab/ui';
import HomeIcon from 'react-native-vector-icons/MaterialIcons';
import CategoryIcon from 'react-native-vector-icons/MaterialIcons';
import ShoppingCartIcon from 'react-native-vector-icons/MaterialIcons';
import PersonIcon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#FFC644', // Dalab Yellow
                tabBarInactiveTintColor: '#9e9e9e',
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName = '';
                    if (route.name === 'HomeTab') iconName = 'home';
                    else if (route.name === 'Explore') iconName = 'category';
                    else if (route.name === 'Cart') iconName = 'shopping-cart';
                    else if (route.name === 'Account') iconName = 'person';

                    return <HomeIcon name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Explore" component={CategoryScreen} options={{ tabBarLabel: 'Category' }} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Account" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export const RootNavigator = () => {
    const { user, isInitialized } = useAuth();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    if (!isInitialized || showSplash) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="ForgotReset" component={ForgotResetScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                    <Stack.Screen name="Orders" component={OrdersScreen} />
                    <Stack.Screen name="Wishlist" component={WishlistScreen} />
                    <Stack.Screen name="Hub" component={HubScreen} />
                    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
                    <Stack.Screen name="Checkout" component={CheckoutScreen} />
                    <Stack.Screen name="Notifications" component={NotificationsScreen} />
                    <Stack.Screen name="Category" component={CategoryScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

