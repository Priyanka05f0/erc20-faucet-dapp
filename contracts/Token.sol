// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;
    address public minter;

    constructor(
        string memory name_,
        string memory symbol_,
        address faucetAddress
    ) ERC20(name_, symbol_) {
        minter = faucetAddress;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only faucet can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
