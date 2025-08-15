import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
	current: number;
	total: number;
	onBack: () => void;
	onNext: () => void;
	nextDisabled?: boolean;
	children: React.ReactNode;
};

export default function QuizStepper({ current, total, onBack, onNext, nextDisabled, children }: Props) {
	const progress = Math.max(0, Math.min(1, total ? current / total : 0));
	return (
		<View style={styles.container}>
			<View accessibilityRole="progressbar" accessibilityValue={{ now: Math.round(progress * 100), min: 0, max: 100 }} style={styles.progressBar}>
				<View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
			</View>
			<View style={styles.content}>{children}</View>
			<View style={styles.footer}>
				<Pressable onPress={onBack} accessibilityLabel="Back" style={[styles.button, styles.secondary]}><Text style={styles.buttonText}>Back</Text></Pressable>
				<Pressable onPress={nextDisabled ? undefined : onNext} accessibilityLabel="Next" style={[styles.button, nextDisabled ? styles.disabled : styles.primary]} disabled={nextDisabled}>
					<Text style={styles.buttonText}>Next</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	progressBar: { height: 20, backgroundColor: '#eee', width: '100%' },
	progressFill: { height: '100%', backgroundColor: '#ff7f32' },
	content: { flex: 1, padding: 16 },
	footer: { height: 80, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 },
	button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
	primary: { backgroundColor: '#ff7f32' },
	secondary: { backgroundColor: '#333' },
	disabled: { backgroundColor: '#aaa' },
	buttonText: { color: '#fff', fontWeight: '600' },
});