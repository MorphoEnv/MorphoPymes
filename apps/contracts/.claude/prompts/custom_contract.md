---
description: Detailed technical specification of the main contract CompanyAndCampaignManager.
---

# CompanyAndCampaignManager: Detailed Technical Specification

This document provides a comprehensive, function-by-function breakdown of the `CompanyAndCampaignManager` smart contract. It will be built on **Solidity 0.8.20** using **Hardhat** for a robust and secure development environment. The contract is designed to be deployed on the **Sepolia** testnet, adhering to **OpenZeppelin** best practices for production-grade security.

## 1. Contract Overview and Core Functionality

The `CompanyAndCampaignManager` contract serves as the central hub for the MorphoPymes ecosystem. Its primary roles are:

- **Company Registry**: Registers and manages business entities on-chain.
- **Campaign Factory**: Enables registered businesses to create crowdfunding campaigns.
- **Investment Escrow**: Securely holds investor funds until a campaign's goal is met.
- **Token Controller**: Manages the minting and burning of **MoPyTokens** in response to investments and refunds.

This centralized design is more secure and gas-efficient, as it minimizes external contract calls and manages state within a single, audited-ready codebase.

## 2. Data Structures and State Variables

The contract's state is carefully managed through `structs` and `mappings`, ensuring data integrity and efficient lookups.

- `struct Company`: A simple data structure to store company information.
  - `string companyName`: The official name of the business.
  - `uint256 registrationDate`: A `timestamp` of the company's registration.
  - `bool isRegistered`: A boolean flag for quick checks.
  - `address owner`: The `address` of the company owner.

- `struct Campaign`: The core data structure for each crowdfunding campaign.
  - `address ownerAddress`: The public key of the company owner.
  - `uint256 goalAmount`: The funding target in **Wei** (1 ETH = $10^{18}$ Wei).
  - `uint256 minInvestment`: The minimum accepted contribution in **Wei**.
  - `uint256 deadline`: The Unix `timestamp` when the campaign concludes.
  - `uint256 returnPercentage`: The promised return for investors as a percentage. Stored as an integer multiplied by 100 (e.g., 10.50% is stored as `1050`) to avoid floating-point inaccuracies.
  - `uint256 totalRaised`: The cumulative **ETH** collected from investors.
  - `bool active`: A flag indicating if the campaign is open for investments.
  - `bool goalReached`: A flag set to `true` if the `totalRaised` meets or exceeds the `goalAmount`.

- `mapping(address => Company) public companies`: The central registry mapping a company owner's `address` to their `Company` data.
- `mapping(uint256 => Campaign) public campaigns`: A mapping from a unique `campaignId` to its `Campaign` data.
- `mapping(uint256 => mapping(address => uint256)) public campaignInvestments`: A crucial ledger tracking each investor's contribution to a specific campaign.
- `uint256 private nextCampaignId`: An auto-incrementing counter to generate unique `campaignId`s.
- `IERC20 public mopyToken`: A state variable to hold the interface for the `MoPyToken` ERC-20 contract, enabling this contract to mint and burn tokens.

---

### 3. Function-by-Function Breakdown with Detailed Validations

Each public function is designed with strict access controls and `require()` statements to ensure state integrity.

#### `constructor(address _mopyTokenAddress)`

- **Purpose**: Initializes the contract by linking it to the pre-deployed `MoPyToken`.
- **Validation**: `require(_mopyTokenAddress != address(0), "Invalid token address");`.

#### `registerCompany(string memory _companyName)`

- **Purpose**: Registers a new business on the platform.
- **Visibility**: `public`
- **Validation**:
  - `require(!companies[msg.sender].isRegistered, "Caller is already a registered company owner.");` This prevents multiple registrations from a single account.
  - `require(bytes(_companyName).length > 0, "Company name cannot be empty.");`
- **Logic**: Creates a `Company` struct, stores it in the `companies` mapping, and emits a `CompanyRegistered` event.

#### `createCampaign(uint256 _goalAmount, uint256 _minInvestment, uint256 _durationInDays, uint256 _returnPercentage)`

- **Purpose**: Allows a registered company owner to create a new crowdfunding campaign.
- **Visibility**: `public`
- **Validation**:
  - `require(companies[msg.sender].isRegistered, "Must be a registered company owner.");`
  - `require(_goalAmount > 0, "Goal amount must be greater than zero.");`
  - `require(_minInvestment > 0 && _minInvestment <= _goalAmount, "Invalid minimum investment amount.");`
  - `require(_durationInDays > 0, "Duration must be greater than zero.");`
  - `require(_returnPercentage <= 10000, "Return percentage cannot exceed 100%.");` (10000 = 100%)
- **Logic**: Increments `nextCampaignId`, creates a new `Campaign` struct, and emits a `CampaignCreated` event, returning the new ID.

#### `invest(uint256 _campaignId)`

- **Purpose**: Allows an investor to contribute funds to a campaign.
- **Visibility**: `public payable`
- **Validation**:
  - `require(campaigns[_campaignId].active, "Campaign is not active.");`
  - `require(msg.value >= campaigns[_campaignId].minInvestment, "Investment amount is below the minimum.");`
  - `require(block.timestamp <= campaigns[_campaignId].deadline, "Campaign deadline has passed.");`
  - `require(campaigns[_campaignId].totalRaised < campaigns[_campaignId].goalAmount, "Campaign goal has already been reached.");`
- **Logic**:
  - Updates the `campaignInvestments` and `totalRaised` state variables.
  - Calculates the **MoPyToken** amount to mint based on a predefined rate (e.g., 100 MPY per 1 ETH).
  - Calls `mopyToken.mint(msg.sender, tokensToMint);`.
  - Checks if the goal has been reached. If so, sets `campaigns[_campaignId].active = false` and `campaigns[_campaignId].goalReached = true`.
  - Emits an `InvestmentReceived` event.

#### `refund(uint256 _campaignId)`

- **Purpose**: Allows investors to get their funds back if a campaign fails.
- **Visibility**: `public`
- **Validation**:
  - `require(!campaigns[_campaignId].active, "Campaign is still active.");`
  - `require(!campaigns[_campaignId].goalReached, "Goal was met, no refund available.");`
  - `require(campaignInvestments[_campaignId][msg.sender] > 0, "No investment to refund.");`
- **Logic**:
  - Calculates the amount of ETH to return to the investor.
  - Calls `mopyToken.burn(msg.sender, tokensToBurn);` to destroy the investor's tokens.
  - Transfers the initial ETH investment back to the investor.
  - Updates the `campaignInvestments` mapping to 0 for that investor.
  - Emits a `Refunded` event.

#### `distributeFunds(uint256 _campaignId)`

- **Purpose**: Allows the company owner to withdraw the collected funds after a successful campaign.
- **Visibility**: `public`
- **Validation**:
  - `require(msg.sender == campaigns[_campaignId].ownerAddress, "Only campaign owner can withdraw.");`
  - `require(campaigns[_campaignId].goalReached, "Goal not met, funds cannot be distributed.");`
  - `require(address(this).balance >= campaigns[_campaignId].totalRaised, "Insufficient funds in contract.");`
- **Logic**:
  - Transfers the `totalRaised` amount from the contract's balance to the campaign owner's address.
  - Sets a flag to prevent multiple withdrawals.
  - Emits a `FundsDistributed` event.

---

### 4. Security and Best Practices

- **Access Control**: All sensitive functions are protected with `require()` statements to ensure only authorized users can call them.
- **Reentrancy Guard**: Any function that performs an external call (e.g., transferring ETH) will use a `ReentrancyGuard` to prevent reentrancy attacks, a common exploit in Solidity.
- **Event Logging**: All state-changing functions emit events. This is crucial for dApps and external services to track the contract's state without expensive on-chain calls.
- **Gas Efficiency**: The use of `mappings` and a centralized architecture minimizes gas costs for users.
- **Modular Design**: While the core logic is centralized, the use of `IERC20` for the token contract allows for easy replacement or upgrades of the token in the future.
