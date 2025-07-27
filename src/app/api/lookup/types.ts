/* eslint-disable  @typescript-eslint/no-explicit-any */
export type BasescanResponse = {
    status: string,
    message: string,
    result: Transaction[]
}

export type Transaction = {
    blockHash: string;
    blockNumber: string;
    confirmations: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    input: string;
    isError: string;
    nonce: string;
    timeStamp: string;
    to: string;
    transactionIndex: string;
    txreceipt_status: string;
    value: string;
    methodId: string;
    functionName: string;
}

export type ZerionPortfolio = {
    links: {
        self: string;
    },
    data: {
        type: string;
        id: string;
        attributes: any;
    }
}

export type AlchemyTokenBalances = {
    jsonrpc: string;
    id: number;
    result: {
        address: string;
        tokenBalances: TokenBalance[];
        pageKey: string
    }
}

export type TokenBalance = {
    token_address: string;
    symbol: string;
    name: string;
    logo: string;
    thumbnail: string;
    decimals: number;
    balance: string;
    possible_spam: boolean;
    verified_contract: boolean;
    total_supply: string;
    total_supply_formatted: string;
    percentage_relative_to_total_supply: number;
    security_score: number;
}