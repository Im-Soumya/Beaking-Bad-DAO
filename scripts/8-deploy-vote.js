import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: "Breaking Bad DAO",
      voting_token_address: "0x6c57726C77467aC95CA9476d1e5658B9133f24Fd",
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 6570,
      voting_quorum_fraction: 0,
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Successfully deployed vote contract at: ",
      voteContractAddress
    );
  } catch (e) {
    console.log("Failed to deploy vote contract", e);
  }
})();
