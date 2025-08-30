description: Analyze test coverage in Hardhat project
argument-hint: [project_directory or test_file]
allowed-tools: Bash(npx:hardhat), Bash(npm:), Bash(find:), Bash(cat:*)
Analyze test coverage in Hardhat project: $ARGUMENTS

📊 Test Coverage Analysis
🎯 Target: Minimum 90% Coverage
Run Coverage Analysis
# Install solidity-coverage if not installed
!npm install --save-dev solidity-coverage

# Run coverage analysis
!npx hardhat coverage

# Generate detailed report
!npx hardhat coverage --testfiles "test/**/*.js"
📈 Key Metrics to Analyze
1. Statement Coverage
Target: >95% for critical contracts

Minimum: >90% for all contracts

Identify code lines not executed in tests

2. Branch Coverage
Target: >90% for conditional logic

Verify all if/else branches are tested

Include edge cases and boundary conditions

3. Function Coverage
Target: 100% for public/external functions

All functions should have at least one test

Include emergency and admin functions

4. Line Coverage
Target: >95% lines executed

Identify dead or unreachable code

Prioritize critical security lines

🔍 Detailed Analysis per Contract
For each contract, review:

Uncovered Functions
// Example of missing test
describe("Emergency Functions", function() {
  it("should pause contract in emergency", async function() {
    await expect(contract.emergencyPause())
      .to.emit(contract, "EmergencyPause");
  });
});
Untested Branches
// Test for all conditional branches
it("should handle edge cases", async function() {
  // Test normal case
  await contract.normalCase();

  // Test edge case
  await expect(contract.edgeCase())
    .to.be.revertedWith("Edge case error");
});
Uncovered Edge Cases
Boundary values (0, max uint256, etc.)

Error conditions and reverts

Invalid contract states

External contract interactions

🧪 Recommended Test Types
Unit Tests (70% del coverage)
describe("Token Transfer", function() {
  it("should transfer tokens correctly", async function() {
    const amount = ethers.utils.parseEther("100");
    await token.transfer(recipient.address, amount);
  
    expect(await token.balanceOf(recipient.address))
      .to.equal(amount);
  });
});
Integration Tests (20% del coverage)
describe("DeFi Protocol Integration", function() {
  it("should interact with external protocols", async function() {
    // Test complete interaction between contracts
    await protocol.deposit(amount);
    await protocol.stake();
    await protocol.harvest();
  });
});
Fuzzing Tests (10% del coverage)
// Using @foundry-rs/hardhat-forge for fuzzing
describe("Fuzz Tests", function() {
  it("should handle random inputs", async function() {
    // Test with random inputs
    for(let i = 0; i < 100; i++) {
      const randomAmount = Math.floor(Math.random() * 1000000);
      // Test logic here
    }
  });
});
📋 Coverage Checklist
Critical Functions (100% coverage required):

[ ] Token/ETH transfer functions

[ ] Mint/burn functions

[ ] Administrative access functions

[ ] Emergency functions (pause/unpause)

[ ] Contract upgrade functions

Edge Cases (Mandatory):

[ ] Transfers with insufficient balance

[ ] Operations with zero values

[ ] Operations with maximum values

[ ] Calls from unauthorized addresses

[ ] Paused/unpaused contract states

Error Scenarios:

[ ] All require() statements

[ ] All revert() with specific messages

[ ] Overflow/underflow conditions

[ ] Reentrancy attempts

[ ] Gas limit scenarios

📊 Coverage Report
Generate HTML Report
!npx hardhat coverage --reporter html
# Open coverage/index.html for visual report
CI/CD Integration
# GitHub Actions example
- name: Run Coverage
  run: |
    npx hardhat coverage
    npx codecov -f coverage/lcov.info
🎯 Recommended Improvements
For Coverage <90%:

Identify critical gaps in security functions

Prioritize tests by risk impact

Create specific tests for uncovered code

Refactor unreachable code if necessary

For Coverage >90%:

Optimize existing tests for better performance

Add property-based testing

Implement mutation testing

Document covered edge cases

📈 Quality Metrics
Provide report with:

Coverage percentage per contract

Untested functions listed by priority

Uncovered branches with test examples

Specific recommendations to improve coverage

Time estimation to reach 90%+ coverage

Include comparison with industry benchmarks and similar projects.