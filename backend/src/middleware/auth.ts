import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const SECRET_KEY: Secret = process.env.JWT_SECRET || 'your-secret-key-here';

export interface CustomRequest extends Request {
  token?: string | JwtPayload;
  userId?: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    (req as CustomRequest).token = decoded;
    (req as CustomRequest).userId = decoded._id;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide.' });
  }
};
