import { useState, useEffect } from 'react';
import BlockchainService from './blockchainService';

export const useBlockchain = () => {
  const [service] = useState(() => new BlockchainService());
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [issues, setIssues] = useState<Array<{
    id: number;
    title: string;
    description: string;
    upvotes: string;
    downvotes: string;
    creator: string;
    createdAt: string;
  }>>([]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await service.connectWallet();
      setIsConnected(true);
      await getTokenBalance();
      await getIssues();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
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
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
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
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
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
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTokenBalance = async () => {
    try {
      const balance = await service.getTokenBalance();
      setTokenBalance(balance);
    } catch (err: unknown) {
      console.error('Error getting token balance:', err);
    }
  };

  const getIssues = async () => {
    try {
      const issuesList = await service.getIssues();
      setIssues(issuesList);
    } catch (err: unknown) {
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
