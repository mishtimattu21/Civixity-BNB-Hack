import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy CiviToken
  console.log("Deploying CiviToken...");
  const CiviToken = await ethers.getContractFactory("CiviToken");
  const civiToken = await CiviToken.deploy();
  await civiToken.waitForDeployment();
  const civiTokenAddress = await civiToken.getAddress();
  console.log("CiviToken deployed to:", civiTokenAddress);

  // Deploy IssueManager
  console.log("Deploying IssueManager...");
  const IssueManager = await ethers.getContractFactory("IssueManager");
  const issueManager = await IssueManager.deploy(civiTokenAddress);
  await issueManager.waitForDeployment();
  const issueManagerAddress = await issueManager.getAddress();
  console.log("IssueManager deployed to:", issueManagerAddress);

  // Transfer ownership of CiviToken to IssueManager
  console.log("Transferring CiviToken ownership to IssueManager...");
  const transferTx = await civiToken.transferOwnership(issueManagerAddress);
  await transferTx.wait();
  console.log("Ownership transferred successfully");

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      civiToken: civiTokenAddress,
      issueManager: issueManagerAddress,
    },
    timestamp: new Date().toISOString(),
  };

  const deploymentPath = path.join(process.cwd(), "deployment-info.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to:", deploymentPath);

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 