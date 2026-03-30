export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  role: 'USER' | 'ADMIN';
}

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  capaUrl: string;
  pdfUrl: string;
  categoriaId: number;
  mediaAvaliacao?: number;
  categoria?: {
    nome: string;
  };
}

export interface RankingSabio {
  nome: string;
  tempoTotal: number;
}