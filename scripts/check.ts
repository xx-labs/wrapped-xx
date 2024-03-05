import { ethers } from "hardhat";

const wrappedXXAddress = "0x171120219d3223E008558654ec3254A0F206edb2";
const adminAddress = "0xd74db3908a5ba94559ef9baa00cd597ad8cbd0f6";

async function main() {
  // Check admin and minter is expected address
  const wrappedXX = await ethers.getContractAt("WrappedXX", wrappedXXAddress);

  console.log("Loaded Wrapped XX contract at:", wrappedXXAddress);

  const adminRole = await wrappedXX.DEFAULT_ADMIN_ROLE();
  const minterRole = await wrappedXX.MINTER_ROLE();

  const isAdmin = await wrappedXX.hasRole(adminRole, adminAddress);
  const isMinter = await wrappedXX.hasRole(minterRole, adminAddress);

  console.log("Admin role:", isAdmin);
  console.log("Minter role:", isMinter);

  // Check supply
  const totalSupply = await wrappedXX.totalSupply();

  console.log("Total supply:", totalSupply.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
