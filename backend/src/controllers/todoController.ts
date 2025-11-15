import { Request, Response } from 'express';
import Todo from '../models/todo';

// GET all todos
export const getTodos = async (_req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les tâches.' });
  }
};

// GET one todo by id
export const getTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Tâche introuvable.' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer la tâche.' });
  }
};

// POST (create) a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const todo = new Todo({ title, description, status });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Création impossible.' });
  }
};

// PUT (update) a todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Non trouvé.' });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Mise à jour impossible.' });
  }
};

// DELETE a todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Non trouvé.' });
    res.json({ message: 'Tâche supprimée.' });
  } catch (error) {
    res.status(400).json({ error: 'Suppression impossible.' });
  }
};
