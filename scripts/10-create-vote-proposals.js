import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

const vote = sdk.getVote("0x6D6d2b6832e8BDE7f2cdBc70C6194C90c6388599");
const token = sdk.getToken("0x11060ADb42C4E60244088012f4bD2ae93F909AA5");

(async () => {
  // try {
  //   const amount = 420_000;
  //   const description = `Should the DAO mint ${amount} more mETH in the treasury?`;
  //   const executions = [
  //     {
  //       toAddress: token.getAddress(),
  //       nativeTokenValue: 0,
  //       transactionData: token.encoder.encode("mintTo", [
  //         vote.getAddress(),
  //         ethers.utils.parseEther(amount.toString(), 18),
  //       ]),
  //     },
  //   ];

  //   await vote.propose(description, executions);
  //   console.log("Successfully created the proposal to mint mETH.");
  // } catch (e) {
  //   console.log("Failed to create proposal to mint mETH. ", e);
  //   process.exit(1);
  // }

  try {
    const amount = 6_900;
    const description = `Should the DAO transfer ${amount} mETH to ${process.env.WALLET_ADDRESS}?`;
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
    console.log("Successfully create the proposal to transfer mETH.");
  } catch (e) {
    console.log("Failed to create proposal to transfer mETH. ", e);
    process.exit(1);
  }
})();
