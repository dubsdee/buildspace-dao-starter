import sdk from "./1-initialize-sdk.js";

// this is the address to the ERC 1155 NFT contract
const editionDrop = sdk.getEditionDrop("0xA3BBB310D49b1B25B92D2eBD8d06D171A2B04296");

// address for the ERC - 20 contract
const token = sdk.getToken("0xc43cf0577E53Ba0b1854bD0196388B1282fde02b");

(async () => {
    try {
        // grab all the addresses for people who own a membership NFT (tokenid = 0)
        const walletAddress = await editionDrop.history.getAllClaimerAddresses(0);

        if (walletAddress.length === 0) {
            console.log(
                "No NFTs have been claimed yet."
            );
            process.exit(0);
        }

        // looks through the array of addresses
        const airdropTargets = walletAddress.map((address) => {
            // pick a random number between 1000 and 100000
            const randomAmount = Math.floor(Math.random() * (1000 - 1000 + 1) + 1000);
            console.log("Airdropping ", randomAmount, "tokens to ", address);

            // set up the target
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        });

        // call transferBatch on all airdrop targets
        console.log("🌈 Starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("Successfully airdropped tokens to all NFT holders.");
    }   catch (err) {
        console.error("failed to airdrop tokens", err);
    }
})();