import { Router } from 'express';
import { getTodos, getTodo, createTodo, updateTodo, deleteTodo } from '../controllers/todoController';
import { auth } from '../middleware/auth';

const router = Router();

// Toutes les routes todos nécessitent une authentification
router.get('/todos', auth, getTodos);
router.get('/todos/:id', auth, getTodo);
router.post('/todos', auth, createTodo);
router.put('/todos/:id', auth, updateTodo);
router.delete('/todos/:id', auth, deleteTodo);

export default router;
