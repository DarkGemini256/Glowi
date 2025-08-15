import { useMemo, useState } from 'react';
import axios from 'axios';

export type AllergyQuestion = { id: string; text: string; options: { label: string; value: any }[]; multi?: boolean };

export function useAllergyQuiz(baseUrl: string) {
	const questions: AllergyQuestion[] = useMemo(() => [
		{ id: 'aq1', text: 'Which allergens affect your skin?', multi: true, options: [
			{ label: 'Pollen', value: 'pollen' }, { label: 'Dust', value: 'dust' }, { label: 'Fragrances', value: 'fragrances' }, { label: 'Acids', value: 'acids' }, { label: 'Retinol', value: 'retinol' }, { label: 'Wool', value: 'wool' }, { label: 'Nickel', value: 'nickel' }, { label: 'Latex', value: 'latex' }, { label: 'None', value: 'none' }
		]},
		{ id: 'aq2', text: 'How often do flare-ups occur?', options: [
			{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'Rarely', value: 'rarely' }
		]},
		{ id: 'aq3', text: 'What is the severity of reactions?', options: [
			{ label: 'Mild redness', value: 'mild' }, { label: 'Moderate itching', value: 'moderate' }, { label: 'Severe swelling', value: 'severe' }
		]},
		{ id: 'aq4', text: 'Do you have known sensitivities?', multi: true, options: [
			{ label: 'Eczema', value: 'Eczema' }, { label: 'Rosacea', value: 'Rosacea' }, { label: 'Contact Dermatitis', value: 'Contact Dermatitis' }, { label: 'No', value: 'No' }
		]},
		{ id: 'aq5', text: 'How does your skin react to new products?', options: [
			{ label: 'No reaction', value: 'none' }, { label: 'Mild irritation', value: 'mild' }, { label: 'Breakouts', value: 'breakouts' }, { label: 'Severe rash', value: 'severe' }
		]},
		{ id: 'aq6', text: 'Environmental triggers?', multi: true, options: [
			{ label: 'Cold weather', value: 'cold' }, { label: 'Hot weather', value: 'hot' }, { label: 'Humidity', value: 'humidity' }, { label: 'Pollution', value: 'pollution' }, { label: 'Sun exposure', value: 'sun' }
		]},
	], []);

	const [answers, setAnswers] = useState<Record<string, any>>({});

	function answerQuestion(id: string, value: any) { setAnswers(prev => ({ ...prev, [id]: value })); }

	async function submit(token: string, season: 'summer'|'winter'|'spring'|'fall') {
		const payload = {
			allergyAnswers: {
				allergens: answers['aq1'] ?? [],
				flareFrequency: answers['aq2'] ?? 'rarely',
				severity: answers['aq3'] ?? 'mild',
				sensitivities: answers['aq4']?.filter((v: string) => v !== 'No') ?? [],
				reactionToNew: answers['aq5'] ?? 'none',
				envTriggers: answers['aq6'] ?? [],
			}
		};
		const res = await axios.post(`${baseUrl}/api/quiz/validate`, payload, { headers: { Authorization: `Bearer ${token}` } });
		return res.data as { initialRoutine: string[] };
	}

	return { questions, answers, answerQuestion, submit };
}