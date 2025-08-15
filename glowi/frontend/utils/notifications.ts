import * as Notifications from 'expo-notifications';

export async function requestPermissions() {
	const { status } = await Notifications.getPermissionsAsync();
	if (status !== 'granted') {
		await Notifications.requestPermissionsAsync();
	}
}

export async function scheduleHydrationReminders() {
	await requestPermissions();
	await Notifications.cancelScheduledNotificationAsync('hydration-repeating' as any).catch(() => {});
	await Notifications.scheduleNotificationAsync({
		identifier: 'hydration-repeating' as any,
		content: { title: 'Hydrate Now', body: 'Drink water to maintain your streak' },
		trigger: { repeats: true, seconds: 2 * 60 * 60 },
	});
}

export async function cancelHydrationReminders() {
	await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyRoutineReminder(hour = 8, minute = 0) {
	await requestPermissions();
	await Notifications.scheduleNotificationAsync({
		content: { title: 'Routine Reminder', body: 'Start your recommended routine now' },
		trigger: { hour, minute, repeats: true },
	});
}