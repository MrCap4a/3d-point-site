# syntax=docker/dockerfile:1

########################
# 1. Зависимости
########################
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

########################
# 2. Сборка приложения
########################
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Схема Prisma читает url из env("DATABASE_URL") без дефолта.
# SQLite-файл создаётся в /app/prisma/dev.db (путь относительный
# к prisma/schema.prisma). В рантайме переопределяется из окружения.
ENV DATABASE_URL="file:/app/prisma/dev.db"

# NEXT_PUBLIC_* переменные попадают в JS-бандлы на этапе сборки,
# поэтому прокидываются как build-arg (см. GitHub Action).
# Дефолт — как в коде приложения (src/app/layout.tsx и др.).
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Страницы портфолио пререндерятся во время сборки (ISR, revalidate=60)
# и читают базу данных, поэтому до `next build` применяем миграции
# и генерируем Prisma Client.
RUN npx prisma migrate deploy \
  && npx prisma generate \
  && npm run build

########################
# 3. Runtime
########################
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    DATABASE_URL="file:/app/prisma/dev.db"

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
# Убираем devDependencies (eslint, typescript, tailwind и т.п.) — в рантайме
# нужны только dependencies (next, react, @prisma/client, prisma CLI и пр.).
RUN npm prune --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/prisma ./prisma

# Каталог для загруженных файлов (заявки, изображения портфолио).
# ВАЖНО: для продакшена смонтируйте сюда volume, чтобы файлы
# переживали пересоздание контейнера (см. README).
# Запись нужна только в uploads/, prisma/ (SQLite dev.db) и .next/
# (кэш next/image), поэтому chown не на весь /app — это сильно быстрее.
RUN mkdir -p uploads && chown -R node:node uploads prisma .next

USER node
EXPOSE 3000

# Миграции применяются при каждом старте контейнера (идемпотентно),
# затем запускается production-сервер Next.js.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
