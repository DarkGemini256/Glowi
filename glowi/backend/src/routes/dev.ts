import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signToken } from '../middleware/auth';

export const router = Router();

router.post('/login', async (_req, res) => {
	if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEV_LOGIN) {
		return res.status(403).json({ error: 'Forbidden' });
	}
	const email = 'dev@glowi.test';
	const name = 'Dev User';
	const password = 'password123';
	let user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		const passwordHash = await bcrypt.hash(password, 10);
		user = await prisma.user.create({ data: { email, name, passwordHash } });
	}
	const token = signToken({ userId: user.id, tokenVersion: user.tokenVersion });
	return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});