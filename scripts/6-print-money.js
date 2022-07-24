import sdk from "./1-initialize-sdk.js";

const token = await sdk.getToken("0x6c57726C77467aC95CA9476d1e5658B9133f24Fd");

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
