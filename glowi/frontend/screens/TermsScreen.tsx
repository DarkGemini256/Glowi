import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function TermsScreen() {
	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 12 }}>Terms of Use</Text>
			<Text>By using Glowi, you agree to follow safe sun practices, consult a dermatologist for concerns, and use provided routines at your own discretion. Do not rely solely on the app for medical guidance.</Text>
			<Text style={{ marginTop: 12 }}>We provide the service "as is" without warranties. We may modify or discontinue features. Your continued use constitutes acceptance of updates.</Text>
		</ScrollView>
	);
}