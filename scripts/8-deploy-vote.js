import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            // give governance contract a name
            name: "Swole DAO Gym Rules",

            // location of the governance token, the ERC 20
            voting_token_address: "0xc43cf0577E53Ba0b1854bD0196388B1282fde02b",

            // parameters are specified in number of blocks - assuming block time of ~13.14 sec

            // after proposal is created, when can members vote
            // initial delay set to 0
            voting_delay_in_blocks: 0,

            // how long do members have to vote on a proposal?
            // setting to 1 day = ~6570 blocks
            voting_period_in_blocks: 6570,

            // minimum % of the total supply neede to vote quorum
            voting_quorum_fraction: 0,

            // minimum # of tokens a user needs to create a proposal
            // initial set to 1
            proposal_token_threshold: 0,
        });

        console.log(
            "Successfully deployed vote contract, address: ",
            voteContractAddress,
        );
    }   catch (err) {
        console.error("Failed to deploy vote contract", err);
    }
})();