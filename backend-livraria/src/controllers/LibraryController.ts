import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LibraryController {
  // LISTAR COM PAGINAÇÃO, BUSCA GLOBAL E FILTRO DE CATEGORIA
  async listar(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      // Pegamos os termos de busca da URL
      const busca = req.query.busca as string;
      const categoriaNome = req.query.categoria as string;

      // Montamos o filtro dinâmico para o Prisma
      const where: any = {};

      if (busca) {
        where.OR = [
          { titulo: { contains: busca } }, // Busca parcial no título (ignora maiúsculas/minúsculas no SQLite/Postgres padrão)
          { autor: { contains: busca } }   // Busca parcial no autor
        ];
      }

      if (categoriaNome && categoriaNome !== 'Todas') {
        where.categoria = {
          nome: categoriaNome
        };
      }

      // Executa a busca dos livros e a contagem total com os filtros aplicados
      const [livros, total] = await prisma.$transaction([
        prisma.livro.findMany({
          where, // APLICA O FILTRO DE BUSCA AQUI
          skip,
          take: limit,
          include: { 
            categoria: true,
            avaliacoes: true 
          },
          orderBy: { titulo: 'asc' }
        }),
        prisma.livro.count({ where }) // CONTA APENAS OS FILTRADOS PARA A PAGINAÇÃO
      ]);

      // Calcula a média de cada livro dinamicamente
      const dataComMedia = livros.map(livro => {
        const totalNotas = livro.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
        const media = livro.avaliacoes.length > 0 ? totalNotas / livro.avaliacoes.length : 0;
        
        return {
          ...livro,
          mediaAvaliacao: media
        };
      });

      return res.json({
        data: dataComMedia,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar tomos na biblioteca." });
    }
  }

  // ... (restante dos métodos: criarLivro, atualizarLivro, buscarPorId, excluirLivro continuam iguais)

  // CRIAR LIVRO
  async criarLivro(req: Request, res: Response) {
    const { titulo, autor, categoriaId, capaUrlExterna } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const capaUrl = files && files['capa'] ? files['capa'][0].filename : (capaUrlExterna || null);
    const pdfUrl = files && files['pdf'] ? files['pdf'][0].filename : req.body.pdfUrl;

    try {
      const novoLivro = await prisma.livro.create({
        data: { 
          titulo, 
          autor, 
          pdfUrl, 
          capaUrl,
          categoriaId: Number(categoriaId)
        },
        include: { categoria: true }
      });
      return res.status(201).json(novoLivro);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar novo manuscrito." });
    }
  }

  async atualizarLivro(req: Request, res: Response) {
    const { id } = req.params;
    const { titulo, autor, pdfUrl, categoriaId } = req.body;
    
    try {
      const livroAtualizado = await prisma.livro.update({
        where: { id },
        data: { 
          titulo, 
          autor,
          pdfUrl, 
          categoriaId: Number(categoriaId) 
        }
      });
      return res.json(livroAtualizado);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao atualizar a obra." });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const livro = await prisma.livro.findUnique({ 
        where: { id }, 
        include: { categoria: true } 
      });

      if (!livro) return res.status(404).json({ error: "Obra não encontrada." });
      return res.json(livro);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao buscar livro." });
    }
  }

  async excluirLivro(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.livro.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao excluir a obra." });
    }
  }

  async criarCategoria(req: Request, res: Response) {
    const { nome } = req.body;
    try {
      const categoria = await prisma.categoria.create({ data: { nome } });
      return res.status(201).json(categoria);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao criar categoria." });
    }
  }

  async listarCategorias(req: Request, res: Response) {
    try {
      const categorias = await prisma.categoria.findMany({ orderBy: { nome: 'asc' } });
      return res.json(categorias);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao listar categorias." });
    }
  }
}