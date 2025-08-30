Rules for Solidity Code Generation

1. Security as the Absolute Priority
   Prevent Reentrancy: Always use OpenZeppelin's ReentrancyGuard on any function that performs an external ETH or token transfer. For Ether transfers, use the call method with the "checks-effects-interactions" pattern.

Thorough Validation: Every public or external function must start with require() statements to validate msg.sender, contract state, and input parameters. Never assume input data is valid.

Access Control: Use modifiers like onlyOwner, onlyMinter, or OpenZeppelin's AccessControl to restrict who can call critical functions.

2. Efficiency and Optimization
   Minimize Storage Writes: Reading from and writing to storage is expensive. Prioritize calculations in memory and only save to storage when absolutely necessary.

Variable Packing: To save gas, group small storage variables (uint8, bool) within structs so the compiler can pack them into a single 256-bit slot.

Cautious Iterations: Avoid loops (for, while) that depend on a variable or large amount of data in storage, as they can cause transactions to run out of gas. Instead, use mappings and process data individually.

3. Readability and Maintainability
   Descriptive Naming: Use clear and self-explanatory function and variable names, like totalRaised instead of tr and invest() instead of i().

NatSpec Comments: Include detailed NatSpec comments for all public functions and variables. Describe the function's purpose, its parameters (@param), what it returns (@return), and any require conditions (@dev).

Event Emission: Emit an event for every significant state change in the contract. This is essential for off-chain monitoring and building the user interface.

Rules for Hardhat Test Creation

1. Exhaustive Coverage
   Happy Path: Write tests that verify functions work as expected when all input parameters are valid.

Sad Path: Create a test for every require() and revert statement in the code. Ensure that functions fail with the expected error message when conditions aren't met.

Edge Cases: Test extreme values, such as the minimum or maximum investment amount, the end of the deadline, and the interaction of multiple users.

2. Structure and Organization
   Describe & It Blocks: Organize tests logically using describe to group functions or modules and it to describe a specific test case.

Fixtures: Use Hardhat Fixtures to deploy your contract to a clean, initial state before each test. This ensures that tests are independent and repeatable.

Before Each Test: Use beforeEach to reset the blockchain state and contract deployments. This ensures every test runs from a known, clean state.

3. Tools and Language
   Chai and Waffle: Use the Chai library with the Waffle plugin for clear and expressive assertions (e.g., expect(await contract.balanceOf(owner.address)).to.equal(expectedAmount)).

Solidity-Coverage: Use the solidity-coverage plugin to generate a report showing which lines of your code have been covered by tests. Aim for over 95% coverage.

rules-coding-style.md
Code Style and Formatting Guide

1. Naming Conventions
   Contracts & Libraries: Use PascalCase (e.g., MyContract.sol).

Functions & Variables: Use camelCase (e.g., myFunction(), myVariable).

Immutable/Constant Variables: Use UPPER_CASE_SNAKE (e.g., MAX_SUPPLY).

2. Code Formatting
   Indentation: Use 4 spaces for indentation.

Line Breaks: Include a blank line between variable declarations, functions, and structs.

Spacing: Use a single space after commas and around operators (+, -, =, ==, etc.).

3. Tooling
   Prettier & Solhint: The project must use Prettier and Solhint for automatic formatting and linting. The AI agent must adhere to the rules defined in the project's .prettierrc and .solhint.json configuration files.

Variable Types: Always specify the variable type (uint256, address, bytes32, etc.). Avoid using var.

rules-project-structure.md
Project Directory Structure Rules

1. Code Organization
   contracts/: All contract files (.sol) must reside here.

contracts/mocks/: Mock contracts for simulating external dependencies.

contracts/interfaces/: Interface files (.sol) for interacting with other contracts.

test/: All test files (.js or .ts) belong in this folder.

test/fixtures/: Hardhat scripts to set up the blockchain state.

test/integration/: Tests that verify interactions between multiple contracts.

test/utils/: Helper functions for tests.

scripts/: Hardhat scripts for development, deployment, and automation tasks.

scripts/deploy/: Scripts for contract deployment.

docs/: Relevant project documentation.

2. Configuration Files
   hardhat.config.ts: The main Hardhat configuration file.

.env: Sensitive environment variables (private keys, API URLs).

package.json: Project dependencies and scripts.

.solhint.json & .prettierrc: Configuration files for linting and formatting tools.
