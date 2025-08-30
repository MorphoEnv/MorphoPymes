// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MoPy
 * @dev ERC-20 token for the MorphoPymes ecosystem representing fractional ownership and future returns from campaigns
 * @notice This contract is lean, secure, and fully ERC-20 compliant
 * @author MorphoPymes Team
 */
contract MoPy is ERC20, Ownable {
    /// @dev Address of the authorized minter contract (CompanyAndCampaignManager)
    address public minterContract;

    /// @dev Emitted when tokens are minted to an address
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);

    /// @dev Emitted when tokens are burned from an address
    event TokensBurned(address indexed from, uint256 amount, address indexed minter);

    /// @dev Emitted when the minter contract is updated
    event MinterContractUpdated(address indexed oldMinter, address indexed newMinter);

    /**
     * @dev Modifier to restrict function access to the authorized minter contract only
     * @notice Only the CompanyAndCampaignManager contract can mint or burn tokens
     */
    modifier onlyMinter() {
        require(msg.sender == minterContract, "MoPy: caller is not the authorized minter");
        _;
    }

    /**
     * @dev Constructor to deploy the token and set the initial authorized minter
     * @param _minterContract Address of the CompanyAndCampaignManager contract
     * @notice Initializes the token with name "MoPy Token" and symbol "MPY"
     */
    constructor(address _minterContract) ERC20("MoPy Token", "MPY") Ownable(msg.sender) {
        require(_minterContract != address(0), "MoPy: minter address cannot be zero");
        minterContract = _minterContract;
        emit MinterContractUpdated(address(0), _minterContract);
    }

    /**
     * @dev Creates new tokens and assigns them to an address
     * @param to Address to receive the minted tokens
     * @param amount Number of tokens to mint
     * @notice Only the authorized minter contract can call this function
     */
    function mint(address to, uint256 amount) public onlyMinter {
        require(to != address(0), "MoPy: cannot mint to zero address");
        require(amount > 0, "MoPy: amount must be greater than zero");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, msg.sender);
    }

    /**
     * @dev Destroys tokens from a specific address
     * @param from Address to burn tokens from
     * @param amount Number of tokens to burn
     * @notice Only the authorized minter contract can call this function
     */
    function burn(address from, uint256 amount) public onlyMinter {
        require(from != address(0), "MoPy: cannot burn from zero address");
        require(amount > 0, "MoPy: amount must be greater than zero");
        require(balanceOf(from) >= amount, "MoPy: burn amount exceeds balance");
        
        _burn(from, amount);
        emit TokensBurned(from, amount, msg.sender);
    }

    /**
     * @dev Updates the authorized minter contract address
     * @param _newMinterContract Address of the new minter contract
     * @notice Only the contract owner can update the minter contract
     */
    function updateMinterContract(address _newMinterContract) public onlyOwner {
        require(_newMinterContract != address(0), "MoPy: new minter address cannot be zero");
        require(_newMinterContract != minterContract, "MoPy: new minter is the same as current");
        
        address oldMinter = minterContract;
        minterContract = _newMinterContract;
        emit MinterContractUpdated(oldMinter, _newMinterContract);
    }

    /**
     * @dev Returns the current total supply of tokens
     * @return The total number of tokens in circulation
     */
    function getTotalSupply() public view returns (uint256) {
        return totalSupply();
    }

    /**
     * @dev Returns the balance of a specific address
     * @param account Address to check balance for
     * @return The number of tokens held by the account
     */
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}