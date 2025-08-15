"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
exports.router = (0, express_1.Router)();
const skinTypeAnswerSchema = zod_1.z.array(zod_1.z.number().int());
const allergyQuizSchema = zod_1.z.object({
    allergens: zod_1.z.array(zod_1.z.string()),
    flareFrequency: zod_1.z.enum(['daily', 'weekly', 'monthly', 'rarely']),
    severity: zod_1.z.enum(['mild', 'moderate', 'severe']),
    sensitivities: zod_1.z.array(zod_1.z.enum(['Eczema', 'Rosacea', 'Contact Dermatitis'])).optional(),
    reactionToNew: zod_1.z.enum(['none', 'mild', 'breakouts', 'severe']),
    envTriggers: zod_1.z.array(zod_1.z.enum(['cold', 'hot', 'humidity', 'pollution', 'sun'])).optional()
});
const requestSchema = zod_1.z.object({
    skinTypeAnswers: skinTypeAnswerSchema.optional(),
    allergyAnswers: allergyQuizSchema.optional(),
    season: zod_1.z.enum(['summer', 'winter', 'spring', 'fall']).optional()
});
function calculateSkinTypeScore(answers) {
    const score = answers.reduce((a, b) => a + b, 0);
    let type = 'I';
    if (score <= 7)
        type = 'I';
    else if (score <= 16)
        type = 'II';
    else if (score <= 25)
        type = 'III';
    else if (score <= 30)
        type = 'IV';
    else if (score <= 35)
        type = 'V';
    else
        type = 'VI';
    return { score, type };
}
function generateInitialRoutine(params) {
    const { skinType = 'III', season = 'summer', allergy } = params;
    const routines = [];
    if (season === 'summer') {
        if (skinType === 'I' || skinType === 'II') {
            routines.push('Tanning: 5-10min exposure with SPF 50, hat, shade breaks');
            routines.push('Post-Sun: Cool shower, aloe gel, SPF reapply');
        }
        else if (skinType === 'III' || skinType === 'IV') {
            routines.push('Tanning: 15-25min with SPF 30, hydrate every 10min');
            routines.push('Post-Sun: Soothing lotion, avoid acids 24h');
        }
        else {
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
exports.router.post('/validate', auth_1.requireAuth, async (req, res) => {
    const parse = requestSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
    const { skinTypeAnswers, allergyAnswers, season } = parse.data;
    const { userId } = req.auth;
    let skinType;
    if (skinTypeAnswers) {
        const { score, type } = calculateSkinTypeScore(skinTypeAnswers);
        skinType = type;
        if ((skinTypeAnswers[4] ?? 0) >= 4 && (skinTypeAnswers[5] ?? 0) === 0) {
            return res.status(400).json({ error: 'Inconsistent answers, retake' });
        }
        await prisma_1.prisma.user.update({ where: { id: userId }, data: { skinType: type } });
    }
    if (allergyAnswers) {
        await prisma_1.prisma.user.update({ where: { id: userId }, data: { allergyProfile: allergyAnswers } });
    }
    const initialRoutine = generateInitialRoutine({ skinType, season, allergy: allergyAnswers ?? null });
    return res.json({ skinType, initialRoutine });
});
