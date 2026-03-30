import express from 'express';
import cors from 'cors';
import path from 'path';
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Rota para servir as imagens/pdfs da pasta uploads
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(routes);

// EXPORTAÇÃO PARA OS TESTES
export { app };

// INICIALIZAÇÃO DO SERVIDOR
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Gato Preto online em http://localhost:${PORT}`);
});