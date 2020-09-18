// SPDX-License-Identifier: MIT

pragma solidity 0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";

contract Fotios is Ownable {
  fallback() external payable {}
    
  function withdraw() external onlyOwner {
    address payable ownerAddr = address(uint160(owner()));
    ownerAddr.transfer(address(this).balance);
  }

  function kill() external onlyOwner {
    address payable addr = msg.sender;
    selfdestruct(addr);
  }
}