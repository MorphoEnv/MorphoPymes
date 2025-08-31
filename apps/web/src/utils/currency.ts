export function getUsdPerEth(): number {
  // Configure via NEXT_PUBLIC_USD_PER_ETH, fallback to 2000 USD/ETH if not set
  const v = process.env.NEXT_PUBLIC_USD_PER_ETH;
  const parsed = Number(v);
  if (!isNaN(parsed) && parsed > 0) return parsed;
  return 2000;
}

export function usdToEth(usd: number): number {
  const rate = getUsdPerEth();
  return usd / rate;
}

export function formatEth(eth: number, decimals = 6): string {
  // show up to `decimals` but trim trailing zeros
  const s = eth.toFixed(decimals);
  return trimTrailingZeros(s);
}

export function formatUsd(amount: number): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  } catch (e) {
    return `$${amount}`;
  }
}

export function formatUsdWithEth(usd: number): string {
  const eth = usdToEth(Number(usd) || 0);
  return `${formatUsd(Number(usd) || 0)} (≈ ${formatEth(eth)} ETH)`;
}

function trimTrailingZeros(s: string) {
  if (s.indexOf('.') === -1) return s;
  return s.replace(/\.0+$|(?<=\d)0+$/,'').replace(/\.$/, '');
}
