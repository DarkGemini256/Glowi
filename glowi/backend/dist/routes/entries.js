"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
exports.router = (0, express_1.Router)();
const entrySchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    content: zod_1.z.string().min(1),
    mood: zod_1.z.number().int().min(1).max(10).optional(),
});
exports.router.use(auth_1.requireAuth);
exports.router.get('/', async (req, res) => {
    const { userId } = req.auth;
    const entries = await prisma_1.prisma.entry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    res.json(entries);
});
exports.router.post('/', async (req, res) => {
    const parse = entrySchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
    const { userId } = req.auth;
    const created = await prisma_1.prisma.entry.create({ data: { ...parse.data, userId } });
    res.status(201).json(created);
});
exports.router.get('/:id', async (req, res) => {
    const { userId } = req.auth;
    const { id } = req.params;
    const entry = await prisma_1.prisma.entry.findFirst({ where: { id, userId } });
    if (!entry)
        return res.status(404).json({ error: 'Not found' });
    res.json(entry);
});
exports.router.put('/:id', async (req, res) => {
    const parse = entrySchema.partial().safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
    const { userId } = req.auth;
    const { id } = req.params;
    const existing = await prisma_1.prisma.entry.findFirst({ where: { id, userId } });
    if (!existing)
        return res.status(404).json({ error: 'Not found' });
    const updated = await prisma_1.prisma.entry.update({ where: { id }, data: parse.data });
    res.json(updated);
});
exports.router.delete('/:id', async (req, res) => {
    const { userId } = req.auth;
    const { id } = req.params;
    const existing = await prisma_1.prisma.entry.findFirst({ where: { id, userId } });
    if (!existing)
        return res.status(404).json({ error: 'Not found' });
    await prisma_1.prisma.entry.delete({ where: { id } });
    res.json({ success: true });
});
