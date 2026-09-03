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

# Prisma требует libssl; node:22-slim (bookworm) идёт без пакета openssl,
# из-за чего движок запросов не может определить версию libssl.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Схема Prisma читает url из env("DATABASE_URL") без дефолта.
# SQLite-файл держим в отдельном каталоге /app/data (НЕ в prisma/), чтобы
# в рантайме можно было примонтировать volume только на данные, не
# перекрывая schema.prisma и migrations/. В рантайме путь переопределяется.
ENV DATABASE_URL="file:/app/data/dev.db"
RUN mkdir -p /app/data

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
    DATABASE_URL="file:/app/data/dev.db"

# Prisma требует libssl (см. комментарий в стадии builder).
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
# Убираем devDependencies (eslint, typescript, tailwind и т.п.) — в рантайме
# нужны только dependencies (next, react, @prisma/client, prisma CLI и пр.).
RUN npm prune --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/data ./data

# Каталог для загруженных файлов (заявки, изображения портфолио).
# ВАЖНО: для продакшена смонтируйте сюда volume, чтобы файлы
# переживали пересоздание контейнера (см. README).
# Запись нужна только в uploads/, data/ (SQLite dev.db) и .next/
# (кэш next/image), поэтому chown не на весь /app — это сильно быстрее.
RUN mkdir -p uploads data && chown -R node:node uploads data .next

USER node
EXPOSE 3000

# Миграции применяются при каждом старте контейнера (идемпотентно),
# затем запускается production-сервер Next.js.
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
