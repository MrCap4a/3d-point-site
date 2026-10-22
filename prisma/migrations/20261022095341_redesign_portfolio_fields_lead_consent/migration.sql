-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "consentAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PortfolioCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT,
    "material" TEXT,
    "leadTime" TEXT,
    "categories" TEXT NOT NULL DEFAULT '',
    "beforeImageId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PortfolioCase" ("createdAt", "description", "id", "isPublished", "price", "sortOrder", "title", "updatedAt") SELECT "createdAt", "description", "id", "isPublished", "price", "sortOrder", "title", "updatedAt" FROM "PortfolioCase";
DROP TABLE "PortfolioCase";
ALTER TABLE "new_PortfolioCase" RENAME TO "PortfolioCase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
