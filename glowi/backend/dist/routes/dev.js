"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
exports.router = (0, express_1.Router)();
exports.router.post('/login', async (_req, res) => {
    if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEV_LOGIN) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const email = 'dev@glowi.test';
    const name = 'Dev User';
    const password = 'password123';
    let user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        user = await prisma_1.prisma.user.create({ data: { email, name, passwordHash } });
    }
    const token = (0, auth_1.signToken)({ userId: user.id, tokenVersion: user.tokenVersion });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});
