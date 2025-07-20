import { ethers } from 'ethers';
import contractConfig from './contracts.json';

declare global {
  interface Window {
    ethereum: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
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
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const account = accounts[0];
      
      if (!account) {
        throw new Error('No accounts found');
      }

      // Check if we're on the correct network (localhost for development)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
      const expectedChainId = '0x7a69'; // 31337 in hex for localhost
      
      if (chainId !== expectedChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: expectedChainId }],
          });
        } catch (switchError: unknown) {
          const error = switchError as { code: number };
          // If the network doesn't exist, add it
          if (error.code === 4902) {
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

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await browserProvider.getSigner();
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

  async getIssues(): Promise<Array<{
    id: number;
    title: string;
    description: string;
    upvotes: string;
    downvotes: string;
    creator: string;
    createdAt: string;
  }>> {
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
