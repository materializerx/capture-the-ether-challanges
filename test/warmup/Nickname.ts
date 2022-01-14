import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { expect } from "chai";

let accounts: Signer[];
let eoa: Signer;
let contract: Contract;

before(async () => {
  accounts = await ethers.getSigners();
  eoa = accounts[0];
  const factory =  await ethers.getContractFactory("CaptureTheEther")
  contract = factory.attach(`0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee`)
  // contract = factory.attach(`0xf13776BCd3Cf3fcd8BC84876add62dC93Fc5c8A6`)
});

it("solves the challenge", async function () {
  const bytes32String = ethers.utils.formatBytes32String("materializerX")
  const recovered = ethers.utils.parseBytes32String( bytes32String )
  console.log("recoverd : " + recovered)

  const nickname = ethers.utils.formatBytes32String("materializerX")
  const tx = await contract.setNickname(ethers.utils.formatBytes32String("materializerX"));
  const txHash = tx && tx.hash
  expect(txHash).to.not.be.undefined
});
