import { useEffect, useState } from 'react';
import axios from 'axios';
import { Season } from './useSeasonDetector';

export type RoutineType = 'tanning'|'postSun'|'winter'|'hydration'|'allergySafe';

export function useRoutineGenerator(baseUrl: string, token: string, skinType: 'I'|'II'|'III'|'IV'|'V'|'VI' = 'III', season: Season) {
	const [variations, setVariations] = useState<Record<string, string[]>>({});
	const [selectedRoutine, setSelectedRoutine] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			const res = await axios.get(`${baseUrl}/api/routines/variations`, { params: { skinType, season }, headers: { Authorization: `Bearer ${token}` } });
			setVariations(res.data);
		})();
	}, [baseUrl, token, skinType, season]);

	function regenerate(type: RoutineType) {
		const arr = variations[type] || [];
		if (arr.length > 0) {
			const idx = Math.floor(Math.random() * arr.length);
			setSelectedRoutine(arr[idx]);
		}
	}

	return { selectedRoutine, variations, regenerate };
}