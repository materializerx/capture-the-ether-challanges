// https://capturetheether.com/challenges/warmup/call-me/
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";

let accounts: Signer[];
let eoa: Signer;
let contract: Contract;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory =  await ethers.getContractFactory("CallMeChallenge")
  contract = factory.attach(`0xF5503FF53CE2C8b35db895743aaf4fDf4329df55`)
});

it("solves the challenge", async function () {
  const tx = await contract.callme();
  const txHash = tx.hash
  expect(txHash).to.not.be.undefined
});
