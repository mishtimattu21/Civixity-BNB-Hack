# Civixity Blockchain Deployment Guide

## Overview

This guide will help you deploy the Civixity blockchain contracts to the opBNB testnet. The system includes:

- **CiviToken**: ERC20 token for gas reimbursement
- **IssueManager**: Smart contract for posting and voting on issues

## Prerequisites

1. **MetaMask Wallet**: Install MetaMask browser extension
2. **opBNB Testnet Setup**: Add opBNB testnet to MetaMask
3. **Testnet BNB**: Get testnet BNB from faucet
4. **Private Key**: Export your private key from MetaMask

## Network Configuration

### Add opBNB Testnet to MetaMask

1. Open MetaMask
2. Go to Settings > Networks > Add Network
3. Add the following details:
   - **Network Name**: opBNB Testnet
   - **RPC URL**: https://opbnb-testnet-rpc.bnbchain.org
   - **Chain ID**: 5611
   - **Currency Symbol**: tBNB
   - **Block Explorer**: https://testnet.opbnbscan.com

### Get Testnet BNB

1. Visit the opBNB testnet faucet: https://testnet.opbnbscan.com/faucet
2. Enter your wallet address
3. Request testnet BNB (you'll need this for gas fees)

## Environment Setup

1. **Copy Environment Template**:
   ```bash
   cp env.example .env
   ```

2. **Edit .env File**:
   ```env
   PRIVATE_KEY=your_private_key_here
   OPBNB_TESTNET_RPC_URL=https://opbnb-testnet-rpc.bnbchain.org
   OPBNB_TESTNET_CHAIN_ID=5611
   GAS_LIMIT=3000000
   GAS_PRICE=1000000000
   ```

3. **Get Your Private Key**:
   - Open MetaMask
   - Go to Account Details > Export Private Key
   - Enter your password
   - Copy the private key (without 0x prefix)
   - Paste it in the .env file

## Deployment Steps

### 1. Compile Contracts
```bash
npx hardhat compile
```

### 2. Deploy to opBNB Testnet
```bash
npx hardhat run scripts/deploy.ts --network opBNBTestnet
```

### 3. Verify Deployment
The deployment script will output:
- CiviToken contract address
- IssueManager contract address
- Network information

### 4. Verify Contracts on opBNBScan
```bash
# Verify CiviToken
npx hardhat verify --network opBNBTestnet <CIVI_TOKEN_ADDRESS> "CiviToken" "CIVI" "1000000" "1000000"

# Verify IssueManager
npx hardhat verify --network opBNBTestnet <ISSUE_MANAGER_ADDRESS> "<CIVI_TOKEN_ADDRESS>"
```

## Contract Functions

### CiviToken Functions
- `reimburseGas(address user, uint256 gasSpent)`: Reimburse user for gas spent
- `updateGasReimbursementRate(uint256 newRate)`: Update reimbursement rate
- `getGasSpentByUser(address user)`: Get total gas spent by user

### IssueManager Functions
- `createIssue(string title, string description)`: Create a new issue
- `voteOnIssue(uint256 issueId, bool isUpvote)`: Vote on an issue
- `getIssue(uint256 issueId)`: Get issue details
- `getUserVote(uint256 issueId, address user)`: Get user's vote
- `getUserIssues(address user)`: Get all issues by user
- `getUserGasSpent(address user)`: Get user's total gas spent
- `getTotalIssues()`: Get total number of issues

## Frontend Integration

### 1. Generate Frontend Files
```bash
npx hardhat run scripts/frontend-integration.ts
```

### 2. Install Dependencies in Frontend
```bash
cd ../Civixity-BNB-Hack
npm install ethers
```

### 3. Use Blockchain Service
```typescript
import { useBlockchain } from './src/blockchain/useBlockchain';

const { connectWallet, createIssue, voteOnIssue } = useBlockchain();
```

## Testing

### Run Local Tests
```bash
npx hardhat test
```

### Run Local Network
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

## Gas Optimization

The contracts are optimized for:
- **CiviToken**: ~860k gas for deployment
- **IssueManager**: ~1.1M gas for deployment
- **createIssue**: ~300k gas per issue
- **voteOnIssue**: ~175k gas per vote

## Security Features

- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive parameter validation
- **Gas Tracking**: Automatic gas spent tracking and reimbursement
- **Vote Protection**: Prevents double voting and self-voting

## Troubleshooting

### Common Issues

1. **Insufficient Gas**:
   - Increase gas limit in hardhat.config.ts
   - Check current gas prices on opBNBScan

2. **Network Issues**:
   - Verify RPC URL is correct
   - Check network connectivity

3. **Private Key Issues**:
   - Ensure private key is 64 characters (without 0x)
   - Verify private key is from the correct account

4. **Contract Verification**:
   - Ensure constructor arguments match deployment
   - Check contract address is correct

### Error Messages

- `"Invalid user address"`: User address is zero address
- `"Gas spent must be greater than 0"`: No gas was spent
- `"Issue does not exist"`: Issue ID is invalid
- `"Already voted on this issue"`: User already voted
- `"Cannot vote on your own issue"`: User trying to vote on their own issue

## Monitoring

### Track Gas Usage
- Monitor gas spent per user
- Check reimbursement rates
- Track issue creation and voting activity

### Contract Events
- `IssueCreated`: When new issues are posted
- `IssueVoted`: When users vote on issues
- `GasReimbursed`: When gas is reimbursed

## Next Steps

1. **Deploy to Mainnet**: After thorough testing on testnet
2. **Frontend Integration**: Connect React app to deployed contracts
3. **User Testing**: Test with real users and MetaMask
4. **Gas Optimization**: Further optimize gas usage if needed
5. **Security Audit**: Consider professional security audit

## Support

For issues or questions:
1. Check the test files for usage examples
2. Review the contract documentation
3. Check opBNBScan for transaction details
4. Monitor gas usage and reimbursement rates 