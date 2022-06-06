import { Token } from "@thirdweb-dev/sdk";
import sdk from "./1-initialize-sdk.js";

// address of the ERC 20 contract printed out in 5-deploy-token
const token = sdk.getToken("0xc43cf0577E53Ba0b1854bD0196388B1282fde02b");

(async () => {
    try {
        // what is the max token supply?
        const amount = 1000000;
        // interact to mint tokens
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // print out how many of the tokens are issued
        console.log("There are now ", totalSupply.displayValue, "$CURLS in circulation.");
    }   catch (error) {
        console.error("Failed to print money", error);
    }
})();