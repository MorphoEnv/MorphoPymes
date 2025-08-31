// Blockchain Services for MorphoPymes
// This file contains services for interacting with the CompanyAndCampaignManager smart contract

import { createThirdwebClient, getContract, prepareContractCall, sendTransaction, readContract, toWei } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { baseSepolia } from "thirdweb/chains";
import { BLOCKCHAIN_CONFIG } from "./blockchainConfig";

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
    // Create MetaMask wallet instance
    const wallet = createWallet("io.metamask");
    
    try {
      // Connect the wallet with Base Sepolia chain
      const account = await wallet.connect({ 
        client,
        chain: baseSepolia
      });
      return account;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect wallet. Please make sure MetaMask is installed and unlocked.');
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
   * Get all campaigns
   */
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      await this.ensureInitialized();
      
      const campaignCount = await readContract({
        contract: this.contract,
        method: "function getCampaignCount() view returns (uint256)",
        params: []
      });

      const campaigns: Campaign[] = [];
      for (let i = 0; i < Number(campaignCount); i++) {
        try {
          const campaign = await this.getCampaignById(i.toString());
          if (campaign && campaign.isActive) {
            campaigns.push(campaign);
          }
        } catch (error) {
          console.warn(`Failed to get campaign ${i}:`, error);
        }
      }

      return campaigns;
    } catch (error) {
      console.error('Failed to get campaigns:', error);
      return [];
    }
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(campaignId: string): Promise<Campaign | null> {
    try {
      await this.ensureInitialized();
      
      const result = await readContract({
        contract: this.contract,
        method: "function getCampaign(uint256 campaignId) view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, bool, bool, address)",
        params: [BigInt(campaignId)]
      });

      if (!result || !result[9]) {
        return null;
      }

      return {
        campaignId: result[0].toString(),
        companyId: result[1].toString(),
        fundingGoal: result[2].toString(),
        minInvestment: result[3].toString(),
        expectedROI: Number(result[4]),
        interestRate: Number(result[5]),
        paymentDaysAfterGoal: Number(result[6]),
        totalFunds: result[7].toString(),
        fundingDeadline: new Date(Number(result[8]) * 1000),
        isActive: result[9],
        isFunded: result[10],
        creator: result[11]
      };
    } catch (error) {
      console.error('Failed to get campaign:', error);
      return null;
    }
  }

  /**
   * Invest in a campaign
   */
  async investInCampaign(campaignId: string, amount: string): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const account = await this.getConnectedAccount();
      if (!account?.address) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      const transaction = prepareContractCall({
        contract: this.contract,
        method: "function investInCampaign(uint256 campaignId)",
        params: [BigInt(campaignId)],
        value: toWei(amount)
      });

      const result = await sendTransaction({
        transaction,
        account
      });

      return result.transactionHash;
    } catch (error) {
      console.error('Failed to invest in campaign:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();