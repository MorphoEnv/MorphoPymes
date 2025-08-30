description: Debug failed transactions in Hardhat
argument-hint: [transaction_hash or test_name]
allowed-tools: Bash(npx:hardhat), Bash(cat:), Bash(grep:)
Debug failed transaction in Hardhat: $ARGUMENTS

🐛 Transaction Debugging
🔍 Initial Transaction Information
Get Transaction Details
// In test or debugging script
const txHash = "$ARGUMENTS";
const tx = await ethers.provider.getTransaction(txHash);
const receipt = await ethers.provider.getTransactionReceipt(txHash);

console.log("Transaction Details:");
console.log("- Hash:", tx.hash);
console.log("- From:", tx.from);
console.log("- To:", tx.to);
console.log("- Value:", ethers.utils.formatEther(tx.value));
console.log("- Gas Limit:", tx.gasLimit.toString());
console.log("- Gas Price:", ethers.utils.formatUnits(tx.gasPrice, "gwei"), "gwei");
console.log("- Status:", receipt.status === 1 ? "SUCCESS" : "FAILED");
console.log("- Gas Used:", receipt.gasUsed.toString());
🚨 Common Error Types
1. Revert with Message
// Error: VM Exception while processing transaction: revert Custom error message
describe("Debug Revert Messages", function() {
  it("should catch and analyze revert", async function() {
    try {
      await contract.functionThatReverts();
    } catch (error) {
      console.log("Revert reason:", error.reason);
      console.log("Error code:", error.code);
      console.log("Transaction:", error.transaction);
    
      // Analyze the specific error
      if (error.reason.includes("Insufficient balance")) {
        console.log("💡 Solution: Check user balance before transaction");
      }
    }
  });
});
2. Out of Gas
// Error: Transaction ran out of gas
describe("Debug Gas Issues", function() {
  it("should analyze gas consumption", async function() {
    // Estimate required gas
    const gasEstimate = await contract.estimateGas.expensiveFunction();
    console.log("Estimated gas:", gasEstimate.toString());
  
    // Execute with sufficient gas
    const tx = await contract.expensiveFunction({
      gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
    });
  
    const receipt = await tx.wait();
    console.log("Actual gas used:", receipt.gasUsed.toString());
    console.log("Gas efficiency:", receipt.gasUsed.mul(100).div(gasEstimate).toString() + "%");
  });
});
3. Require/Assert Failures
// Debugging require statements
describe("Debug Require Failures", function() {
  it("should identify failed requirements", async function() {
    // Test each require individually
    const balance = await token.balanceOf(user.address);
    const allowance = await token.allowance(user.address, spender.address);
    const amount = ethers.utils.parseEther("100");
  
    console.log("Pre-transaction state:");
    console.log("- User balance:", ethers.utils.formatEther(balance));
    console.log("- Allowance:", ethers.utils.formatEther(allowance));
    console.log("- Transfer amount:", ethers.utils.formatEther(amount));
  
    // Verify conditions manually
    if (balance.lt(amount)) {
      console.log("❌ Insufficient balance");
    }
    if (allowance.lt(amount)) {
      console.log("❌ Insufficient allowance");
    }
  });
});
🛠️ Debugging Tools
1. Console.log in Contracts
// In the Solidity contract
import "hardhat/console.sol";

contract DebuggableContract {
    function problematicFunction(uint256 amount) external {
        console.log("Function called with amount:", amount);
        console.log("Sender balance:", balances[msg.sender]);
        console.log("Contract balance:", address(this).balance);
      
        require(balances[msg.sender] >= amount, "Insufficient balance");
      
        console.log("Requirement passed, proceeding...");
        // Rest of function logic
    }
}
2. Hardhat Network Tracing
// Enable detailed tracing
describe("Transaction Tracing", function() {
  it("should trace transaction execution", async function() {
    // Execute with tracing enabled
    await network.provider.send("hardhat_setLoggingEnabled", [true]);
  
    const tx = await contract.problematicFunction(amount);
    const receipt = await tx.wait();
  
    // Get complete trace
    const trace = await network.provider.send("debug_traceTransaction", [
      tx.hash,
      { tracer: "callTracer" }
    ]);
  
    console.log("Transaction trace:", JSON.stringify(trace, null, 2));
  });
});
3. Detailed Stack Traces
// Configure stack traces in hardhat.config.js
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: false // Disable for better debugging
      }
    }
  },
  networks: {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      blockGasLimit: 0x1fffffffffffff
    }
  }
};
🔬 Step-by-Step Analysis
Debugging Workflow
class TransactionDebugger {
  constructor(provider) {
    this.provider = provider;
  }

  async debugTransaction(txHash) {
    console.log("🔍 Starting transaction debug...");
  
    // 1. Get basic information
    const tx = await this.provider.getTransaction(txHash);
    const receipt = await this.provider.getTransactionReceipt(txHash);
  
    console.log("📋 Transaction Info:");
    this.logTransactionInfo(tx, receipt);
  
    // 2. Analyze pre-transaction state
    console.log("📊 Pre-transaction State:");
    await this.analyzePreState(tx);
  
    // 3. Simulate the transaction
    console.log("🎭 Transaction Simulation:");
    await this.simulateTransaction(tx);
  
    // 4. Analyze logs and events
    console.log("📝 Events and Logs:");
    this.analyzeLogs(receipt);
  
    // 5. Suggest solutions
    console.log("💡 Suggested Solutions:");
    this.suggestSolutions(receipt);
  }

  logTransactionInfo(tx, receipt) {
    console.table({
      "Hash": tx.hash,
      "Status": receipt.status === 1 ? "✅ SUCCESS" : "❌ FAILED",
      "Gas Limit": tx.gasLimit.toString(),
      "Gas Used": receipt.gasUsed.toString(),
      "Gas Price": ethers.utils.formatUnits(tx.gasPrice, "gwei") + " gwei",
      "Value": ethers.utils.formatEther(tx.value) + " ETH"
    });
  }

  async analyzePreState(tx) {
    // Analyze sender balance
    const balance = await this.provider.getBalance(tx.from, tx.blockNumber - 1);
    console.log("Sender balance:", ethers.utils.formatEther(balance), "ETH");
  
    // Analyze nonce
    const nonce = await this.provider.getTransactionCount(tx.from, tx.blockNumber - 1);
    console.log("Expected nonce:", nonce, "Actual nonce:", tx.nonce);
  }

  async simulateTransaction(tx) {
    try {
      // Simulate the transaction in previous state
      const result = await this.provider.call(tx, tx.blockNumber - 1);
      console.log("✅ Simulation successful");
    } catch (error) {
      console.log("❌ Simulation failed:", error.reason || error.message);
      this.analyzeError(error);
    }
  }

  analyzeLogs(receipt) {
    if (receipt.logs.length === 0) {
      console.log("No events emitted");
      return;
    }
  
    receipt.logs.forEach((log, index) => {
      console.log(`Event ${index + 1}:`, {
        address: log.address,
        topics: log.topics,
        data: log.data
      });
    });
  }

  analyzeError(error) {
    const errorPatterns = {
      "insufficient funds": "💰 Increase account balance",
      "gas required exceeds allowance": "⛽ Increase gas limit",
      "nonce too low": "🔢 Check transaction nonce",
      "replacement transaction underpriced": "💸 Increase gas price",
      "execution reverted": "🔄 Check contract requirements"
    };
  
    const errorMessage = error.message.toLowerCase();
    for (const [pattern, solution] of Object.entries(errorPatterns)) {
      if (errorMessage.includes(pattern)) {
        console.log("Identified issue:", pattern);
        console.log("Suggested solution:", solution);
        break;
      }
    }
  }

  suggestSolutions(receipt) {
    if (receipt.status === 0) {
      console.log("🔧 General debugging steps:");
      console.log("1. Check require/assert conditions");
      console.log("2. Verify function parameters");
      console.log("3. Ensure sufficient gas limit");
      console.log("4. Check contract state prerequisites");
      console.log("5. Validate external contract interactions");
    }
  }
}
🧪 Debugging Tests
Test Suite for Problematic Cases
describe("Debug Common Issues", function() {
  let debugger;

  beforeEach(async function() {
    debugger = new TransactionDebugger(ethers.provider);
  });

  it("should debug insufficient balance", async function() {
    // Create insufficient balance scenario
    const poorUser = ethers.Wallet.createRandom().connect(ethers.provider);
  
    try {
      await contract.connect(poorUser).expensiveFunction({
        value: ethers.utils.parseEther("1000") // More than available
      });
    } catch (error) {
      console.log("Expected error caught:", error.reason);
      // Analyze and suggest solution
    }
  });

  it("should debug access control", async function() {
    const unauthorizedUser = ethers.Wallet.createRandom().connect(ethers.provider);
  
    try {
      await contract.connect(unauthorizedUser).onlyOwnerFunction();
    } catch (error) {
      console.log("Access control working:", error.reason);
      console.log("💡 Solution: Use authorized account or grant permissions");
    }
  });
});
📊 Debugging Report
For each debugged transaction, provide:

Transaction status (successful/failed)

Root cause of the problem identified

Specific steps to reproduce the error

Recommended solution with code example

Preventive tests to avoid the problem in the future

Gas impact and costs of the solution

🎯 Error Prevention
Implement preventive checks:

Parameter validation before transactions

Automatic gas estimation

Balance and allowance verification

Regression tests for known errors

Includes automated tools for continuous debugging and early alerts.