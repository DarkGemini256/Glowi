import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

type Props = {
	label: string;
	value: string;
	onChangeText: (t: string) => void;
	placeholder?: string;
	secure?: boolean;
	keyboardType?: 'default'|'email-address';
	error?: string;
};

export default function InputField({ label, value, onChangeText, placeholder, secure, keyboardType = 'default', error }: Props) {
	const [hidden, setHidden] = useState(!!secure);
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<View style={[styles.inputRow, error ? styles.errorBorder : undefined]}>
				<TextInput accessibilityLabel={`${label} input`} style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} secureTextEntry={hidden} keyboardType={keyboardType} />
				{secure ? <Pressable accessibilityRole="button" accessibilityLabel={hidden ? 'Show password' : 'Hide password'} onPress={() => setHidden(!hidden)}><Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text></Pressable> : null}
			</View>
			{error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { marginBottom: 12 },
	label: { fontWeight: '700', marginBottom: 6 },
	inputRow: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' },
	input: { flex: 1, paddingVertical: 12 },
	toggle: { color: '#007BFF', paddingHorizontal: 8, fontWeight: '700' },
	error: { color: '#FF0000', marginTop: 4 },
	errorBorder: { borderColor: '#FF0000' }
});