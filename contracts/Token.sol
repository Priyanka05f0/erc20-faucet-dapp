// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;
    address public minter;

    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {}

    modifier onlyMinter() {
        require(msg.sender == minter, "Not minter");
        _;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}
