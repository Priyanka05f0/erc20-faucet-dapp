import { useState } from "react";
import { ethers } from "ethers";
import TOKEN_ABI from "./abis/Token.json";
import FAUCET_ABI from "./abis/TokenFaucet.json";

const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;


function App() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");

  async function connectWallet() {
    if (!window.ethereum) return alert("MetaMask not found");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
    await fetchBalance(accounts[0]);
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
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const faucet = new ethers.Contract(
      FAUCET_ADDRESS,
      FAUCET_ABI,
      signer
    );

    const tx = await faucet.requestTokens();
    await tx.wait();

    alert("Tokens claimed successfully");

    // 🔴 THIS IS WHAT YOU WERE MISSING
    await fetchBalance(await signer.getAddress());
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>ERC-20 Faucet DApp</h1>

      {!account && (
        <button onClick={connectWallet}>Connect Wallet</button>
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
