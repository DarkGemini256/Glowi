import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import HydrationReminderModal from '@components/HydrationReminderModal';
import StreakProgressBar from '@components/StreakProgressBar';
import { useStore } from '@store/index';
import { useSeasonDetector } from '@hooks/useSeasonDetector';
import { useStreakTracker } from '@hooks/useStreakTracker';

export default function DashboardScreen({ navigation }: any) {
	const { baseUrl, token } = useStore();
	const { currentSeason } = useSeasonDetector();
	const { streaks, incrementStreak } = useStreakTracker(baseUrl, token ?? '');
	const [hydrationVisible, setHydrationVisible] = useState(false);
	useEffect(() => { const t = setInterval(() => setHydrationVisible(true), 1000 * 60 * 120); return () => clearInterval(t); }, []);
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Glowi Dashboard</Text>
			<View style={styles.row}>
				<Text>Hydration Streak: {streaks.hydration} days</Text>
				<StreakProgressBar current={streaks.hydration} goal={7} />
			</View>
			<Pressable onPress={() => navigation.navigate('Routines')} style={styles.card}>
				<Text style={styles.title}>Recommended Routine</Text>
				<Text>Season: {currentSeason}</Text>
				<Text>Choose from 12 tanning routines</Text>
			</Pressable>
			<HydrationReminderModal visible={hydrationVisible} onSnooze={() => setHydrationVisible(false)} onDismiss={() => setHydrationVisible(false)} onLogWater={() => { incrementStreak('hydration'); setHydrationVisible(false); }} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
	card: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
	title: { fontSize: 16, fontWeight: '700' }
});