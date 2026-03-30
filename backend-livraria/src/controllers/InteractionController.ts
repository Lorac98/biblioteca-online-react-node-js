import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InteractionController {
  // FAVORITAR (Toggle)
  async favoritar(req: any, res: Response) {
    const { livroId } = req.body;
    const userId = req.user.id;

    try {
      const existe = await prisma.favorito.findFirst({
        where: { userId, livroId }
      });

      if (existe) {
        await prisma.favorito.delete({ where: { id: existe.id } });
        return res.json({ mensagem: "Removido dos favoritos" });
      }

      const favorito = await prisma.favorito.create({
        data: { userId, livroId }
      });

      return res.status(201).json(favorito);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao favoritar" });
    }
  }

  // REMOVER FAVORITO (UUID)
  async removerFavorito(req: any, res: Response) {
    try {
      const { livroId } = req.params;
      const userId = req.user.id;

      await prisma.favorito.deleteMany({
        where: { userId, livroId }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: "Erro ao remover favorito" });
    }
  }

  // LISTAR FAVORITOS
  async listarFavoritos(req: any, res: Response) {
    const userId = req.user.id;
    try {
      const favoritos = await prisma.favorito.findMany({
        where: { userId },
        include: { livro: true }
      });
      return res.json(favoritos);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao listar favoritos" });
    }
  }

  // REGISTRAR PROGRESSO
  async registrarProgresso(req: any, res: Response) {
    try {
      const { livroId, minutos } = req.body;
      const userId = req.user.id;

      const leitura = await prisma.leitura.upsert({
        where: { userId_livroId: { userId, livroId } },
        update: { tempoLido: { increment: minutos }, dataUltimaLeitura: new Date() },
        create: { userId, livroId, tempoLido: minutos, dataUltimaLeitura: new Date() }
      });

      return res.json(leitura);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao salvar progresso." });
    }
  }

  // AVALIAR
  async avaliar(req: any, res: Response) {
    const { livroId, nota } = req.body;
    const userId = req.user.id;

    try {
      const avaliacao = await prisma.avaliacao.upsert({
        where: { userId_livroId: { userId, livroId } },
        update: { nota },
        create: { userId, livroId, nota }
      });
      return res.json(avaliacao);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao avaliar" });
    }
  }

  // COMENTAR
  async comentar(req: any, res: Response) {
    const { livroId, texto } = req.body;
    const usuarioId = req.user.id;

    try {
      const comentario = await prisma.comentario.create({
        data: { texto, livroId, usuarioId },
        include: { usuario: { select: { nome: true } } }
      });
      return res.status(201).json(comentario);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao publicar comentário." });
    }
  }

  // LISTAR COMENTÁRIOS
  async listarComentarios(req: Request, res: Response) {
    const { livroId } = req.params;
    try {
      const comentarios = await prisma.comentario.findMany({
        where: { livroId },
        include: { usuario: { select: { nome: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(comentarios);
    } catch (error) {
      return res.status(500).json({ erro: "Erro ao carregar comentários." });
    }
  }
}