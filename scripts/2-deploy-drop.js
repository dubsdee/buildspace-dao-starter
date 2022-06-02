import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            // give collection a name 
            name: "Swole DAO Gym Pass",
            // give a description for the collection
            description: "A DAO for gym and fitness enthusiasts.",
            // link the image that will be held on our NFT
            image: readFileSync("assets/45plate.jpg"),
            // we need to pass the address of the person who is getting the proceeds 
            // of sales of nfts in the contract.
            // We're not charging for the mint - all funds are getting sent to the 0x0 address
            primary_sale_recipient: AddressZero,
        });

        // this initialization returns the address of the contract
        // we use this to initialize the contract on the thirdweb sdk
        const editionDrop = sdk.getEditionDrop(editionDropAddress);

        // with this, we can get the metadeta of our contract
        const metadata = await editionDrop.metadata.get();

        console.log(
            "✅ Successfully deployed editionDrop contract, address:",
            editionDropAddress,
        );
        console.log("✅ editionDrop metadata:", metadata);
    }   catch (error) {
        console.log("failed to deploy editionDrop contract", error);
    }
})();