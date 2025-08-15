import { create } from 'zustand';

type StreakState = {
	tanningStreak: number;
	irritationFreeStreak: number;
	hydrationStreak: number;
	incrementStreak: (type: 'tanning'|'irritationFree'|'hydration') => void;
	resetStreak: (type: 'tanning'|'irritationFree'|'hydration') => void;
};

export const useStreakSlice = create<StreakState>((set) => ({
	tanningStreak: 0,
	irritationFreeStreak: 0,
	hydrationStreak: 0,
	incrementStreak: (type) => set((s) => ({ ...s, [`${type}Streak`]: (s as any)[`${type}Streak`] + 1 }) as any),
	resetStreak: (type) => set((s) => ({ ...s, [`${type}Streak`]: 0 }) as any),
}));