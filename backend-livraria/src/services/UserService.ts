import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  // Função principal de cadastro
  async cadastrar(dados: any) {
    this.validarEmail(dados.email);
    this.validarCPF(dados.cpf);
    const senhaHash = await this.criptografarSenha(dados.senha);
    
    return prisma.user.create({
      data: { ...dados, senha: senhaHash }
    });
  }

  private validarEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) throw new Error("Email inválido");
  }

  private validarCPF(cpf: string) {
    // Validação simples de tamanho (o ideal é um algoritmo de dígitos verificadores)
    if (cpf.length !== 11) throw new Error("CPF deve ter 11 dígitos");
  }

  private async criptografarSenha(senha: string) {
    return bcrypt.hash(senha, 10);
  }

  async atualizar(id: string, dados: { nome: string, senha?: string, cpf: string }) {
  // A regra diz: Não permitir alterar e-mail. Por isso não recebemos e-mail nos dados.
  
  const camposParaAtualizar: any = { 
    nome: dados.nome, 
    cpf: dados.cpf 
  };

  if (dados.senha) {
    camposParaAtualizar.senha = await bcrypt.hash(dados.senha, 10);
  }

  return prisma.user.update({
    where: { id },
    data: camposParaAtualizar
  });
}
}