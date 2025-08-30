description: Run Hardhat tests with different configurations
argument-hint: [test_pattern or configuration]
allowed-tools: Bash(npx:hardhat), Bash(npm:), Bash(find:)
Run Hardhat tests with optimized configuration: $ARGUMENTS

🧪 Hardhat Test Execution
🚀 Basic Testing Commands
Standard Tests
# Ejecutar todos los tests
!npx hardhat test

# Ejecutar tests específicos
!npx hardhat test test/MyContract.test.js

# Ejecutar tests con patrón
!npx hardhat test --grep "transfer"

# Tests con network específica
!npx hardhat test --network localhost
Tests con Configuraciones Avanzadas
# Tests con gas reporter
!REPORT_GAS=true npx hardhat test

# Tests con coverage
!npx hardhat coverage

# Tests en modo verbose
!npx hardhat test --verbose

# Tests con timeout extendido
!npx hardhat test --timeout 60000
⚙️ Configuraciones de Test
Configuración Optimizada en hardhat.config.js
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
    hardhat: {
      // Configuración para tests
      blockGasLimit: 30000000,
      gasPrice: 20000000000, // 20 gwei
      initialBaseFeePerGas: 0,
      accounts: {
        count: 20, // Más cuentas para tests complejos
        accountsBalance: "10000000000000000000000" // 10k ETH cada una
      },
      // Forking para tests con mainnet
      forking: process.env.MAINNET_FORK ? {
        url: process.env.MAINNET_RPC_URL,
        blockNumber: parseInt(process.env.FORK_BLOCK_NUMBER)
      } : undefined
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      timeout: 60000
    }
  },
  mocha: {
    timeout: 60000, // 60 segundos timeout
    reporter: 'spec',
    slow: 2000
  }
};
🎯 Estrategias de Testing
1. Tests por Categorías
# Tests de unidad (rápidos)
!npx hardhat test test/unit/ --timeout 30000

# Tests de integración (lentos)
!npx hardhat test test/integration/ --timeout 120000

# Tests de seguridad
!npx hardhat test test/security/ --grep "security|audit|vulnerability"

# Tests de gas optimization
!npx hardhat test test/gas/ --reporter gas
2. Tests Paralelos
// Configurar tests paralelos en package.json
{
  "scripts": {
    "test:parallel": "hardhat test --parallel",
    "test:unit": "hardhat test test/unit/",
    "test:integration": "hardhat test test/integration/",
    "test:security": "hardhat test test/security/",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:security"
  }
}
🔧 Setup de Test Environment
Configuración de Fixtures
// test/fixtures/deployments.js
const { deployments } = require("hardhat");

async function deployContractsFixture() {
  // Deploy todos los contratos necesarios
  await deployments.fixture(["Token", "Exchange", "Governance"]);

  const token = await ethers.getContract("Token");
  const exchange = await ethers.getContract("Exchange");
  const governance = await ethers.getContract("Governance");

  // Setup inicial
  await token.mint(owner.address, ethers.utils.parseEther("1000000"));
  await exchange.initialize(token.address);

  return { token, exchange, governance };
}

module.exports = { deployContractsFixture };
Helper Functions para Tests
// test/helpers/utils.js
const { expect } = require("chai");

class TestUtils {
  static async expectRevert(promise, expectedError) {
    try {
      await promise;
      expect.fail("Expected transaction to revert");
    } catch (error) {
      expect(error.message).to.include(expectedError);
    }
  }

  static async getGasUsed(tx) {
    const receipt = await tx.wait();
    return receipt.gasUsed;
  }

  static async increaseTime(seconds) {
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
  }

  static async snapshot() {
    return await network.provider.send("evm_snapshot");
  }

  static async revert(snapshotId) {
    await network.provider.send("evm_revert", [snapshotId]);
  }

  static formatGas(gasUsed) {
    return `${gasUsed.toString()} gas (${ethers.utils.formatUnits(gasUsed.mul(20), "gwei")} gwei @ 20 gwei)`;
  }
}

module.exports = { TestUtils };
📊 Test Reporting
Custom Test Reporter
// test/reporters/custom-reporter.js
class CustomReporter {
  constructor(runner) {
    this.stats = {
      passes: 0,
      failures: 0,
      gasUsed: {},
      duration: 0
    };
  
    runner.on('pass', (test) => {
      this.stats.passes++;
      if (test.gasUsed) {
        this.stats.gasUsed[test.title] = test.gasUsed;
      }
    });
  
    runner.on('fail', (test) => {
      this.stats.failures++;
    });
  
    runner.on('end', () => {
      this.generateReport();
    });
  }

  generateReport() {
    console.log("\n📊 Test Summary:");
    console.log(`✅ Passed: ${this.stats.passes}`);
    console.log(`❌ Failed: ${this.stats.failures}`);
  
    if (Object.keys(this.stats.gasUsed).length > 0) {
      console.log("\n⛽ Gas Usage:");
      console.table(this.stats.gasUsed);
    }
  }
}

module.exports = CustomReporter;
🔄 Continuous Testing
Watch Mode para Desarrollo
# Instalar nodemon para watch mode
!npm install --save-dev nodemon

# Script para watch tests
!npx nodemon --watch contracts --watch test --ext sol,js --exec "npx hardhat test"
Pre-commit Hooks
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:quick && npm run lint",
      "pre-push": "npm run test:all"
    }
  },
  "scripts": {
    "test:quick": "hardhat test test/unit/ --timeout 30000",
    "test:all": "hardhat test --timeout 120000",
    "lint": "solhint contracts/**/*.sol"
  }
}
🧪 Test Patterns Avanzados
Property-Based Testing
describe("Property-Based Tests", function() {
  it("should maintain invariants", async function() {
    // Generar inputs aleatorios
    for (let i = 0; i < 100; i++) {
      const randomAmount = Math.floor(Math.random() * 1000000);
      const randomUser = accounts[Math.floor(Math.random() * accounts.length)];
    
      // Test invariant: total supply should never change unexpectedly
      const totalSupplyBefore = await token.totalSupply();
    
      try {
        await token.connect(randomUser).transfer(accounts[0].address, randomAmount);
      } catch (error) {
        // Expected failures are OK
      }
    
      const totalSupplyAfter = await token.totalSupply();
      expect(totalSupplyAfter).to.equal(totalSupplyBefore);
    }
  });
});
Fuzzing Tests
describe("Fuzzing Tests", function() {
  it("should handle edge cases", async function() {
    const edgeCases = [
      0,
      1,
      ethers.constants.MaxUint256,
      ethers.utils.parseEther("0.000000000000000001"),
      ethers.utils.parseEther("1000000000")
    ];
  
    for (const amount of edgeCases) {
      try {
        await contract.handleAmount(amount);
        console.log(`✅ Handled amount: ${amount.toString()}`);
      } catch (error) {
        console.log(`⚠️ Failed with amount ${amount.toString()}: ${error.reason}`);
      }
    }
  });
});
📈 Performance Testing
Load Testing
describe("Performance Tests", function() {
  it("should handle high transaction volume", async function() {
    const batchSize = 100;
    const transactions = [];
  
    console.log(`🚀 Starting load test with ${batchSize} transactions...`);
    const startTime = Date.now();
  
    // Crear batch de transacciones
    for (let i = 0; i < batchSize; i++) {
      transactions.push(
        contract.quickFunction(i, { gasLimit: 100000 })
      );
    }
  
    // Ejecutar todas en paralelo
    const results = await Promise.allSettled(transactions);
    const endTime = Date.now();
  
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
  
    console.log(`📊 Results: ${successful} successful, ${failed} failed`);
    console.log(`⏱️ Duration: ${endTime - startTime}ms`);
    console.log(`📈 TPS: ${(successful / (endTime - startTime) * 1000).toFixed(2)}`);
  });
});
🎯 Best Practices for Testing
✅ Testing Checklist
[ ] Unit tests for all public functions

[ ] Integration tests for complete flows

[ ] Security tests for known vulnerabilities

[ ] Gas optimization tests for critical functions

[ ] Edge case tests for boundary values

[ ] Error handling tests for all reverts

[ ] Event emission tests for important logs

[ ] Access control tests for permissions

📋 Recommended Structure
test/
├── unit/           # Individual function tests
├── integration/    # Complete flow tests
├── security/       # Vulnerability tests
├── gas/           # Gas optimization tests
├── fixtures/      # Reusable configurations
├── helpers/       # Test utilities
└── mocks/         # Mock contracts for testing
Execute tests with specified configuration and provide detailed report of results, gas usage, and improvement recommendations.