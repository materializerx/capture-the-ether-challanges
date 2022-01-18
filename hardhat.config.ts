import "@nomiclabs/hardhat-waffle";
import 'solidity-coverage';
import dotenv from "dotenv";
dotenv.config();
import { task, HardhatUserConfig } from "hardhat/config";

const { ARCHIVE_URL, MNEMONIC } = process.env;

if (!ARCHIVE_URL)
  throw new Error(
    `ARCHIVE_URL env var not set. Copy .env.template to .env and set the env var`
  );
if (!MNEMONIC)
  throw new Error(
    `MNEMONIC env var not set. Copy .env.template to .env and set the env var`
  );

const accounts = {
  // derive accounts from mnemonic, see tasks/create-key
  mnemonic: MNEMONIC,
  path:"m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20
};

// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.4.21" },
      { version: "0.8.11" },
      { version: "0.7.3" }
    ],
  },
  networks: {
    ropsten: {
      url: ARCHIVE_URL,
      accounts,
      gas: 2100000,
      gasPrice: 10045566399,
    },
    hardhat: {
      accounts,
      forking: {
        url: ARCHIVE_URL,
        // blockNumber: 11760848,
        // blockNumber: 11823465,
        enabled: true
      },
      gas: 2100000,
      gasPrice: 10045566399,
      gasMultiplier: 1
    },
  },
  mocha: {
    timeout: 300 * 1e3,
  }
};

export default config;