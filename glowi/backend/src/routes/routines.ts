import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';

export const router = Router();

const querySchema = z.object({
	type: z.enum(['tanning','postSun','winter','hydration','allergySafe']).optional(),
	skinType: z.enum(['I','II','III','IV','V','VI']).optional(),
	season: z.enum(['summer','winter','spring','fall']).optional(),
});

function buildVariations({ type, skinType, season }: { type?: string; skinType?: string; season?: string }) {
	const makeList = (base: string, count: number) => Array.from({ length: count }, (_, i) => `${base} Variant ${i + 1}`);
	const pack = {
		tanning: makeList(`Gentle Tanning${skinType ? ` Type ${skinType}` : ''}`, 12),
		postSun: makeList('Post-Sun Recovery', 12),
		winter: makeList(`Winter Hydration${skinType ? ` Type ${skinType}` : ''}`, 11),
		hydration: makeList('Daily Hydration', 15),
		allergySafe: makeList('Allergy-Safe Routine', 12),
	};
	if (type) return { [type]: (pack as any)[type] };
	return pack;
}

router.get('/variations', requireAuth, (req, res) => {
	const parse = querySchema.safeParse(req.query);
	if (!parse.success) return res.status(400).json({ error: 'Invalid query' });
	const { type, skinType, season } = parse.data;
	const data = buildVariations({ type, skinType, season });
	res.json(data);
});