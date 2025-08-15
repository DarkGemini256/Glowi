import React from 'react';
import { View, Text } from 'react-native';

export default function PricingScreen() {
	return (
		<View style={{ padding: 16 }}>
			<Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 12 }}>Pricing</Text>
			<Text>Free: Basic routines, hydration reminders, quizzes.</Text>
			<Text>Premium (planned): Allergy-safe advanced routines, custom schedules, community insights.</Text>
		</View>
	);
}