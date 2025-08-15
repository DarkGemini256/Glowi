import { create } from 'zustand';

type QuizState = {
	skinTypeAnswers: number[];
	allergyAnswers: Record<string, any>;
	setSkinTypeAnswers: (a: number[]) => void;
	setAllergyAnswers: (a: Record<string, any>) => void;
};

export const useQuizSlice = create<QuizState>((set) => ({
	skinTypeAnswers: [],
	allergyAnswers: {},
	setSkinTypeAnswers: (a) => set({ skinTypeAnswers: a }),
	setAllergyAnswers: (a) => set({ allergyAnswers: a }),
}));