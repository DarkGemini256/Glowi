import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useStore } from '@store/index';

export default function SettingsScreen() {
	const { notificationsEnabled, setNotificationsEnabled } = useStore();
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Settings</Text>
			<View style={styles.row}>
				<Text>Routine Reminders</Text>
				<Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
			</View>
			<Text style={{ marginTop: 16 }}>Streak Goals</Text>
			<Text>Quiz History</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});