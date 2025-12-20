const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1️⃣ Deploy TEMP Faucet address (deployer)
  const Token = await hre.ethers.getContractFactory("Token");
  const tempToken = await Token.deploy(deployer.address);
  await tempToken.waitForDeployment();

  // 2️⃣ Deploy Faucet with token address
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(await tempToken.getAddress());
  await faucet.waitForDeployment();

  // 3️⃣ Deploy FINAL Token with REAL faucet
  const finalToken = await Token.deploy(await faucet.getAddress());
  await finalToken.waitForDeployment();

  console.log("FINAL Token:", await finalToken.getAddress());
  console.log("Faucet:", await faucet.getAddress());
}

main().catch(console.error);
