import { useEffect, useState } from 'react';
import axios from 'axios';

export type Goal = { id: string; name: string; progress: number; achieved: boolean; reward?: string };

export function useStreakTracker(baseUrl: string, token: string) {
	const [streaks, setStreaks] = useState({ tanning: 0, irritationFree: 0, hydration: 0 });
	const [goals, setGoals] = useState<Goal[]>([
		{ id: 'g1', name: '7-Day Tanning Streak', progress: 0, achieved: false, reward: 'Bronze Badge' },
		{ id: 'g2', name: '14-Day Routine Completion', progress: 0, achieved: false, reward: 'Silver Badge' },
		{ id: 'g3', name: '30-Day Irritation-Free', progress: 0, achieved: false, reward: 'Gold Badge' },
	]);

	async function sync() {
		await axios.post(`${baseUrl}/api/streaks/sync`, { streaks }, { headers: { Authorization: `Bearer ${token}` } });
	}

	function incrementStreak(type: keyof typeof streaks) {
		setStreaks(prev => ({ ...prev, [type]: prev[type] + 1 }));
	}
	function resetStreak(type: keyof typeof streaks) {
		setStreaks(prev => ({ ...prev, [type]: 0 }));
	}
	function awardBadge() {
		setGoals(prev => prev.map(g => {
			if (g.name.includes('7-Day') && streaks.tanning >= 7) return { ...g, achieved: true, progress: 1 };
			if (g.name.includes('14-Day') && streaks.tanning + streaks.hydration >= 14) return { ...g, achieved: true, progress: 1 };
			if (g.name.includes('30-Day') && streaks.irritationFree >= 30) return { ...g, achieved: true, progress: 1 };
			return g;
		}));
	}

	useEffect(() => { sync(); }, [streaks]);

	return { streaks, goals, incrementStreak, resetStreak, awardBadge };
}