import {
  requestTokens,
  getTokenBalance,
  canClaim,
  getRemainingAllowance,
  getContractAddresses,
} from "./contracts";
import { connectWallet } from "./wallet";

window.__EVAL__ = {
  connectWallet: async () => {
    return await connectWallet();
  },

  requestTokens: async () => {
    const hash = await requestTokens();
    return hash;
  },

  getBalance: async (address) => {
    return await getTokenBalance(address);
  },

  canClaim: async (address) => {
    return await canClaim(address);
  },

  getRemainingAllowance: async (address) => {
    return await getRemainingAllowance(address);
  },

  getContractAddresses: async () => {
    return getContractAddresses();
  },
};
