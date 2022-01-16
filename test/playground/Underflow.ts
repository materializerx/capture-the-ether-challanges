import { expect, use,config } from 'chai';
import { Contract } from 'ethers';
import { ethers, network } from 'hardhat';
const { utils, provider } = ethers;
import { BN } from 'bn.js';
use(require('chai-bn')(BN));
config.includeStack = true;
 
describe('Underflow', () => {
  let contract4Dot21: Contract;
  let contract8Dot11: Contract;

  before(async () => {
    // 4.21 version
    const underflow4Dot21Factory = await ethers.getContractFactory('Underflow4Dot21');
    contract4Dot21 = await underflow4Dot21Factory.deploy();
    await contract4Dot21.deployed();

    console.log('contract4Dot21 deployed on', contract4Dot21.address);

    // 8.11 version
    const newUnderflowFactory = await ethers.getContractFactory('Underflow8Dot11');
    contract8Dot11 = await newUnderflowFactory.deploy();
    await contract8Dot11.deployed();

    console.log('contract8Dot11 deployed on', contract8Dot11.address);
  });

  it("4.21 version", async () => {
    // initially it is set to 0
    expect(await contract4Dot21.getValue()).to.equal(0)
    // try to underflow
    await contract4Dot21.makeUnderflow()
    
    // uint256 (uint is an alias) is a unsigned integer which has:
    // maximum value of 2^256-1 = 115792089237316195423570985008687907853269984665640564039457584007913129639935 
    // 78 decimal digits

    const expectedUnderflow = await contract4Dot21.getValue()
    expect(await contract4Dot21.getValue()).to.equal(ethers.BigNumber.from(BigInt(2 ** 256) - BigInt(1)))
    
  });

  it("8.11 compiler version", async() => {
    // initially it is set to 0
    expect(await contract8Dot11.getValue()).to.equal(0)
    // try to underflow
    await contract8Dot11.makeUnderflow()
    // it gives an error : 
    // Error: VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)

    const expectedUnderflow = await contract8Dot11.getValue()
    console.log("8.11 value after underflow : " + expectedUnderflow);
  })

});
