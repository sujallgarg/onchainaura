/* eslint-disable @typescript-eslint/no-explicit-any */
// Filename: app/api/hello/route.ts

import { NextRequest, NextResponse } from "next/server";
import { BasescanResponse, TokenBalance, Transaction, ZerionPortfolio } from './types';
const getTokenBalances = async (userAddress: string) : Promise<TokenBalance[]|[]> => {
  try {
    
    const url = `https://deep-index.moralis.io/api/v2.2/${userAddress}/erc20?chain=base`;
    // call url with X-API-Key in headers
    const options = {
      method: 'GET',
      headers: {
        'X-API-Key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjYxOGRmNTdhLTg0N2QtNDI2MS05ZjExLTYzNTU0N2UxYzRkYyIsIm9yZ0lkIjoiNDIzMDcyIiwidXNlcklkIjoiNDM1MTE1IiwidHlwZUlkIjoiYWQwNzkzMzMtNzFhZS00ZDU0LTk4NmItMjNmY2MxMjhlZWI4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzU0Njc5MzksImV4cCI6NDg5MTIyNzkzOX0.qniJd6GLum7N0e7LBsJrdsKVZMiMjiDVilevthkAKvw'
      }
    };
    const res = await fetch(url, options);
    const data = await res.json() as TokenBalance[];
    return data;
  } catch (e) {
    console.error("Error in getTokenBalances: ", e);
    return [];
  }
}

function analyzeTokens(tokenBalances: TokenBalance[]) {
  // Basic containers for stats
  let totalTokens = 0;                // Number of distinct tokens
  let spamTokenCount = 0;             // How many tokens are flagged as spam
  let verifiedTokenCount = 0;         // How many tokens have verified_contract = true
  let sumSecurityScore = 0;           // Sum of security scores for averaging
  let countSecurityScore = 0;         // Track how many tokens have a valid security_score
  let largeHoldingCount = 0;          // # tokens where user holds > X% of total supply
  const largeHoldinTokens: TokenBalance[] = [];
  
  // For demonstration, we assume you'll handle token prices separately.
  // If you have the user’s total holdings in USD, you can incorporate it.

  for (const token of tokenBalances) {
    totalTokens++;

    // 1) Check spam
    if (token.possible_spam) {
      spamTokenCount++;
    }

    // 2) Check if verified
    if (token.verified_contract) {
      verifiedTokenCount++;
    }

    // 3) Security score
    if (typeof token.security_score === 'number') {
      sumSecurityScore += token.security_score;
      countSecurityScore++;
    }

    // 4) Holding concentration
    // e.g., if user has more than 1% (0.01) or 5% (0.05) or 10% of total supply
    // This threshold can be adjusted
    const holdingPct = token.percentage_relative_to_total_supply || 0;
    if (holdingPct >= 1) {
      largeHoldingCount++;
      largeHoldinTokens.push(token);
    }

    // 5) If you had a real-time token price feed, 
    // you'd multiply the user’s 'balance' (converted to base units)
    // by the token price to estimate USD value.
    // For now, we set totalBalanceUSD = 0 or do a placeholder:
    // totalBalanceUSD += getTokenPrice(token_address) * (balance in base units)
    // const balanceInDecimal = Number(token.balance) / Math.pow(10, token.decimals);
    // get top 5 balance tokens
  }

  // 6) Derive some final metrics
  const avgSecurityScore = countSecurityScore > 0
    ? sumSecurityScore / countSecurityScore
    : 0;

  // Potentially, define a partial "portfolio health" or "token portfolio" score
  // based on these stats. For example:
  // - If spamTokenCount is high => subtract from score
  // - If avgSecurityScore is low => portfolio might be riskier
  // - If largeHoldingCount is high => user invests in smaller tokens or big whales
  // - If verifiedTokenCount is high => user invests in well-known / verified tokens

  // Return an object with all the stats; your main Aura Score function
  // can incorporate these as desired:
  return {
    totalTokens,
    spamTokenCount,
    verifiedTokenCount,
    avgSecurityScore,
    largeHoldingCount,
    largeHoldinTokens
    // totalBalanceUSD, // if implemented
  };
}


const getWalletsPortfolio = async (userAddress: string): Promise<ZerionPortfolio | null> => {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: 'Basic emtfZGV2XzFlNzE5MjU3MDA0YzRhYzk5NDFjOTEzZDI1ZmVmMDFiOg=='
      }
    };
    const res = await fetch(`https://api.zerion.io/v1/wallets/${userAddress}/portfolio?currency=usd`, options)
    const data = await res.json() as ZerionPortfolio;
    return data;
  } catch (e) {
    console.error("Error in getWalletsPortfolio: ", e);
    return null;
  }
}

function analyzePortfolio(portfolio: any) {
  // 1) Basic validity checks
  if (!portfolio || typeof portfolio !== 'object') {
    throw new Error('Invalid portfolio data');
  }
  const {
    positions_distribution_by_type,
    positions_distribution_by_chain,
    total,
    changes
  } = portfolio;

  // 2) Sum up various types (wallet, deposited, borrowed, locked, staked)
  //    => Could reflect how diverse the user’s holdings are in different states (liquid vs. locked)
  const typeDistribution = positions_distribution_by_type || {};
  const {
    wallet = 0,
    deposited = 0,
    borrowed = 0,
    locked = 0,
    staked = 0
  } = typeDistribution;

  // 3) Multi-chain distribution
  const chainDistribution = positions_distribution_by_chain || {};
  // Compute total across all chains to verify (should match total.positions)
  let sumByChain = 0;
  for (const chain in chainDistribution) {
    sumByChain += chainDistribution[chain];
  }

  const totalPositions = total?.positions || 0;
  const totalDiff = Math.abs(sumByChain - totalPositions);

  // 4) Diversity measure: how many chains have a non-zero balance?
  const chainsUsed
    = Object.keys(chainDistribution).filter(chain => chainDistribution[chain] > 0).length;
  // 5) 1-day changes in absolute and percent
  const absoluteChange1d = changes?.absolute_1d || 0;
  const percentChange1d = changes?.percent_1d || 0; // negative if loss

  // 6) Gather meaningful metrics
  // Example: ratio of staked/locked vs. total, sign of DeFi engagement
  const stakedRatio = (staked + locked + deposited) / totalPositions;

  // Example: ratio of “borrowed” to total, sign of leveraged position
  const borrowedRatio = borrowed / totalPositions;

  // 7) Return raw metrics
  return {
    // A. Distribution by type
    wallet,
    deposited,
    borrowed,
    locked,
    staked,
    stakedRatio,
    borrowedRatio,

    // B. Distribution by chain
    sumByChain,     // sum of chain values
    chainsUsed,     // how many chains the user is active on
    totalPositions, // total from portfolio.total
    totalDiff,      // difference between sumByChain & totalPositions

    // C. 1d Performance
    absoluteChange1d,
    percentChange1d
  };
}

// const ApiServices = async () => {
//   try{
//     getTransactions("0x849151d7D0bF1F34b70d5caD5149D28CC2308bf1");
//   }catch(e){
//     console.error(e);
//   }
// }

/*********************************************************
 * UTILITY / LOOKUP TABLES
 *********************************************************/
// EXAMPLE: Known DeFi contract addresses (you can expand this list)
const KNOWN_DEFI_CONTRACTS = new Set([
  "0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
  "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
  "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
  "0x2626664c2603336E57B271c5C0b26F421741e481",
  "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
  "0x4200000000000000000000000000000000000006",
  "0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5",
  "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD",
  "0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24",
  "0x111111125421cA6dc452d289314280a0f8842A65",
  "0x95dd05950bc8CD5dEF7be0aDC600D0fadd15Bd86",
  "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
  "0x0000000000000068F116a894984e2DB1123eB395",
  "0x6Cb442acF35158D5eDa88fe602221b67B400Be3E",
  "0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891"
  // Add other DeFi addresses as needed...
]);

// EXAMPLE: Known DeFi function signatures (just a small example)
const KNOWN_DEFI_METHOD_IDS = new Set([
  // e.g., 0xe2bbb158 (Aave deposit), 0xf305d719 (Uniswap addLiquidityETH), ...
  // For demonstration, let's consider "transferOwnership" might be a special sign of advanced usage
  "0xf2fde38b", // => "transferOwnership(address newOwner)"
]);

/*********************************************************
 * PROCESS THE RESPONSE
 *********************************************************/
function analyzeTransactions(txResponse: Transaction[]) {
  // Check if the API returned properly
  if (txResponse.length === 0 || !txResponse[0].hasOwnProperty("timeStamp")) {
    throw new Error("No transactions found in the response");
  }

  const transactions = txResponse;

  // Basic containers for metrics
  let totalTxCount = 0;
  let successCount = 0;
  let failCount = 0;
  let defiTxCount = 0;
  let contractDeployCount = 0;
  const timestamps: number[] = [];

  for (const tx of transactions) {
    totalTxCount++;

    // 1) Check success/fail
    const isError = (tx.isError === "1" || tx.txreceipt_status === "0");
    if (isError) {
      failCount++;
    } else {
      successCount++;
    }

    // 2) Collect timestamp for frequency analysis
    // Convert to number (it's in seconds, typically)
    const txTime = Number(tx.timeStamp) * 1000; // convert to ms if needed
    timestamps.push(txTime);

    // 3) Check if it's a "DeFi" transaction
    // Simple heuristics: if `to` or `contractAddress` is known, or methodId is known
    const toAddress = (tx.to || "").toLowerCase();
    const contractCreated = (tx.contractAddress || "").toLowerCase();
    const methodId = (tx.methodId || "").toLowerCase();

    if (tx.to === null || tx.to === '') {
      // console.log("contractDeployed: ", tx.hash);
      contractDeployCount++;
    }
    if (!!contractCreated) {
      // console.log("contractCreated: ", contractCreated, "txHash: ", tx.hash);
      contractDeployCount++;
    }
    const isDefiContract =
      KNOWN_DEFI_CONTRACTS.has(toAddress) ||
      KNOWN_DEFI_CONTRACTS.has(contractCreated);
    const isDefiMethod = KNOWN_DEFI_METHOD_IDS.has(methodId);

    if (isDefiContract || isDefiMethod) {
      defiTxCount++;
    }
  }

  // Sort timestamps (ascending)
  timestamps.sort((a, b) => a - b);

  // 4) Calculate frequency metrics
  // For example: average time gap (ms) between consecutive transactions
  let totalGap = 0;
  for (let i = 1; i < timestamps.length; i++) {
    totalGap += (timestamps[i] - timestamps[i - 1]);
  }
  const avgGapMillis = timestamps.length > 1
    ? totalGap / (timestamps.length - 1)
    : 0;

  // Convert milliseconds to days (for demonstration)
  let avgGapDays = avgGapMillis / (1000 * 60 * 60 * 24);
  if(!avgGapDays){
    avgGapDays = 0;
  }

  // 5) Return analysis
  return {
    totalTxCount,
    successCount,
    failCount,
    successRate: successCount / totalTxCount, // fraction
    averageTimeGapDays: avgGapDays,
    defiTxCount,
    contractDeployCount
  };
}

async function getTransactions(userAddress: string): Promise<Transaction[]> {
  try {
    // run the API call until it reaches the transaction from last year
    // I want all transaction that starts from 1st January 2024
    let page = 1;
    const offset = 100;
    const transactions: Transaction[] = [];
    let hasMore = true;
    let lastTransactionTime = Date.now();
    const lastYear = 2024;
    // let blockAtLastYear = 8638927;
    while (hasMore) {
      const url = `https://api.basescan.org/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=7CKA9EHPB4C4PFPAX77XSWNJZBBPA5EXQT`
      const response = await fetch(url);
      const data = await response.json() as BasescanResponse;
      
      if(data.result == null){
        hasMore = false;
      }else{
        transactions.push(...data.result);
      }
      if (data.result.length < offset) {
        hasMore = false;
      } else {
        lastTransactionTime = Number(data.result[data.result.length - 1].timeStamp) * 1000;
        if (new Date(lastTransactionTime).getFullYear() < lastYear) {
          hasMore = false;
        }
        page++;
      }
    }
    return transactions;

  } catch (e) {
    console.error("Error in getTransactions: ", e);
    return [];
  }
}

function computePortfolioScore(portfolioAnalysis: any) {
  let score = 0;

  // Reward multi-chain usage
  if (portfolioAnalysis.chainsUsed < 2) {
    score += 10 * portfolioAnalysis.chainsUsed;  // user is not diversified
  } else if (portfolioAnalysis.chainsUsed > 5) {
    score += 20 * portfolioAnalysis.chainsUsed;  // user is diversified
  } else {
    score += 15 * portfolioAnalysis.chainsUsed;  // user is somewhat diversified
  }

  // Reward staked ratio, penalize borrowed ratio
  score += portfolioAnalysis.stakedRatio * 30; // up to +20 if 100% staked
  score += portfolioAnalysis.borrowedRatio * 10; // if heavily borrowed, penalize

  // If big negative daily changes, penalize (optional)
  if (portfolioAnalysis.percentChange1d < -5) {
    score += 100;
  }
  score += Math.abs(portfolioAnalysis.absoluteChange1d * 0.1); // up to +50 if big positive change

  return score;
}


function computeTokenScore(analysis: any) {
  let score = 0;

  score += analysis.verifiedTokenCount * 10; // 10 points per token

  score += (analysis.totalTokens - analysis.verifiedTokenCount) 

  // If average security score is low
  if (analysis.avgSecurityScore < 50 && analysis.avgSecurityScore > 0) {
    // Subtract some portion based on how low the security is
    score += analysis.avgSecurityScore;
  }else if(analysis.avgSecurityScore > 50 && analysis.avgSecurityScore < 80){
    score += analysis.avgSecurityScore * 2;
  }else{
    score += analysis.avgSecurityScore * 5;
  }

  // If user holds a large fraction of the supply in many tokens => might be high risk
  if (analysis.largeHoldingCount > 0) {
    score += analysis.largeHoldingCount * 2;
  }

  return score;
}

function computeTxFrequencyScore(avgGapDays: number) {
  // If avgGapDays is small => user transacts often => higher score
  if (avgGapDays === 0) return 0;
  return Math.max(0, 100 - avgGapDays);
}

function computeTxCountScore(txCount: number, defiTxCount: number) {
  // The more transactions, the higher the score
  // But DeFi transactions are more valuable, so we give them a higher weight
  return txCount + defiTxCount * 10;
}


async function getAuraScore(userAddress: string): Promise<number> {
  try {
    const [portfolio, tokenBalances, transactions] = await Promise.all([
      getWalletsPortfolio(userAddress),
      getTokenBalances(userAddress),
      getTransactions(userAddress)
    ]);
  
    const [portfolioResult, tokenResult, transactionResult] = await Promise.all([
      analyzePortfolio(portfolio?.data.attributes),
      analyzeTokens(tokenBalances),
      analyzeTransactions(transactions)
    ]);

    console.log("Portfolio analysis:", portfolioResult);
    console.log("Token analysis:", tokenResult);
    console.log("Transaction analysis:", transactionResult);
  
    // Combine or weight them however you like:
    const auraScore = computeTxFrequencyScore(transactionResult.averageTimeGapDays)
      + computeTxCountScore(transactionResult.successCount, transactionResult.defiTxCount)
      + computeTokenScore(tokenResult)
      + computePortfolioScore(portfolioResult);
  
    console.log("Aura score:", auraScore);
  
    console.log('Hello World');
    return auraScore;
    
  } catch (error) {
    console.error("Error in getAuraScore: ", error);
    return 0;
  }
}

async function requestHandler(_request: NextRequest): Promise<NextResponse> {
  console.log("Hello from Next.js!");
  const url = new URL(_request.url);
  const params = url.searchParams;
  const address = params.get('address');
  if (!address) {
    return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
  }
  console.log({address})
  const auraScore = await getAuraScore(address)
  return NextResponse.json({ auraScore });
}

export { requestHandler as GET };