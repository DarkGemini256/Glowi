import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

export const router = Router();

const entrySchema = z.object({
	title: z.string().min(1).max(200),
	content: z.string().min(1),
	mood: z.number().int().min(1).max(10).optional(),
});

router.use(requireAuth);

router.get('/', async (req, res) => {
	const { userId } = (req as any).auth as { userId: string };
	const entries = await prisma.entry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
	res.json(entries);
});

router.post('/', async (req, res) => {
	const parse = entrySchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
	const { userId } = (req as any).auth as { userId: string };
	const created = await prisma.entry.create({ data: { ...parse.data, userId } });
	res.status(201).json(created);
});

router.get('/:id', async (req, res) => {
	const { userId } = (req as any).auth as { userId: string };
	const { id } = req.params;
	const entry = await prisma.entry.findFirst({ where: { id, userId } });
	if (!entry) return res.status(404).json({ error: 'Not found' });
	res.json(entry);
});

router.put('/:id', async (req, res) => {
	const parse = entrySchema.partial().safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
	const { userId } = (req as any).auth as { userId: string };
	const { id } = req.params;
	const existing = await prisma.entry.findFirst({ where: { id, userId } });
	if (!existing) return res.status(404).json({ error: 'Not found' });
	const updated = await prisma.entry.update({ where: { id }, data: parse.data });
	res.json(updated);
});

router.delete('/:id', async (req, res) => {
	const { userId } = (req as any).auth as { userId: string };
	const { id } = req.params;
	const existing = await prisma.entry.findFirst({ where: { id, userId } });
	if (!existing) return res.status(404).json({ error: 'Not found' });
	await prisma.entry.delete({ where: { id } });
	res.json({ success: true });
});