pragma solidity ^0.4.21;

contract Underflow4Dot21 {

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