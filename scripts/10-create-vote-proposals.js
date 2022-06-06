import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// governance contract address
const vote = sdk.getVote("0xFB1671979373D97255eD96eD9D290e9Bd230ddeB");

// ERC 20 contract
const token = sdk.getToken("0xc43cf0577E53Ba0b1854bD0196388B1282fde02b");

(async () => {
    try {
        // create proposal to mint 420,000 new tokens to treasury
        const amount = 420_000;
        const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
        const executions =[
            {
                // token contract that executres the mint
                toAddress: token.getAddress(),
                // native token (ETH) - tells how much we want to send in the proposal
                 // we aren't doing that here, so it is 0
                nativeTokenValue: 0,
                // we are minting and minting to the vote which will act as our treasury
                // we need ethers to convert to correct format
                transasctionData: token.encoder.encode(
                    "mintTo", [
                    vote.getAddress(),
                    ethers.utils.parseUnits(amount.toString(), 18),
                ]
                ),   
            }
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to mint tokens");
    }   catch (error) {
        console.error("failed to create proposal", error);
        process.exit(1);
    }

    try {
        // create proposal to transfer ourselves 6,900 from treasury
        const amount = 6_900;
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " + process.env.WALLET_ADDRESS + " for being a bro?";
        const executions = [
            {
                // sending 0 ETH again, just the CURLS token
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    // from treasury to wallet
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: token.getAddress(),
            },
        ];

        await vote.propose(description, executions);
        
        console.log(
            "✅ Successfully created proposal to reward ourselves from the treasury! Can I get a spot?"
        );
    }   catch (error) {
        console.error("failed to create second proposal", error);
    }
})();