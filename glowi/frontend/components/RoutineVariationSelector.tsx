import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

export type RoutineVariation = { id: string; title: string; steps: string[]; skinType?: string; allergens?: string[]; season?: string };

type Props = {
	variations: RoutineVariation[];
	onSelect: (v: RoutineVariation) => void;
	skinType?: string;
	allergens?: string[];
};

export default function RoutineVariationSelector({ variations, onSelect, skinType, allergens }: Props) {
	const filtered = variations.filter(v => (!skinType || v.skinType === skinType) && (!allergens || !v.allergens || v.allergens.every(a => !allergens.includes(a))));
	return (
		<View>
			<FlatList horizontal pagingEnabled data={filtered} keyExtractor={(i) => i.id} contentContainerStyle={{ paddingHorizontal: 16 }} renderItem={({ item }) => (
				<Pressable onPress={() => onSelect(item)} style={styles.card} accessibilityLabel={`Select ${item.title}`}>
					<Text style={styles.title}>{item.title}</Text>
					{item.steps.slice(0, 3).map((s, idx) => (
						<Text key={idx} style={styles.step}>• {s}</Text>
					))}
				</Pressable>
			)} />
		</View>
	);
}

const styles = StyleSheet.create({
	card: { width: 280, marginRight: 12, padding: 16, borderRadius: 12, backgroundColor: '#fff', elevation: 2 },
	title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
	step: { fontSize: 14, color: '#444' },
});