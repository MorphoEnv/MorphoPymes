description: Deploy contracts to test networks (testnet)
argument-hint: [network_name] (sepolia, goerli, mumbai, etc.)
allowed-tools: Bash(npx:hardhat), Bash(cat:), Bash(echo:)
Deploy contracts to testnet: $ARGUMENTS

🚀 Testnet Deployment
🌐 Available Test Networks
Ethereum Testnets
Sepolia (Recommended) - Proof of Stake testnet

Goerli (Deprecated) - Will be discontinued

Holesky - New testnet for validators

L2 Testnets
Arbitrum Sepolia - Arbitrum testnet

Optimism Sepolia - Optimism testnet

Polygon Mumbai - Polygon testnet

Base Sepolia - Base testnet

⚙️ Network Configuration
Configure hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
solidity: {
version: "0.8.19",
settings: {
optimizer: {
enabled: true,
runs: 200
}
}
},
networks: {
sepolia: {
url: process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/YOUR_KEY",
accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
gasPrice: 20000000000, // 20 gwei
gas: 6000000
},
mumbai: {
url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
gasPrice: 20000000000
},
arbitrumSepolia: {
url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
gasPrice: 100000000 // 0.1 gwei
}
},
etherscan: {
apiKey: {
sepolia: process.env.ETHERSCAN_API_KEY,
polygonMumbai: process.env.POLYGONSCAN_API_KEY,
arbitrumSepolia: process.env.ARBISCAN_API_KEY
}
}
};
🔐 Security Configuration
Environment Variables (.env)

# RPC URLs

SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# Private Keys (NEVER commit to repo)

PRIVATE_KEY=0x...your_private_key_here

# API Keys for verification

ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key

# Deployment configuration

DEPLOY_GAS_LIMIT=6000000
DEPLOY_GAS_PRICE=20000000000
📝 Script de Deployment
scripts/deploy-testnet.js
const { ethers, network } = require("hardhat");
const fs = require("fs");

async function main() {
console.log(`🚀 Deploying to ${network.name}...`);

// Get deployer account
const [deployer] = await ethers.getSigners();
console.log("Deploying with account:", deployer.address);

// Verify balance
const balance = await deployer.getBalance();
console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

if (balance.lt(ethers.utils.parseEther("0.01"))) {
throw new Error("❌ Insufficient balance for deployment");
}

// Deploy contracts
const deployments = {};

// 1. Deploy Token Contract
console.log("\n📄 Deploying Token...");
const Token = await ethers.getContractFactory("MyToken");
const token = await Token.deploy(
"Test Token",
"TEST",
ethers.utils.parseEther("1000000")
);
await token.deployed();

console.log("✅ Token deployed to:", token.address);
deployments.token = {
address: token.address,
txHash: token.deployTransaction.hash,
gasUsed: (await token.deployTransaction.wait()).gasUsed.toString()
};

// 2. Deploy Exchange Contract
console.log("\n🏪 Deploying Exchange...");
const Exchange = await ethers.getContractFactory("Exchange");
const exchange = await Exchange.deploy(token.address);
await exchange.deployed();

console.log("✅ Exchange deployed to:", exchange.address);
deployments.exchange = {
address: exchange.address,
txHash: exchange.deployTransaction.hash,
gasUsed: (await exchange.deployTransaction.wait()).gasUsed.toString()
};

// 3. Initialize contracts
console.log("\n⚙️ Initializing contracts...");

// Approve exchange to spend tokens
const approveTx = await token.approve(
exchange.address,
ethers.utils.parseEther("100000")
);
await approveTx.wait();
console.log("✅ Exchange approved for token spending");

// Add initial liquidity
const liquidityTx = await exchange.addLiquidity(
ethers.utils.parseEther("1000"),
{ value: ethers.utils.parseEther("1") }
);
await liquidityTx.wait();
console.log("✅ Initial liquidity added");

// Save deployment info
const deploymentInfo = {
network: network.name,
chainId: network.config.chainId,
deployer: deployer.address,
timestamp: new Date().toISOString(),
contracts: deployments,
gasUsed: Object.values(deployments)
.reduce((total, contract) => total + parseInt(contract.gasUsed), 0)
};

const filename = `deployments/${network.name}-${Date.now()}.json`;
fs.mkdirSync("deployments", { recursive: true });
fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));

console.log(`\n📋 Deployment info saved to: ${filename}`);
console.log("\n🎉 Deployment completed successfully!");

// Verification instructions
console.log("\n🔍 To verify contracts, run:");
console.log(`npx hardhat verify --network ${network.name} ${token.address} "Test Token" "TEST" "1000000000000000000000000"`);
console.log(`npx hardhat verify --network ${network.name} ${exchange.address} ${token.address}`);
}

main()
.then(() => process.exit(0))
.catch((error) => {
console.error("❌ Deployment failed:", error);
process.exit(1);
});
🚀 Deployment Commands
Deploy to Specific Network

# Deploy a Sepolia

!npx hardhat run scripts/deploy-testnet.js --network sepolia

# Deploy a Mumbai (Polygon)

!npx hardhat run scripts/deploy-testnet.js --network mumbai

# Deploy a Arbitrum Sepolia

!npx hardhat run scripts/deploy-testnet.js --network arbitrumSepolia

# Deploy with specific gas price

!npx hardhat run scripts/deploy-testnet.js --network sepolia --gas-price 25000000000
🔍 Post-Deployment Verification
Verification Checklist
// scripts/verify-deployment.js
async function verifyDeployment(contractAddress, network) {
console.log(`🔍 Verifying deployment on ${network}...`);

// 1. Verify contract exists
const code = await ethers.provider.getCode(contractAddress);
if (code === "0x") {
throw new Error("❌ Contract not found at address");
}
console.log("✅ Contract code exists");

// 2. Verify basic functions
const contract = await ethers.getContractAt("MyToken", contractAddress);

const name = await contract.name();
const symbol = await contract.symbol();
const totalSupply = await contract.totalSupply();

console.log("📋 Contract Info:");
console.log("- Name:", name);
console.log("- Symbol:", symbol);
console.log("- Total Supply:", ethers.utils.formatEther(totalSupply));

// 3. Verify ownership
try {
const owner = await contract.owner();
console.log("- Owner:", owner);
} catch (error) {
console.log("- No owner function found");
}

console.log("✅ Deployment verification completed");
}
💰 Gas and Cost Management
Cost Estimation
async function estimateDeploymentCost() {
const gasPrice = await ethers.provider.getGasPrice();
console.log("Current gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");

// Estimate gas for each contract
const Token = await ethers.getContractFactory("MyToken");
const tokenGas = await Token.signer.estimateGas(
Token.getDeployTransaction("Test Token", "TEST", ethers.utils.parseEther("1000000"))
);

const tokenCost = tokenGas.mul(gasPrice);
console.log("Token deployment cost:", ethers.utils.formatEther(tokenCost), "ETH");

return tokenCost;
}
🛡️ Testnet Best Practices
Pre-Deployment Checklist
[ ] ✅ Contracts compiled without warnings

[ ] ✅ Tests passing 100%

[ ] ✅ Security audit completed

[ ] ✅ Gas optimization verified

[ ] ✅ Environment variables configured

[ ] ✅ Sufficient balance in deployer account

[ ] ✅ RPC endpoint working

[ ] ✅ Etherscan API key configured

Post-Deployment Checklist
[ ] ✅ Contracts verified in explorer

[ ] ✅ Basic functions tested

[ ] ✅ Ownership transferred if necessary

[ ] ✅ Deployment info saved

[ ] ✅ Frontend updated with new addresses

[ ] ✅ Integration tests executed

[ ] ✅ Documentation updated

📊 Monitoring and Logs
Deployment Tracking

# View deployment logs

!tail -f deployments/sepolia-latest.log

# Check transaction status

!npx hardhat run scripts/check-tx-status.js --network sepolia

# Monitor gas prices

!npx hardhat run scripts/gas-tracker.js --network sepolia
🎯 Common Troubleshooting
❌ Frequent Errors
"Insufficient funds for gas"

Check deployer account balance

Reduce gas price or gas limit

Use faucet to obtain test ETH

"Nonce too low"

Reset nonce: await ethers.provider.send("hardhat_reset")

Check pending transactions

"Contract creation code storage out of gas"

Enable optimizer in hardhat.config.js

Reduce contract size

Use proxy patterns for large contracts

Execute deployment on the specified network with all security validations and save deployment information for future reference.
