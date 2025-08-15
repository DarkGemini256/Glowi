import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { requireAuth, signToken } from '../middleware/auth';

export const router = Router();

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(100);

router.post('/signup', async (req, res) => {
	const parse = z
		.object({ email: emailSchema, password: passwordSchema, name: z.string().min(1).max(100).optional() })
		.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
	}
	const { email, password, name } = parse.data;
	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return res.status(409).json({ error: 'Email already in use' });
	}
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await prisma.user.create({ data: { email, passwordHash, name } });
	const token = signToken({ userId: user.id, tokenVersion: user.tokenVersion });
	return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.post('/login', async (req, res) => {
	const parse = z.object({ email: emailSchema, password: z.string() }).safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: 'Invalid request' });
	}
	const { email, password } = parse.data;
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}
	const token = signToken({ userId: user.id, tokenVersion: user.tokenVersion });
	return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.get('/me', requireAuth, async (req, res) => {
	const { userId } = (req as any).auth as { userId: string };
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) return res.status(404).json({ error: 'Not found' });
	return res.json({ id: user.id, email: user.email, name: user.name });
});

router.post('/logout', requireAuth, async (req, res) => {
	const { userId } = (req as any).auth as { userId: string };
	await prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } });
	return res.json({ success: true });
});