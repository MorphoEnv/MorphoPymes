import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("CompanyAndCampaignManager Tests", async function () {
  const { viem } = await network.connect();

  it("Should deploy and configure complete ecosystem", async function () {
    const [owner, company, investor] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [owner.account.address]);
    const manager = await viem.deployContract("CompanyAndCampaignManager", [token.address]);
    
    await token.write.updateMinterContract([manager.address], { account: owner.account });
    
    const minterAddress = await token.read.minterContract();
    assert.equal(minterAddress.toLowerCase(), manager.address.toLowerCase());
  });

  it("Should register company and create campaign", async function () {
    const [owner, company, investor] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [owner.account.address]);
    const manager = await viem.deployContract("CompanyAndCampaignManager", [token.address]);
    await token.write.updateMinterContract([manager.address], { account: owner.account });
    
    await manager.write.registerCompany(["Test Company"], { account: company.account });
    
    const companyData = await manager.read.getCompany([company.account.address]);
    assert.equal(companyData.companyName, "Test Company");
    assert.equal(companyData.isRegistered, true);
    
    const campaignId = await manager.write.createCampaign([
      parseEther("5"),    // goal: 5 ETH
      parseEther("0.1"),  // min: 0.1 ETH
      30n,                // 30 days
      1500n               // 15% return
    ], { account: company.account });
    
    const campaign = await manager.read.getCampaign([1n]);
    assert.equal(campaign.goalAmount, parseEther("5"));
    assert.equal(campaign.ownerAddress.toLowerCase(), company.account.address.toLowerCase());
    assert.equal(campaign.active, true);
  });

  it("Should handle investment and token minting", async function () {
    const [owner, company, investor] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [owner.account.address]);
    const manager = await viem.deployContract("CompanyAndCampaignManager", [token.address]);
    await token.write.updateMinterContract([manager.address], { account: owner.account });
    
    await manager.write.registerCompany(["Test Company"], { account: company.account });
    await manager.write.createCampaign([
      parseEther("5"),
      parseEther("0.1"),
      30n,
      1500n
    ], { account: company.account });
    
    const investmentAmount = parseEther("1");
    await manager.write.invest([1n], { 
      account: investor.account,
      value: investmentAmount
    });
    
    const investorBalance = await token.read.balanceOf([investor.account.address]);
    assert.equal(investorBalance, 100n); // 100 MPY tokens (not ETH)
    
    const investment = await manager.read.getInvestment([1n, investor.account.address]);
    assert.equal(investment, investmentAmount);
    
    const campaign = await manager.read.getCampaign([1n]);
    assert.equal(campaign.totalRaised, investmentAmount);
  });

  it("Should reach goal and allow fund distribution", async function () {
    const [owner, company, investor] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [owner.account.address]);
    const manager = await viem.deployContract("CompanyAndCampaignManager", [token.address]);
    await token.write.updateMinterContract([manager.address], { account: owner.account });
    
    await manager.write.registerCompany(["Test Company"], { account: company.account });
    await manager.write.createCampaign([
      parseEther("1"),    // goal: 1 ETH
      parseEther("0.1"),
      30n,
      1500n
    ], { account: company.account });
    
    await manager.write.invest([1n], { 
      account: investor.account,
      value: parseEther("1")
    });
    
    const campaignAfterInvestment = await manager.read.getCampaign([1n]);
    assert.equal(campaignAfterInvestment.goalReached, true);
    assert.equal(campaignAfterInvestment.active, false);
    
    const initialCompanyBalance = await viem.getPublicClient().then(client => 
      client.getBalance({ address: company.account.address })
    );
    
    await manager.write.distributeFunds([1n], { account: company.account });
    
    const finalCompanyBalance = await viem.getPublicClient().then(client => 
      client.getBalance({ address: company.account.address })
    );
    
    const campaign = await manager.read.getCampaign([1n]);
    assert.equal(campaign.fundsDistributed, true);
  });

  it("Should handle refunds for failed campaigns", async function () {
    const [owner, company, investor] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [owner.account.address]);
    const manager = await viem.deployContract("CompanyAndCampaignManager", [token.address]);
    await token.write.updateMinterContract([manager.address], { account: owner.account });
    
    await manager.write.registerCompany(["Test Company"], { account: company.account });
    await manager.write.createCampaign([
      parseEther("5"),    // goal: 5 ETH (won't be reached)
      parseEther("0.1"),
      30n,
      1500n
    ], { account: company.account });
    
    await manager.write.invest([1n], { 
      account: investor.account,
      value: parseEther("1")
    });
    
    await manager.write.pauseCampaign([1n], { account: owner.account });
    
    const initialBalance = await viem.getPublicClient().then(client => 
      client.getBalance({ address: investor.account.address })
    );
    const initialTokens = await token.read.balanceOf([investor.account.address]);
    
    await manager.write.refund([1n], { account: investor.account });
    
    const finalTokens = await token.read.balanceOf([investor.account.address]);
    assert.equal(finalTokens, 0n); // All tokens should be burned
    
    const investment = await manager.read.getInvestment([1n, investor.account.address]);
    assert.equal(investment, 0n);
  });

  it("Should prevent investment after deadline", async function () {
    const [owner, company, investor] = await viem.getWalletClients();
    
    const token = await viem.deployContract("MoPy", [owner.account.address]);
    const manager = await viem.deployContract("CompanyAndCampaignManager", [token.address]);
    await token.write.updateMinterContract([manager.address], { account: owner.account });
    
    await manager.write.registerCompany(["Test Company"], { account: company.account });
    await manager.write.createCampaign([
      parseEther("5"),
      parseEther("0.1"),
      1n,  // 1 day
      1500n
    ], { account: company.account });
    
    // Skip 2 days using Hardhat Network
    const publicClient = await viem.getPublicClient();
    await publicClient.request({
      method: "evm_increaseTime",
      params: [2 * 24 * 60 * 60] // 2 days in seconds
    });
    await publicClient.request({
      method: "evm_mine"
    });
    
    try {
      await manager.write.invest([1n], { 
        account: investor.account,
        value: parseEther("1")
      });
      assert.fail("Should have reverted");
    } catch (error) {
      assert(error.message.includes("Campaign deadline has passed"));
    }
  });
});