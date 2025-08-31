// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MoPy.sol";

/**
 * @title CompanyAndCampaignManager
 * @dev Central hub for the MorphoPymes ecosystem managing companies, campaigns, and investments
 * @notice This contract handles company registration, campaign creation, investments, and token minting
 * @author MorphoPymes Team
 */
contract CompanyAndCampaignManager is Ownable, ReentrancyGuard {
    
    /// @dev Conversion rate: 100 MPY tokens per 1 ETH
    uint256 public constant TOKEN_RATE = 100;
    
    /// @dev Maximum return percentage (100.00%)
    uint256 public constant MAX_RETURN_PERCENTAGE = 10000;
    
    /// @dev Reference to the MoPy token contract
    MoPy public mopyToken;
    
    /// @dev Counter for generating unique campaign IDs
    uint256 private nextCampaignId = 1;

    /// @dev Company data structure
    struct Company {
        string companyName;
        uint256 registrationDate;
        bool isRegistered;
        address owner;
    }

    /// @dev Campaign data structure
    struct Campaign {
        address ownerAddress;
        uint256 goalAmount;
        uint256 minInvestment;
        uint256 deadline;
        uint256 returnPercentage;
        uint256 totalRaised;
        bool active;
        bool goalReached;
        bool fundsDistributed;
    }

    /// @dev Mapping from company owner address to Company data
    mapping(address => Company) public companies;
    
    /// @dev Mapping from campaign ID to Campaign data
    mapping(uint256 => Campaign) public campaigns;
    
    /// @dev Mapping from campaign ID to investor address to investment amount
    mapping(uint256 => mapping(address => uint256)) public campaignInvestments;

    /// @dev Events
    event CompanyRegistered(address indexed owner, string companyName, uint256 registrationDate);
    event CampaignCreated(uint256 indexed campaignId, address indexed owner, uint256 goalAmount, uint256 deadline);
    event InvestmentReceived(uint256 indexed campaignId, address indexed investor, uint256 amount, uint256 tokensReceived);
    event Refunded(uint256 indexed campaignId, address indexed investor, uint256 amount, uint256 tokensBurned);
    event FundsDistributed(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event CampaignGoalReached(uint256 indexed campaignId, uint256 totalRaised);

    /**
     * @dev Constructor to initialize the contract with MoPy token address
     * @param _mopyTokenAddress Address of the deployed MoPy token contract
     */
    constructor(address _mopyTokenAddress) Ownable(msg.sender) {
        require(_mopyTokenAddress != address(0), "Invalid token address");
        mopyToken = MoPy(_mopyTokenAddress);
    }

    /**
     * @dev Registers a new business on the platform
     * @param _companyName The official name of the business
     * @notice Only unregistered addresses can register a company
     */
    function registerCompany(string memory _companyName) public {
        require(!companies[msg.sender].isRegistered, "Caller is already a registered company owner");
        require(bytes(_companyName).length > 0, "Company name cannot be empty");
        
        companies[msg.sender] = Company({
            companyName: _companyName,
            registrationDate: block.timestamp,
            isRegistered: true,
            owner: msg.sender
        });
        
        emit CompanyRegistered(msg.sender, _companyName, block.timestamp);
    }

    /**
     * @dev Creates a new crowdfunding campaign
     * @param _goalAmount The funding target in Wei
     * @param _minInvestment The minimum accepted contribution in Wei
     * @param _durationInDays Campaign duration in days
     * @param _returnPercentage Promised return percentage (multiplied by 100, e.g., 1050 = 10.50%)
     * @return campaignId The unique identifier for the created campaign
     */
    function createCampaign(
        uint256 _goalAmount,
        uint256 _minInvestment,
        uint256 _durationInDays,
        uint256 _returnPercentage
    ) public returns (uint256) {
        require(companies[msg.sender].isRegistered, "Must be a registered company owner");
        require(_goalAmount > 0, "Goal amount must be greater than zero");
        require(_minInvestment > 0 && _minInvestment <= _goalAmount, "Invalid minimum investment amount");
        require(_durationInDays > 0, "Duration must be greater than zero");
        require(_returnPercentage <= MAX_RETURN_PERCENTAGE, "Return percentage cannot exceed 100%");
        
        uint256 campaignId = nextCampaignId++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);
        
        campaigns[campaignId] = Campaign({
            ownerAddress: msg.sender,
            goalAmount: _goalAmount,
            minInvestment: _minInvestment,
            deadline: deadline,
            returnPercentage: _returnPercentage,
            totalRaised: 0,
            active: true,
            goalReached: false,
            fundsDistributed: false
        });
        
        emit CampaignCreated(campaignId, msg.sender, _goalAmount, deadline);
        return campaignId;
    }

    /**
     * @dev Allows investors to contribute funds to a campaign
     * @param _campaignId The ID of the campaign to invest in
     * @notice Automatically mints MoPy tokens based on investment amount
     */
    function invest(uint256 _campaignId) public payable nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(campaign.active, "Campaign is not active");
        require(msg.value >= campaign.minInvestment, "Investment amount is below the minimum");
        require(block.timestamp <= campaign.deadline, "Campaign deadline has passed");
        require(campaign.totalRaised < campaign.goalAmount, "Campaign goal has already been reached");
        
        uint256 tokensToMint = (msg.value * TOKEN_RATE) / 1 ether;
        
        campaignInvestments[_campaignId][msg.sender] += msg.value;
        campaign.totalRaised += msg.value;
        
        mopyToken.mint(msg.sender, tokensToMint);
        
        if (campaign.totalRaised >= campaign.goalAmount) {
            campaign.active = false;
            campaign.goalReached = true;
            emit CampaignGoalReached(_campaignId, campaign.totalRaised);
        }
        
        emit InvestmentReceived(_campaignId, msg.sender, msg.value, tokensToMint);
    }

    /**
     * @dev Allows investors to get refunds if campaign fails
     * @param _campaignId The ID of the failed campaign
     * @notice Burns investor's MoPy tokens and returns ETH
     */
    function refund(uint256 _campaignId) public nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 investmentAmount = campaignInvestments[_campaignId][msg.sender];
        
        require(!campaign.active, "Campaign is still active");
        require(!campaign.goalReached, "Goal was met, no refund available");
        require(investmentAmount > 0, "No investment to refund");
        
        uint256 tokensToBurn = (investmentAmount * TOKEN_RATE) / 1 ether;
        
        campaignInvestments[_campaignId][msg.sender] = 0;
        campaign.totalRaised -= investmentAmount;
        
        mopyToken.burn(msg.sender, tokensToBurn);
        
        (bool success, ) = msg.sender.call{value: investmentAmount}("");
        require(success, "ETH transfer failed");
        
        emit Refunded(_campaignId, msg.sender, investmentAmount, tokensToBurn);
    }

    /**
     * @dev Allows campaign owner to withdraw funds after successful campaign
     * @param _campaignId The ID of the successful campaign
     * @notice Only callable by campaign owner after goal is reached
     */
    function distributeFunds(uint256 _campaignId) public nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(msg.sender == campaign.ownerAddress, "Only campaign owner can withdraw");
        require(campaign.goalReached, "Goal not met, funds cannot be distributed");
        require(!campaign.fundsDistributed, "Funds already distributed");
        require(address(this).balance >= campaign.totalRaised, "Insufficient funds in contract");
        
        campaign.fundsDistributed = true;
        
        (bool success, ) = msg.sender.call{value: campaign.totalRaised}("");
        require(success, "ETH transfer failed");
        
        emit FundsDistributed(_campaignId, msg.sender, campaign.totalRaised);
    }

    /**
     * @dev Returns campaign details
     * @param _campaignId The ID of the campaign
     * @return Campaign struct data
     */
    function getCampaign(uint256 _campaignId) public view returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    /**
     * @dev Returns company details
     * @param _owner The address of the company owner
     * @return Company struct data
     */
    function getCompany(address _owner) public view returns (Company memory) {
        return companies[_owner];
    }

    /**
     * @dev Returns investment amount for a specific investor in a campaign
     * @param _campaignId The ID of the campaign
     * @param _investor The address of the investor
     * @return The investment amount in Wei
     */
    function getInvestment(uint256 _campaignId, address _investor) public view returns (uint256) {
        return campaignInvestments[_campaignId][_investor];
    }

    /**
     * @dev Returns the next campaign ID that will be assigned
     * @return The next campaign ID
     */
    function getNextCampaignId() public view returns (uint256) {
        return nextCampaignId;
    }

    /**
     * @dev Emergency function to pause active campaigns
     * @param _campaignId The ID of the campaign to pause
     * @notice Only contract owner can call this function
     */
    function pauseCampaign(uint256 _campaignId) public onlyOwner {
        require(campaigns[_campaignId].active, "Campaign is not active");
        campaigns[_campaignId].active = false;
    }

    /**
     * @dev Receive function to handle direct ETH transfers
     */
    receive() external payable {
        revert("Direct ETH transfers not allowed");
    }
}