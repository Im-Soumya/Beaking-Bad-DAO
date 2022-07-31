import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0x6D6d2b6832e8BDE7f2cdBc70C6194C90c6388599");
const token = sdk.getToken("0x11060ADb42C4E60244088012f4bD2ae93F909AA5");

(async () => {
  try {
    await token.roles.grant("minter", vote.getAddress());
    console.log("Successfully gave vote contract permission");
  } catch (e) {
    console.log("Failed to grant vote contract perimssion", e);
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);
    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = (Number(ownedAmount) / 100) * 90;

    await token.transfer(vote.getAddress(), percent90);

    console.log(
      "Successfully transferred" + percent90 + "tokens to vote contract"
    );
  } catch (e) {
    console.log("Failed to transfer tokens to vote contract");
    process.exit(1);
  }
})();
