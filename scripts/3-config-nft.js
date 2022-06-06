import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// accessing the editionDrop contract, ERC-1155 deployed 
const editionDrop = sdk.getEditionDrop("0xA3BBB310D49b1B25B92D2eBD8d06D171A2B04296");

// setting up the NFT using createbatch
(async () => {
    try {
        // calls createBatch on the contract
        await editionDrop.createBatch([
            {
                // descriptions and location of the image file
                name:"SwoleDAO Membership Card",
                description: "This NFT will give you access to the SwoleDAO",
                image: readFileSync("scripts/assets/membershipCard.png")
            },
        ]);
        console.log("Successfully created a new NFT in the drop!");
    }   catch(error) {
        console.error("failed to create a new NFT", error);
    }
})();