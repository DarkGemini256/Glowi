import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function RoutineCard({ title, steps, hasConflict = false, onCompleteStep }: { title: string; steps: string[]; hasConflict?: boolean; onCompleteStep?: (i: number) => void }) {
	const [expanded, setExpanded] = useState(false);
	const [checked, setChecked] = useState<boolean[]>(steps.map(() => false));
	return (
		<View style={styles.card}>
			<Pressable onPress={() => setExpanded(!expanded)} accessibilityLabel={`${title}, ${expanded ? 'Collapse' : 'Expand'}`}>
				<Text style={styles.title}>{title}</Text>
			</Pressable>
			{hasConflict ? <View style={styles.banner}><Text style={styles.bannerText}>Conflict detected: Retinol + High UV</Text></View> : null}
			{expanded ? (
				<View>
					{steps.map((s, i) => (
						<Pressable key={i} onPress={() => { const c = [...checked]; c[i] = !c[i]; setChecked(c); onCompleteStep?.(i); }} style={styles.stepRow}>
							<Text style={[styles.checkbox, checked[i] && styles.checkboxChecked]}>{checked[i] ? '✓' : ''}</Text>
							<Text style={styles.stepText}>{s}</Text>
						</Pressable>
					))}
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, elevation: 2 },
	title: { fontSize: 16, fontWeight: '700' },
	banner: { backgroundColor: '#FF0000', padding: 8, borderRadius: 8, marginTop: 8 },
	bannerText: { color: '#fff', fontWeight: '700' },
	stepRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
	checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#ccc', borderRadius: 4, marginRight: 8, textAlign: 'center' },
	checkboxChecked: { backgroundColor: '#FF8C00', borderColor: '#FF8C00', color: '#fff' },
	stepText: { flex: 1 }
});