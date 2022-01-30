import crypto, { sign } from "crypto";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";
import { HDNode } from "ethers/lib/utils";

let accounts: Signer[];
let eoa: Signer;
let challengeContract: Contract;
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await ethers.getContractFactory(
    "AssumeOwnershipChallenge"
  );
  // challengeContract = challengeFactory.attach(
  //   `0x139D666C0ffE1F9ba6f557D57E35ddB198D6ef88`
  // );
});

it("solves the challenge", async function () {
  // the function looks like a constructor but it is misspelled
  // so we can call it directly
  // tx = await challengeContract.AssumeOwmershipChallenge()
  // await tx.wait()
  // tx = await challengeContract.authenticate();
  // await tx.wait();

  const isComplete = await challengeContract.isComplete();
  expect(isComplete).to.be.true;
});
