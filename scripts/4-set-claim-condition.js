import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

// accessing editionDrop contract
const editionDrop = sdk.getEditionDrop("0xA3BBB310D49b1B25B92D2eBD8d06D171A2B04296");

(async () => {
    try {
        // define the claim conditions for the drop
        // array of objects bc we want to include ability for multiple phases
        const claimConditions = [{
            // when people will open to claim
            startTime: new Date(),
            // max NFTs to be claimed
            maxQuantity: 1_000,
            // price of the NFT
            price: 0,
            // amount to claim per transaction
            quantityLimitPerTransaction: 1,
            // set wait time between transactions to maxunit256
            // makes it so you can only claim once
            waitInSeconds: MaxUint256,
        }]
        // interacts with deployed contract on chain to adjust conditions
        // passes in 0 as that is the first token in the contract
        // everyone will be minting the 0 tokenid 
        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("Successfully set claim condition.")
    }   catch (error) {
        console.error("Failed to set claim condition", error);
    }
})();