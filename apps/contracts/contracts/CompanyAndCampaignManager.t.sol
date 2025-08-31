// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "./CompanyAndCampaignManager.sol";
import "./MoPy.sol";

contract CompanyAndCampaignManagerTest is Test {
    CompanyAndCampaignManager public manager;
    MoPy public token;
    
    address public owner;
    address public company1;
    address public company2;
    address public investor1;
    address public investor2;

    function setUp() public {
        owner = address(this);
        company1 = address(0x1);
        company2 = address(0x2);
        investor1 = address(0x3);
        investor2 = address(0x4);
        
        vm.deal(investor1, 10 ether);
        vm.deal(investor2, 10 ether);
        vm.deal(company1, 1 ether);
        vm.deal(company2, 1 ether);
        
        token = new MoPy(address(0x123));
        manager = new CompanyAndCampaignManager(address(token));
        
        token.updateMinterContract(address(manager));
    }

    function testCompanyRegistration() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        CompanyAndCampaignManager.Company memory company = manager.getCompany(company1);
        assertEq(company.companyName, "Test Company");
        assertEq(company.owner, company1);
        assertTrue(company.isRegistered);
        assertEq(company.registrationDate, block.timestamp);
    }

    function testCannotRegisterTwice() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        vm.expectRevert("Caller is already a registered company owner");
        manager.registerCompany("Another Company");
    }

    function testCannotRegisterEmptyName() public {
        vm.prank(company1);
        vm.expectRevert("Company name cannot be empty");
        manager.registerCompany("");
    }

    function testCreateCampaign() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(
            5 ether,        // goal
            0.1 ether,      // min investment
            30,             // 30 days
            1500            // 15% return
        );
        
        assertEq(campaignId, 1);
        
        CompanyAndCampaignManager.Campaign memory campaign = manager.getCampaign(campaignId);
        assertEq(campaign.ownerAddress, company1);
        assertEq(campaign.goalAmount, 5 ether);
        assertEq(campaign.minInvestment, 0.1 ether);
        assertEq(campaign.returnPercentage, 1500);
        assertTrue(campaign.active);
        assertFalse(campaign.goalReached);
    }

    function testCannotCreateCampaignWithoutRegistration() public {
        vm.prank(company1);
        vm.expectRevert("Must be a registered company owner");
        manager.createCampaign(5 ether, 0.1 ether, 30, 1500);
    }

    function testInvestment() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(5 ether, 0.1 ether, 30, 1500);
        
        vm.prank(investor1);
        manager.invest{value: 1 ether}(campaignId);
        
        assertEq(manager.getInvestment(campaignId, investor1), 1 ether);
        assertEq(token.balanceOf(investor1), 100 ether); // 100 MPY per ETH
        
        CompanyAndCampaignManager.Campaign memory campaign = manager.getCampaign(campaignId);
        assertEq(campaign.totalRaised, 1 ether);
    }

    function testCannotInvestBelowMinimum() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(5 ether, 0.1 ether, 30, 1500);
        
        vm.prank(investor1);
        vm.expectRevert("Investment amount is below the minimum");
        manager.invest{value: 0.05 ether}(campaignId);
    }

    function testCampaignGoalReached() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(2 ether, 0.1 ether, 30, 1500);
        
        vm.prank(investor1);
        manager.invest{value: 1 ether}(campaignId);
        
        vm.prank(investor2);
        manager.invest{value: 1 ether}(campaignId);
        
        CompanyAndCampaignManager.Campaign memory campaign = manager.getCampaign(campaignId);
        assertFalse(campaign.active);
        assertTrue(campaign.goalReached);
        assertEq(campaign.totalRaised, 2 ether);
    }

    function testDistributeFunds() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(1 ether, 0.1 ether, 30, 1500);
        
        vm.prank(investor1);
        manager.invest{value: 1 ether}(campaignId);
        
        uint256 initialBalance = company1.balance;
        
        vm.prank(company1);
        manager.distributeFunds(campaignId);
        
        assertEq(company1.balance, initialBalance + 1 ether);
        
        CompanyAndCampaignManager.Campaign memory campaign = manager.getCampaign(campaignId);
        assertTrue(campaign.fundsDistributed);
    }

    function testRefund() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(5 ether, 0.1 ether, 30, 1500);
        
        vm.prank(investor1);
        manager.invest{value: 1 ether}(campaignId);
        
        vm.warp(block.timestamp + 31 days);
        
        vm.prank(owner);
        manager.pauseCampaign(campaignId);
        
        uint256 initialBalance = investor1.balance;
        uint256 initialTokens = token.balanceOf(investor1);
        
        vm.prank(investor1);
        manager.refund(campaignId);
        
        assertEq(investor1.balance, initialBalance + 1 ether);
        assertEq(token.balanceOf(investor1), initialTokens - 100 ether);
        assertEq(manager.getInvestment(campaignId, investor1), 0);
    }

    function testCannotRefundSuccessfulCampaign() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(1 ether, 0.1 ether, 30, 1500);
        
        vm.prank(investor1);
        manager.invest{value: 1 ether}(campaignId);
        
        vm.prank(investor1);
        vm.expectRevert("Goal was met, no refund available");
        manager.refund(campaignId);
    }

    function testOnlyOwnerCanPauseCampaign() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(5 ether, 0.1 ether, 30, 1500);
        
        vm.prank(investor1);
        vm.expectRevert();
        manager.pauseCampaign(campaignId);
    }

    function testCannotInvestInExpiredCampaign() public {
        vm.prank(company1);
        manager.registerCompany("Test Company");
        
        vm.prank(company1);
        uint256 campaignId = manager.createCampaign(5 ether, 0.1 ether, 30, 1500);
        
        vm.warp(block.timestamp + 31 days);
        
        vm.prank(investor1);
        vm.expectRevert("Campaign deadline has passed");
        manager.invest{value: 1 ether}(campaignId);
    }

    function testDirectETHTransferReverts() public {
        vm.prank(investor1);
        vm.expectRevert("Direct ETH transfers not allowed");
        payable(address(manager)).transfer(1 ether);
    }
}