import { Request, Response, NextFunction } from 'express';

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ erro: "Acesso negado. Apenas administradores." });
  }
  next();
}