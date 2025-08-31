/* eslint-disable @typescript-eslint/no-explicit-any */
interface ExchangeRateResponse {
  USD: number;
}

class CurrencyService {
  private ethPriceCache: { price: number; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getETHPrice(): Promise<number> {
    // Check cache first
    if (this.ethPriceCache && 
        Date.now() - this.ethPriceCache.timestamp < this.CACHE_DURATION) {
      return this.ethPriceCache.price;
    }

    try {
      // Using CoinGecko API for ETH price in USD
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      const price = data.ethereum?.usd || 3000; // fallback to $3000 if API fails

      // Update cache
      this.ethPriceCache = {
        price,
        timestamp: Date.now()
      };

      return price;
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      // Return cached price if available, otherwise fallback
      return this.ethPriceCache?.price || 3000;
    }
  }

  async usdToEth(usdAmount: number): Promise<number> {
    const ethPrice = await this.getETHPrice();
    return usdAmount / ethPrice;
  }

  ethToWei(ethAmount: number): bigint {
    // 1 ETH = 10^18 wei
    return BigInt(Math.floor(ethAmount * 1e18));
  }

  async usdToWei(usdAmount: number): Promise<bigint> {
    const ethAmount = await this.usdToEth(usdAmount);
    return this.ethToWei(ethAmount);
  }

  weiToEth(weiAmount: bigint): number {
    return Number(weiAmount) / 1e18;
  }

  async weiToUsd(weiAmount: bigint): Promise<number> {
    const ethAmount = this.weiToEth(weiAmount);
    const ethPrice = await this.getETHPrice();
    return ethAmount * ethPrice;
  }

  formatCurrency(amount: number, currency: 'USD' | 'ETH' = 'USD'): string {
    if (currency === 'ETH') {
      return `${amount.toFixed(6)} ETH`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  }
}

export const currencyService = new CurrencyService();