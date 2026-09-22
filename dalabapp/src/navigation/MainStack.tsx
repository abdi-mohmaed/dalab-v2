import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// We'll create these screens in future phases
import HomeScreen from '../screens/main/HomeScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import CategoryProductsScreen from '../screens/main/CategoryProductsScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import { MainTabNavigator } from './MainTabNavigator';

export type MainStackParamList = {
    MainTabs: undefined;
    ProductDetail: { id: string };
    CategoryProducts: { categoryId: string; categoryName: string };
    Checkout: undefined;
    Orders: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
        <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} options={({ route }) => ({ title: route.params.categoryName })} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Order History' }} />
    </Stack.Navigator>
);
