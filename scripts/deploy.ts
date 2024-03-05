import { ethers } from "hardhat";

const create2ProxyAddress = "0x4e59b44847b379578588920ca78fbf26c0b4956c";

const wrappedXXDeployer = "0x70fFda7eef19d00EAe79ba041f1982016CA6ADd4";
const wrappedXXSalt =
  "0x287872dd7a5189e4639ff3a153dd1654d495c20bbd3b87e7d203184ffb39b808";
const wrappedXXAddress = "0x171120219d3223E008558654ec3254A0F206edb2";

const adminAddress = "0xd74db3908a5ba94559ef9baa00cd597ad8cbd0f6";

async function main() {
  const signers = await ethers.getSigners();
  const deployer =
    signers.find((s) => s.address === wrappedXXDeployer) ||
    signers[signers.length - 1];
  console.log(
    "Deploying Wrapped XX with the following account:",
    wrappedXXDeployer
  );

  // Deploy Wrapped XX
  // Get factory
  const factory = await ethers.getContractFactory("WrappedXX");

  const balance = await deployer.provider.getBalance(wrappedXXDeployer);
  console.log("Wrapped XX deployer balance:", ethers.formatEther(balance));

  // Deploy Wrapped XX using CREATE2 proxy

  // Build data
  const data =
    wrappedXXSalt +
    factory.bytecode.slice(2) +
    "000000000000000000000000" +
    adminAddress.slice(2);

  // Check if address matches
  const addr = await deployer.call({
    to: create2ProxyAddress,
    data,
  });
  if (addr !== wrappedXXAddress.toLowerCase()) {
    throw new Error(
      `Wrapped XX address mismatch: ${addr} !== ${wrappedXXAddress}`
    );
  }

  // Send transaction
  const tx = await deployer.sendTransaction({
    to: create2ProxyAddress,
    data,
    maxFeePerGas: 70000000000,
  });

  console.log("Deploy transaction hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
