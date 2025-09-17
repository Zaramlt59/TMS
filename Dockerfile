FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci && cd frontend && npm ci

# Copy source and build
COPY . .
RUN npx prisma generate && npm run build

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 5004
CMD ["./docker-entrypoint.sh"]


