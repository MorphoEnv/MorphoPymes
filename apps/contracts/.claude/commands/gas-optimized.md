description: Optimize gas consumption in Solidity contracts
argument-hint: [contract_file.sol]
allowed-tools: Bash(cat:), Bash(grep:)
Analyze and optimize gas consumption of Solidity contract: $ARGUMENTS

⛽ Gas Optimization Analysis
🔍 Identify Common Issues
Storage vs Memory: Review unnecessary storage usage

Packed Structs: Identify packing opportunities

Expensive Loops: Analyze loops that can be optimized

Redundant Operations: Find repetitive calculations

External Calls: Optimize expensive external calls

📈 2024 Optimization Techniques
Use unchecked for safe operations (Solidity 0.8+)

Inline assembly for critical operations

Batch operations for multiple transactions

Proxy patterns to reduce deployment costs

Immutable variables for constants

🛠️ Specific Optimizations
Analyze and suggest improvements for:

Storage Optimization:

Reorder variables for packed storage

Use smaller data types when possible

Eliminate unnecessary state variables

Function Optimization:

Mark functions as pure or view when appropriate

Use calldata instead of memory for parameters

Implement early returns to reduce gas

Loop Optimization:

Cache array.length in loops

Use ++i instead of i++

Consider maximum limits to avoid out-of-gas

📊 Optimization Report
Provides:

Current estimated gas vs optimized gas

Expected savings percentage

Optimized code with explanatory comments

Trade-offs between readability and efficiency

Optimization prioritization by impact

Includes before/after code examples and gas estimates using hardhat-gas-reporter.
