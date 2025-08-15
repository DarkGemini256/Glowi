"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
const limiter = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, limit: 120 });
app.use(limiter);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', routes_1.authRouter);
app.use('/api/entries', routes_1.entriesRouter);
app.use('/api/quiz', routes_1.quizRouter);
app.use('/api/routines', routes_1.routinesRouter);
app.use('/api/streaks', routes_1.streaksRouter);
const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
