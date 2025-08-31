// Blockchain Services for MorphoPymes
// This file contains services for interacting with the CompanyAndCampaignManager smart contract

import { createThirdwebClient, getContract, prepareContractCall, sendTransaction, readContract, toWei } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { baseSepolia } from "thirdweb/chains";
import { BLOCKCHAIN_CONFIG } from "./blockchainConfig";
import { currencyService } from "./currencyService";

// Create Thirdweb client
const client = createThirdwebClient({
  clientId: BLOCKCHAIN_CONFIG.CLIENT_ID,
});

export interface Company {
  companyId: string;
  companyName: string;
  registrationDate: Date;
  isRegistered: boolean;
  owner: string;
  companyAddress: string;
}

export interface Campaign {
  campaignId: string;
  companyId: string;
  fundingGoal: string;
  minInvestment: string;
  expectedROI: number;
  interestRate: number;
  paymentDaysAfterGoal: number;
  totalFunds: string;
  fundingDeadline: Date;
  isActive: boolean;
  isFunded: boolean;
  creator: string;
}

export interface Investment {
  investmentId: string;
  campaignId: string;
  investor: string;
  amount: string;
  investmentDate: Date;
  expectedReturn: string;
}

export class BlockchainService {
  private contract: any = null;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the blockchain service
   */
  private async initializeService(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && !this.isInitialized) {
        this.contract = getContract({
          client,
          address: BLOCKCHAIN_CONFIG.MANAGER_CONTRACT_ADDRESS,
          chain: baseSepolia
        });
        this.isInitialized = true;
        console.log('Thirdweb service initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
    }
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized || !this.contract) {
      await this.initializeService();
    }
  }

  /**
   * Get connected wallet account for Thirdweb v5
   */
  private async getConnectedAccount(): Promise<any> {
    try {
      // First check if MetaMask is available
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      const ethereum = (window as any).ethereum;
      
      // Always request account access to show MetaMask UI
      console.log('🔄 Requesting MetaMask account access...');
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      console.log('✅ MetaMask accounts found:', accounts);

      // Check current chain
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      const baseSepolia = '0x14a34'; // Base Sepolia chain ID
      
      if (currentChainId !== baseSepolia) {
        console.log('🔄 Switching to Base Sepolia...');
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseSepolia }],
          });
        } catch (switchError: any) {
          // If chain doesn't exist, add it
          if (switchError.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: baseSepolia,
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia-explorer.base.org'],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Create MetaMask wallet instance
      const wallet = createWallet("io.metamask");
      
      // Connect the wallet
      const account = await wallet.connect({ 
        client,
        chain: baseSepolia as any
      });
      
      console.log('✅ Thirdweb account connected:', account.address);
      return account;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get provider (MetaMask, etc.)
   */
  private async getProvider(): Promise<any | null> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  }

  /**
   * Get signer address safely
   */
  private async getSignerAddress(): Promise<string | null> {
    try {
      const account = await this.getConnectedAccount();
      return account?.address?.toLowerCase() || null;
    } catch (error) {
      console.warn('Failed to get signer address:', error);
      return null;
    }
  }

  /**
   * Get next available company ID
   */
  async getNextCompanyId(): Promise<string> {
    try {
      await this.ensureInitialized();
      
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      const result = await readContract({
        contract: this.contract,
        method: "function getNextCompanyId() view returns (uint256)",
        params: []
      });

      return result.toString();
    } catch (error) {
      console.error('Failed to get next company ID:', error);
      return "1"; // Fallback to 1 if can't read
    }
  }

  /**
   * Get next available campaign ID
   */
  async getNextCampaignId(): Promise<string> {
    try {
      await this.ensureInitialized();
      
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      const result = await readContract({
        contract: this.contract,
        method: "function getNextCampaignId() view returns (uint256)",
        params: []
      });

      return result.toString();
    } catch (error) {
      console.error('Failed to get next campaign ID:', error);
      return "1"; // Fallback to 1 if can't read
    }
  }

  /**
   * Register a new company
   */
  async registerCompany(companyName: string): Promise<{ companyId: string; txHash: string }> {
    try {
      await this.ensureInitialized();
      
      // Get connected account
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet to register a company.');
      }

      // Prepare the transaction
      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function registerCompany(string companyName)",
        params: [companyName],
      });

      // Send the transaction
      const result = await sendTransaction({
        transaction,
        account
      });

      return { 
        companyId: "1", // You'll need to parse this from events
        txHash: result.transactionHash 
      };
    } catch (error) {
      console.error('Failed to register company:', error);
      throw error;
    }
  }

  /**
   * Get company details by ID
   */
  async getCompanyById(companyId: string): Promise<Company | null> {
    try {
      await this.ensureInitialized();
      
      const result = await readContract({
        contract: this.contract,
        method: "function getCompany(uint256 companyId) view returns (uint256, string, uint256, bool, address, address)",
        params: [BigInt(companyId)]
      });

      if (!result || !result[3]) {
        return null;
      }

      return {
        companyId: result[0].toString(),
        companyName: result[1],
        registrationDate: new Date(Number(result[2]) * 1000),
        isRegistered: result[3],
        owner: result[4],
        companyAddress: result[5]
      };
    } catch (error) {
      console.error('Failed to get company:', error);
      throw error;
    }
  }

  /**
   * Get ETH balance for current user
   */
  async getEthBalance(): Promise<string> {
    try {
      const address = await this.getSignerAddress();
      if (!address) return '0';

      const provider = await this.getProvider();
      if (!provider) return '0';

      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      // Convert from wei to ETH
      return (parseInt(balance, 16) / 1e18).toString();
    } catch (error) {
      console.error('Failed to get ETH balance:', error);
      return '0';
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(
    companyId: string,
    fundingGoal: string,
    minInvestment: string,
    expectedROI: number,
    interestRate: number,
    paymentDaysAfterGoal: number
  ): Promise<{ campaignId: string; txHash: string }> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function createCampaign(uint256 companyId, uint256 fundingGoal, uint256 minInvestment, uint256 expectedROI, uint256 interestRate, uint256 paymentDaysAfterGoal)",
        params: [
          BigInt(companyId),
          toWei(fundingGoal),
          toWei(minInvestment),
          BigInt(Math.floor(expectedROI)),
          BigInt(Math.floor(interestRate)),
          BigInt(paymentDaysAfterGoal)
        ]
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return { 
        campaignId: "1", // Parse from events
        txHash: result.transactionHash 
      };
    } catch (error) {
      console.error('Failed to create campaign:', error);
      throw error;
    }
  }

  /**
   * Get all campaigns - simplified version without campaignCount
   */
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      await this.ensureInitialized();
      console.log('Getting all campaigns from blockchain...');
      
      const campaigns: Campaign[] = [];
      
      // Try to get first few campaigns (0-9) and stop when we hit errors
      // Start with a smaller range to avoid timeout issues
      for (let i = 0; i < 10; i++) {
        try {
          const campaign = await this.getCampaignById(i.toString());
          if (campaign) {
            console.log(`Found campaign ${i}:`, campaign);
            campaigns.push(campaign);
          }
        } catch (error) {
          // If we can't get a campaign, assume we've reached the end
          console.log(`No more campaigns found after ${i}`);
          break;
        }
      }

      console.log(`Total campaigns found: ${campaigns.length}`);
      return campaigns;
    } catch (error) {
      console.error('Failed to get campaigns:', error);
      return [];
    }
  }

  /**
   * Get campaign by ID - simplified approach
   */
  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    try {
      await this.ensureInitialized();
      console.log(`Getting campaign ${campaignId} from contract...`);
      
      if (!this.contract) {
        console.error('Contract not initialized');
        return null;
      }
      
      // Try to access campaigns mapping directly
      const result = await readContract({
        contract: this.contract,
        method: "function campaigns(uint256) view returns (uint256, address, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, bool, bool)",
        params: [BigInt(campaignId)]
      });

      console.log(`Campaign ${campaignId} raw result:`, result);

      // If campaign doesn't exist, result[0] (companyId) will be 0
      if (!result || Number(result[0]) === 0) {
        console.log(`Campaign ${campaignId} does not exist (companyId is 0)`);
        return null;
      }

      const campaign = {
        campaignId: campaignId,
        companyId: result[0].toString(),
        fundingGoal: (Number(result[2]) / 1e18).toString(), // goalAmount
        minInvestment: (Number(result[3]) / 1e18).toString(), // minInvestment  
        expectedROI: Number(result[4]) / 100, // returnPercentage from basis points
        interestRate: Number(result[5]) / 100, // dailyPenaltyPercentage
        paymentDaysAfterGoal: Number(result[6]), // paymentDaysAfterGoal
        totalFunds: (Number(result[8]) / 1e18).toString(), // totalRaised
        fundingDeadline: result[7] > 0 ? new Date(Number(result[7]) * 1000) : new Date(), // paymentDeadline
        isActive: result[9], // active
        isFunded: result[10], // goalReached
        creator: result[1] // ownerAddress
      };

      console.log(`Parsed campaign ${campaignId}:`, campaign);
      return campaign;
    } catch (error) {
      console.error(`Failed to get campaign ${campaignId}:`, error);
      return null;
    }
  }

  /**
   * Invest in a campaign
   */
  async investInCampaign(campaignId: string, amountEth: string): Promise<string> {
    try {
      console.log(`🔗 Starting blockchain investment: Campaign ${campaignId}, Amount: ${amountEth} ETH`);
      
      await this.ensureInitialized();
      
      // Force connection to MetaMask with UI
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      console.log(`💰 Connected wallet: ${account.address}`);
      console.log(`📊 Contract address: ${this.contract.address}`);

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function invest(uint256 _campaignId) payable",
        params: [BigInt(campaignId)],
        value: toWei(amountEth)
      });

      console.log(`🚀 Sending transaction...`);
      console.log('Transaction details:', {
        campaignId,
        amountEth,
        valueWei: toWei(amountEth).toString(),
        account: account.address
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      console.log(`✅ Investment successful! TX Hash: ${result.transactionHash}`);
      return result.transactionHash;
    } catch (error: any) {
      console.error('❌ Failed to invest in campaign:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('user rejected')) {
        throw new Error('Transaction was rejected by user.');
      } else if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient funds for this transaction.');
      } else if (error.message?.includes('gas')) {
        throw new Error('Transaction failed due to gas issues. Please try again.');
      } else if (error.message?.includes('Campaign is not active')) {
        throw new Error('This campaign is no longer active.');
      } else if (error.message?.includes('Investment amount is below the minimum')) {
        throw new Error('Investment amount is below the minimum required.');
      } else if (error.message?.includes('Campaign goal has already been reached')) {
        throw new Error('Campaign funding goal has already been reached.');
      } else if (error.message?.includes('Investment would exceed campaign goal')) {
        throw new Error('Investment amount would exceed the campaign goal. Try a smaller amount.');
      } else {
        throw new Error(`Investment failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Get user's campaigns
   */
  async getUserCampaigns(userAddress: string): Promise<Campaign[]> {
    try {
      await this.ensureInitialized();
      
      // This would need to be implemented in the contract
      // For now, we'll get all campaigns and filter by owner
      const allCampaigns = await this.getAllCampaigns();
      return allCampaigns.filter(campaign => campaign.creator.toLowerCase() === userAddress.toLowerCase());
    } catch (error) {
      console.error('Failed to get user campaigns:', error);
      return [];
    }
  }

  /**
   * Get investment amount for a specific user in a specific campaign
   */
  async getInvestmentAmount(campaignId: string, investorAddress: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const result = await readContract({
        contract: this.contract,
        method: "function getInvestment(uint256 _campaignId, address _investor) view returns (uint256)",
        params: [BigInt(campaignId), investorAddress]
      });

      return (Number(result) / 1e18).toString();
    } catch (error) {
      console.error('Failed to get investment amount:', error);
      return '0';
    }
  }

  /**
   * Get user's investments across all campaigns
   */
  async getUserInvestments(userAddress: string): Promise<{ campaignId: string; amount: string; campaign: Campaign | null }[]> {
    try {
      await this.ensureInitialized();
      
      const allCampaigns = await this.getAllCampaigns();
      const investments = [];
      
      for (const campaign of allCampaigns) {
        try {
          const investmentAmount = await readContract({
            contract: this.contract,
            method: "function getInvestment(uint256 _campaignId, address _investor) view returns (uint256)",
            params: [BigInt(campaign.campaignId), userAddress]
          });
          
          if (Number(investmentAmount) > 0) {
            investments.push({
              campaignId: campaign.campaignId,
              amount: (Number(investmentAmount) / 1e18).toString(),
              campaign
            });
          }
        } catch (error) {
          console.warn(`Failed to get investment for campaign ${campaign.campaignId}:`, error);
        }
      }
      
      return investments;
    } catch (error) {
      console.error('Failed to get user investments:', error);
      return [];
    }
  }

  /**
   * Distribute funds (withdraw raised funds) - Campaign owner only
   */
  async distributeFunds(campaignId: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function distributeFunds(uint256 _campaignId)",
        params: [BigInt(campaignId)]
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to distribute funds:', error);
      throw error;
    }
  }

  /**
   * Get required payment amount for returns (includes penalties)
   */
  async getRequiredPayment(campaignId: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const result = await readContract({
        contract: this.contract,
        method: "function getRequiredPayment(uint256 _campaignId) view returns (uint256)",
        params: [BigInt(campaignId)]
      });

      return (Number(result) / 1e18).toString();
    } catch (error) {
      console.error('Failed to get required payment:', error);
      throw error;
    }
  }

  /**
   * Return investment with interest/penalties - Campaign owner only
   */
  async returnInvestment(campaignId: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      // Get required payment amount
      const requiredAmountWei = await readContract({
        contract: this.contract,
        method: "function getRequiredPayment(uint256 _campaignId) view returns (uint256)",
        params: [BigInt(campaignId)]
      });

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function returnInvestment(uint256 _campaignId) payable",
        params: [BigInt(campaignId)],
        value: requiredAmountWei
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to return investment:', error);
      throw error;
    }
  }

  /**
   * Withdraw returns - Investor only
   */
  async withdrawReturns(campaignId: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function withdrawReturns(uint256 _campaignId)",
        params: [BigInt(campaignId)]
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to withdraw returns:', error);
      throw error;
    }
  }

  /**
   * Refund investment for failed campaigns - Investor only
   */
  async refundInvestment(campaignId: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function refund(uint256 _campaignId)",
        params: [BigInt(campaignId)]
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to refund investment:', error);
      throw error;
    }
  }

  /**
   * Pause/Unpause campaign - Campaign owner only
   */
  async toggleCampaignStatus(campaignId: string, active: boolean): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      // Note: This function might not exist in the contract, 
      // you may need to add it or handle pausing differently
      const transaction = prepareContractCall({
        contract: this.contract,
        method: active ? "function activateCampaign(uint256 _campaignId)" : "function pauseCampaign(uint256 _campaignId)",
        params: [BigInt(campaignId)]
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to toggle campaign status:', error);
      throw error;
    }
  }

  /**
   * Pay platform fees - For ads/marketing
   */
  async payOwner(amount: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function payOwner() payable",
        params: [],
        value: toWei(amount)
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to pay owner:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();