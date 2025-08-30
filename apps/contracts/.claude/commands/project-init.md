description: Initialize new Solidity/Hardhat project with optimized configuration
argument-hint: [project_name]
allowed-tools: Bash(npx:), Bash(mkdir:), Bash(npm:), Bash(git:)
Initialize Solidity/Hardhat project: $ARGUMENTS

🚀 Project Initialization
📁 Recommended Project Structure
$ARGUMENTS/
├── contracts/
│   ├── interfaces/
│   ├── libraries/
│   ├── mocks/
│   └── upgrades/
├── scripts/
│   ├── deploy/
│   ├── verify/
│   └── utils/
├── test/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/
├── deployments/
├── .claude/
│   └── commands/
├── hardhat.config.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
🛠️ Initialization Commands
1. Create Base Project
# Create project directory
!mkdir -p $ARGUMENTS
!cd $ARGUMENTS

# Initialize npm
!npm init -y

# Install Hardhat and essential dependencies
!npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify

# Initialize Hardhat
!npx hardhat init --yes
2. Instalar Dependencias de Desarrollo
# Testing y coverage
!npm install --save-dev @nomicfoundation/hardhat-chai-matchers chai ethereum-waffle solidity-coverage hardhat-gas-reporter

# Linting y formatting
!npm install --save-dev solhint prettier prettier-plugin-solidity

# Deployment y verificación
!npm install --save-dev @openzeppelin/hardhat-upgrades hardhat-deploy hardhat-deploy-ethers

# Utilidades
!npm install --save-dev dotenv cross-env rimraf
3. Instalar Dependencias de Producción
# OpenZeppelin contracts (security)
!npm install @openzeppelin/contracts @openzeppelin/contracts-upgradeable

# Ethereum utilities
!npm install ethers @ethersproject/abi @ethersproject/providers
⚙️ Configuración Inicial
hardhat.config.js Optimizado
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-deploy");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },

  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 12000000,
      allowUnlimitedContractSize: true,
      accounts: {
        count: 20,
        accountsBalance: "10000000000000000000000"
      }
    },
  
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
  
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY !== "0x" + "0".repeat(64) ? [PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 20000000000,
      gas: 6000000
    },
  
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: PRIVATE_KEY !== "0x" + "0".repeat(64) ? [PRIVATE_KEY] : [],
      chainId: 1,
      gasPrice: "auto",
      gas: "auto"
    }
  },

  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY
    }
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 20,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },

  namedAccounts: {
    deployer: {
      default: 0
    },
    user1: {
      default: 1
    },
    user2: {
      default: 2
    }
  },

  mocha: {
    timeout: 60000
  }
};
package.json Scripts
{
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "test:gas": "REPORT_GAS=true hardhat test",
    "deploy:localhost": "hardhat deploy --network localhost",
    "deploy:sepolia": "hardhat deploy --network sepolia",
    "deploy:mainnet": "hardhat deploy --network mainnet",
    "verify:sepolia": "hardhat verify --network sepolia",
    "verify:mainnet": "hardhat verify --network mainnet",
    "node": "hardhat node",
    "clean": "hardhat clean && rimraf cache artifacts",
    "lint:sol": "solhint 'contracts/**/*.sol'",
    "lint:js": "eslint '**/*.js'",
    "format": "prettier --write '**/*.{js,json,sol,md}'",
    "size": "hardhat size-contracts"
  }
}
📝 Configuration Files
.env.example
# RPC URLs
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Private Keys (NEVER commit real keys)
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

# Configuration
REPORT_GAS=false
.gitignore
# Dependencies
node_modules/
npm-debug.log*

# Environment variables
.env

# Hardhat
cache/
artifacts/
typechain-types/

# Coverage
coverage/
coverage.json

# Deployments (comment out if you want to track them)
deployments/localhost/
deployments/hardhat/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
solhint.config.js
module.exports = {
  extends: "solhint:recommended",
  rules: {
    "compiler-version": ["error", "^0.8.0"],
    "func-visibility": ["warn", { "ignoreConstructors": true }],
    "max-line-length": ["error", 120],
    "not-rely-on-time": "off",
    "avoid-suicide": "error",
    "avoid-sha3": "warn"
  }
};
.prettierrc
{
  "overrides": [
    {
      "files": "*.sol",
      "options": {
        "printWidth": 120,
        "tabWidth": 4,
        "useTabs": false,
        "singleQuote": false,
        "bracketSpacing": false
      }
    }
  ]
}
📄 Example Contracts
contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
🧪 Example Tests
test/unit/MyToken.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("MyToken", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy(
      "Test Token",
      "TEST",
      ethers.utils.parseEther("1000000")
    );

    return { token, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
    
      await expect(
        token.transfer(addr1.address, 50)
      ).to.changeTokenBalances(token, [owner, addr1], [-50, 50]);

      await expect(
        token.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(token, [addr1, addr2], [-50, 50]);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { token, owner, addr1 } = await loadFixture(deployTokenFixture);
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
📜 Deploy Scripts
scripts/deploy/01-deploy-token.js
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying MyToken...");

  const args = [
    "My Token",
    "MTK",
    ethers.utils.parseEther("1000000")
  ];

  const myToken = await deploy("MyToken", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`MyToken deployed at ${myToken.address}`);

  if (network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(myToken.address, args);
  }
};

module.exports.tags = ["all", "token"];
📚 Documentation
README.md
# $ARGUMENTS

## Overview
Brief description of your project.

## Installation
\`\`\`bash
npm install
\`\`\`

## Usage
\`\`\`bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to localhost
npm run deploy:localhost
\`\`\`

## Testing
\`\`\`bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run with gas reporting
npm run test:gas
\`\`\`

## Deployment
\`\`\`bash
# Deploy to testnet
npm run deploy:sepolia

# Deploy to mainnet
npm run deploy:mainnet
\`\`\`

## Verification
\`\`\`bash
# Verify on testnet
npm run verify:sepolia

# Verify on mainnet
npm run verify:mainnet
\`\`\`
🔧 Setup Commands
Run Complete Initialization
# Create directory structure
!mkdir -p $ARGUMENTS/{contracts/{interfaces,libraries,mocks,upgrades},scripts/{deploy,verify,utils},test/{unit,integration,fixtures},docs,deployments,.claude/commands}

# Copy Claude commands
!cp -r /home/ubuntu/.claude/commands/* $ARGUMENTS/.claude/commands/

# Initialize git
!cd $ARGUMENTS && git init
!cd $ARGUMENTS && git add .
!cd $ARGUMENTS && git commit -m "Initial commit: Project setup with Claude commands"

# Install dependencies
!cd $ARGUMENTS && npm install

# Compile contracts
!cd $ARGUMENTS && npm run compile

# Run initial tests
!cd $ARGUMENTS && npm run test
✅ Initialization Checklist
📋 Final Verification
[ ] ✅ Directory structure created

[ ] ✅ Dependencies installed

[ ] ✅ Hardhat configuration optimized

[ ] ✅ Example contracts compiled

[ ] ✅ Basic tests passing

[ ] ✅ Deployment scripts configured

[ ] ✅ Claude commands copied

[ ] ✅ Git initialized

[ ] ✅ Basic documentation created

[ ] ✅ Environment variables configured

🎯 Next Steps
Customize contracts according to your needs

Write comprehensive tests

Configure CI/CD if necessary

Perform security audit before mainnet

Document specific functionalities

Your project $ARGUMENTS is ready for development with all best practices configured!