export function calculateAllergySensitivity(allergens: string[], severity: 'mild'|'moderate'|'severe'): number {
	const severityMap = { mild: 1, moderate: 2, severe: 3 } as const;
	return allergens.length * severityMap[severity];
}