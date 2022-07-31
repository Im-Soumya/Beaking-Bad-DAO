import { MaxUint256 } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x6dEE70a5a86Ce10AF077ae2e8c5820D7Be61C75f"
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
