"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
exports.router = (0, express_1.Router)();
const querySchema = zod_1.z.object({
    type: zod_1.z.enum(['tanning', 'postSun', 'winter', 'hydration', 'allergySafe']).optional(),
    skinType: zod_1.z.enum(['I', 'II', 'III', 'IV', 'V', 'VI']).optional(),
    season: zod_1.z.enum(['summer', 'winter', 'spring', 'fall']).optional(),
});
function buildVariations({ type, skinType, season }) {
    const makeList = (base, count) => Array.from({ length: count }, (_, i) => `${base} Variant ${i + 1}`);
    const pack = {
        tanning: makeList(`Gentle Tanning${skinType ? ` Type ${skinType}` : ''}`, 12),
        postSun: makeList('Post-Sun Recovery', 12),
        winter: makeList(`Winter Hydration${skinType ? ` Type ${skinType}` : ''}`, 11),
        hydration: makeList('Daily Hydration', 15),
        allergySafe: makeList('Allergy-Safe Routine', 12),
    };
    if (type)
        return { [type]: pack[type] };
    return pack;
}
exports.router.get('/variations', auth_1.requireAuth, (req, res) => {
    const parse = querySchema.safeParse(req.query);
    if (!parse.success)
        return res.status(400).json({ error: 'Invalid query' });
    const { type, skinType, season } = parse.data;
    const data = buildVariations({ type, skinType, season });
    res.json(data);
});
