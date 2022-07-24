import { MaxUint256 } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x59BCB6F1D92154ED8A881F2E9b1afBC113f9b06E"
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
