# Civixity Blockchain Module

This blockchain module implements a decentralized governance system on the opBNB testnet using Hardhat. Users can post issues, vote on them, and receive gas reimbursements in CiviTokens.

## Features

- **Issue Management**: Users can create and vote on community issues
- **Gas Reimbursement**: Users receive CiviTokens for gas spent on voting and posting
- **Voting System**: Upvote/downvote mechanism with one vote per user per issue
- **Token Economics**: CiviToken ERC20 with gas reimbursement mechanism

## Smart Contracts

### CiviToken.sol
- ERC20 token with gas reimbursement functionality
- Tracks gas spent by users
- Configurable reimbursement rate
- Pausable for emergency situations

### IssueManager.sol
- Manages issue creation and voting
- Integrates with CiviToken for gas reimbursement
- Prevents double voting and self-voting
- Tracks user activity and gas consumption

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   PRIVATE_KEY=your_private_key_here
   OPBNB_TESTNET_RPC_URL=https://opbnb-testnet-rpc.bnbchain.org
   OPBNB_TESTNET_CHAIN_ID=5611
   GAS_LIMIT=3000000
   GAS_PRICE=1000000000
   ```

3. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

4. **Run Tests**
   ```bash
   npx hardhat test
   ```

## Deployment

### Local Development
```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

### opBNB Testnet
```bash
npx hardhat run scripts/deploy.ts --network opBNBTestnet
```

## Contract Functions

### CiviToken
- `reimburseGas(address user, uint256 gasSpent)`: Reimburse user for gas spent
- `updateGasReimbursementRate(uint256 newRate)`: Update reimbursement rate
- `getGasSpentByUser(address user)`: Get total gas spent by user
- `pause()/unpause()`: Emergency pause functionality

### IssueManager
- `createIssue(string title, string description)`: Create a new issue
- `voteOnIssue(uint256 issueId, bool isUpvote)`: Vote on an issue
- `getIssue(uint256 issueId)`: Get issue details
- `getUserVote(uint256 issueId, address user)`: Get user's vote on issue
- `getUserIssues(address user)`: Get all issues by user
- `getUserGasSpent(address user)`: Get user's total gas spent
- `getTotalIssues()`: Get total number of issues

## Gas Reimbursement System

1. User performs action (create issue or vote)
2. Contract calculates gas spent: `tx.gasprice * gasleft()`
3. Gas spent is tracked per user
4. CiviTokens are minted to user based on reimbursement rate
5. Rate is configurable by contract owner

## Integration with Frontend

The blockchain module integrates with the React frontend through:

1. **MetaMask Connection**: Users connect their wallets
2. **Contract Interaction**: Frontend calls smart contract functions
3. **Token Balance**: Display CiviToken balances
4. **Gas Tracking**: Show gas spent and reimbursements

## Network Configuration

### opBNB Testnet
- **Chain ID**: 5611
- **RPC URL**: https://opbnb-testnet-rpc.bnbchain.org
- **Explorer**: https://testnet.opbnbscan.com
- **Currency**: tBNB

## Security Features

- **Reentrancy Protection**: All state-changing functions protected
- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: Comprehensive parameter validation
- **Emergency Pause**: Ability to pause token transfers
- **Gas Limit Protection**: Prevents excessive gas consumption

## Testing

Run the test suite:
```bash
npx hardhat test
```

Tests cover:
- Contract deployment
- Issue creation and voting
- Gas tracking and reimbursement
- Access control
- Error conditions

## Verification

After deployment, verify contracts on opBNBScan:
```bash
npx hardhat verify --network opBNBTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Troubleshooting

### Common Issues

1. **Insufficient Gas**: Increase gas limit in hardhat.config.ts
2. **Network Issues**: Check RPC URL and network configuration
3. **Private Key**: Ensure private key is correctly set in .env
4. **Contract Errors**: Check contract compilation and deployment logs

### Gas Optimization

- Use efficient data structures
- Minimize storage operations
- Batch operations where possible
- Use events for off-chain data

## License

MIT License - see LICENSE file for details
