import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import CustomButton from '@components/CustomButton';
import StreakProgressBar from '@components/StreakProgressBar';
import AlertToast from '@components/AlertToast';

const MOCK = [
	{ id: '1', date: '2025-08-10', hours: 1.5, uv: 6, notes: 'Nice day', photo: null },
	{ id: '2', date: '2025-08-11', hours: 0.7, uv: 4, notes: 'Cloudy', photo: null },
];

function JournalEntry({ item }: { item: any }) {
	return (
		<View style={styles.entry}>
			<Text style={styles.entryTitle}>{item.date} • {item.hours}h • UV {item.uv}</Text>
			<Text style={styles.entryNotes}>{item.notes}</Text>
		</View>
	);
}

export default function ExposureHistoryScreen() {
	const [toast, setToast] = useState({ visible: false, msg: '', type: 'info' as 'success'|'error'|'info' });
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Pressable><Text>🔎 Filter</Text></Pressable>
				<CustomButton label="Add Exposure" variant="primary" onPress={() => setToast({ visible: true, msg: 'Add form not implemented', type: 'info' })} />
			</View>
			<FlatList data={MOCK} keyExtractor={i => i.id} renderItem={({ item }) => <JournalEntry item={item} />} />
			<View style={styles.row}>
				<Text>Streaks</Text>
				<StreakProgressBar current={3} goal={7} />
			</View>
			<CustomButton label="Log Hydration" variant="green" onPress={() => setToast({ visible: true, msg: '+1 Hydration streak', type: 'success' })} />
			<AlertToast message={toast.msg} type={toast.type} visible={toast.visible} onHide={() => setToast({ ...toast, visible: false })} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
	entry: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, elevation: 2 },
	entryTitle: { fontWeight: '700' },
	entryNotes: { fontStyle: 'italic' },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }
});