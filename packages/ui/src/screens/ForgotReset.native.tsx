import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { createClient } from '@dalab/shared';
import { theme } from '../theme/tokens';
import { Input } from '../components/Input.native';
import { Button } from '../components/Button.native';
import { useNavigation } from '@react-navigation/native';

export const ForgotResetScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'dalab://reset-password',
            });

            if (error) throw error;

            Alert.alert('Success', 'Password reset link sent to your email!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your email and we'll send you a link to reset your password.
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Button
                        title="Send Reset Link"
                        onPress={handleReset}
                        loading={loading}
                        style={styles.button}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    backButton: {
        paddingVertical: 16,
    },
    backIcon: {
        fontSize: 24,
        color: theme.colors.text,
    },
    header: {
        marginTop: 20,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 12,
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 16,
    },
});
