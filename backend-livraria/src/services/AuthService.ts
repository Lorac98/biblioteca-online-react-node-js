import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  private readonly JWT_SECRET = "sua_chave_secreta";

  async login(email: string, senhaPlana: string) {
    const usuario = await this.buscarUsuarioPorEmail(email);
    await this.validarSenha(senhaPlana, usuario.senha);
    
    // 1. Incluímos o role no Token para o Backend validar
    const token = this.gerarToken(usuario.id, usuario.role);

    // 2. Retornamos o role para o Frontend esconder os botões
    return {
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role // Adicionado aqui
      }
    };
  }

  private async buscarUsuarioPorEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  private async validarSenha(plana: string, hash: string) {
    const ok = await bcrypt.compare(plana, hash);
    if (!ok) throw new Error("Senha incorreta");
  }

  // Ajustado para receber o role
  private gerarToken(userId: string, role: string) {
    return jwt.sign({ sub: userId, role }, this.JWT_SECRET, { expiresIn: '1d' });
  }
}