FROM oven/bun:1.3.5 AS base
WORKDIR /app

# Instala dependências
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build da aplicação
FROM deps AS builder
COPY . .
ENV NODE_ENV=production
ENV DATABASE_URL="file:/tmp/local.db"
RUN bun run prisma:generate
RUN bun run build

# Runtime enxuto
FROM oven/bun:1.3.5-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# SQLite persistente via volume externo
ENV DATABASE_URL="file:/data/local.db"

# Copiamos apenas o necessário para rodar
COPY --from=builder /app/.next .next
COPY --from=deps /app/node_modules node_modules
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/prisma prisma
COPY --from=builder /app/drizzle.config.ts drizzle.config.ts
COPY --from=builder /app/prisma.config.ts prisma.config.ts
COPY --from=builder /app/docker-entrypoint.sh docker-entrypoint.sh

RUN mkdir -p /data
EXPOSE 3000

RUN chmod +x docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]
