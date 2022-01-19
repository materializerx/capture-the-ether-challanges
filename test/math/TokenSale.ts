import crypto from "crypto";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";

let accounts: Signer[];
let eoa: Signer;
let contract: Contract;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const challengeFactory = await ethers.getContractFactory(
    "TokenSaleChallenge"
  );
  contract = challengeFactory.attach(
    `0x56E9615787Fde82f3C68b572f68e2bC6C1866918`
  );
});

it("solves the challenge", async function () {


  const uintMax = BigNumber.from(`2`).pow(`256`)
  const expectedBeUintMax = uintMax.div(ONE_ETHER)
  console.log( "2^256/ether = does it include the floating precision? : " + uintMax.div(ONE_ETHER))

  // expect(uintMax).to.equal(expectedBeUintMax)
  // console.log( "ether/ether = 1 : " + ONE_ETHER.div(ONE_ETHER))
  // expect(ONE_ETHER.div(ONE_ETHER)).to.equal(1)

  // console.log("2^256 is : " + uintMax.div(ONE_ETHER).mul(ONE_ETHER))

  // const expectedBeZero = (uintMax.div(ONE_ETHER).mul(ONE_ETHER).mod(BigNumber.from(`2`).pow(`256`)))
  // console.log(`expectedBeZero`, expectedBeZero)
  // const toBuy = (BigNumber.from(`2`).pow(`256`).div(ONE_ETHER)).toString()
  // console.log(`budying `, (BigNumber.from(`2`).pow(`256`).div(ONE_ETHER)).toString());

  // await contract.buy((BigNumber.from(`2`).pow(`256`).div(ONE_ETHER)).toString(), {
  //   value: 0,
  // });

  // const balance: BigNumber = await contract.balanceOf(await eoa.getAddress());
  // console.log(`balance`, balance.toString());

  // const tx = await contract.sell(`1`);

  // const isComplete = await contract.isComplete();
  // expect(isComplete).to.be.true;
});
