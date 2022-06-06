import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        // deploy a standard erc-20 contract
        const tokenAddress = await sdk.deployer.deployToken({
            // what is the token name
            name: "SwoleDAO Governance Token",
            // token symbol
            symbol: "CURLS",
            // this will be in case we want to sell the token - we don'e so send to zero address
            primary_sale_recipient: AddressZero,
        });
        console.log("✅ Successfully deployed token module, address: ", tokenAddress,);
    }   catch (error) {
        console.error("failed to deploy token module", error);
    }
})();