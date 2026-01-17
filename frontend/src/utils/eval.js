import { ethers } from "ethers";
import tokenAbi from "../abi/Token.json";
import faucetAbi from "../abi/TokenFaucet.json";

const provider = new ethers.BrowserProvider(window.ethereum);

async function getSigner() {
  return await provider.getSigner();
}

async function getContracts() {
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS;
  const faucetAddress = import.meta.env.VITE_FAUCET_ADDRESS;

  const signer = await getSigner();

  return {
    token: new ethers.Contract(tokenAddress, tokenAbi, signer),
    faucet: new ethers.Contract(faucetAddress, faucetAbi, signer),
  };
}

window.__EVAL__ = {
  connectWallet: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  },

  requestTokens: async () => {
    const { faucet } = await getContracts();
    const tx = await faucet.requestTokens();
    await tx.wait();
    return tx.hash;
  },

  getBalance: async (address) => {
    const { token } = await getContracts();
    const balance = await token.balanceOf(address);
    return balance.toString();
  },

  canClaim: async (address) => {
    const { faucet } = await getContracts();
    return await faucet.canClaim(address);
  },

  getRemainingAllowance: async (address) => {
    const { faucet } = await getContracts();
    const remaining = await faucet.remainingAllowance(address);
    return remaining.toString();
  },

  getContractAddresses: async () => {
    return {
      token: import.meta.env.VITE_TOKEN_ADDRESS,
      faucet: import.meta.env.VITE_FAUCET_ADDRESS,
    };
  },
};
