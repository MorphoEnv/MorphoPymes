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
    
    /// @dev Counter for generating unique company IDs
    uint256 private nextCompanyId = 1;

    /// @dev Company data structure
    struct Company {
        uint256 companyId;
        string companyName;
        uint256 registrationDate;
        bool isRegistered;
        address owner;
        address companyAddress;
    }

    /// @dev Campaign data structure
    struct Campaign {
        uint256 companyId;
        address ownerAddress;
        uint256 goalAmount;
        uint256 minInvestment;
        uint256 returnPercentage;
        uint256 dailyPenaltyPercentage;
        uint256 paymentDaysAfterGoal;
        uint256 paymentDeadline;
        uint256 totalRaised;
        uint256 totalPenaltiesPaid;
        bool active;
        bool goalReached;
        bool fundsDistributed;
        bool returnsDistributed;
    }

    /// @dev Mapping from company ID to Company data
    mapping(uint256 => Company) public companies;
    
    /// @dev Mapping from owner address to array of company IDs
    mapping(address => uint256[]) public ownerCompanies;
    
    /// @dev Mapping from company address to company ID
    mapping(address => uint256) public companyAddressToId;
    
    /// @dev Mapping from campaign ID to Campaign data
    mapping(uint256 => Campaign) public campaigns;
    
    /// @dev Mapping from campaign ID to investor address to investment amount
    mapping(uint256 => mapping(address => uint256)) public campaignInvestments;

    /// @dev Events
    event CompanyRegistered(uint256 indexed companyId, address indexed owner, string companyName, uint256 registrationDate);
    event CampaignCreated(uint256 indexed campaignId, uint256 indexed companyId, address indexed owner, uint256 goalAmount, uint256 deadline);
    event InvestmentReceived(uint256 indexed campaignId, address indexed investor, uint256 amount, uint256 tokensReceived);
    event Refunded(uint256 indexed campaignId, address indexed investor, uint256 amount, uint256 tokensBurned);
    event FundsDistributed(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event CampaignGoalReached(uint256 indexed campaignId, uint256 totalRaised);
    event ReturnsDistributed(uint256 indexed campaignId, address indexed owner, uint256 totalAmount);
    event InvestorWithdrew(uint256 indexed campaignId, address indexed investor, uint256 amount);
    event PaymentToOwner(address indexed sender, uint256 amount);

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
     * @return companyId The unique identifier for the registered company
     */
    function registerCompany(string memory _companyName) public returns (uint256) {
        require(bytes(_companyName).length > 0, "Company name cannot be empty");
        
        uint256 companyId = nextCompanyId++;
        
        // Generate unique address for company using CREATE2-like deterministic calculation
        address companyAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            address(this),
            companyId,
            _companyName,
            msg.sender
        )))));
        
        companies[companyId] = Company({
            companyId: companyId,
            companyName: _companyName,
            registrationDate: block.timestamp,
            isRegistered: true,
            owner: msg.sender,
            companyAddress: companyAddress
        });
        
        ownerCompanies[msg.sender].push(companyId);
        companyAddressToId[companyAddress] = companyId;
        
        emit CompanyRegistered(companyId, msg.sender, _companyName, block.timestamp);
        return companyId;
    }

    /**
     * @dev Creates a new crowdfunding campaign
     * @param _companyId The ID of the company creating the campaign
     * @param _goalAmount The funding target in Wei
     * @param _minInvestment The minimum accepted contribution in Wei
     * @param _returnPercentage Promised return percentage (multiplied by 100, e.g., 1050 = 10.50%)
     * @param _dailyPenaltyPercentage Daily penalty percentage for late payments
     * @param _paymentDaysAfterGoal Number of days after goal is reached for payment deadline
     * @return campaignId The unique identifier for the created campaign
     */
    function createCampaign(
        uint256 _companyId,
        uint256 _goalAmount,
        uint256 _minInvestment,
        uint256 _returnPercentage,
        uint256 _dailyPenaltyPercentage,
        uint256 _paymentDaysAfterGoal
    ) public returns (uint256) {
        require(companies[_companyId].isRegistered, "Company does not exist");
        require(companies[_companyId].owner == msg.sender, "Must be the company owner");
        require(_goalAmount > 0, "Goal amount must be greater than zero");
        require(_minInvestment > 0 && _minInvestment <= _goalAmount, "Invalid minimum investment amount");
        require(_paymentDaysAfterGoal > 0, "Payment days must be greater than zero");
        require(_returnPercentage <= MAX_RETURN_PERCENTAGE, "Return percentage cannot exceed 100%");
        
        uint256 campaignId = nextCampaignId++;
        
        campaigns[campaignId] = Campaign({
            companyId: _companyId,
            ownerAddress: msg.sender,
            goalAmount: _goalAmount,
            minInvestment: _minInvestment,
            returnPercentage: _returnPercentage,
            dailyPenaltyPercentage: _dailyPenaltyPercentage,
            paymentDaysAfterGoal: _paymentDaysAfterGoal,
            paymentDeadline: 0, // Set when goal is reached
            totalRaised: 0,
            totalPenaltiesPaid: 0,
            active: true,
            goalReached: false,
            fundsDistributed: false,
            returnsDistributed: false
        });
        
        emit CampaignCreated(campaignId, _companyId, msg.sender, _goalAmount, 0);
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
        require(campaign.totalRaised < campaign.goalAmount, "Campaign goal has already been reached");
        require(campaign.totalRaised + msg.value <= campaign.goalAmount, "Investment would exceed campaign goal");
        
        uint256 tokensToMint = (msg.value * TOKEN_RATE) / 1 ether;
        
        emit InvestmentReceived(_campaignId, msg.sender, msg.value, tokensToMint);
        
        campaignInvestments[_campaignId][msg.sender] += msg.value;
        campaign.totalRaised += msg.value;
        
       // mopyToken.mint(msg.sender, tokensToMint);
        
        if (campaign.totalRaised >= campaign.goalAmount) {
            campaign.active = false;
            campaign.goalReached = true;
            campaign.paymentDeadline = block.timestamp + (campaign.paymentDaysAfterGoal * 1 days);
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
        
        //mopyToken.burn(msg.sender, tokensToBurn);
        
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
     * @dev Allows entrepreneur to return investment + interest to all investors
     * @param _campaignId The ID of the campaign to return funds for
     * @notice Only campaign owner can call this after funds were distributed
     */
    function returnInvestment(uint256 _campaignId) public payable nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        require(msg.sender == campaign.ownerAddress, "Only campaign owner can return investment");
        require(campaign.goalReached, "Campaign goal was not reached");
        require(campaign.fundsDistributed, "Funds must be distributed first");
        require(!campaign.returnsDistributed, "Returns already distributed");
        
        // Calculate total return amount including penalties
        uint256 totalReturnAmount = getRequiredPayment(_campaignId);
        require(msg.value >= totalReturnAmount, "Insufficient ETH sent for returns (including penalties)");
        
        // Track penalties paid separately
        uint256 baseAmount = campaign.totalRaised + (campaign.totalRaised * campaign.returnPercentage / 10000);
        campaign.totalPenaltiesPaid = msg.value - baseAmount;
        campaign.returnsDistributed = true;
        
        // Return investment + interest to each investor proportionally
        // Implementation would require iterating through all investors for this campaign
        // For now, this function accepts the total return amount and marks as distributed
        // Individual investor withdrawals would need a separate function
        
        emit ReturnsDistributed(_campaignId, msg.sender, totalReturnAmount);
    }

    /**
     * @dev Allows individual investors to withdraw their return (principal + interest)
     * @param _campaignId The ID of the campaign to withdraw returns from
     * @notice Investors can only withdraw after entrepreneur has deposited returns
     */
    function withdrawReturns(uint256 _campaignId) public nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 investmentAmount = campaignInvestments[_campaignId][msg.sender];
        
        require(campaign.goalReached, "Campaign goal was not reached");
        require(investmentAmount > 0, "No investment to withdraw");
        
        // Check if entrepreneur paid within deadline
        if (block.timestamp > campaign.paymentDeadline && !campaign.returnsDistributed) {
            // Entrepreneur missed deadline - investor gets refund only
            campaignInvestments[_campaignId][msg.sender] = 0;
            (bool refundSuccess, ) = msg.sender.call{value: investmentAmount}("");
            require(refundSuccess, "ETH transfer failed");
            emit Refunded(_campaignId, msg.sender, investmentAmount, 0);
            return;
        }
        
        require(campaign.returnsDistributed, "Returns have not been distributed by entrepreneur");
        
        // Calculate investor's return amount (investment + interest + proportional penalty rewards)
        uint256 baseReturn = investmentAmount + (investmentAmount * campaign.returnPercentage / 10000);
        
        // Add proportional share of penalty rewards if entrepreneur paid penalties
        if (campaign.totalPenaltiesPaid > 0) {
            // Investor gets their proportional share of total penalties paid
            uint256 investorPenaltyShare = (campaign.totalPenaltiesPaid * investmentAmount) / campaign.totalRaised;
            baseReturn += investorPenaltyShare;
        }
        
        uint256 returnAmount = baseReturn;
        
        // Clear the investment to prevent double withdrawal
        campaignInvestments[_campaignId][msg.sender] = 0;
        
        // Transfer return amount to investor
        (bool success, ) = msg.sender.call{value: returnAmount}("");
        require(success, "ETH transfer failed");
        
        emit InvestorWithdrew(_campaignId, msg.sender, returnAmount);
    }

    /**
     * @dev Calculates the required payment amount for entrepreneur including penalties
     * @param _campaignId The ID of the campaign
     * @return totalRequired The total amount entrepreneur must pay (principal + interest + penalties)
     */
    function getRequiredPayment(uint256 _campaignId) public view returns (uint256) {
        Campaign memory campaign = campaigns[_campaignId];
        
        require(campaign.goalReached, "Campaign goal not reached");
        require(campaign.fundsDistributed, "Funds not distributed yet");
        
        if (campaign.returnsDistributed) {
            return 0; // Already paid
        }
        
        // Base amount: principal + interest
        uint256 baseAmount = campaign.totalRaised + (campaign.totalRaised * campaign.returnPercentage / 10000);
        
        // If no deadline set yet, return base amount
        if (campaign.paymentDeadline == 0) {
            return baseAmount;
        }
        
        // If still within deadline, return base amount
        if (block.timestamp <= campaign.paymentDeadline) {
            return baseAmount;
        }
        
        // Calculate penalty for days overdue
        uint256 daysOverdue = (block.timestamp - campaign.paymentDeadline) / 1 days;
        uint256 dailyPenalty = (campaign.totalRaised * campaign.dailyPenaltyPercentage / 10000);
        uint256 totalPenalty = dailyPenalty * daysOverdue;
        
        return baseAmount + totalPenalty;
    }

    /**
     * @dev Allows anyone to send ETH directly to contract owner
     * @notice Send ETH with this function to pay the contract owner
     */
    function payOwner() public payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        
        address payable contractOwner = payable(owner());
        (bool success, ) = contractOwner.call{value: msg.value}("");
        require(success, "ETH transfer failed");
        
        emit PaymentToOwner(msg.sender, msg.value);
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
     * @dev Returns company details by ID
     * @param _companyId The ID of the company
     * @return Company struct data
     */
    function getCompany(uint256 _companyId) public view returns (Company memory) {
        return companies[_companyId];
    }

    /**
     * @dev Returns all company IDs owned by an address
     * @param _owner The address of the company owner
     * @return Array of company IDs
     */
    function getOwnerCompanies(address _owner) public view returns (uint256[] memory) {
        return ownerCompanies[_owner];
    }

    /**
     * @dev Returns the next company ID that will be assigned
     * @return The next company ID
     */
    function getNextCompanyId() public view returns (uint256) {
        return nextCompanyId;
    }

    /**
     * @dev Returns company data by company address
     * @param _companyAddress The unique address of the company
     * @return The company data structure
     */
    function getCompanyByAddress(address _companyAddress) public view returns (Company memory) {
        uint256 companyId = companyAddressToId[_companyAddress];
        require(companyId > 0, "Company not found");
        return companies[companyId];
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