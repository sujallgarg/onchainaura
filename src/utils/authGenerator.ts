/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export async function calculateAuraPoints(address: string) {
  try {

    // Fetch Ethereum transactions
    const etherscanResponse = await axios.get(
      `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.ETHERSCAN_API_KEY}`
    );

    // Fetch Base chain transactions
    const baseScanResponse = await axios.get(
      `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.BASESCAN_API_KEY}`
    );

    const ethTransactions = etherscanResponse.data.result || [];
    const baseTransactions = baseScanResponse.data.result || [];
    const allTransactions = [...ethTransactions, ...baseTransactions];

    // Calculate activity metrics
    const auraPoints = calculateActivityMetrics(allTransactions);

    return auraPoints;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return null;
  }
}

// Helper function to compute aura points
function calculateActivityMetrics(transactions: any) {
  let totalValue = 0;
  const transactionCount = transactions.length;

  // Compute total value transferred
  transactions.forEach((tx: any) => {
    totalValue += parseFloat(tx.value) / 1e18;
  });

  // Calculate aura points (simplified logic)
  const activityScore = transactionCount + Math.sqrt(totalValue);
  const vibe =
    activityScore > 100 ? "Legendary" :
    activityScore > 50 ? "Epic" :
    activityScore > 20 ? "Rare" :
    "Common";

  return {
    transactionCount,
    totalValue: totalValue.toFixed(2),
    activityScore: activityScore.toFixed(2),
    vibe,
  };
}
