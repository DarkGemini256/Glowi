"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
exports.router = (0, express_1.Router)();
const emailSchema = zod_1.z.string().email();
const passwordSchema = zod_1.z.string().min(8).max(100);
exports.router.post('/signup', async (req, res) => {
    const parse = zod_1.z
        .object({ email: emailSchema, password: passwordSchema, name: zod_1.z.string().min(1).max(100).optional() })
        .safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
    }
    const { email, password, name } = parse.data;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({ data: { email, passwordHash, name } });
    const token = (0, auth_1.signToken)({ userId: user.id, tokenVersion: user.tokenVersion });
    return res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
});
exports.router.post('/login', async (req, res) => {
    const parse = zod_1.z.object({ email: emailSchema, password: zod_1.z.string() }).safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    const { email, password } = parse.data;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = (0, auth_1.signToken)({ userId: user.id, tokenVersion: user.tokenVersion });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});
exports.router.get('/me', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        return res.status(404).json({ error: 'Not found' });
    return res.json({ id: user.id, email: user.email, name: user.name });
});
exports.router.post('/logout', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.auth;
    await prisma_1.prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } });
    return res.json({ success: true });
});
