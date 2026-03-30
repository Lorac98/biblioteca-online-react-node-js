export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Livro {
  id: string;
  titulo: string;
  autor: string;
  capaUrl: string;
  pdfUrl: string;
  categoriaId: number;
  mediaAvaliacao?: number;
  categoria?: Categoria; // Agora usando a interface Categoria aqui
}

export interface RankingSabio {
  nome: string;
  tempoTotal: number;
}