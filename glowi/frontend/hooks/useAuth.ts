import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useStore } from '@store/index';

export function useAuth() {
	const { baseUrl, token, setToken } = useStore();
	useEffect(() => { (async () => {
		const saved = await SecureStore.getItemAsync('token');
		if (saved) { setToken(saved); return; }
		try {
			const res = await axios.post(`${baseUrl}/api/dev/login`);
			setToken(res.data.token);
			await SecureStore.setItemAsync('token', res.data.token);
		} catch {}
	})(); }, [baseUrl]);
	return { token };
}