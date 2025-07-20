// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CiviToken is ERC20, Ownable {
    // Gas reimbursement rate (tokens per wei spent on gas)
    uint256 public gasReimbursementRate;
    
    // Mapping to track gas spent by users
    mapping(address => uint256) public gasSpentByUser;
    
    // Events
    event GasReimbursed(address indexed user, uint256 gasSpent, uint256 tokensReimbursed);
    event GasReimbursementRateUpdated(uint256 oldRate, uint256 newRate);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _gasReimbursementRate
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10**decimals());
        gasReimbursementRate = _gasReimbursementRate;
    }
    
    /**
     * @dev Reimburse user for gas spent on voting/posting
     * @param user Address of the user to reimburse
     * @param gasSpent Amount of gas spent in wei
     */
    function reimburseGas(address user, uint256 gasSpent) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(gasSpent > 0, "Gas spent must be greater than 0");
        
        uint256 tokensToReimburse = (gasSpent * gasReimbursementRate) / 1e18;
        require(tokensToReimburse > 0, "Reimbursement amount too small");
        
        gasSpentByUser[user] += gasSpent;
        _mint(user, tokensToReimburse);
        
        emit GasReimbursed(user, gasSpent, tokensToReimburse);
    }
    
    /**
     * @dev Update gas reimbursement rate
     * @param newRate New reimbursement rate
     */
    function updateGasReimbursementRate(uint256 newRate) external onlyOwner {
        uint256 oldRate = gasReimbursementRate;
        gasReimbursementRate = newRate;
        emit GasReimbursementRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Get total gas spent by a user
     * @param user Address of the user
     * @return Total gas spent in wei
     */
    function getGasSpentByUser(address user) external view returns (uint256) {
        return gasSpentByUser[user];
    }
} 