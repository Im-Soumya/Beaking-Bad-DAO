import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x11060ADb42C4E60244088012f4bD2ae93F909AA5");

(async () => {
  try {
    console.log("All roles: ", await token.roles.getAll());

    await token.roles.setAll({ admin: [], minter: [] });
    console.log("Successfully revoked roles");

    console.log("All roles: ", await token.roles.getAll());
  } catch (e) {
    console.log("Failed to revoke admin powers", e);
    process.exit(1);
  }
})();
