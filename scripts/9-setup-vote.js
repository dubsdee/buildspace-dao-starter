import sdk from "./1-initialize-sdk.js";

// governance contract address
const vote = sdk.getVote("0xFB1671979373D97255eD96eD9D290e9Bd230ddeB");

// ERC 20 contract
const token = sdk.getToken("0xc43cf0577E53Ba0b1854bD0196388B1282fde02b");

(async () => {
    try {
        // give treasure power to mint additional tokens
        await token.roles.grant("minter", vote.getAddress());

        console.log(
            "✅ Successfully gave vote contract permissions to act on token contract"
        );
    }   catch (error) {
        console.error(
            "failed to grant vote contract permissions on token contract",
            error
        );
        process.exit(1);
    }

    try {
        // grab our wallet's token balance 
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );

        // grab 90% of that supply for transfer
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        // transfer supply to voting contract
        await token.transfer(
            vote.getAddress(),
            percent90
        );

        console.log("✅ Successfully transferred "+ percent90 + " tokens to vote contract.");
    }   catch (err) {
        console.error("failed to transfer tokens to vote contract", err);
    }
})();