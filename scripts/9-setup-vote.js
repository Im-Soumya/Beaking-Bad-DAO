import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0x0a5Adb1911832484d97C96e6DC9FB47E776142c1");
const token = sdk.getToken("0x6c57726C77467aC95CA9476d1e5658B9133f24Fd");

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
