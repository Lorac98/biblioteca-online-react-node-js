import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  async logar(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      // Chamamos o serviço de login
      const result = await authService.login(email, senha);
      
      // Enviamos para o Frontend o token e os dados, INCLUINDO o role
      return res.status(200).json({ 
        token: result.token, 
        user: {
          id: result.user.id,
          nome: result.user.nome,
          email: result.user.email,
          role: result.user.role // <--- ADICIONADO: Essencial para o Frontend saber se é ADM
        } 
      });

    } catch (error: any) {
      return res.status(401).json({ mensagem: error.message });
    }
  }
}