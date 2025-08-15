import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const ALLERGENS = ['Pollen','Dust','Fragrances','Acids','Retinol','Wool','Nickel','Latex'];

export default function AllergyTriggerPicker({ value = [], onChange }: { value?: string[]; onChange: (v: string[]) => void }) {
	const [selected, setSelected] = useState<string[]>(value);
	function toggle(a: string) {
		const next = selected.includes(a) ? selected.filter(x => x !== a) : [...selected, a];
		setSelected(next); onChange(next);
	}
	return (
		<View style={styles.wrap}>
			{ALLERGENS.map(a => (
				<Pressable key={a} onPress={() => toggle(a)} style={[styles.chip, selected.includes(a) && styles.chipOn]}>
					<Text style={[styles.text, selected.includes(a) && styles.textOn]}>{a}</Text>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	chip: { borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 16 },
	chipOn: { backgroundColor: '#FF8C00', borderColor: '#FF8C00' },
	text: { color: '#333' },
	textOn: { color: '#fff', fontWeight: '700' }
});