// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public faucet;

    constructor(address _faucet) ERC20("MyToken", "MTK") {
        faucet = _faucet;
        _mint(msg.sender, 1_000_000 * 10**18); // ✅ INITIAL SUPPLY
    }
}
