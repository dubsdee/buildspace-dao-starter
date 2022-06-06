import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xc43cf0577E53Ba0b1854bD0196388B1282fde02b");

(async () => {
    try {
        // log the current roles
        const allRoles = await token.roles.getAll();

        console.log("👀 Roles that exist right now:", allRoles);

        // revoke your wallet sudo status
        await token.roles.setAll({ admin: [], minter: [] });
        console.log(
            "🎉 Roles after revoking ourselves",
            await token.roles.getAll()
        );
        console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

    }   catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error);
    }
})();