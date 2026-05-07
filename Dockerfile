FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd openssl && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./

RUN npm ci

COPY backend/prisma/ ./prisma/

RUN npx prisma generate

RUN npm prune --production

COPY backend/ .

RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node healthcheck.js || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
