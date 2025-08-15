import React from 'react';
import { View, Text, Switch, StyleSheet, Pressable } from 'react-native';
import { useStore } from '@store/index';
import { cancelHydrationReminders, scheduleDailyRoutineReminder, scheduleHydrationReminders } from '@utils/notifications';

export default function SettingsScreen({ navigation }: any) {
	const { notificationsEnabled, setNotificationsEnabled } = useStore();
	async function toggleNotifications(v: boolean) {
		setNotificationsEnabled(v);
		if (v) { await scheduleHydrationReminders(); await scheduleDailyRoutineReminder(8,0); } else { await cancelHydrationReminders(); }
	}
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Settings</Text>
			<View style={styles.row}>
				<Text>Routine Reminders</Text>
				<Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
			</View>
			<Text style={{ marginTop: 16 }}>Legal & Pricing</Text>
			<Pressable onPress={() => navigation.navigate('Terms')}><Text>Terms of Use</Text></Pressable>
			<Pressable onPress={() => navigation.navigate('Privacy')}><Text>Privacy Policy</Text></Pressable>
			<Pressable onPress={() => navigation.navigate('Pricing')}><Text>Pricing</Text></Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});