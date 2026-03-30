import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
  sub: string;
  role: string;
}

export class AuthMiddleware {
  execute(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ erro: "Token ausente" });
    }

    const [, token] = authHeader.split(" ");

    try {
      // Usando a chave padronizada. Certifique-se que é a mesma do AuthService!
      const decoded = verify(token, "sua_chave_secreta") as Payload;

      req.user = {
        id: decoded.sub,
        role: decoded.role
      };

      return next();
    } catch (err) {
      return res.status(401).json({ erro: "Token inválido" });
    }
  }
}