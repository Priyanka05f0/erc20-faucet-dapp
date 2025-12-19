const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  // 1. Deploy Faucet first (temporary token address)
  const Faucet = await ethers.getContractFactory("TokenFaucet");
  let faucet = await Faucet.deploy(ethers.ZeroAddress);
  await faucet.waitForDeployment();

  // 2. Deploy Token with faucet as minter
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(
    "FaucetToken",
    "FCT",
    await faucet.getAddress()
  );
  await token.waitForDeployment();

  // 3. Redeploy Faucet with correct token address
  faucet = await Faucet.deploy(await token.getAddress());
  await faucet.waitForDeployment();

  console.log("Token deployed to:", await token.getAddress());
  console.log("Faucet deployed to:", await faucet.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
