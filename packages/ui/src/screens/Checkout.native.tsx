import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { theme } from '../theme/tokens';
import { Button } from '../components/Button.native';
import { useNavigation } from '@react-navigation/native';

export const CheckoutScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [step, setStep] = useState(1);

    const steps = ['Address', 'Shipping', 'Payment', 'Review'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Checkout</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.stepIndicator}>
                {steps.map((s, i) => (
                    <View key={i} style={styles.stepItem}>
                        <View style={[
                            styles.stepCircle,
                            { backgroundColor: i + 1 <= step ? theme.colors.primary : '#E5E7EB' }
                        ]}>
                            <Text style={[styles.stepNumber, { color: i + 1 <= step ? '#FFF' : '#6B7280' }]}>{i + 1}</Text>
                        </View>
                        <Text style={[styles.stepLabel, { fontWeight: i + 1 === step ? '700' : '400' }]}>{s}</Text>
                    </View>
                ))}
            </View>

            <ScrollView style={styles.content}>
                {step === 1 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shipping Address</Text>
                        <TouchableOpacity style={styles.addressCard}>
                            <Text style={styles.addressName}>Mark J. Spencer</Text>
                            <Text style={styles.addressText}>123 Main St, Apt 4B, New York, NY 10001</Text>
                            <Text style={styles.addressPhone}>+1 (212) 555-1234</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.addAddress}>
                            <Text style={styles.addAddressText}>+ Add New Address</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Shipping Method</Text>
                        <TouchableOpacity style={styles.methodCardActive}>
                            <View>
                                <Text style={styles.methodName}>Standard Shipping</Text>
                                <Text style={styles.methodTime}>Estimated 3-5 business days</Text>
                            </View>
                            <Text style={styles.methodPrice}>FREE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.methodCard}>
                            <View>
                                <Text style={styles.methodName}>Express Shipping</Text>
                                <Text style={styles.methodTime}>Estimated 1-2 business days</Text>
                            </View>
                            <Text style={styles.methodPrice}>$12.99</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Total Amount</Text>
                    <Text style={styles.priceValue}>$299.99</Text>
                </View>
                <Button
                    title={step === 4 ? "PLACE ORDER" : "NEXT STEP"}
                    onPress={() => step < 4 ? setStep(step + 1) : Alert.alert('Success', 'Order Placed!')}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    backIcon: {
        fontSize: 24,
        color: theme.colors.text,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    stepItem: {
        alignItems: 'center',
        width: 80,
    },
    stepCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    stepNumber: {
        fontSize: 12,
        fontWeight: '700',
    },
    stepLabel: {
        fontSize: 10,
        color: theme.colors.text,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 16,
    },
    addressCard: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        backgroundColor: '#FAFAFA',
    },
    addressName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    addressPhone: {
        fontSize: 14,
        color: theme.colors.text,
        marginTop: 8,
    },
    addAddress: {
        marginTop: 16,
        alignItems: 'center',
    },
    addAddressText: {
        color: theme.colors.primary,
        fontWeight: '700',
    },
    methodCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    methodCardActive: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        backgroundColor: '#FAFAFA',
        marginBottom: 12,
    },
    methodName: {
        fontSize: 14,
        fontWeight: '700',
    },
    methodTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    methodPrice: {
        fontWeight: '800',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    priceLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    priceValue: {
        fontSize: 20,
        fontWeight: '800',
    },
});
