import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ExposureHistoryScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Exposure History</Text>
			<Text>Logs will appear here</Text>
			<Pressable style={styles.primary}><Text style={styles.btnText}>Log Hydration</Text></Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
	primary: { backgroundColor: '#ff7f32', padding: 12, borderRadius: 8, marginTop: 12 },
	btnText: { color: '#fff', fontWeight: '700' }
});