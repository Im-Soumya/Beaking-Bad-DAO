import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x59BCB6F1D92154ED8A881F2E9b1afBC113f9b06E"
);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Heisenberg",
        description: "This NFT gives you access to BBDAO",
        image: readFileSync("scripts/assets/heisenberg.png"),
      },
    ]);

    console.log("✅ Successfully created a new NFT in the drop,");
  } catch (e) {
    console.log("Failed to deploy. ", e);
    process.exit(1);
  }
})();
