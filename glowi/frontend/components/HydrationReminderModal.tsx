import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

type Props = { visible: boolean; onSnooze: () => void; onDismiss: () => void; onLogWater: () => void };

export default function HydrationReminderModal({ visible, onSnooze, onDismiss, onLogWater }: Props) {
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
	useEffect(() => {
		if (visible) {
			const t = setTimeout(onDismiss, 10000);
			setTimer(t);
			return () => clearTimeout(t);
		}
	}, [visible]);
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
			<View style={styles.backdrop}>
				<View style={styles.card}>
					<Text style={styles.title}>Time to hydrate! Drink water now</Text>
					<View style={styles.row}>
						<Pressable onPress={onSnooze} style={styles.button}><Text style={styles.buttonText}>Snooze 30min</Text></Pressable>
						<Pressable onPress={onLogWater} style={[styles.button, styles.primary]}><Text style={styles.buttonText}>Log Water Intake</Text></Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
	card: { width: '85%', backgroundColor: '#fff', padding: 16, borderRadius: 12 },
	title: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
	row: { flexDirection: 'row', justifyContent: 'space-between' },
	button: { padding: 12, backgroundColor: '#333', borderRadius: 8 },
	primary: { backgroundColor: '#ff7f32' },
	buttonText: { color: '#fff', fontWeight: '700' }
});