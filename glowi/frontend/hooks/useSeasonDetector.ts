export type Season = 'summer'|'winter'|'spring'|'fall';

export function useSeasonDetector() {
	function monthToSeason(date = new Date()): Season {
		const m = date.getMonth();
		if (m >= 5 && m <= 7) return 'summer';
		if (m === 11 || m <= 1) return 'winter';
		if (m >= 2 && m <= 4) return 'spring';
		return 'fall';
	}
	const currentSeason = monthToSeason();
	async function fetchUVSeason(lat: number, lon: number): Promise<Season> {
		try {
			const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`);
			const data = await res.json();
			const uv = data?.current?.uv_index ?? 0;
			if (uv >= 6) return 'summer';
			if (uv <= 2) return 'winter';
			return currentSeason;
		} catch {
			return currentSeason;
		}
	}
	function adjustRoutines(routines: string[], season: Season = currentSeason) { return routines; }
	return { currentSeason, adjustRoutines, fetchUVSeason };
}