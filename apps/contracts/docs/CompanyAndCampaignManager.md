# CompanyAndCampaignManager Contract Documentation

## Overview
The CompanyAndCampaignManager contract is the core business logic contract for the MorphoPymes ecosystem. It manages company registrations, crowdfunding campaigns, investments, and returns with penalty mechanisms.

## Contract Address
- **Network**: Base Sepolia Testnet
- **Latest Deployment**: `0x17aB704305a43915a0261EbF3b154ee6B568F6f5` (check latest in deployed_addresses.json)

## Dependencies
- **MoPy Token Contract**: ERC-20 token for rewards (currently disabled in invest function)
- **OpenZeppelin**: ReentrancyGuard, Ownable for security

## Constants
```solidity
uint256 public constant TOKEN_RATE = 100; // 100 MoPy tokens per 1 ETH
uint256 public constant MAX_RETURN_PERCENTAGE = 10000; // 100.00% maximum return
```

## Data Structures

### Company Struct
```solidity
struct Company {
    uint256 companyId;          // Unique company identifier
    string companyName;         // Company name
    uint256 registrationDate;   // Unix timestamp of registration
    bool isRegistered;          // Registration status
    address owner;              // Company owner address
}
```

### Campaign Struct
```solidity
struct Campaign {
    uint256 companyId;                  // Associated company ID
    address ownerAddress;               // Campaign creator address
    uint256 goalAmount;                 // Funding target in Wei
    uint256 minInvestment;              // Minimum investment in Wei
    uint256 returnPercentage;           // Promised return (basis points, e.g., 500 = 5%)
    uint256 dailyPenaltyPercentage;     // Daily penalty rate (basis points)
    uint256 paymentDaysAfterGoal;       // Days allowed for payment after goal reached
    uint256 paymentDeadline;            // Unix timestamp for payment deadline
    uint256 totalRaised;                // Total ETH raised
    bool active;                        // Campaign is accepting investments
    bool goalReached;                   // Goal amount has been reached
    bool fundsDistributed;              // Owner has withdrawn funds
    bool returnsDistributed;            // Returns have been deposited by entrepreneur
}
```

## Public Functions

### Company Management

#### `registerCompany(string memory _companyName) → uint256`
Registers a new company in the system.

**Parameters:**
- `_companyName`: Company name (cannot be empty)

**Returns:**
- `uint256`: Unique company ID

**Access:** Any address
**Events:** `CompanyRegistered(companyId, owner, companyName, timestamp)`

---

#### `getCompany(uint256 _companyId) → Company memory`
Retrieves company information.

**Parameters:**
- `_companyId`: Company ID to query

**Returns:**
- `Company`: Complete company data structure

**Access:** Public view function

---

### Campaign Management

#### `createCampaign(uint256 _companyId, uint256 _goalAmount, uint256 _minInvestment, uint256 _returnPercentage, uint256 _dailyPenaltyPercentage, uint256 _paymentDaysAfterGoal) → uint256`
Creates a new crowdfunding campaign.

**Parameters:**
- `_companyId`: ID of registered company
- `_goalAmount`: Funding target in Wei
- `_minInvestment`: Minimum investment amount in Wei
- `_returnPercentage`: Promised return rate in basis points (500 = 5%)
- `_dailyPenaltyPercentage`: Daily penalty rate in basis points (100 = 1%)
- `_paymentDaysAfterGoal`: Days allowed for payment after goal is reached

**Returns:**
- `uint256`: Unique campaign ID

**Access:** Must be company owner
**Events:** `CampaignCreated(campaignId, companyId, owner, goalAmount, 0)`

---

#### `getCampaign(uint256 _campaignId) → Campaign memory`
Retrieves complete campaign information.

**Parameters:**
- `_campaignId`: Campaign ID to query

**Returns:**
- `Campaign`: Complete campaign data structure

**Access:** Public view function

---

### Investment Functions

#### `invest(uint256 _campaignId) payable`
Allows investors to contribute ETH to a campaign.

**Parameters:**
- `_campaignId`: Target campaign ID

**Payable:** Yes - send ETH with transaction
**Requirements:**
- Campaign must be active
- Investment ≥ minimum investment
- Goal not already reached
- Investment doesn't exceed remaining goal amount

**Effects:**
- Records investment amount per investor
- Updates campaign total raised
- Activates payment deadline when goal is reached
- Emits tokens to investor (currently disabled)

**Events:** `InvestmentReceived(campaignId, investor, amount, tokensReceived)`
**Access:** Any address with sufficient ETH

---

#### `getInvestmentAmount(uint256 _campaignId, address _investor) → uint256`
Gets investment amount for specific investor in a campaign.

**Parameters:**
- `_campaignId`: Campaign ID
- `_investor`: Investor address

**Returns:**
- `uint256`: Investment amount in Wei

**Access:** Public view function

---

### Fund Distribution

#### `distributeFunds(uint256 _campaignId)`
Allows campaign owner to withdraw raised funds after goal is reached.

**Parameters:**
- `_campaignId`: Campaign ID to withdraw funds from

**Requirements:**
- Only campaign owner can call
- Goal must be reached
- Funds not already distributed
- Contract has sufficient balance

**Effects:**
- Transfers all raised ETH to campaign owner
- Marks funds as distributed

**Events:** `FundsDistributed(campaignId, owner, amount)`
**Access:** Campaign owner only

---

### Return and Penalty System

#### `returnInvestment(uint256 _campaignId) payable`
Allows entrepreneur to deposit returns (principal + interest + penalties) back to contract.

**Parameters:**
- `_campaignId`: Campaign ID to return funds for

**Payable:** Yes - must send required return amount
**Requirements:**
- Only campaign owner can call
- Goal must be reached
- Funds must be distributed first
- Must send sufficient ETH (use `getRequiredPayment()` to check amount)

**Effects:**
- Marks returns as distributed
- Enables investor withdrawals

**Events:** `ReturnsDistributed(campaignId, owner, totalAmount)`
**Access:** Campaign owner only

---

#### `getRequiredPayment(uint256 _campaignId) → uint256`
Calculates total amount entrepreneur must pay including penalties.

**Parameters:**
- `_campaignId`: Campaign ID to calculate payment for

**Returns:**
- `uint256`: Total required payment in Wei

**Calculation:**
- Base: `totalRaised + (totalRaised * returnPercentage / 10000)`
- Penalty: `+ (totalRaised * dailyPenaltyPercentage / 10000) * daysOverdue`

**Access:** Public view function

---

#### `withdrawReturns(uint256 _campaignId)`
Allows investors to withdraw their returns (principal + interest + penalty rewards).

**Parameters:**
- `_campaignId`: Campaign ID to withdraw from

**Requirements:**
- Goal must be reached
- Investor must have investment in campaign
- Returns must be distributed by entrepreneur

**Returns Calculation:**
- Base: `investment + (investment * returnPercentage / 10000)`
- Penalty Share: `(totalPenaltiesPaid * investment) / totalRaised`

**Special Cases:**
- If entrepreneur missed deadline and hasn't paid: investor gets refund only
- If entrepreneur paid with penalties: investor gets proportional penalty rewards

**Events:** `InvestorWithdrew(campaignId, investor, amount)` or `Refunded(campaignId, investor, amount, 0)`
**Access:** Any investor with funds in the campaign

---

### Refund System

#### `refund(uint256 _campaignId)`
Allows investors to get refunds if campaign fails to reach goal.

**Parameters:**
- `_campaignId`: Campaign ID to refund from

**Requirements:**
- Campaign must be inactive
- Goal must not be reached
- Investor must have investment

**Effects:**
- Returns investment amount to investor
- Burns corresponding MoPy tokens (currently disabled)

**Events:** `Refunded(campaignId, investor, amount, tokensBurned)`
**Access:** Any investor with funds in failed campaign

---

## Events

### Company Events
```solidity
event CompanyRegistered(uint256 indexed companyId, address indexed owner, string companyName, uint256 registrationDate);
```

### Campaign Events
```solidity
event CampaignCreated(uint256 indexed campaignId, uint256 indexed companyId, address indexed owner, uint256 goalAmount, uint256 deadline);
event CampaignGoalReached(uint256 indexed campaignId, uint256 totalRaised);
```

### Investment Events
```solidity
event InvestmentReceived(uint256 indexed campaignId, address indexed investor, uint256 amount, uint256 tokensReceived);
event Refunded(uint256 indexed campaignId, address indexed investor, uint256 amount, uint256 tokensBurned);
```

### Distribution Events
```solidity
event FundsDistributed(uint256 indexed campaignId, address indexed owner, uint256 amount);
event ReturnsDistributed(uint256 indexed campaignId, address indexed owner, uint256 totalAmount);
event InvestorWithdrew(uint256 indexed campaignId, address indexed investor, uint256 amount);
```

## Usage Flow

### For Entrepreneurs
1. `registerCompany("Company Name")` → Get company ID
2. `createCampaign(companyId, goalAmount, minInvestment, returnPct, penaltyPct, paymentDays)` → Get campaign ID
3. Wait for investments to reach goal
4. `distributeFunds(campaignId)` → Withdraw funds for project development
5. `getRequiredPayment(campaignId)` → Check required payment amount
6. `returnInvestment(campaignId) { value: requiredAmount }` → Pay back investors with interest/penalties

### For Investors
1. `getCampaign(campaignId)` → Check campaign details
2. `invest(campaignId) { value: investmentAmount }` → Invest in campaign
3. After entrepreneur pays returns: `withdrawReturns(campaignId)` → Get principal + interest + penalty rewards
4. If campaign fails: `refund(campaignId)` → Get investment back

## Error Messages

### Company Registration
- `"Company name cannot be empty"`

### Campaign Creation
- `"Company does not exist"`
- `"Must be the company owner"`
- `"Goal amount must be greater than zero"`
- `"Invalid minimum investment amount"`
- `"Payment days must be greater than zero"`
- `"Return percentage cannot exceed 100%"`

### Investment
- `"Campaign is not active"`
- `"Investment amount is below the minimum"`
- `"Campaign goal has already been reached"`
- `"Investment would exceed campaign goal"`

### Fund Management
- `"Only campaign owner can withdraw"`
- `"Goal not met, funds cannot be distributed"`
- `"Funds already distributed"`
- `"Insufficient funds in contract"`

### Return System
- `"Campaign goal was not reached"`
- `"No investment to withdraw"`
- `"Returns have not been distributed by entrepreneur"`
- `"Insufficient ETH sent for returns (including penalties)"`
- `"Returns already distributed"`

## Security Features
- **ReentrancyGuard**: Prevents reentrancy attacks on all fund transfer functions
- **Access Control**: Functions restricted to appropriate roles (owner, investor)
- **Balance Validation**: Ensures contract has sufficient funds before transfers
- **Prevent Direct Transfers**: `receive()` function reverts direct ETH transfers
- **Double Withdrawal Prevention**: Investment amounts cleared after withdrawal

## Gas Considerations
- Contract compiled with optimizer enabled and `viaIR: true` for complex struct handling
- Use `view` functions to check requirements before making transactions
- Batch operations when possible to save gas

## Integration Notes for Backend
- Always check campaign status with `getCampaign()` before operations
- Use `getRequiredPayment()` to show entrepreneurs exact payment amounts
- Monitor events for real-time updates
- Handle penalty calculations for frontend display
- Implement proper error handling for all revert conditions