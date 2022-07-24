import sdk from "./1-initialize-sdk.js";
import { AddressZero } from "@ethersproject/constants";

(async () => {
  try {
    const tokenAddress = await sdk.deployer.deployToken({
      name: "BBDAO Governance token",
      symbol: "mETH",
      primary_sale_recipient: AddressZero,
    });

    console.log("🌟 Successfully deployed token contract at: ", tokenAddress);
  } catch (e) {
    console.log("Failed to deploy the contract. ", e);
    process.exit(1);
  }
})();
