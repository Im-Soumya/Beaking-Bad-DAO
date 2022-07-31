import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x6dEE70a5a86Ce10AF077ae2e8c5820D7Be61C75f"
);
const token = sdk.getToken("0x11060ADb42C4E60244088012f4bD2ae93F909AA5");

(async () => {
  try {
    const allAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (allAddresses.length === 0) {
      console.log("No NFTs have been minted yet.");
      process.exit(0);
    }

    const airdropTargets = allAddresses.map((address) => {
      const randomAmt = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log(`Going to airdrop ${address} with ${randomAmt} tokens.`);

      const airdropTarget = {
        toAddress: address,
        amount: randomAmt,
      };

      return airdropTarget;
    });

    await token.transferBatch(airdropTargets);
    console.log("✅ Successfully airdropped");
  } catch (e) {
    console.log("Failed to airdrop. ", e);
    process.exit(1);
  }
})();
