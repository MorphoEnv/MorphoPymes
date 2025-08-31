# Multi-stage Dockerfile for API (TypeScript/Node) using pnpm
FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production

# Install pnpm
RUN npm install -g pnpm@10.15.0

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

RUN npm install -g pnpm@7

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000
CMD ["pnpm", "start"]
