import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
	label: string;
	onPress?: () => void;
	variant?: 'primary'|'secondary'|'green'|'danger';
	disabled?: boolean;
	style?: ViewStyle;
	accessibilityLabel?: string;
};

export default function CustomButton({ label, onPress, variant = 'primary', disabled, style, accessibilityLabel }: Props) {
	return (
		<Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel || label} onPress={disabled ? undefined : onPress} style={[styles.base, styles[variant], disabled && styles.disabled, style]}>
			<Text style={styles.text}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', elevation: 2 },
	primary: { backgroundColor: '#FF8C00' },
	secondary: { backgroundColor: '#007BFF' },
	green: { backgroundColor: '#00AA00' },
	danger: { backgroundColor: '#FF0000' },
	disabled: { opacity: 0.6 },
	text: { color: '#fff', fontWeight: '700' }
});