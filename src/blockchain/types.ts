// Auto-generated contract types
export interface ContractConfig {
  networks: {
    [network: string]: {
      chainId: number;
      rpcUrl: string;
      explorer: string;
      currency: string;
      contracts: {
        [contract: string]: {
          address: string;
          abi: string;
        };
      };
    };
  };
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  upvotes: string;
  downvotes: string;
  creator: string;
  createdAt: string;
}

export interface UserVote {
  hasVoted: boolean;
  voteDirection: boolean;
}

export interface GasReimbursement {
  user: string;
  gasSpent: string;
  tokensReimbursed: string;
}
