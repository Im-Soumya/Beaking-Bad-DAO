import { MaxUint256 } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x8eab038128f59937C718B8389A3bfD17eE2195F2"
);

(async () => {
  try {
    const claimConditions = [
      {
        startTime: new Date(),
        maxQuantity: 50_000,
        price: 0,
        quantityLimitPerTransaction: 1,
        waitInSeconds: MaxUint256,
      },
    ];

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log("✅ Successfully set claim conditions");
  } catch (e) {
    console.log("Failed to set claim conditions. ", e);
    process.exit(1);
  }
})();
