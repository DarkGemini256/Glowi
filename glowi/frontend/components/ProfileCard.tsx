import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

export default function ProfileCard({ name, skinType, allergens = [], streak = 0, onEdit, onDelete }: { name: string; skinType?: string; allergens?: { name: string; severity: 'mild'|'moderate'|'severe' }[]; streak?: number; onEdit?: () => void; onDelete?: () => void }) {
	return (
		<View style={styles.card} accessibilityLabel={`Profile ${name}, Type ${skinType || 'Unknown'}`}>
			<View style={styles.row}>
				<Image source={{ uri: 'https://placehold.co/40x40' }} style={styles.avatar} />
				<View style={{ flex: 1 }}>
					<Text style={styles.name}>{name}</Text>
					<Text style={styles.meta}>Skin Type: {skinType || '—'} • Streak: {streak} days</Text>
					<View style={styles.chips}>
						{allergens.slice(0, 3).map((a, i) => (
							<Text key={i} style={[styles.chip, a.severity === 'severe' ? styles.red : a.severity === 'moderate' ? styles.yellow : styles.gray]}>{a.name}</Text>
						))}
					</View>
				</View>
				<View style={styles.iconCol}>
					<Pressable accessibilityLabel="Edit profile" onPress={onEdit}><Text>✏️</Text></Pressable>
					<Pressable accessibilityLabel="Delete profile" onPress={onDelete}><Text>🗑️</Text></Pressable>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 2 },
	row: { flexDirection: 'row', alignItems: 'center' },
	avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
	name: { fontSize: 16, fontWeight: '700' },
	meta: { fontSize: 12, color: '#444' },
	chips: { flexDirection: 'row', marginTop: 4, gap: 4 },
	chip: { fontSize: 12, color: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginRight: 4 },
	red: { backgroundColor: '#FF0000' },
	yellow: { backgroundColor: '#FFA500' },
	gray: { backgroundColor: '#999' },
	iconCol: { justifyContent: 'space-between', height: 40, marginLeft: 8 }
});