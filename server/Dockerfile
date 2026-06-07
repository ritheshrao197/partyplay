# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---- Production stage ----
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled JS
COPY --from=builder /app/dist ./dist

# Copy SQL migration files (not compiled by tsc)
COPY src/database/migrations ./dist/database/migrations

EXPOSE 4000

CMD ["sh", "-c", "node dist/database/migrate.js && node dist/index.js"]
