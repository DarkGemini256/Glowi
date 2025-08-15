import axios from 'axios';
import { useStore } from '@store/index';

export async function loginEmailPassword(baseUrl: string, email: string, password: string) {
	const res = await axios.post(`${baseUrl}/api/auth/login`, { email, password });
	return res.data as { token: string; user: { id: string; email: string; name?: string | null } };
}

export async function signupEmailPassword(baseUrl: string, email: string, password: string, name?: string) {
	const res = await axios.post(`${baseUrl}/api/auth/signup`, { email, password, name });
	return res.data as { token: string; user: { id: string; email: string; name?: string | null } };
}