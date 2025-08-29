# MorphoPymes

MorphoPymes is a decentralized micro-investment platform designed to empower small and medium-sized businesses (SMEs) in Latin America.  
We connect local entrepreneurs with individual investors through blockchain and ENS, enabling transparent, inclusive, and impactful financing.  

---

## Tech Stack

- **MERN Stack**
  - **MongoDB** – Scalable NoSQL database for project and user data.
  - **Express.js** – Backend framework for REST APIs and business logic.
  - **React.js** – Frontend framework for dynamic, modular user interfaces.
  - **Node.js** – Runtime for server-side JavaScript execution.

- **Ethereum**
  - Smart Contracts for investment agreements and fund release conditions.
  - **Web3.js / ethers.js** for blockchain interaction.
  - Deployed on Ethereum-compatible networks.

- **ENS (Ethereum Name Service)**
  - Each SME project is linked to a unique ENS subdomain, e.g. `panaderia123.eth`.
  - Simplifies access, enhances transparency, and ensures trust.

- **Red Hat OpenShift**
  - Enterprise-grade container orchestration and CI/CD pipeline management.
  - Provides scalability, monitoring, and secure deployments.

---

## Features

- **Micro-Investments** – Anyone can invest starting from $10.
- **Transparent Smart Contracts** – Automated fund management and repayment tracking.
- **Reputation Layer** – On-chain credit history and trust system for both investors and entrepreneurs.
- **ENS Integration** – Every business is accessible through its own ENS subdomain.
- **Open-Source Infrastructure** – Built for collaboration and community-driven growth.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Docker (for containerization)
- Red Hat OpenShift (for deployment)
- Ethereum wallet (MetaMask recommended)
- ENS test domain (Rinkeby, Sepolia, or other testnet)

### Installation
```bash
# Clone the repo
git clone https://github.com/morphoenv/morphopymes.git

# Install dependencies
cd morphopymes
npm install

# Run the backend
cd server
npm run dev

# Run the frontend
cd client
npm start
