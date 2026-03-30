import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BookService {

    // Adicione dentro da classe BookService
async deletar(id: string) {
  // Primeiro verificamos se o livro existe
  const livroExistente = await prisma.livro.findUnique({ where: { id } });
  
  if (!livroExistente) throw new Error("Este livro não existe no banco de dados.");

  return await prisma.livro.delete({ where: { id } });
}
  // Função curta e tipada conforme os requisitos
  async criar(titulo: string, autor: string, categoriaId: number) {
    return await prisma.livro.create({
      data: {
        titulo,
        autor,
        categoriaId
      }
    });
  }

  // Função para listar com paginação (Requisito do projeto)
  async listarPaginado(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await prisma.livro.findMany({
      skip: skip,
      take: limit,
      include: { categoria: true }
    });
  }
}