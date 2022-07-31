import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x11060ADb42C4E60244088012f4bD2ae93F909AA5");

(async () => {
  try {
    const amount = 1_000_000;
    await token.mintToSelf(amount);
    const totalSupply = await token.totalSupply();

    console.log(
      `✅ Now there is ${totalSupply.displayValue} tokens available.`
    );
  } catch (e) {
    console.log("Failed to print money. ", e);
    process.exit(1);
  }
})();
