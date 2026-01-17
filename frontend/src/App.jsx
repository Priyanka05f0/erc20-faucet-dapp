import { useState } from "react";
import { ethers } from "ethers";
import TOKEN_ABI from "./abis/Token.json";
import FAUCET_ABI from "./abis/TokenFaucet.json";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [connecting, setConnecting] = useState(false);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    if (connecting) return;
    setConnecting(true);

    try {
      // ✅ STEP 1: check if already connected
      const existingAccounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (existingAccounts.length > 0) {
        setAccount(existingAccounts[0]);
        await fetchBalance(existingAccounts[0]);
        return;
      }

      // ✅ STEP 2: only request if NOT connected
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      await fetchBalance(accounts[0]);
    } catch (err) {
      console.error("Connect wallet error:", err);

      if (err.code === -32002) {
        alert("MetaMask already has a pending request. Open MetaMask.");
      } else {
        alert("Wallet connection failed");
      }
    } finally {
      setConnecting(false);
    }
  }

  async function fetchBalance(user) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const token = new ethers.Contract(
      TOKEN_ADDRESS,
      TOKEN_ABI,
      provider
    );

    const bal = await token.balanceOf(user);
    setBalance(ethers.formatUnits(bal, 18));
  }

  async function claimTokens() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const faucet = new ethers.Contract(
        FAUCET_ADDRESS,
        FAUCET_ABI,
        signer
      );

      const tx = await faucet.requestTokens();
      await tx.wait();

      alert("Tokens claimed successfully!");
      await fetchBalance(await signer.getAddress());
    } catch (err) {
      console.error("Claim error:", err);
      alert("Token claim failed");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>ERC-20 Faucet DApp</h1>

      {!account && (
        <button onClick={connectWallet} disabled={connecting}>
          {connecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      {account && (
        <>
          <p><b>Wallet:</b> {account}</p>
          <p><b>Token Balance:</b> {balance}</p>
          <button onClick={claimTokens}>Claim Tokens</button>
        </>
      )}
    </div>
  );
}

export default App;
