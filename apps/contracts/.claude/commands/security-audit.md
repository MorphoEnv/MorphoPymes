description: Perform comprehensive security audit on Solidity contracts
argument-hint: [contract_file.sol or directory]
allowed-tools: Bash(find:), Bash(grep:), Bash(cat:*)
Perform comprehensive security audit on Solidity contract: $ARGUMENTS

Analyze the following critical security aspects:

🔒 Critical Vulnerabilities
Reentrancy Attacks: Look for patterns of external calls followed by state changes

Integer Overflow/Underflow: Verify use of SafeMath or Solidity 0.8+

Access Control: Review onlyOwner modifiers, roles and permissions

Front-running: Identify transactions vulnerable to MEV

Flash Loan Attacks: Analyze price manipulation and liquidity issues

🛡️ 2024 Best Practices
Use of updated OpenZeppelin contracts

Implementation of ReentrancyGuard

Input validation with require/revert

Events for all critical actions

Appropriate gas limits and timeouts

📊 Gas Optimization
Identify unnecessary expensive operations

Suggest use of packed structs

Review loops that may cause out-of-gas

Analyze storage vs memory usage

🔍 Code Analysis
Examine code line by line and provide:

List of vulnerabilities found (CRITICAL/HIGH/MEDIUM/LOW)

Specific correction recommendations

Example code for fixes

Overall security score (1-10)

Include references to similar audits and known exploit cases when relevant.