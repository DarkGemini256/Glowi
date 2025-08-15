import { create } from 'zustand';

export type RootState = {
	token: string | null;
	baseUrl: string;
	notificationsEnabled: boolean;
	setToken: (t: string | null) => void;
	setBaseUrl: (u: string) => void;
	setNotificationsEnabled: (v: boolean) => void;
};

export const useStore = create<RootState>((set) => ({
	token: null,
	baseUrl: 'http://localhost:4000',
	notificationsEnabled: true,
	setToken: (t) => set({ token: t }),
	setBaseUrl: (u) => set({ baseUrl: u }),
	setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
}));