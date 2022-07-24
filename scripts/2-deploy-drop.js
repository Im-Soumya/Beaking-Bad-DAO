import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "BBDAO Membership",
      description: "A DAO for fans of Breaking Bad",
      image: readFileSync("scripts/assets/rock.jpg"),
      primary_sale_recipient: AddressZero,
    });

    const editionDrop = sdk.getEditionDrop(editionDropAddress);
    const metadata = await editionDrop.metadata.get();

    console.log(
      "✅ Successfully deployed editionDrop contract at address: ",
      editionDropAddress
    );
    console.log("✅ editionDrop metadata: ", metadata);
  } catch (e) {
    console.log("Failed to deploy ", e);
    process.exit(1);
  }
})();
