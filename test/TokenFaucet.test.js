const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Faucet", function () {
  let token, faucet;
  let owner, user1, user2;

  const FAUCET_AMOUNT = ethers.parseEther("100");
  const MAX_CLAIM = ethers.parseEther("1000");
  const COOLDOWN = 24 * 60 * 60;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const Faucet = await ethers.getContractFactory("TokenFaucet");

    faucet = await Faucet.deploy(ethers.ZeroAddress);
    await faucet.waitForDeployment();

    token = await Token.deploy(
      "TestToken",
      "TTK",
      await faucet.getAddress()
    );
    await token.waitForDeployment();

    faucet = await Faucet.deploy(await token.getAddress());
    await faucet.waitForDeployment();
  });

  it("should deploy token and faucet correctly", async function () {
    expect(await faucet.isPaused()).to.equal(false);
  });

  it("should allow user to claim tokens", async function () {
    await faucet.connect(user1).requestTokens();
    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(FAUCET_AMOUNT);
  });

  it("should enforce cooldown between claims", async function () {
    await faucet.connect(user1).requestTokens();
    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Not eligible to claim");
  });

  it("should allow claim after cooldown", async function () {
    await faucet.connect(user1).requestTokens();

    await ethers.provider.send("evm_increaseTime", [COOLDOWN]);
    await ethers.provider.send("evm_mine");

    await faucet.connect(user1).requestTokens();
    const balance = await token.balanceOf(user1.address);
    expect(balance).to.equal(FAUCET_AMOUNT * 2n);
  });

  it("should enforce lifetime claim limit", async function () {
    for (let i = 0; i < 10; i++) {
      await faucet.connect(user1).requestTokens();
      await ethers.provider.send("evm_increaseTime", [COOLDOWN]);
      await ethers.provider.send("evm_mine");
    }

    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Lifetime limit reached");
  });

  it("should allow admin to pause faucet", async function () {
    await faucet.connect(owner).setPaused(true);
    expect(await faucet.isPaused()).to.equal(true);
  });

  it("should block claims when paused", async function () {
    await faucet.connect(owner).setPaused(true);
    await expect(
      faucet.connect(user1).requestTokens()
    ).to.be.revertedWith("Faucet is paused");
  });

  it("should prevent non-admin from pausing", async function () {
    await expect(
      faucet.connect(user1).setPaused(true)
    ).to.be.revertedWith("Only admin");
  });

  it("should allow multiple users to claim independently", async function () {
    await faucet.connect(user1).requestTokens();
    await faucet.connect(user2).requestTokens();

    expect(await token.balanceOf(user1.address)).to.equal(FAUCET_AMOUNT);
    expect(await token.balanceOf(user2.address)).to.equal(FAUCET_AMOUNT);
  });
});
