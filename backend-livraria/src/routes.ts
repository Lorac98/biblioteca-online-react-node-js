import { Router } from 'express';
import multer from 'multer';
import { storage } from './config/multer';

import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/AuthController';
import { LibraryController } from './controllers/LibraryController';
import { InteractionController } from './controllers/InteractionController';
import { AuthMiddleware } from './middlewares/authMiddleware';
import { adminOnly } from './middlewares/adminMiddleware';

const routes = Router();
const upload = multer({ storage });

const userController = new UserController();
const authController = new AuthController();
const libController = new LibraryController();
const interactionController = new InteractionController();
const authMiddleware = new AuthMiddleware();

// 1. ROTAS PÚBLICAS (Ninguém precisa de Token aqui)
routes.post('/usuarios', userController.criar);
routes.post('/login', authController.logar);
routes.patch('/recuperar-senha', userController.recuperarSenha);

// 2. ATIVAÇÃO DA SEGURANÇA (Tudo abaixo daqui precisa de Token)
routes.use(authMiddleware.execute);

// 3. ROTAS DE USUÁRIO COMUM (Autenticadas)
routes.get('/perfil', (req: any, res: any) => res.json({ id: req.user.id, role: req.user.role }));
routes.get('/ranking', userController.obterRanking);
routes.patch('/usuarios/senha', userController.alterarSenha);

// Interações e Progresso (AGORA DENTRO DA PROTEÇÃO PARA IDENTIFICAR O USER)
routes.post('/livros/progresso', interactionController.registrarProgresso);
routes.get('/favoritos', interactionController.listarFavoritos);
routes.post('/favoritos', interactionController.favoritar);
routes.delete('/favoritos/:livroId', interactionController.removerFavorito);
routes.post('/avaliacoes', interactionController.avaliar);
routes.post('/comentarios', interactionController.comentar);
routes.get('/comentarios/:livroId', interactionController.listarComentarios);

// Biblioteca (Leitura e Listagem)
routes.get('/categorias', libController.listarCategorias);
routes.get('/livros', libController.listar);
routes.get('/livros/:id', libController.buscarPorId);

// 4. ROTAS DE ADMINISTRADOR (Precisa de Token + ser Admin)
routes.post('/categorias', adminOnly, libController.criarCategoria);
routes.post('/livros', adminOnly, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'capa', maxCount: 1 }]), libController.criarLivro);
routes.put('/livros/:id', adminOnly, upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'capa', maxCount: 1 }]), libController.atualizarLivro);
routes.delete('/livros/:id', adminOnly, libController.excluirLivro);

export { routes };