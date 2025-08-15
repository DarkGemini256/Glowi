import { useMemo, useState } from 'react';
import axios from 'axios';

export type Question = { id: string; text: string; options: { label: string; value: number }[] };

export function useSkinTypeQuiz(baseUrl: string) {
	const questions: Question[] = useMemo(() => [
		{ id: 'q1', text: 'What color are your eyes?', options: [
			{ label: 'Light blue/gray/green', value: 0 },
			{ label: 'Hazel/light brown', value: 1 },
			{ label: 'Dark brown', value: 2 },
			{ label: 'Black', value: 3 },
		]},
		{ id: 'q2', text: 'What is your natural hair color?', options: [
			{ label: 'Red/blonde', value: 0 },
			{ label: 'Blonde/light brown', value: 1 },
			{ label: 'Dark brown', value: 2 },
			{ label: 'Black', value: 3 },
		]},
		{ id: 'q3', text: 'What is your natural skin color (unexposed areas)?', options: [
			{ label: 'Pale/ivory', value: 0 },
			{ label: 'Fair/beige', value: 1 },
			{ label: 'Light brown/olive', value: 2 },
			{ label: 'Dark brown/black', value: 3 },
		]},
		{ id: 'q4', text: 'How many freckles do you have on unexposed skin?', options: [
			{ label: 'Many', value: 0 },
			{ label: 'Several', value: 1 },
			{ label: 'Few', value: 2 },
			{ label: 'None', value: 3 },
		]},
		{ id: 'q5', text: 'How does your skin respond to the sun?', options: [
			{ label: 'Always burns, never tans', value: 0 },
			{ label: 'Burns easily, tans minimally', value: 1 },
			{ label: 'Burns moderately, tans gradually', value: 2 },
			{ label: 'Rarely burns, tans well', value: 3 },
			{ label: 'Never burns, tans deeply', value: 4 },
		]},
		{ id: 'q6', text: 'Do you tan?', options: [
			{ label: 'Never', value: 0 },
			{ label: 'Sometimes', value: 1 },
			{ label: 'Usually', value: 2 },
			{ label: 'Always', value: 3 },
		]},
		{ id: 'q7', text: 'How sensitive is your face to the sun?', options: [
			{ label: 'Very sensitive', value: 0 },
			{ label: 'Sensitive', value: 1 },
			{ label: 'Normal', value: 2 },
			{ label: 'Resistant', value: 3 },
			{ label: 'Very resistant', value: 4 },
		]},
		{ id: 'q8', text: 'How often do you tan?', options: [
			{ label: 'Never', value: 0 },
			{ label: 'Rarely', value: 1 },
			{ label: 'Sometimes', value: 2 },
			{ label: 'Often', value: 3 },
			{ label: 'Always', value: 4 },
		]},
	], []);

	const [answers, setAnswers] = useState<Record<string, number>>({});

	function answerQuestion(id: string, value: number) {
		setAnswers(prev => ({ ...prev, [id]: value }));
	}

	function calculateType(): string {
		const values = Object.values(answers);
		const score = values.reduce((a, b) => a + b, 0);
		if (score <= 7) return 'I';
		if (score <= 16) return 'II';
		if (score <= 25) return 'III';
		if (score <= 30) return 'IV';
		if (score <= 35) return 'V';
		return 'VI';
	}

	async function submit(token: string, season: 'summer'|'winter'|'spring'|'fall') {
		const ordered = questions.map(q => answers[q.id] ?? 0);
		const res = await axios.post(`${baseUrl}/api/quiz/validate`, { skinTypeAnswers: ordered, season }, { headers: { Authorization: `Bearer ${token}` } });
		return res.data as { skinType?: string; initialRoutine: string[] };
	}

	return { questions, answers, answerQuestion, calculateType, submit };
}