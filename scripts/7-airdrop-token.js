import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x59BCB6F1D92154ED8A881F2E9b1afBC113f9b06E"
);
const token = sdk.getToken("0x6c57726C77467aC95CA9476d1e5658B9133f24Fd");

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
