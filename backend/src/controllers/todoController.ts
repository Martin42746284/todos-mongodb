import { Request, Response } from 'express';
import Todo from '../models/todo';
import { CustomRequest } from '../middleware/auth';

// GET all todos de l'utilisateur connecté
export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = (req as CustomRequest).userId;
    
    // Récupérer uniquement les todos de cet utilisateur
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer les tâches.' });
  }
};

// GET one todo by id (vérifier qu'il appartient à l'utilisateur)
export const getTodo = async (req: Request, res: Response) => {
  try {
    const userId = (req as CustomRequest).userId;
    
    const todo = await Todo.findOne({ _id: req.params.id, userId });
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
    const userId = (req as CustomRequest).userId;
    
    // Créer le todo avec l'userId
    const todo = new Todo({ title, description, status, userId });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Création impossible.' });
  }
};

// PUT (update) a todo (vérifier qu'il appartient à l'utilisateur)
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const userId = (req as CustomRequest).userId;
    
    // Mettre à jour uniquement si le todo appartient à l'utilisateur
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId },
      { title, description, status },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Non trouvé.' });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Mise à jour impossible.' });
  }
};

// DELETE a todo (vérifier qu'il appartient à l'utilisateur)
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const userId = (req as CustomRequest).userId;
    
    // Supprimer uniquement si le todo appartient à l'utilisateur
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId });
    if (!todo) return res.status(404).json({ error: 'Non trouvé.' });
    res.json({ message: 'Tâche supprimée.' });
  } catch (error) {
    res.status(400).json({ error: 'Suppression impossible.' });
  }
};
