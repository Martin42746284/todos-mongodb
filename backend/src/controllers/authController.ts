import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-here';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Utilisateur déjà existant.' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id.toString(), name: user.name, email: user.email },
      SECRET_KEY,
      { expiresIn: '2d' }
    );

    res.json({
      message: 'Connexion réussie.',
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
};
