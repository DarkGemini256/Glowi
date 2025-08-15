import React, { useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

export default function AlertToast({ message, type = 'success', visible, onHide }: { message: string; type?: 'success'|'error'|'info'; visible: boolean; onHide: () => void }) {
	const [opacity] = React.useState(new Animated.Value(0));
	useEffect(() => {
		if (visible) {
			Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
			const t = setTimeout(() => { Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(onHide); }, 3000);
			return () => clearTimeout(t);
		}
	}, [visible]);
	if (!visible) return null;
	return (
		<Animated.View style={[styles.toast, styles[type], { opacity }]}>
			<Text style={styles.text}>{message}</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	toast: { position: 'absolute', bottom: 32, left: 16, right: 16, padding: 12, borderRadius: 8, elevation: 2 },
	success: { backgroundColor: '#00AA00' },
	error: { backgroundColor: '#FF0000' },
	info: { backgroundColor: '#007BFF' },
	text: { color: '#fff', fontWeight: '700', textAlign: 'center' }
});