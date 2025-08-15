import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ProfilesScreen({ navigation }: any) {
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Profile</Text>
			<Pressable style={styles.primary} onPress={() => navigation.navigate('SkinTypeQuiz')}><Text style={styles.btnText}>Take/Retake Skin Type Quiz</Text></Pressable>
			<Pressable style={styles.secondary} onPress={() => navigation.navigate('AllergyQuiz')}><Text style={styles.btnText}>Allergy Quiz</Text></Pressable>
			<View style={{ marginTop: 16 }}>
				<Text>Streak overview:</Text>
				<Text>Tanning Streak: 0</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
	primary: { backgroundColor: '#ff7f32', padding: 12, borderRadius: 8, marginBottom: 8 },
	secondary: { backgroundColor: '#333', padding: 12, borderRadius: 8 },
	btnText: { color: '#fff', fontWeight: '700' }
});