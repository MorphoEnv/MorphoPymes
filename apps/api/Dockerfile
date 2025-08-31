# Multi-stage Dockerfile for API (TypeScript/Node) using pnpm
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Use Corepack to provide pnpm (no global npm installs)
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy lockfiles and install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
# assume there's a build script that compiles TS to dist/
RUN pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000
CMD ["pnpm", "start"]
