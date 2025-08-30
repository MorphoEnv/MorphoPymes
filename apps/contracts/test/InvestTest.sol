// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/MoPy.sol";
import "../contracts/CompanyAndCampaignManager.sol";

contract InvestTest is Test {
    MoPy public mopyToken;
    CompanyAndCampaignManager public manager;
    
    address public owner = address(0x1);
    address public investor = address(0x2);
    
    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy MoPy with owner as initial minter
        mopyToken = new MoPy(owner);
        
        // Deploy Manager
        manager = new CompanyAndCampaignManager(address(mopyToken));
        
        // Set Manager as minter
        mopyToken.updateMinterContract(address(manager));
        
        vm.stopPrank();
    }
    
    function testInvestFlow() public {
        vm.startPrank(owner);
        
        // Register company
        uint256 companyId = manager.registerCompany("Test Company");
        
        // Create campaign
        uint256 campaignId = manager.createCampaign(
            companyId,
            1 ether, // goal
            0.01 ether, // min investment
            block.timestamp + 30 days, // deadline
            500 // 5% return
        );
        
        vm.stopPrank();
        
        // Test investment
        vm.startPrank(investor);
        vm.deal(investor, 1 ether);
        
        console.log("Investor address:", investor);
        console.log("msg.sender before invest:", msg.sender);
        
        manager.invest{value: 0.1 ether}(campaignId);
        
        // Check tokens minted (0.1 ETH * 100 rate = 10 tokens with 18 decimals)
        uint256 tokens = mopyToken.balanceOf(investor);
        assertEq(tokens, 10 * 10**18); // 10 tokens with 18 decimals
        
        vm.stopPrank();
    }
    
    function testMsgSenderNotZero() public {
        vm.startPrank(owner);
        
        uint256 companyId = manager.registerCompany("Test Company");
        uint256 campaignId = manager.createCampaign(
            companyId,
            1 ether,
            0.01 ether,
            block.timestamp + 30 days,
            500
        );
        
        vm.stopPrank();
        
        vm.startPrank(investor);
        vm.deal(investor, 1 ether);
        
        // This should NOT revert with "msg.sender is zero address"
        manager.invest{value: 0.1 ether}(campaignId);
        
        vm.stopPrank();
    }
}