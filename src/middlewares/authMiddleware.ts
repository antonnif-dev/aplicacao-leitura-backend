import { Request, Response, NextFunction } from 'express';
import { getSupabaseClient } from '../config/supabase.js';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];  
  const supabase = getSupabaseClient();

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw new Error('Token inválido');
    }
    // @ts-ignore
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
}