import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { router as authRouter } from './routes/auth';
import { router as entriesRouter } from './routes/entries';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60 * 1000, limit: 120 });
app.use(limiter);

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/entries', entriesRouter);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});