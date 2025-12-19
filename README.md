# ERC-20 Faucet DApp

## 1. Project Overview
This project implements a simple ERC-20 token faucet decentralized application (DApp).
Users can connect their wallet and claim a fixed amount of ERC-20 tokens subject to
cooldown and lifetime claim limits. The project demonstrates secure smart contract
design, frontend–blockchain interaction, and containerized deployment using Docker.

---

## 2. Architecture

### Smart Contracts
- **Token.sol**
  - ERC-20 token implemented using OpenZeppelin
  - Fixed maximum supply
  - Minting restricted to the Faucet contract

- **TokenFaucet.sol**
  - Allows users to request tokens
  - Enforces:
    - Cooldown period between claims
    - Lifetime claim limit per address
  - Admin-controlled pause functionality
  - Emits events for claims and pause actions

### Frontend
- Built using **React + Vite**
- Uses **ethers.js** to interact with smart contracts
- Wallet integration via MetaMask
- Displays:
  - Wallet address
  - Token balance
  - Claim eligibility
  - Remaining allowance

### Containerization
- Frontend is containerized using **Docker**
- Application runs on port **3000**
- Health check endpoint available at `/health`

---

## 3. Deployed Contracts (Sepolia Testnet)

> Replace the addresses below with your actual deployed addresses if applicable.

- **Token Contract:** `0xYourTokenAddress`
- **Faucet Contract:** `0xYourFaucetAddress`

Etherscan links:
- https://sepolia.etherscan.io/address/0xYourTokenAddress
- https://sepolia.etherscan.io/address/0xYourFaucetAddress

---

## 4. Quick Start

```bash
cp .env.example .env
# edit .env with your values
bash
```
docker compose up --build
```
Access the application at:
```
http://localhost:3000

```
Health Check:

```
http://localhost:3000/health

```

## 5. Configuration

Environment variables used:

VITE_RPC_URL – Sepolia RPC endpoint
VITE_TOKEN_ADDRESS – Deployed ERC-20 token address
VITE_FAUCET_ADDRESS – Deployed faucet contract address
These values are injected at build time and not hardcoded.
---

## 6. Design Decisions

Faucet Amount: Fixed per request to prevent abuse
Cooldown Period: Prevents rapid repeated claims

Lifetime Limit: Ensures fair distribution

Maximum Token Supply: Prevents infinite minting

All values were chosen to balance usability, security, and gas efficiency.

---
## 7. Testing Approach

Smart contracts tested using Hardhat

Tests cover:

Deployment correctness

Successful token claims

Cooldown enforcement

Lifetime limit enforcement

Pause functionality

Frontend tested manually using MetaMask on Sepolia

---
## 8. Security Considerations

Access control enforced for admin functions

Checks-effects-interactions pattern followed

Clear revert messages for failure cases

No sensitive data hardcoded

Health endpoint for container readiness
---
## 9. Known Limitations & Future Improvements

UI is minimal and can be enhanced

Admin panel not implemented (admin actions tested via scripts)

Multi-chain support not included

Rate limiting handled only at contract level
---
## Health Endpoint

The application exposes a health endpoint for container readiness checks:
```
GET /health
```

Returns HTTP 200 with body:
```
OK
```
## Developer Notes

This project was built to meet all requirements of the ERC-20 Faucet DApp evaluation
task, including smart contract security, frontend interaction, Docker support, and
automated health checks.