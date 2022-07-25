import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: "Breaking Bad DAO",
      //ERC20 token contract address
      voting_token_address: "0x6c57726C77467aC95CA9476d1e5658B9133f24Fd",
      //One can vote immediately after the proposal has been created
      voting_delay_in_blocks: 0,
      //Time period in blocks (6570 blocks in a day for ethereum) for which the voting procedure will continue
      voting_period_in_blocks: 6570,
      //The minimum % of total supply that need to vote for the proposal to be valid
      voting_quorum_fraction: 0,
      //minimum amount of token required to create a proposal
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
