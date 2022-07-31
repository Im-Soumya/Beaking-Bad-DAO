import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x6dEE70a5a86Ce10AF077ae2e8c5820D7Be61C75f"
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
