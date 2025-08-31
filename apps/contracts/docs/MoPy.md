# MoPy Token Contract Documentation

## Overview
The MoPy (MorphoPymes Token) contract is an ERC-20 token that represents fractional ownership and future returns from campaigns in the MorphoPymes ecosystem. It features controlled minting and burning through an authorized minter contract.

## Contract Address
- **Network**: Base Sepolia Testnet
- **Latest Deployment**: `0xf3DD33ddb68A08b5c520D8cc3BB0A72f08431551`

## Dependencies
- **OpenZeppelin ERC20**: Standard token implementation
- **OpenZeppelin Ownable**: Access control for contract owner
- **CompanyAndCampaignManager**: Authorized minter contract

## Token Details
```solidity
Name: "MoPy Token"
Symbol: "MPL"
Decimals: 18 (inherited from ERC20)
```

## Access Control
- **Owner**: Can mint, burn, and update minter contract
- **Authorized Minter**: Currently the CompanyAndCampaignManager contract
- **Public**: Standard ERC-20 transfer, approve, and view functions

## Public Functions

### Token Management

#### `mint(address to, uint256 amount)`
Creates new tokens and assigns them to an address.

**Parameters:**
- `to`: Address to receive the minted tokens
- `amount`: Number of tokens to mint (in wei, 18 decimals)

**Requirements:**
- Only owner or authorized minter can call
- `to` address cannot be zero address
- `amount` must be greater than zero

**Events:** `TokensMinted(to, amount, msg.sender)`
**Access:** Owner or authorized minter only

---

#### `burn(address from, uint256 amount)`
Destroys tokens from a specific address.

**Parameters:**
- `from`: Address to burn tokens from
- `amount`: Number of tokens to burn (in wei, 18 decimals)

**Requirements:**
- Only owner or authorized minter can call
- `from` address cannot be zero address
- `amount` must be greater than zero
- Account must have sufficient balance

**Events:** `TokensBurned(from, amount, msg.sender)`
**Access:** Owner or authorized minter only

---

#### `updateMinterContract(address _newMinterContract)`
Updates the authorized minter contract address.

**Parameters:**
- `_newMinterContract`: Address of the new minter contract

**Requirements:**
- Only contract owner can call
- New minter address cannot be zero address
- New minter must be different from current minter

**Events:** `MinterContractUpdated(oldMinter, newMinter)`
**Access:** Owner only

---

### View Functions

#### `getTotalSupply() → uint256`
Returns the current total supply of tokens.

**Returns:**
- `uint256`: Total number of tokens in circulation

**Access:** Public view function

---

#### `getBalance(address account) → uint256`
Returns the balance of a specific address.

**Parameters:**
- `account`: Address to check balance for

**Returns:**
- `uint256`: Number of tokens held by the account

**Access:** Public view function

---

#### `minterContract() → address`
Returns the current authorized minter contract address.

**Returns:**
- `address`: Address of the authorized minter contract

**Access:** Public view function

---

## Standard ERC-20 Functions

### Transfer Functions
- `transfer(address to, uint256 amount) → bool`
- `transferFrom(address from, address to, uint256 amount) → bool`
- `approve(address spender, uint256 amount) → bool`

### View Functions
- `balanceOf(address account) → uint256`
- `totalSupply() → uint256`
- `allowance(address owner, address spender) → uint256`
- `name() → string`
- `symbol() → string`
- `decimals() → uint8`

## Events

### Token Management Events
```solidity
event TokensMinted(address indexed to, uint256 amount, address indexed minter);
event TokensBurned(address indexed from, uint256 amount, address indexed minter);
event MinterContractUpdated(address indexed oldMinter, address indexed newMinter);
```

### Standard ERC-20 Events
```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

## Backend Integration Guide

### Token Conversion
- **Rate**: 100 MPL tokens per 1 ETH invested
- **Calculation**: `tokensToMint = (ethAmount * 100) / 1 ether`

### Common Operations

#### Check Token Balance
```javascript
const balance = await mopyContract.balanceOf(userAddress);
const balanceInTokens = ethers.formatEther(balance); // Convert from wei
```

#### Monitor Token Events
```javascript
// Listen for minting events
contract.on("TokensMinted", (to, amount, minter) => {
    console.log(`${ethers.formatEther(amount)} MPL minted to ${to}`);
});

// Listen for transfers
contract.on("Transfer", (from, to, value) => {
    console.log(`${ethers.formatEther(value)} MPL transferred from ${from} to ${to}`);
});
```

#### Get Total Supply
```javascript
const totalSupply = await mopyContract.getTotalSupply();
const totalInTokens = ethers.formatEther(totalSupply);
```

### Error Messages
- `"MoPy: caller is not authorized"` - Unauthorized minting/burning attempt
- `"MoPy: cannot mint to zero address"` - Invalid recipient address
- `"MoPy: amount must be greater than zero"` - Invalid amount
- `"MoPy: cannot burn from zero address"` - Invalid burn address
- `"MoPy: burn amount exceeds balance"` - Insufficient balance for burning
- `"MoPy: new minter address cannot be zero"` - Invalid minter address
- `"MoPy: new minter is the same as current"` - No change in minter

## Security Features
- **Access Control**: Only owner and authorized minter can mint/burn
- **Zero Address Protection**: Prevents minting/burning to/from zero address
- **Balance Validation**: Ensures sufficient balance before burning
- **Minter Validation**: Prevents setting invalid minter addresses

## Gas Considerations
- Minting: ~50,000 gas
- Burning: ~45,000 gas
- Standard transfers: ~21,000 gas
- Use `view` functions for free balance checks