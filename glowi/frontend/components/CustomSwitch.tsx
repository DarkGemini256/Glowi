import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function CustomSwitch({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
	return (
		<View style={styles.row}>
			<Text>{label}</Text>
			<Switch value={value} onValueChange={onChange} />
		</View>
	);
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 } });