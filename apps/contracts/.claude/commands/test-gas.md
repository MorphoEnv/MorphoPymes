description: Analyze gas consumption in Hardhat tests
argument-hint: [test_file.js or test_directory]
allowed-tools: Bash(npx:hardhat), Bash(npm:), Bash(cat:)
Analyze gas consumption in Hardhat tests: $ARGUMENTS

⛽ Gas Analysis in Tests
🎯 Gas Reporter Configuration
Install and Configure hardhat-gas-reporter
// hardhat.config.js
require("hardhat-gas-reporter");

module.exports = {
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 20, // gwei
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    outputFile: 'gas-report.txt',
    noColors: true,
    reportFormat: 'markdown'
  }
};
Run Tests with Gas Reporting
# Test with detailed gas report
!npx hardhat test --gas-reporter

# Specific test with gas analysis
!npx hardhat test test/MyContract.test.js --gas-reporter

# Generate file report
!REPORT_GAS=true npx hardhat test
📊 Gas Metrics to Analyze
1. Deployment Costs
Target: <2M gas for typical contracts

Critical: >5M gas indicates design problems

Compare with block limit (30M gas)

2. Function Call Costs
Reads: <50k gas typically

Writes: 50k-200k gas depending on complexity

Complex operations: <500k gas maximum

3. Gas por Transacción
describe("Gas Analysis", function() {
  it("should track gas usage", async function() {
    const tx = await contract.expensiveFunction();
    const receipt = await tx.wait();
  
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    expect(receipt.gasUsed).to.be.lt(200000); // Max 200k gas
  });
});
🔍 Detailed Analysis per Function
High Consumption Functions (>100k gas)
// Test para identificar funciones costosas
describe("High Gas Functions", function() {
  let gasUsed = {};

  beforeEach(async function() {
    // Setup inicial
  });

  it("should measure gas for each function", async function() {
    // Medir gas de deployment
    const deployTx = await ContractFactory.deploy();
    const deployReceipt = await deployTx.deployTransaction.wait();
    gasUsed.deployment = deployReceipt.gasUsed;
  
    // Medir gas de funciones críticas
    const tx1 = await contract.criticalFunction1();
    gasUsed.criticalFunction1 = (await tx1.wait()).gasUsed;
  
    const tx2 = await contract.criticalFunction2();
    gasUsed.criticalFunction2 = (await tx2.wait()).gasUsed;
  
    // Reportar resultados
    console.table(gasUsed);
  });
});
Common Optimizations
describe("Gas Optimizations", function() {
  it("should compare optimized vs unoptimized", async function() {
    // Versión no optimizada
    const tx1 = await contract.unoptimizedFunction();
    const gas1 = (await tx1.wait()).gasUsed;
  
    // Versión optimizada
    const tx2 = await contract.optimizedFunction();
    const gas2 = (await tx2.wait()).gasUsed;
  
    const savings = gas1.sub(gas2);
    const percentage = savings.mul(100).div(gas1);
  
    console.log(`Gas savings: ${savings} (${percentage}%)`);
    expect(gas2).to.be.lt(gas1);
  });
});
📈 Benchmarking and Comparisons
Gas Benchmarks by Operation Type
const GAS_BENCHMARKS = {
  // Storage operations
  SSTORE_NEW: 20000,      // Store to new slot
  SSTORE_UPDATE: 5000,    // Update existing slot
  SLOAD: 800,             // Load from storage

  // Memory operations
  MSTORE: 3,              // Store to memory
  MLOAD: 3,               // Load from memory

  // Arithmetic
  ADD: 3,                 // Addition
  MUL: 5,                 // Multiplication
  DIV: 5,                 // Division

  // External calls
  CALL: 700,              // External call base cost
  DELEGATECALL: 700,      // Delegatecall base cost

  // Contract creation
  CREATE: 32000,          // Contract creation
  CREATE2: 32000          // CREATE2 opcode
};
Gas Regression Tests
describe("Gas Regression Tests", function() {
  const EXPECTED_GAS = {
    mint: 65000,
    transfer: 51000,
    approve: 46000,
    burn: 35000
  };

  Object.entries(EXPECTED_GAS).forEach(([func, expectedGas]) => {
    it(`${func} should not exceed ${expectedGas} gas`, async function() {
      const tx = await contract[func](...args);
      const actualGas = (await tx.wait()).gasUsed;
    
      expect(actualGas).to.be.lte(
        expectedGas, 
        `${func} used ${actualGas} gas, expected max ${expectedGas}`
      );
    });
  });
});
🛠️ Analysis Tools
1. Detailed Gas Profiling
// Utility for detailed profiling
class GasProfiler {
  constructor() {
    this.measurements = {};
  }

  async measure(name, txPromise) {
    const tx = await txPromise;
    const receipt = await tx.wait();
    this.measurements[name] = receipt.gasUsed;
    return receipt;
  }

  report() {
    console.table(this.measurements);
    return this.measurements;
  }

  compare(baseline) {
    const comparison = {};
    for (const [name, gas] of Object.entries(this.measurements)) {
      if (baseline[name]) {
        const diff = gas.sub(baseline[name]);
        const percentage = diff.mul(100).div(baseline[name]);
        comparison[name] = {
          current: gas.toString(),
          baseline: baseline[name].toString(),
          diff: diff.toString(),
          percentage: percentage.toString() + '%'
        };
      }
    }
    console.table(comparison);
    return comparison;
  }
}
2. Analysis of Loops and Batch Operations
describe("Batch Operations Gas Analysis", function() {
  it("should analyze gas scaling", async function() {
    const batchSizes = [1, 5, 10, 20, 50];
    const gasResults = {};
  
    for (const size of batchSizes) {
      const addresses = Array(size).fill().map(() => 
        ethers.Wallet.createRandom().address
      );
    
      const tx = await contract.batchTransfer(addresses, amount);
      const gas = (await tx.wait()).gasUsed;
    
      gasResults[size] = {
        total: gas.toString(),
        perItem: gas.div(size).toString()
      };
    }
  
    console.table(gasResults);
  
    // Verificar que el gas por item se mantenga constante
    const gasPerItem = Object.values(gasResults).map(r => 
      parseInt(r.perItem)
    );
    const avgGasPerItem = gasPerItem.reduce((a, b) => a + b) / gasPerItem.length;
  
    gasPerItem.forEach(gas => {
      expect(Math.abs(gas - avgGasPerItem)).to.be.lt(avgGasPerItem * 0.1);
    });
  });
});
📊 Reports and Visualization
Generate Complete Report
// Script to generate complete gas report
async function generateGasReport() {
  const report = {
    timestamp: new Date().toISOString(),
    network: hre.network.name,
    gasPrice: await ethers.provider.getGasPrice(),
    contracts: {},
    summary: {}
  };

  // Analizar cada contrato
  for (const contractName of contractNames) {
    const contract = await deployContract(contractName);
    report.contracts[contractName] = await analyzeContract(contract);
  }

  // Generar resumen
  report.summary = generateSummary(report.contracts);

  // Guardar reporte
  fs.writeFileSync('gas-analysis-report.json', JSON.stringify(report, null, 2));

  return report;
}
🎯 Recommended Optimizations
For Functions >200k Gas:
Review loops - Implement limits and pagination

Optimize storage - Use packed structs

Reduce external calls - Batch operations

Use assembly for critical operations

For Deployment >3M Gas:
Separate into multiple contracts

Use proxy patterns

Remove unused code

Optimize constructor

📈 Performance Metrics
Provide report with:

Total gas per function with historical comparisons

Most expensive functions ranked

Specific optimization opportunities

Economic impact at current gas prices

Prioritized refactoring recommendations

Include trend graphs and comparisons with similar contracts from the ecosystem.