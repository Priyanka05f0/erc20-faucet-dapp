import { ethers } from "ethers";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

const tokenAbi = [
  "function balanceOf(address) view returns (uint256)"
];

const faucetAbi = [
  "function requestTokens()",
  "function canClaim(address) view returns (bool)",
  "function remainingAllowance(address) view returns (uint256)"
];

function getProvider() {
  return new ethers.BrowserProvider(window.ethereum);
}

async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

export async function getTokenBalance(address) {
  const provider = getProvider();
  const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);
  const balance = await token.balanceOf(address);
  return balance.toString();
}

export async function requestTokens() {
  const signer = await getSigner();
  const faucet = new ethers.Contract(FAUCET_ADDRESS, faucetAbi, signer);
  const tx = await faucet.requestTokens();
  const receipt = await tx.wait();
  return receipt.hash;
}

export async function canClaim(address) {
  const provider = getProvider();
  const faucet = new ethers.Contract(FAUCET_ADDRESS, faucetAbi, provider);
  return await faucet.canClaim(address);
}

export async function getRemainingAllowance(address) {
  const provider = getProvider();
  const faucet = new ethers.Contract(FAUCET_ADDRESS, faucetAbi, provider);
  const value = await faucet.remainingAllowance(address);
  return value.toString();
}

export function getContractAddresses() {
  return {
    token: TOKEN_ADDRESS,
    faucet: FAUCET_ADDRESS,
  };
}
