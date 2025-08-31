description: Specific analysis of reentrancy vulnerabilities in Solidity contracts
argument-hint: [contract_file.sol]
allowed-tools: Bash(cat:), Bash(grep:)
Analyze reentrancy vulnerabilities in contract: $ARGUMENTS

🔄 Reentrancy Analysis
🚨 What is Reentrancy?
A reentrancy attack occurs when an external function can be called recursively before the first invocation completes, allowing manipulation of the contract's state.

📍 Vulnerable Patterns to Identify
❌ Classic Reentrancy
// VULNERABLE - The DAO hack pattern
function withdraw(uint \_amount) public {
require(balances[msg.sender] >= \_amount);

    // External call BEFORE state change
    (bool success,) = msg.sender.call{value: _amount}("");
    require(success);

    balances[msg.sender] -= _amount; // ⚠️ State change AFTER external call

}
❌ Cross-Function Reentrancy
// VULNERABLE - Different functions, same state
function withdraw() external {
uint amount = balances[msg.sender];
(bool success,) = msg.sender.call{value: amount}("");
balances[msg.sender] = 0;
}

function transfer(address to, uint amount) external {
require(balances[msg.sender] >= amount); // ⚠️ Can be exploited during withdraw
balances[msg.sender] -= amount;
balances[to] += amount;
}
❌ Read-Only Reentrancy
// VULNERABLE - Price manipulation through reentrancy
function getPrice() external view returns (uint) {
return token.balanceOf(address(this)) \* PRICE_MULTIPLIER;
}

function withdraw() external {
// External call can manipulate balanceOf during execution
(bool success,) = msg.sender.call{value: amount}("");
}
✅ Solutions and Mitigations

1.  Checks-Effects-Interactions Pattern
    // ✅ SECURE - State changes before external calls
    function withdraw(uint \_amount) public {
    require(balances[msg.sender] >= \_amount, "Insufficient balance");
    // Effects: Update state FIRST
    balances[msg.sender] -= \_amount;

        // Interactions: External call LAST
        (bool success,) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

    }

2.  ReentrancyGuard (OpenZeppelin)
    // ✅ RECOMMENDED - Use OpenZeppelin ReentrancyGuard
    import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureContract is ReentrancyGuard {
function withdraw(uint \_amount) public nonReentrant {
require(balances[msg.sender] >= \_amount);

        balances[msg.sender] -= _amount;
        (bool success,) = msg.sender.call{value: _amount}("");
        require(success);
    }

} 3. Mutex Pattern (Manual)
// ✅ ALTERNATIVE - Manual mutex implementation
contract MutexProtected {
bool private locked;

    modifier noReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function withdraw() external noReentrant {
        // Function logic here
    }

} 4. Pull Payment Pattern
// ✅ MOST SECURE - Users withdraw their own funds
contract PullPayment {
mapping(address => uint) public pendingWithdrawals;

    function allowWithdrawal(address payee, uint amount) internal {
        pendingWithdrawals[payee] += amount;
    }

    function withdraw() external {
        uint amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingWithdrawals[msg.sender] = 0;
        (bool success,) = msg.sender.call{value: amount}("");
        require(success);
    }

}
🔍 Automated Analysis
Search for these patterns in the code:

External calls followed by state changes

call(), send(), transfer() before updating variables

External contract calls before state changes

Functions that modify the same state

Multiple functions accessing the same variables

Lack of protection between related functions

View functions that can be manipulated

View functions depending on external state

Price calculations based on manipulable balances

🧪 Reentrancy Testing
Attack Contract for Testing
// Test contract para verificar vulnerabilidades
contract ReentrancyAttacker {
VulnerableContract target;
uint public attackCount;

    constructor(address _target) {
        target = VulnerableContract(_target);
    }

    function attack() external payable {
        target.deposit{value: msg.value}();
        target.withdraw(msg.value);
    }

    receive() external payable {
        if (attackCount < 3) {
            attackCount++;
            target.withdraw(msg.value);
        }
    }

}
📊 Reentrancy Report
For each analyzed function, provide:

Risk level: CRITICAL/HIGH/MEDIUM/LOW/SECURE

Type of reentrancy detected

Specific vulnerable code lines

Corrected code with appropriate solution

Attack test to validate vulnerability

Gas estimation of proposed fix

🎯 Fix Priorities
CRITICAL: Functions handling ETH/tokens with external calls

HIGH: Cross-function reentrancy in related functions

MEDIUM: Read-only reentrancy that can affect prices

LOW: Functions with external calls but no state risk

Include examples of historical exploits (The DAO, Cream Finance) and how they could have been prevented.
