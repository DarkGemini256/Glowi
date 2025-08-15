import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import QuizStepper from '@components/QuizStepper';
import { useSkinTypeQuiz } from '@hooks/useSkinTypeQuiz';
import { useStore } from '@store/index';
import { useSeasonDetector } from '@hooks/useSeasonDetector';

export default function SkinTypeQuizScreen() {
	const { baseUrl, token } = useStore();
	const { currentSeason } = useSeasonDetector();
	const { questions, answerQuestion, calculateType, submit } = useSkinTypeQuiz(baseUrl);
	const [idx, setIdx] = useState(0);
	const q = questions[idx];
	return (
		<QuizStepper current={idx + 1} total={questions.length} onBack={() => setIdx(Math.max(0, idx - 1))} onNext={async () => {
			if (idx === questions.length - 1) {
				await submit(token ?? '', currentSeason);
			} else setIdx(idx + 1);
		}} nextDisabled={false}>
			<View>
				<Text style={styles.heading}>{q.text}</Text>
				{q.options.map((o, i) => (
					<Pressable key={i} onPress={() => answerQuestion(q.id, o.value)} style={styles.option}><Text>{o.label}</Text></Pressable>
				))}
				<Text style={{ marginTop: 12 }}>Calculated Type: {calculateType()}</Text>
			</View>
		</QuizStepper>
	);
}

const styles = StyleSheet.create({
	heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	option: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 }
});