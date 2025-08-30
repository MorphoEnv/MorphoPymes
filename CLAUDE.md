# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MorphoPymes is a decentralized micro-investment platform for Latin American SMEs, built as a monorepo using pnpm workspaces. The platform connects entrepreneurs with investors through blockchain technology and ENS integration.

## Architecture

This is a monorepo with three main applications:

- **apps/api** - Express.js REST API with MongoDB and TypeScript
- **apps/web** - Next.js frontend with React 19 and TailwindCSS v4 
- **apps/contracts** - Ethereum smart contracts using Hardhat and Viem
- **packages/** - Shared packages (currently empty)

## Commands

### Root Level (run from repository root)
```bash
# Install all dependencies
pnpm install

# Run all apps in development mode (parallel)
pnpm dev

# Build all apps
pnpm build

# Lint all apps
pnpm lint
```

### API Development (apps/api)
```bash
# Run API in development mode with auto-reload
cd apps/api
pnpm dev

# Build TypeScript
pnpm build

# Start production server
pnpm start
```

### Frontend Development (apps/web) 
```bash
# Run Next.js with Turbopack
cd apps/web
pnpm dev

# Build for production with Turbopack
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

### Smart Contracts (apps/contracts)
```bash
# Compile contracts
cd apps/contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia testnet
npx hardhat ignition deploy ignitions/Counter.ts --network sepolia
```

## Key Technical Details

- **Package Manager**: pnpm with workspace configuration
- **API Stack**: Express.js, MongoDB (Mongoose), TypeScript, CORS enabled
- **Frontend Stack**: Next.js 15, React 19, TailwindCSS v4, Turbopack
- **Smart Contracts**: Hardhat with Viem toolbox, Solidity 0.8.28
- **Networks**: Configured for Hardhat local, Sepolia testnet
- **Environment**: Requires Node.js 18+, MongoDB, Ethereum wallet

## Development Workflow

1. API runs on port 4000 by default
2. Frontend development uses Turbopack for faster builds
3. Smart contracts use Hardhat for development and testing
4. MongoDB connection string: `mongodb://localhost:27017/morphopymes` (default)
5. Environment variables managed via .env files in each app