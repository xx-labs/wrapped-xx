import { ethers } from "hardhat";

const create2ProxyDeployer = "0x3fab184622dc19b6109349b94811493bf2a45362";
const create2ProxyTransaction =
  "0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222";
const create2ProxyAddress = "0x4e59b44847b379578588920ca78fbf26c0b4956c";

const wrappedXXDeployer = "0x70fFda7eef19d00EAe79ba041f1982016CA6ADd4";
const wrappedXXSalt =
  "0x287872dd7a5189e4639ff3a153dd1654d495c20bbd3b87e7d203184ffb39b808";
const wrappedXXAddress = "0x171120219d3223E008558654ec3254A0F206edb2";

const adminAddress = "0xd74db3908a5ba94559ef9baa00cd597ad8cbd0f6";

async function main() {
  const signers = await ethers.getSigners();
  const base = signers[0];
  const deployer =
    signers.find((s) => s.address === wrappedXXDeployer) ||
    signers[signers.length - 1];
  console.log(
    "Deploying Wrapped XX with the following account:",
    wrappedXXDeployer
  );

  // Deploy CREATE2 proxy
  // Fund deployer
  let tx = await base.sendTransaction({
    to: create2ProxyDeployer,
    value: ethers.parseEther("1"),
  });
  await tx.wait(1);

  let balance = await base.provider.getBalance(create2ProxyDeployer);
  console.log("CREATE2 deployer balance:", ethers.formatEther(balance));

  // Send raw transaction
  await base.provider.broadcastTransaction(create2ProxyTransaction);

  // Confirm CREATE2 proxy deployment
  while (true) {
    const res = await base.provider.send("eth_getCode", [
      create2ProxyAddress,
      "latest",
    ]);
    if (res !== "0x") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("CREATE2 proxy deployed to:", create2ProxyAddress);

  // Deploy Wrapped XX
  // Get factory
  const factory = await ethers.getContractFactory("WrappedXX");

  // Fund deployer
  tx = await base.sendTransaction({
    to: wrappedXXDeployer,
    value: ethers.parseEther("10"),
  });
  await tx.wait(1);

  balance = await base.provider.getBalance(wrappedXXDeployer);
  console.log("Wrapped XX deployer balance:", ethers.formatEther(balance));

  // Deploy Wrapped XX using CREATE2 proxy
  const data =
    wrappedXXSalt +
    factory.bytecode.slice(2) +
    "000000000000000000000000" +
    adminAddress.slice(2);
  tx = await deployer.sendTransaction({
    to: create2ProxyAddress,
    data,
  });
  const receipt = await tx.wait(1);

  // Get address from logs
  let address: string | undefined = undefined;
  try {
    address = receipt?.logs[0].address;
  } catch (e) {
    console.error(e);
  }

  if (address === undefined) {
    throw new Error("Failed to get Wrapped XX address from logs");
  }

  if (address !== wrappedXXAddress) {
    throw new Error(
      `Wrapped XX address mismatch: ${address} !== ${wrappedXXAddress}`
    );
  }

  // Confirm Wrapped XX deployment
  while (true) {
    const res = await base.provider.send("eth_getCode", [
      wrappedXXAddress,
      "latest",
    ]);
    if (res !== "0x") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log("Wrapped XX deployed to:", wrappedXXAddress);
  console.log("Gas used: ", receipt?.gasUsed.toString());

  // Check admin and minter is expected address
  const wrappedXX = await ethers.getContractAt("WrappedXX", wrappedXXAddress);

  const adminRole = await wrappedXX.DEFAULT_ADMIN_ROLE();
  const minterRole = await wrappedXX.MINTER_ROLE();

  const isAdmin = await wrappedXX.hasRole(adminRole, adminAddress);
  const isMinter = await wrappedXX.hasRole(minterRole, adminAddress);

  console.log("Admin role:", isAdmin);
  console.log("Minter role:", isMinter);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
