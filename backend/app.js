import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import capsuleRoutes from './routes/capsuleRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { checkUnlocks } from './controllers/capsuleController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(express.json());
app.use(cors());


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/events', eventRoutes);
app.get('/api/cron/check-unlocks', checkUnlocks);
app.get('/', (req, res) => {
  res.send(' TimeCapsule API is running...');
});



export default app;


