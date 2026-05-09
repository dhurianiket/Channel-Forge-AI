import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export function requireInternalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token !== config.INTERNAL_API_KEY) {
    return res.status(403).json({ error: 'Invalid internal API key' });
  }
  
  next();
}
