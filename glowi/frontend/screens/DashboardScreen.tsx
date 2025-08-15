import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import HydrationReminderModal from '@components/HydrationReminderModal';
import StreakProgressBar from '@components/StreakProgressBar';
import { useStore } from '@store/index';
import { useSeasonDetector } from '@hooks/useSeasonDetector';
import { useStreakTracker } from '@hooks/useStreakTracker';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { fetchWeather, computeSafeExposureMinutes } from '@utils/apiService';
import AlertToast from '@components/AlertToast';

export default function DashboardScreen({ navigation }: any) {
	const { baseUrl, token } = useStore();
	const { currentSeason, fetchUVSeason } = useSeasonDetector();
	const { streaks, incrementStreak } = useStreakTracker(baseUrl, token ?? '');
	const [hydrationVisible, setHydrationVisible] = useState(false);
	const [season, setSeason] = useState(currentSeason);
	const [uv, setUv] = useState(0);
	const [temp, setTemp] = useState(0);
	const [toast, setToast] = useState({ visible: false, msg: '', type: 'info' as 'success'|'error'|'info' });
	useEffect(() => { const t = setInterval(() => setHydrationVisible(true), 1000 * 60 * 120); return () => clearInterval(t); }, []);
	useEffect(() => { (async () => {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status === 'granted') {
			const loc = await Location.getCurrentPositionAsync({});
			const s = await fetchUVSeason(loc.coords.latitude, loc.coords.longitude);
			setSeason(s);
			const w = await fetchWeather(loc.coords.latitude, loc.coords.longitude);
			setUv(w.uvIndex); setTemp(w.temperature);
			Speech.speak(`Season ${s}, UV ${w.uvIndex}`);
		} else { setToast({ visible: true, msg: 'Location permission denied', type: 'error' }); }
	})(); }, []);
	useEffect(() => { if (streaks.hydration && streaks.hydration % 7 === 0) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }, [streaks.hydration]);
	const safe = computeSafeExposureMinutes('III', uv);
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.logo}>☀️ Glowi</Text>
				<Pressable onPress={() => navigation.navigate('Settings')}><Text>⚙️</Text></Pressable>
			</View>
			<View style={styles.panel}>
				<Text style={[styles.uv, uv < 3 ? styles.green : uv <= 7 ? styles.orange : styles.red]}>UV {uv}</Text>
				<Text>Temp {temp}°C</Text>
				<Text>Safe Exposure: {safe} min</Text>
			</View>
			<Pressable onPress={() => navigation.navigate('Routines')} style={styles.card}>
				<Text style={styles.title}>Recommended Routine</Text>
				<Text>Season: {season}</Text>
				<Text>Choose from 12 tanning routines</Text>
			</Pressable>
			<View style={styles.grid}>
				<Pressable style={styles.gridItem} onPress={() => navigation.navigate('Exposure')}><Text>Track Exposure</Text></Pressable>
				<Pressable style={styles.gridItem} onPress={() => navigation.navigate('Profiles')}><Text>View Profiles</Text></Pressable>
				<Pressable style={styles.gridItem} onPress={() => navigation.navigate('Routines')}><Text>Generate Routine</Text></Pressable>
				<Pressable style={styles.gridItem} onPress={() => navigation.navigate('Settings')}><Text>Settings</Text></Pressable>
			</View>
			<View style={styles.row}>
				<Text>Hydration Streak: {streaks.hydration} days</Text>
				<StreakProgressBar current={streaks.hydration} goal={7} />
			</View>
			<HydrationReminderModal visible={hydrationVisible} onSnooze={() => setHydrationVisible(false)} onDismiss={() => setHydrationVisible(false)} onLogWater={() => { incrementStreak('hydration'); setHydrationVisible(false); }} />
			<AlertToast message={toast.msg} type={toast.type} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
	logo: { fontSize: 18, fontWeight: '800' },
	panel: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2, gap: 4 },
	uv: { fontSize: 24, fontWeight: '800' },
	green: { color: '#00AA00' },
	orange: { color: '#FF8C00' },
	red: { color: '#FF0000' },
	card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
	title: { fontSize: 16, fontWeight: '700' },
	grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 12 },
	gridItem: { width: '48%', height: 80, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2 },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
});