import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import QuizStepper from '@components/QuizStepper';
import { useAllergyQuiz } from '@hooks/useAllergyQuiz';
import { useStore } from '@store/index';
import { useSeasonDetector } from '@hooks/useSeasonDetector';

export default function AllergyQuizScreen() {
	const { baseUrl, token } = useStore();
	const { currentSeason } = useSeasonDetector();
	const { questions, answerQuestion, submit } = useAllergyQuiz(baseUrl);
	const [idx, setIdx] = useState(0);
	const q = questions[idx];
	function toggleOption(o: any) {
		if (!q.multi) return answerQuestion(q.id, o.value);
		answerQuestion(q.id, Array.isArray(o.value) ? o.value : ((prev: any[]) => {
			const arr = (prev ?? []) as any[];
			return arr.includes(o.value) ? arr.filter(v => v !== o.value) : [...arr, o.value];
		}));
	}
	return (
		<QuizStepper current={idx + 1} total={questions.length} onBack={() => setIdx(Math.max(0, idx - 1))} onNext={async () => {
			if (idx === questions.length - 1) {
				await submit(token ?? '', currentSeason);
			} else setIdx(idx + 1);
		}} nextDisabled={false}>
			<View>
				<Text style={styles.heading}>{q.text}</Text>
				{q.options.map((o, i) => (
					<Pressable key={i} onPress={() => toggleOption(o)} style={styles.option}><Text>{o.label}</Text></Pressable>
				))}
			</View>
		</QuizStepper>
	);
}

const styles = StyleSheet.create({
	heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	option: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 }
});