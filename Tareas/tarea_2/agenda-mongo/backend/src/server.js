import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import agendaRouter from './routes/agenda.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/agendas', agendaRouter);

const port = process.env.PORT || 4000;
connectDB()
  .then(() => app.listen(port, () => console.log(`API (Mongo driver) http://localhost:${port}`)))
  .catch((err) => {
    console.error('Error al iniciar DB', err);
    process.exit(1);
  });
