import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x8eab038128f59937C718B8389A3bfD17eE2195F2"
);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Metal and Rock",
        description: "This NFT gives you access to MetalDAO",
        image: readFileSync("scripts/assets/rock.jpg"),
      },
    ]);

    console.log("✅ Successfully created a new NFT in the drop,");
  } catch (e) {
    console.log("Failed to deploy. ", e);
    process.exit(1);
  }
})();
