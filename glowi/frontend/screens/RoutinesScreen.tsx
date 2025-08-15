import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import RoutineVariationSelector from '@components/RoutineVariationSelector';
import RoutineCard from '@components/RoutineCard';
import { useStore } from '@store/index';
import { useSeasonDetector } from '@hooks/useSeasonDetector';
import { useRoutineGenerator } from '@hooks/useRoutineGenerator';
import { useStreakTracker } from '@hooks/useStreakTracker';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Speech from 'expo-speech';
import CustomButton from '@components/CustomButton';

export default function RoutinesScreen() {
	const { baseUrl, token } = useStore();
	const { currentSeason } = useSeasonDetector();
	const { selectedRoutine, variations, regenerate } = useRoutineGenerator(baseUrl, token ?? '', 'III', currentSeason);
	const { incrementStreak } = useStreakTracker(baseUrl, token ?? '');
	const [selected, setSelected] = useState<string | null>(null);
	const [celebrate, setCelebrate] = useState(false);
	const [conflict, setConflict] = useState(false);
	useEffect(() => { if (!selected && variations.tanning?.length) setSelected(variations.tanning[0]); }, [variations]);
	function complete() { incrementStreak('tanning'); setCelebrate(true); setTimeout(() => setCelebrate(false), 2000); }
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Skincare Routines</Text>
			<Text>Hydration Routines</Text>
			<Text>Available: {variations.hydration?.length ?? 0}</Text>
			<RoutineVariationSelector variations={(variations.tanning || []).map((t, i) => ({ id: String(i), title: t, steps: ['Step 1', 'Step 2', 'Step 3'] }))} onSelect={(v) => { setSelected(v.title); Speech.speak(`Selected ${v.title}`); }} />
			<RoutineCard title={selected || 'Select a routine'} steps={['Cleanse','Protect','Hydrate']} hasConflict={conflict} />
			<View style={styles.row}>
				<CustomButton label="Generate Routine" variant="secondary" onPress={() => regenerate('tanning')} />
				<CustomButton label="Log Product" variant="secondary" onPress={() => setConflict(true)} />
				<CustomButton label="Complete All" variant="green" onPress={complete} />
			</View>
			{celebrate ? <ConfettiCannon count={80} origin={{ x: 0, y: 0 }} fadeOut /> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
	row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, gap: 8 }
});