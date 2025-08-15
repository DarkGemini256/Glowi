import { getCache, setCache } from './offlineCache';

export type WeatherData = { uvIndex: number; temperature: number; condition?: string; fetchedAt: number };

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
	const cacheKey = `weather-${lat.toFixed(2)}-${lon.toFixed(2)}`;
	const cached = await getCache<WeatherData>(cacheKey);
	if (cached) return cached;
	const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index,temperature_2m`);
	const data = await res.json();
	const uv = data?.current?.uv_index ?? 0;
	const temp = data?.current?.temperature_2m ?? 0;
	const record = { uvIndex: uv, temperature: temp, fetchedAt: Date.now() };
	await setCache(cacheKey, record, 3600);
	return record;
}

export function computeSafeExposureMinutes(skinType: 'I'|'II'|'III'|'IV'|'V'|'VI', uvIndex: number): number {
	if (uvIndex <= 0) return 60;
	const typeFactorMap = { I: 10, II: 15, III: 20, IV: 25, V: 35, VI: 40 };
	const base = typeFactorMap[skinType];
	const uvFactor = Math.max(1, uvIndex);
	return Math.round((base * 5) / (uvFactor / 5));
}