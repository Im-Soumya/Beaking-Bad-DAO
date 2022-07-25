import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

const vote = sdk.getVote("0x0a5Adb1911832484d97C96e6DC9FB47E776142c1");
const token = sdk.getToken("0x6c57726C77467aC95CA9476d1e5658B9133f24Fd");

(async () => {
  try {
    const amount = 420_000;
    const description = `Should the DAO mint additional ${amount} tokens in the treasury?`;
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseEther(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);
    console.log("Successfully created the proposal to mint tokens.");
  } catch (e) {
    console.log("Failed to create proposal to mint tokens. ", e);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    const description = `Should the DAO transfer ${amount} tokens to ${process.env.WALLET_ADDRESS}?`;
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("transfer", [
          process.env.WALLET_ADDRESS,
          ethers.utils.parseEther(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);
    console.log("Successfully create the proposal to transfer tokens.");
  } catch (e) {
    console.log("Failed to create proposal to transfer tokens. ", e);
    process.exit(1);
  }
})();
