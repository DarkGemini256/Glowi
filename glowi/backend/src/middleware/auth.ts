import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthPayload = { userId: string; tokenVersion: number };

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	const token = authHeader.substring(7);
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
		(req as any).auth = payload;
		return next();
	} catch {
		return res.status(401).json({ error: 'Invalid token' });
	}
};

export const signToken = (payload: AuthPayload) => {
	return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};