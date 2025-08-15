import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function LoadingSpinner({ size = 50 }: { size?: number }) {
	return (
		<View style={styles.container}>
			<ActivityIndicator size={size} color="#FF8C00" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, alignItems: 'center', justifyContent: 'center' }
});