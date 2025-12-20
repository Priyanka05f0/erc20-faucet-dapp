// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract TokenFaucet {
    IERC20 public token;
    uint256 public constant AMOUNT = 100 * 10**18;

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    function requestTokens() external {
        require(
            token.transfer(msg.sender, AMOUNT),
            "Transfer failed"
        );
    }
}
