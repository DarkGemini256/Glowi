import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProfileCard from '@components/ProfileCard';
import CustomButton from '@components/CustomButton';

const MOCK = [{ id: '1', name: 'You', skinType: 'III', allergens: [{ name: 'Pollen', severity: 'moderate' as const }], streak: 3 }];

export default function ProfilesScreen({ navigation }: any) {
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Profiles</Text>
			<FlatList data={MOCK} keyExtractor={i => i.id} renderItem={({ item }) => (
				<ProfileCard name={item.name} skinType={item.skinType} allergens={item.allergens} streak={item.streak} onEdit={() => {}} onDelete={() => {}} />
			)} />
			<CustomButton label="Take Skin Type Quiz" onPress={() => navigation.navigate('SkinTypeQuiz')} variant="primary" />
			<CustomButton label="Allergy Quiz" onPress={() => navigation.navigate('AllergyQuiz')} variant="secondary" style={{ marginTop: 8 }} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	heading: { fontSize: 24, fontWeight: '800', marginBottom: 12 }
});