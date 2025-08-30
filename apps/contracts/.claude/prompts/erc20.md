---
description: Detailed technical documentation of the ERC-20 contract (MoPyToken).
---

# MoPyToken Contract: Detailed Specifications for the ERC-20 Standard

This document outlines the granular technical specifications for the `MoPyToken` smart contract. It is the official ERC-20 token for the MorphoPymes ecosystem, representing an investor's fractional ownership and their right to future returns from a campaign. The contract is designed to be lean, secure, and fully compliant with the **ERC-20 standard**. It will inherit from **OpenZeppelin's** battle-tested libraries for enhanced security and to ensure industry compatibility.

## 1. Contract Architecture and Design Philosophy

The `MoPyToken` is a standalone contract. Its primary responsibility is token management; it contains **no business logic** related to campaigns or investments. This separation of concerns is a critical security best practice, preventing logic-based vulnerabilities from affecting the token supply.

The token's core functionality is controlled by a single, trusted entity: the `CompanyAndCampaignManager` contract. This is enforced through an `onlyMinter` modifier, ensuring that tokens can only be created or destroyed as a result of a valid investment or refund processed by the central manager contract.

## 2. Core State Variables

- `IERC20Metadata public MoPyToken`: An interface to the ERC20 contract.
- `address public minterContract`: A variable to store the address of the single authorized minter, which will be the `CompanyAndCampaignManager` contract.

## 3. Function-by-Function Breakdown

### `constructor(address _minterContract)`

- **Purpose**: Deploys the token and sets the initial authorized minter.
- **Parameters**:
  - `_minterContract (address)`: The address of the `CompanyAndCampaignManager` contract.
- **Validation**: `require(_minterContract != address(0), "Minter address cannot be zero.");`
- **Inheritance**: The constructor will pass the token's name ("MoPy Token") and symbol ("MPY") to the ERC20 parent constructor.

### `mint(address to, uint256 amount)`

- **Purpose**: Creates new tokens and assigns them to an address. This function is the core mechanism for rewarding investors.
- **Visibility**: `public`
- **Security**: Uses an `onlyMinter` custom modifier to ensure that only the `CompanyAndCampaignManager` can call this function.
- **Logic**: Calls the internal `_mint` function from the ERC20 standard to create `amount` tokens and transfer them to the `to` address.

### `burn(address from, uint256 amount)`

- **Purpose**: Destroys tokens from a specific address. This function is essential for handling refunds.
- **Visibility**: `public`
- **Security**: Uses an `onlyMinter` custom modifier to ensure that only the `CompanyAndCampaignManager` can call this function.
- **Logic**: Calls the internal `_burn` function from the ERC20 standard to remove `amount` tokens from the `from` address.

### `transfer(address to, uint256 amount)`

- **Purpose**: Standard ERC-20 transfer functionality, allowing investors to move their tokens.
- **Visibility**: `public`
- **Security**: This function is inherited from OpenZeppelin and includes all necessary checks to prevent unauthorized transfers and handle insufficient balances.

## 4. Security and Compliance

- **ERC-20 Compliance**: The contract will fully comply with the [ERC-20 standard](https://eips.ethereum.org/EIPS/eip-20), ensuring compatibility with wallets, exchanges, and other dApps.
- **Separation of Concerns**: By separating the token's logic from the investment logic, we minimize the attack surface of both contracts.
- **Centralized Control**: While decentralized in spirit, the token's supply is centrally controlled by the `CompanyAndCampaignManager` contract. This is a common and secure pattern for utility tokens tied to a specific application's logic.
- **Events**: Standard events like `Transfer`, `Approval`, and custom events for `Mint` and `Burn` will be emitted for every state-changing transaction, allowing for robust off-chain monitoring.
