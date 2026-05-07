FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends netcat-openbsd openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Install ALL deps (รวม prisma CLI ใน devDeps) เพื่อ generate client
RUN npm ci

COPY prisma/ ./prisma/

RUN npx prisma generate

# ลบ devDeps ออกหลัง generate เพื่อลดขนาด image
RUN npm prune --production

COPY . .

RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node healthcheck.js || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
