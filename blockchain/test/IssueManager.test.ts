import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("IssueManager", function () {
  let civiToken: any;
  let issueManager: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    // Deploy CiviToken
    const CiviToken = await ethers.getContractFactory("CiviToken");
    civiToken = await CiviToken.deploy(
      "CiviToken",
      "CIVI",
      1000000, // Initial supply
      1000000  // Gas reimbursement rate
    );

    // Deploy IssueManager
    const IssueManager = await ethers.getContractFactory("IssueManager");
    issueManager = await IssueManager.deploy(await civiToken.getAddress());

    // Transfer CiviToken ownership to IssueManager
    await civiToken.transferOwnership(await issueManager.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the correct CiviToken address", async function () {
      expect(await issueManager.civiToken()).to.equal(await civiToken.getAddress());
    });

    it("Should start with 0 issues", async function () {
      expect(await issueManager.getTotalIssues()).to.equal(0);
    });
  });

  describe("Creating Issues", function () {
    it("Should create an issue successfully", async function () {
      const title = "Test Issue";
      const description = "This is a test issue description";

      const tx = await issueManager.connect(user1).createIssue(title, description);
      const receipt = await tx.wait();

      expect(await issueManager.getTotalIssues()).to.equal(1);

      const issue = await issueManager.getIssue(1);
      expect(issue.id).to.equal(1);
      expect(issue.author).to.equal(user1.address);
      expect(issue.title).to.equal(title);
      expect(issue.description).to.equal(description);
      expect(issue.upvotes).to.equal(0);
      expect(issue.downvotes).to.equal(0);
    });

    it("Should reject empty title", async function () {
      await expect(
        issueManager.connect(user1).createIssue("", "Description")
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject empty description", async function () {
      await expect(
        issueManager.connect(user1).createIssue("Title", "")
      ).to.be.revertedWith("Description cannot be empty");
    });

    it("Should track user issues", async function () {
      await issueManager.connect(user1).createIssue("Issue 1", "Description 1");
      await issueManager.connect(user1).createIssue("Issue 2", "Description 2");

      const userIssues = await issueManager.getUserIssues(user1.address);
      expect(userIssues.length).to.equal(2);
      expect(userIssues[0]).to.equal(1);
      expect(userIssues[1]).to.equal(2);
    });
  });

  describe("Voting", function () {
    let issueId: number;

    beforeEach(async function () {
      await issueManager.connect(user1).createIssue("Test Issue", "Description");
      issueId = 1;
    });

    it("Should allow upvoting", async function () {
      await issueManager.connect(user2).voteOnIssue(issueId, true);

      const issue = await issueManager.getIssue(issueId);
      expect(issue.upvotes).to.equal(1);
      expect(issue.downvotes).to.equal(0);

      const userVote = await issueManager.getUserVote(issueId, user2.address);
      expect(userVote.hasVoted).to.be.true;
      expect(userVote.voteDirection).to.be.true;
    });

    it("Should allow downvoting", async function () {
      await issueManager.connect(user2).voteOnIssue(issueId, false);

      const issue = await issueManager.getIssue(issueId);
      expect(issue.upvotes).to.equal(0);
      expect(issue.downvotes).to.equal(1);

      const userVote = await issueManager.getUserVote(issueId, user2.address);
      expect(userVote.hasVoted).to.be.true;
      expect(userVote.voteDirection).to.be.false;
    });

    it("Should prevent voting on non-existent issue", async function () {
      await expect(
        issueManager.connect(user2).voteOnIssue(999, true)
      ).to.be.revertedWith("Issue does not exist");
    });

    it("Should prevent voting twice on the same issue", async function () {
      await issueManager.connect(user2).voteOnIssue(issueId, true);

      await expect(
        issueManager.connect(user2).voteOnIssue(issueId, false)
      ).to.be.revertedWith("Already voted on this issue");
    });

    it("Should prevent voting on own issue", async function () {
      await expect(
        issueManager.connect(user1).voteOnIssue(issueId, true)
      ).to.be.revertedWith("Cannot vote on your own issue");
    });

    it("Should allow multiple users to vote", async function () {
      await issueManager.connect(user2).voteOnIssue(issueId, true);
      await issueManager.connect(user3).voteOnIssue(issueId, false);

      const issue = await issueManager.getIssue(issueId);
      expect(issue.upvotes).to.equal(1);
      expect(issue.downvotes).to.equal(1);
    });
  });

  describe("Gas Tracking and Reimbursement", function () {
    it("Should track gas spent by users", async function () {
      const initialBalance = await civiToken.balanceOf(user1.address);

      await issueManager.connect(user1).createIssue("Test Issue", "Description");

      const gasSpent = await issueManager.getUserGasSpent(user1.address);
      expect(gasSpent).to.be.gt(0);

      const finalBalance = await civiToken.balanceOf(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should reimburse gas for voting", async function () {
      await issueManager.connect(user1).createIssue("Test Issue", "Description");

      const initialBalance = await civiToken.balanceOf(user2.address);
      const initialGasSpent = await issueManager.getUserGasSpent(user2.address);

      await issueManager.connect(user2).voteOnIssue(1, true);

      const finalBalance = await civiToken.balanceOf(user2.address);
      const finalGasSpent = await issueManager.getUserGasSpent(user2.address);

      expect(finalBalance).to.be.gt(initialBalance);
      expect(finalGasSpent).to.be.gt(initialGasSpent);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update CiviToken address", async function () {
      const newTokenAddress = user1.address; // Just for testing
      await issueManager.updateCiviToken(newTokenAddress);
      expect(await issueManager.civiToken()).to.equal(newTokenAddress);
    });

    it("Should prevent non-owner from updating CiviToken address", async function () {
      await expect(
        issueManager.connect(user1).updateCiviToken(user2.address)
      ).to.be.revertedWithCustomError(issueManager, "OwnableUnauthorizedAccount");
    });
  });
});