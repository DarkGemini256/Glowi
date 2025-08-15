import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { authRouter, entriesRouter, quizRouter, routinesRouter, streaksRouter, devRouter } from './routes';

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
app.use('/api/quiz', quizRouter);
app.use('/api/routines', routinesRouter);
app.use('/api/streaks', streaksRouter);
if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_DEV_LOGIN) {
	app.use('/api/dev', devRouter);
}

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});