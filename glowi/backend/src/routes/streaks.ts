import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

export const router = Router();

const bodySchema = z.object({
	streaks: z.object({ tanning: z.number().int().nonnegative(), irritationFree: z.number().int().nonnegative(), hydration: z.number().int().nonnegative() }),
});

router.post('/sync', requireAuth, async (req, res) => {
	const parse = bodySchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid body' });
	const { userId } = (req as any).auth as { userId: string };
	const { tanning, irritationFree, hydration } = parse.data.streaks;
	await prisma.user.update({
		where: { id: userId },
		data: { tanningStreak: tanning, irritationFreeStreak: irritationFree, hydrationStreak: hydration },
	});
	const communityAverage = Math.floor(40 + Math.random() * 40);
	res.json({ success: true, communityAverage });
});