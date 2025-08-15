import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setCache<T>(key: string, value: T, ttlSeconds: number) {
	const record = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
	await AsyncStorage.setItem(key, JSON.stringify(record));
}

export async function getCache<T>(key: string): Promise<T | null> {
	const raw = await AsyncStorage.getItem(key);
	if (!raw) return null;
	try {
		const { value, expiresAt } = JSON.parse(raw);
		if (Date.now() > expiresAt) { await AsyncStorage.removeItem(key); return null; }
		return value as T;
	} catch {
		return null;
	}
}