import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// FUNÇÃO AUXILIAR DE CPF (Requisito da Rubrica)
function validarCPF(cpf: string) {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/)) return false;
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cleanCPF.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(9))) return false;
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cleanCPF.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(10))) return false;
  return true;
}

export class UserController {
  async criar(req: Request, res: Response) {
    const { nome, email, senha, cpf } = req.body;

    // Validação de E-mail (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erro: "Formato de e-mail inválido." });
    }

    // Validação de CPF
    if (!validarCPF(cpf)) {
      return res.status(400).json({ erro: "CPF inválido." });
    }

    try {
      const usuarioExiste = await prisma.user.findFirst({
        where: { OR: [{ email }, { cpf }] }
      });

      if (usuarioExiste) {
        return res.status(400).json({ erro: "E-mail ou CPF já cadastrados." });
      }

      const senhaCriptografada = await hash(senha, 8);

      const usuario = await prisma.user.create({
        data: { nome, email, senha: senhaCriptografada, cpf }
      });

      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar usuário." });
    }
  }

  async obterRanking(req: any, res: any) {
    try {
      const ranking = await prisma.user.findMany({
        select: {
          nome: true,
          leituras: { select: { tempoLido: true } }
        },
        where: { leituras: { some: {} } }
      });

      const rankingFormatado = ranking.map(user => ({
        nome: user.nome,
        tempoTotal: user.leituras.reduce((acc, curr) => acc + curr.tempoLido, 0)
      }))
      .sort((a, b) => b.tempoTotal - a.tempoTotal)
      .slice(0, 5);

      return res.json(rankingFormatado);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao gerar ranking." });
    }
  }

  async recuperarSenha(req: Request, res: Response) {
    const { email, cpf, novaSenha } = req.body;
    try {
      const usuario = await prisma.user.findFirst({ where: { email, cpf } });
      if (!usuario) return res.status(404).json({ erro: "Dados não conferem." });

      const senhaCriptografada = await hash(novaSenha, 8);
      await prisma.user.update({
        where: { id: usuario.id },
        data: { senha: senhaCriptografada }
      });
      return res.json({ mensagem: "Senha alterada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao recuperar senha." });
    }
  }

  // MÉTODO CORRIGIDO PARA A ROTA
  async alterarSenha(req: any, res: Response) {
    const { novaSenha } = req.body; // Alinhado com o Front
    const userId = req.user.id;

    try {
      const senhaCriptografada = await hash(novaSenha, 8);
      await prisma.user.update({
        where: { id: userId },
        data: { senha: senhaCriptografada }
      });
      return res.json({ mensagem: "Senha atualizada com sucesso!" });
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar senha." });
    }
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { nome } = req.body; 
    
    // Rubrica: Só pode editar o próprio usuário
    if (req.user.id !== id) {
      return res.status(403).json({ erro: "Acesso negado." });
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: { nome } // E-mail não deve ser alterado após cadastro conforme a rubrica
      });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar perfil." });
    }
  }
}