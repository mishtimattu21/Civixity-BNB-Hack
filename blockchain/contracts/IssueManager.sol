// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CiviToken.sol";

contract IssueManager is Ownable {
    CiviToken public civiToken;
    
    struct Issue {
        uint256 id;
        address author;
        string title;
        string description;
        uint256 upvotes;
        uint256 downvotes;
        uint256 createdAt;
        bool exists;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteDirection; // true for upvote, false for downvote
    }
    
    struct Vote {
        bool hasVoted;
        bool voteDirection;
    }
    
    uint256 public nextIssueId;
    mapping(uint256 => Issue) public issues;
    mapping(address => uint256[]) public userIssues;
    
    // Gas tracking
    mapping(address => uint256) public userGasSpent;
    
    // Events
    event IssueCreated(uint256 indexed issueId, address indexed author, string title, uint256 gasSpent);
    event IssueVoted(uint256 indexed issueId, address indexed voter, bool isUpvote, uint256 gasSpent);
    event GasReimbursed(address indexed user, uint256 gasSpent, uint256 tokensReimbursed);
    
    constructor(address _civiToken) Ownable(msg.sender) {
        civiToken = CiviToken(_civiToken);
        nextIssueId = 1;
    }
    
    /**
     * @dev Create a new issue
     * @param title Issue title
     * @param description Issue description
     */
    function createIssue(string memory title, string memory description) 
        external 
        returns (uint256) 
    {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        uint256 issueId = nextIssueId++;
        Issue storage newIssue = issues[issueId];
        
        newIssue.id = issueId;
        newIssue.author = msg.sender;
        newIssue.title = title;
        newIssue.description = description;
        newIssue.upvotes = 0;
        newIssue.downvotes = 0;
        newIssue.createdAt = block.timestamp;
        newIssue.exists = true;
        
        userIssues[msg.sender].push(issueId);
        
        // Track gas spent and reimburse
        uint256 gasSpent = tx.gasprice * gasleft();
        userGasSpent[msg.sender] += gasSpent;
        civiToken.reimburseGas(msg.sender, gasSpent);
        
        emit IssueCreated(issueId, msg.sender, title, gasSpent);
        return issueId;
    }
    
    /**
     * @dev Vote on an issue
     * @param issueId ID of the issue to vote on
     * @param isUpvote True for upvote, false for downvote
     */
    function voteOnIssue(uint256 issueId, bool isUpvote) external {
        require(issues[issueId].exists, "Issue does not exist");
        require(!issues[issueId].hasVoted[msg.sender], "Already voted on this issue");
        require(issues[issueId].author != msg.sender, "Cannot vote on your own issue");
        
        Issue storage issue = issues[issueId];
        issue.hasVoted[msg.sender] = true;
        issue.voteDirection[msg.sender] = isUpvote;
        
        if (isUpvote) {
            issue.upvotes++;
        } else {
            issue.downvotes++;
        }
        
        // Track gas spent and reimburse
        uint256 gasSpent = tx.gasprice * gasleft();
        userGasSpent[msg.sender] += gasSpent;
        civiToken.reimburseGas(msg.sender, gasSpent);
        
        emit IssueVoted(issueId, msg.sender, isUpvote, gasSpent);
    }
    
    /**
     * @dev Get issue details
     * @param issueId ID of the issue
     * @return id Issue ID
     * @return author Issue author
     * @return title Issue title
     * @return description Issue description
     * @return upvotes Number of upvotes
     * @return downvotes Number of downvotes
     * @return createdAt Creation timestamp
     */
    function getIssue(uint256 issueId) external view returns (
        uint256 id,
        address author,
        string memory title,
        string memory description,
        uint256 upvotes,
        uint256 downvotes,
        uint256 createdAt
    ) {
        Issue storage issue = issues[issueId];
        require(issue.exists, "Issue does not exist");
        
        return (
            issue.id,
            issue.author,
            issue.title,
            issue.description,
            issue.upvotes,
            issue.downvotes,
            issue.createdAt
        );
    }
    
    /**
     * @dev Get user's vote on an issue
     * @param issueId ID of the issue
     * @param user Address of the user
     * @return hasVoted Whether user has voted
     * @return voteDirection True for upvote, false for downvote
     */
    function getUserVote(uint256 issueId, address user) external view returns (bool hasVoted, bool voteDirection) {
        Issue storage issue = issues[issueId];
        require(issue.exists, "Issue does not exist");
        
        return (issue.hasVoted[user], issue.voteDirection[user]);
    }
    
    /**
     * @dev Get all issues by a user
     * @param user Address of the user
     * @return Array of issue IDs
     */
    function getUserIssues(address user) external view returns (uint256[] memory) {
        return userIssues[user];
    }
    
    /**
     * @dev Get total gas spent by a user
     * @param user Address of the user
     * @return Total gas spent in wei
     */
    function getUserGasSpent(address user) external view returns (uint256) {
        return userGasSpent[user];
    }
    
    /**
     * @dev Get total number of issues
     * @return Total number of issues
     */
    function getTotalIssues() external view returns (uint256) {
        return nextIssueId - 1;
    }
    
    /**
     * @dev Update CiviToken contract address
     * @param newCiviToken New CiviToken contract address
     */
    function updateCiviToken(address newCiviToken) external onlyOwner {
        require(newCiviToken != address(0), "Invalid token address");
        civiToken = CiviToken(newCiviToken);
    }
} 