import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import RoutineVariationSelector from '@components/RoutineVariationSelector';
import { useStore } from '@store/index';
import { useSeasonDetector } from '@hooks/useSeasonDetector';
import { useRoutineGenerator } from '@hooks/useRoutineGenerator';
import { useStreakTracker } from '@hooks/useStreakTracker';

export default function RoutinesScreen() {
	const { baseUrl, token } = useStore();
	const { currentSeason } = useSeasonDetector();
	const { selectedRoutine, variations, regenerate } = useRoutineGenerator(baseUrl, token ?? '', 'III', currentSeason);
	const { incrementStreak } = useStreakTracker(baseUrl, token ?? '');
	const [selected, setSelected] = useState<string | null>(null);
	useEffect(() => { if (!selected && variations.tanning?.length) setSelected(variations.tanning[0]); }, [variations]);
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Skincare Routines</Text>
			<Text>Hydration Routines</Text>
			<Text>Available: {variations.hydration?.length ?? 0}</Text>
			<RoutineVariationSelector variations={(variations.tanning || []).map((t, i) => ({ id: String(i), title: t, steps: ['Step 1', 'Step 2', 'Step 3'] }))} onSelect={(v) => setSelected(v.title)} />
			<View style={styles.row}>
				<Pressable style={styles.secondary} onPress={() => regenerate('tanning')}><Text style={styles.btnText}>Regenerate for Season</Text></Pressable>
				<Pressable style={styles.primary} onPress={() => incrementStreak('tanning')}><Text style={styles.btnText}>Complete All</Text></Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
	row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
	primary: { backgroundColor: '#ff7f32', padding: 12, borderRadius: 8 },
	secondary: { backgroundColor: '#333', padding: 12, borderRadius: 8 },
	btnText: { color: '#fff', fontWeight: '700' }
});