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
	function adjustRoutines(routines: string[], season: Season = currentSeason) {
		return routines;
	}
	return { currentSeason, adjustRoutines };
}