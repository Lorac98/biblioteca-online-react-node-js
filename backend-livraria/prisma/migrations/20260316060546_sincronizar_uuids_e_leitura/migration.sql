/*
  Warnings:

  - The primary key for the `Favorito` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Favorito` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "Leitura" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tempoLido" INTEGER NOT NULL DEFAULT 0,
    "dataUltimaLeitura" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "livroId" TEXT NOT NULL,
    CONSTRAINT "Leitura_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Leitura_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favorito" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "livroId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorito_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Favorito_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Favorito" ("id", "livroId", "userId") SELECT "id", "livroId", "userId" FROM "Favorito";
DROP TABLE "Favorito";
ALTER TABLE "new_Favorito" RENAME TO "Favorito";
CREATE UNIQUE INDEX "Favorito_userId_livroId_key" ON "Favorito"("userId", "livroId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Leitura_userId_livroId_key" ON "Leitura"("userId", "livroId");
