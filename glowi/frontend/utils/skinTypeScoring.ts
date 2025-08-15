export function calculateSkinType(answers: number[]): string {
	const score = answers.reduce((a, b) => a + b, 0);
	if (score <= 7) return 'I';
	if (score <= 16) return 'II';
	if (score <= 25) return 'III';
	if (score <= 30) return 'IV';
	if (score <= 35) return 'V';
	return 'VI';
}