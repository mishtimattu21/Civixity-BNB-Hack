import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Generating frontend integration files...");

  // Read deployment info
  const deploymentPath = path.join(process.cwd(), "deployment-info.json");
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment info not found. Please run deployment first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const { civiToken, issueManager } = deploymentInfo.contracts;

  // Get contract artifacts
  const civiTokenArtifact = await ethers.getContractFactory("CiviToken");
  const issueManagerArtifact = await ethers.getContractFactory("IssueManager");

  // Create contracts.json
  const contractsConfig = {
    networks: {
      localhost: {
        chainId: 31337,
        rpcUrl: "http://127.0.0.1:8545",
        explorer: "http://localhost:8545",
        currency: "tBNB",
        contracts: {
          civiToken: {
            address: civiToken,
            abi: civiTokenArtifact.interface.formatJson()
          },
          issueManager: {
            address: issueManager,
            abi: issueManagerArtifact.interface.formatJson()
          }
        }
      }
    }
  };

  // Create blockchainService.ts
  const blockchainServiceContent = `import { ethers } from 'ethers';
import contractConfig from './contracts.json';

declare global {
  interface Window {
    ethereum: any;
  }
}

export class BlockchainService {
  private provider: ethers.Provider;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(contractConfig.networks.localhost.rpcUrl);
  }

  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      
      if (!account) {
        throw new Error('No accounts found');
      }

      // Check if we're on the correct network (localhost for development)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const expectedChainId = '0x7a69'; // 31337 in hex for localhost
      
      if (chainId !== expectedChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: expectedChainId }],
          });
        } catch (switchError: any) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: expectedChainId,
                chainName: 'Hardhat Local',
                nativeCurrency: {
                  name: 'tBNB',
                  symbol: 'tBNB',
                  decimals: 18
                },
                rpcUrls: ['http://127.0.0.1:8545'],
                blockExplorerUrls: ['http://localhost:8545']
              }],
            });
          } else {
            throw new Error('Please switch to Hardhat Local network in MetaMask');
          }
        }
      }

      this.signer = new ethers.BrowserProvider(window.ethereum).getSigner();
      return account;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  private getContract(contractName: string) {
    const config = contractConfig.networks.localhost.contracts[contractName];
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return new ethers.Contract(config.address, config.abi, this.signer);
  }

  async createIssue(title: string, description: string): Promise<void> {
    const issueManager = this.getContract('issueManager');
    const tx = await issueManager.createIssue(title, description);
    await tx.wait();
  }

  async upvoteIssue(issueId: number): Promise<void> {
    const issueManager = this.getContract('issueManager');
    const tx = await issueManager.upvoteIssue(issueId);
    await tx.wait();
  }

  async downvoteIssue(issueId: number): Promise<void> {
    const issueManager = this.getContract('issueManager');
    const tx = await issueManager.downvoteIssue(issueId);
    await tx.wait();
  }

  async getTokenBalance(address?: string): Promise<string> {
    const civiToken = this.getContract('civiToken');
    const balance = await civiToken.balanceOf(address || await this.signer!.getAddress());
    return ethers.formatEther(balance);
  }

  async getIssues(): Promise<any[]> {
    const issueManager = this.getContract('issueManager');
    const issueCount = await issueManager.getIssueCount();
    const issues = [];
    
    for (let i = 0; i < issueCount; i++) {
      const issue = await issueManager.getIssue(i);
      issues.push({
        id: i,
        title: issue.title,
        description: issue.description,
        upvotes: issue.upvotes.toString(),
        downvotes: issue.downvotes.toString(),
        creator: issue.creator,
        createdAt: new Date(issue.createdAt * 1000).toISOString()
      });
    }
    
    return issues;
  }
}

export default BlockchainService;
`;

  // Create useBlockchain.ts
  const useBlockchainContent = `import { useState, useEffect } from 'react';
import BlockchainService from './blockchainService';

export const useBlockchain = () => {
  const [service] = useState(() => new BlockchainService());
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [issues, setIssues] = useState<any[]>([]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await service.connectWallet();
      setIsConnected(true);
      await getTokenBalance();
      await getIssues();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createIssue = async (title: string, description: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await service.createIssue(title, description);
      await getIssues(); // Refresh issues list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const upvoteIssue = async (issueId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await service.upvoteIssue(issueId);
      await getIssues(); // Refresh issues list
      await getTokenBalance(); // Refresh balance
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downvoteIssue = async (issueId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await service.downvoteIssue(issueId);
      await getIssues(); // Refresh issues list
      await getTokenBalance(); // Refresh balance
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenBalance = async () => {
    try {
      const balance = await service.getTokenBalance();
      setTokenBalance(balance);
    } catch (err: any) {
      console.error('Error getting token balance:', err);
    }
  };

  const getIssues = async () => {
    try {
      const issuesList = await service.getIssues();
      setIssues(issuesList);
    } catch (err: any) {
      console.error('Error getting issues:', err);
    }
  };

  return {
    connectWallet,
    createIssue,
    upvoteIssue,
    downvoteIssue,
    getTokenBalance,
    isConnected,
    isLoading,
    error,
    tokenBalance,
    issues
  };
};
`;

  // Create types.ts
  const typesContent = `export interface Issue {
  id: number;
  title: string;
  description: string;
  upvotes: string;
  downvotes: string;
  creator: string;
  createdAt: string;
}

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
`;

  // Write files
  const frontendDir = path.join(process.cwd(), "..", "Civixity-BNB-Hack", "src", "blockchain");
  
  // Ensure directory exists
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  fs.writeFileSync(path.join(frontendDir, "contracts.json"), JSON.stringify(contractsConfig, null, 2));
  fs.writeFileSync(path.join(frontendDir, "blockchainService.ts"), blockchainServiceContent);
  fs.writeFileSync(path.join(frontendDir, "useBlockchain.ts"), useBlockchainContent);
  fs.writeFileSync(path.join(frontendDir, "types.ts"), typesContent);

  console.log("Files created:");
  console.log("- contracts.json: Contract addresses and ABIs");
  console.log("- types.ts: TypeScript type definitions");
  console.log("- blockchainService.ts: Web3 integration utilities");
  console.log("- useBlockchain.ts: React hooks for blockchain interaction");

  console.log("\\nNext steps:");
  console.log("1. Copy the generated files to your React app");
  console.log("2. Install ethers.js: npm install ethers");
  console.log("3. Use the useBlockchain hook in your components");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Frontend integration failed:", error);
    process.exit(1);
  }); 