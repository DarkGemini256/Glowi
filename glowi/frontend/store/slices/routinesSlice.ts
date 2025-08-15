import { create } from 'zustand';

type RoutinesState = {
	variations: Record<string, string[]>;
	selected: string | null;
	setVariations: (v: Record<string, string[]>) => void;
	select: (s: string | null) => void;
};

export const useRoutinesSlice = create<RoutinesState>((set) => ({
	variations: {},
	selected: null,
	setVariations: (v) => set({ variations: v }),
	select: (s) => set({ selected: s }),
}));