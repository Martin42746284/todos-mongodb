import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', todoRoutes);
app.use('/api/auth', authRoutes);

export default app;
