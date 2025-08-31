# Multi-stage Dockerfile for Next.js app using pnpm
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Use Corepack to provide pnpm (no global npm installs)
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Allow passing NEXT_PUBLIC_API_URL at build time so the value is embedded in the client bundle
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy package and lockfile first for better layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Keep NEXT_PUBLIC available at runtime too (useful if parts expect it)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

# Copy built assets and node_modules from builder
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "start"]
