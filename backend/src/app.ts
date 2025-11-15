import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

// Configure CORS pour autoriser ton frontend
app.use(cors({
  origin: ['http://localhost:8080'], // Ajoute ton URL frontend
  credentials: true
}));

app.use(express.json());

app.use('/api', todoRoutes);
app.use('/api/auth', authRoutes);

export default app;
