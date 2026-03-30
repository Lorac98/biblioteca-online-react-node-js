// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


    async function main() {
  // Limpa apenas os que estão dando problema para garantir uma nova inserção
  await prisma.livro.deleteMany({
    where: { 
      titulo: { in: ["É Assim que Acaba", "Orgulho e Preconceito", "O Exorcista"] } 
    }
  });
  console.log('🌱 Expandindo o acervo do Gato Preto...');

  // 1. CRIAÇÃO/BUSCA DAS CATEGORIAS
  const catTerror = await prisma.categoria.upsert({ where: { nome: 'Terror' }, update: {}, create: { nome: 'Terror' } });
  const catRomance = await prisma.categoria.upsert({ where: { nome: 'Romance' }, update: {}, create: { nome: 'Romance' } });
  const catFiccao = await prisma.categoria.upsert({ where: { nome: 'Ficção Científica' }, update: {}, create: { nome: 'Ficção Científica' } });

  const novosLivros = [
    // TERROR
    { titulo: "It: A Coisa", autor: "Stephen King", capaUrl: "itacoisa.jpg", pdfUrl: "itacoisa.pdf", categoriaId: catTerror.id },
    { titulo: "O Exorcista", autor: "William Peter Blatty", capaUrl: "oexorcista.jpg", pdfUrl: "oexorcista.pdf", categoriaId: catTerror.id },
    { titulo: "O Cemitério", autor: "Stephen King", capaUrl: "ocemiterio.jpg", pdfUrl: "ocemiterio.pdf", categoriaId: catTerror.id },
    { titulo: "O Bebê de Rosemary", autor: "Ira Levin", capaUrl: "obebederosemary.jpg", pdfUrl: "obebederosemary.pdf", categoriaId: catTerror.id },
    { titulo: "Histórias Extraordinárias", autor: "Edgar Allan Poe", capaUrl: "historias-extraordinarias.jpg", pdfUrl: "historias-extraordinarias.pdf", categoriaId: catTerror.id },
    
    // ROMANCE
    { titulo: "A Hipótese do Amor", autor: "Ali Hazelwood", capaUrl: "ahipotesedoamor.jpg", pdfUrl: "ahipotesedoamor.pdf", categoriaId: catRomance.id },
    { titulo: "É Assim que Acaba", autor: "Colleen Hoover", capaUrl: "eassimqueacaba.jpg", pdfUrl: "eassimqueacaba.pdf", categoriaId: catRomance.id },
    { titulo: "Orgulho e Preconceito", autor: "Jane Austen", capaUrl: "orgulhoepreconceito.webp", pdfUrl: "orgulhoepreconceito.pdf", categoriaId: catRomance.id },
    
    // FICÇÃO CIENTÍFICA
    { titulo: "Guerra dos Mundos", autor: "H.G. Wells", capaUrl: "guerradosmundos.png", pdfUrl: "guerradosmundos.pdf", categoriaId: catFiccao.id }
  ];

  for (const livro of novosLivros) {
    // Verificamos se o livro já existe pelo título para evitar duplicatas
    const existe = await prisma.livro.findFirst({
      where: { titulo: livro.titulo }
    });

    if (!existe) {
      await prisma.livro.create({ data: livro });
      console.log(`✅ Adicionado: ${livro.titulo}`);
    } else {
      // Se já existe, apenas atualizamos os arquivos
      await prisma.livro.update({
        where: { id: existe.id },
        data: {
          capaUrl: livro.capaUrl,
          pdfUrl: livro.pdfUrl
        }
      });
      console.log(`🆙 Atualizado: ${livro.titulo}`);
    }
  }

  console.log('📚 Processo de catalogação finalizado!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });