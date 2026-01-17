const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1️⃣ Deploy Token FIRST
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("Token deployed to:", tokenAddress);

  // 2️⃣ Deploy Faucet with token address
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(tokenAddress);
  await faucet.waitForDeployment();

  const faucetAddress = await faucet.getAddress();
  console.log("Faucet deployed to:", faucetAddress);

  // 3️⃣ Grant minting permission to Faucet
  const tx = await token.setMinter(faucetAddress);
  await tx.wait();

  console.log("Faucet set as minter");

  // 4️⃣ (Optional) Save addresses for frontend
  console.log("SAVE THESE:");
  console.log("VITE_TOKEN_ADDRESS=", tokenAddress);
  console.log("VITE_FAUCET_ADDRESS=", faucetAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
