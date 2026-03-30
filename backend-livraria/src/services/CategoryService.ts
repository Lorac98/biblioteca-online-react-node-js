import { PrismaClient } from '@prisma/client';

// Criamos a instância FORA da classe
const prisma = new PrismaClient();

export class CategoryService {
  async criar(nome: string) {
    // Verifique se no seu schema.prisma o nome é "Categoria"
    // O Prisma gera o acesso sempre em minúsculo: prisma.categoria
    return await prisma.categoria.create({
      data: { nome }
    });
  }

  async listar() {
    return await prisma.categoria.findMany();
  }
}