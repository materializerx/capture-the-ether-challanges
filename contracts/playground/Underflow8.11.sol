pragma solidity ^0.8.11;

contract Underflow8Dot11 {

    uint256 public value;

    // function Underflow() {
    // }

    function makeUnderflow() public {
        value -= 1;
    }

    function getValue() public view returns(uint256) {
        return value;
    }
}