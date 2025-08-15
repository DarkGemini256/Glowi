"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
exports.router = (0, express_1.Router)();
const bodySchema = zod_1.z.object({
    streaks: zod_1.z.object({ tanning: zod_1.z.number().int().nonnegative(), irritationFree: zod_1.z.number().int().nonnegative(), hydration: zod_1.z.number().int().nonnegative() }),
});
exports.router.post('/sync', auth_1.requireAuth, async (req, res) => {
    const parse = bodySchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: 'Invalid body' });
    const { userId } = req.auth;
    const { tanning, irritationFree, hydration } = parse.data.streaks;
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { tanningStreak: tanning, irritationFreeStreak: irritationFree, hydrationStreak: hydration },
    });
    const communityAverage = Math.floor(40 + Math.random() * 40);
    res.json({ success: true, communityAverage });
});
