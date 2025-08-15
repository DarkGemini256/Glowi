import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function PrivacyScreen() {
	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 12 }}>Privacy Policy</Text>
			<Text>We store minimal data necessary for personalization (e.g., skin type, allergy preferences, streaks). Data is stored locally on your device and, when logged in, on our server.</Text>
			<Text style={{ marginTop: 12 }}>We do not sell your data. You may request deletion by contacting support. We use analytics for improving features without personally identifying information.</Text>
		</ScrollView>
	);
}