import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '@components/CustomButton';
import InputField from '@components/InputField';
import AlertToast from '@components/AlertToast';
import LoadingSpinner from '@components/LoadingSpinner';
import { isStrongPassword, isValidEmail } from '@utils/validators';
import { loginEmailPassword, signupEmailPassword } from '@services/azureAuthService';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useStore } from '@store/index';

export default function LoginScreen({ navigation }: any) {
	const { baseUrl, setToken } = useStore();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState<{ msg: string; type: 'success'|'error'|'info'; visible: boolean }>({ msg: '', type: 'info', visible: false });
	async function handleLogin() {
		if (!isValidEmail(email)) { return setToast({ msg: 'Invalid email', type: 'error', visible: true }); }
		if (!isStrongPassword(password)) { return setToast({ msg: 'Password must be at least 8 characters', type: 'error', visible: true }); }
		setLoading(true);
		try {
			const res = await loginEmailPassword(baseUrl, email, password);
			setToken(res.token);
			await SecureStore.setItemAsync('token', res.token);
			setToast({ msg: 'Welcome back!', type: 'success', visible: true });
			navigation.replace('Root');
		} catch (e: any) {
			setToast({ msg: e?.response?.data?.error || 'Login failed. Internet required.', type: 'error', visible: true });
		} finally { setLoading(false); }
	}
	async function handleSignup() {
		if (!isValidEmail(email)) { return setToast({ msg: 'Invalid email', type: 'error', visible: true }); }
		if (!isStrongPassword(password)) { return setToast({ msg: 'Password must be at least 8 characters', type: 'error', visible: true }); }
		setLoading(true);
		try {
			const res = await signupEmailPassword(baseUrl, email, password);
			setToken(res.token);
			await SecureStore.setItemAsync('token', res.token);
			setToast({ msg: 'Account created!', type: 'success', visible: true });
			navigation.replace('SkinTypeQuiz');
		} catch (e: any) {
			setToast({ msg: e?.response?.data?.error || 'Signup failed. Internet required.', type: 'error', visible: true });
		} finally { setLoading(false); }
	}
	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.logo}>☀️</Text>
			<Text style={styles.title}>Welcome to Glowi</Text>
			<InputField label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" />
			<InputField label="Password" value={password} onChangeText={setPassword} placeholder="Enter password" secure />
			<CustomButton label="Login" onPress={handleLogin} variant="primary" />
			<CustomButton label="Sign Up" onPress={handleSignup} variant="secondary" style={{ marginTop: 8 }} />
			<Text style={styles.terms} onPress={() => navigation.navigate('Terms')}>By signing up, you agree to our Terms</Text>
			{loading ? <LoadingSpinner /> : null}
			<AlertToast message={toast.msg} type={toast.type} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flexGrow: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
	logo: { fontSize: 64, marginBottom: 12 },
	title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
	terms: { marginTop: 12, color: '#007BFF' }
});