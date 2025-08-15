import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

export const router = Router();

const skinTypeAnswerSchema = z.array(z.number().int());
const allergyQuizSchema = z.object({
	allergens: z.array(z.string()),
	flareFrequency: z.enum(['daily','weekly','monthly','rarely']),
	severity: z.enum(['mild','moderate','severe']),
	sensitivities: z.array(z.enum(['Eczema','Rosacea','Contact Dermatitis'])).optional(),
	reactionToNew: z.enum(['none','mild','breakouts','severe']),
	envTriggers: z.array(z.enum(['cold','hot','humidity','pollution','sun'])).optional()
});

const requestSchema = z.object({
	skinTypeAnswers: skinTypeAnswerSchema.optional(),
	allergyAnswers: allergyQuizSchema.optional(),
	season: z.enum(['summer','winter','spring','fall']).optional()
});

function calculateSkinTypeScore(answers: number[]): { score: number; type: string } {
	const score = answers.reduce((a, b) => a + b, 0);
	let type = 'I';
	if (score <= 7) type = 'I';
	else if (score <= 16) type = 'II';
	else if (score <= 25) type = 'III';
	else if (score <= 30) type = 'IV';
	else if (score <= 35) type = 'V';
	else type = 'VI';
	return { score, type };
}

function generateInitialRoutine(params: { skinType?: string; season?: 'summer'|'winter'|'spring'|'fall'; allergy?: z.infer<typeof allergyQuizSchema> | null }) {
	const { skinType = 'III', season = 'summer', allergy } = params;
	const routines: string[] = [];
	if (season === 'summer') {
		if (skinType === 'I' || skinType === 'II') {
			routines.push('Tanning: 5-10min exposure with SPF 50, hat, shade breaks');
			routines.push('Post-Sun: Cool shower, aloe gel, SPF reapply');
		} else if (skinType === 'III' || skinType === 'IV') {
			routines.push('Tanning: 15-25min with SPF 30, hydrate every 10min');
			routines.push('Post-Sun: Soothing lotion, avoid acids 24h');
		} else {
			routines.push('Tanning: 30-40min with SPF 15, avoid peak UV');
			routines.push('Post-Sun: Light moisturizer, water + electrolytes');
		}
	}
	if (season === 'winter') {
		routines.push('Hydration: Gel cleanse, hyaluronic serum, rich cream, oil seal');
	}
	if (season === 'spring' || season === 'fall') {
		routines.push('Transitional: Gentle cleanse, soothing serum, SPF 30');
	}
	if (allergy) {
		routines.push('Allergy-Safe: Fragrance-free, avoid acids/retinol; add oat mask');
	}
	return routines;
}

router.post('/validate', requireAuth, async (req, res) => {
	const parse = requestSchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
	const { skinTypeAnswers, allergyAnswers, season } = parse.data;
	const { userId } = (req as any).auth as { userId: string };

	let skinType: string | undefined;
	if (skinTypeAnswers) {
		const { score, type } = calculateSkinTypeScore(skinTypeAnswers);
		skinType = type;
		if ((skinTypeAnswers[4] ?? 0) >= 4 && (skinTypeAnswers[5] ?? 0) === 0) {
			return res.status(400).json({ error: 'Inconsistent answers, retake' });
		}
		await prisma.user.update({ where: { id: userId }, data: { skinType: type } });
	}

	if (allergyAnswers) {
		await prisma.user.update({ where: { id: userId }, data: { allergyProfile: allergyAnswers as unknown as any } });
	}

	const initialRoutine = generateInitialRoutine({ skinType, season, allergy: allergyAnswers ?? null });
	return res.json({ skinType, initialRoutine });
});