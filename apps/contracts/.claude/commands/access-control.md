description: Review and improve access control in Solidity contracts
argument-hint: [contract_file.sol]
allowed-tools: Bash(cat:), Bash(grep:)
Analyze access control of Solidity contract: $ARGUMENTS

🔐 Access Control Analysis
🎯 Access Patterns to Review

1. Ownable Pattern
   // ✅ CORRECTO - OpenZeppelin Ownable
   import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
function criticalFunction() external onlyOwner {
// Only owner can execute
}
} 2. Role-Based Access Control (RBAC)
// ✅ RECOMMENDED - More flexible AccessControl
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyContract is AccessControl {
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not admin");
        _;
    }

} 3. Multi-Signature Control
// ✅ ALTA SEGURIDAD - Para contratos críticos
contract MultiSig {
mapping(address => bool) public isOwner;
uint public required;

    modifier onlyMultiSig() {
        require(isValidMultiSig(), "MultiSig required");
        _;
    }

}
🚨 Common Vulnerabilities
❌ tx.origin vs msg.sender
// ❌ VULNERABLE - Phishing attacks
function withdraw() external {
require(tx.origin == owner, "Not owner");
}

// ✅ SEGURO
function withdraw() external {
require(msg.sender == owner, "Not owner");
}
❌ Funciones sin Protección
Funciones public que deberían ser internal

Constructores sin inicialización de owner

Funciones críticas sin modificadores

❌ Privilege Escalation
Funciones que permiten cambiar roles sin validación

Transferencia de ownership sin confirmación

Roles con permisos excesivos

🔍 Review Checklist
Ownership & Roles:

[ ] Is the owner properly initialized?

[ ] Are there functions to transfer ownership safely?

[ ] Are roles well defined and limited?

[ ] Are modifiers used consistently?

Function Access:

[ ] Do all critical functions have access control?

[ ] Is msg.sender used instead of tx.origin?

[ ] Are there admin functions that could be abused?

[ ] Are modifiers implemented correctly?

Emergency Controls:

[ ] Is there an emergency pause mechanism?

[ ] Are there safe recovery functions?

[ ] Do emergency controls have timelock?

🛠️ Recommended Improvements
Implement Timelock for Critical Changes
contract TimelockController {
uint256 public constant DELAY = 2 days;

    function scheduleTransaction(
        address target,
        bytes calldata data
    ) external onlyAdmin {
        // Schedule transaction with delay
    }

}
Two-Step Ownership Transfer
contract SafeOwnable {
address public owner;
address public pendingOwner;

    function transferOwnership(address newOwner) external onlyOwner {
        pendingOwner = newOwner;
    }

    function acceptOwnership() external {
        require(msg.sender == pendingOwner, "Not pending owner");
        owner = pendingOwner;
        pendingOwner = address(0);
    }

}
📊 Analysis Report
Provides:

Current contract permissions map

Vulnerabilities found with severity

Specific improvement recommendations

Updated code with best practices

Tests to validate access control

Includes examples of known attacks and how to prevent them with proper access control.
