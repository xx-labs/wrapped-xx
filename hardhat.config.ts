import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ledger";
import dotenv from "dotenv";

dotenv.config();

const MAINNET_URL = process.env.MAINNET_URL || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        runs: 200,
        enabled: true,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      ledgerAccounts: ["0x70fFda7eef19d00EAe79ba041f1982016CA6ADd4"],
    },
    // ETH mainnet
    mainnet: {
      url: MAINNET_URL,
    },
  },
};

export default config;
