//importing SDK from thirdweb and ethers
import {ThirdwebSDK} from "@thirdweb-dev/sdk";
import ethers from "ethers";

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// checks to make sure the .env is operating correctly

// check if private key doesn't exist or is empty
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("🛑 Private key not found.");
}

// check if alchemy api doesn't exist or is empty
if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
    console.log("🛑 Alchemy API URL not found.");
  }

// check if wallet address doesn't exist or is empty
if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("🛑 Wallet Address not found.");
  }

// RPC URL - we use the Alchemy API URL from the .env file
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
// Wallet private key - keep linked to .env, don't update to git or share
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// sdk - initializing third web sdk - using wallet which passes private key and alchemy api 
const sdk = new ThirdwebSDK(wallet);

// set up to make sure that sdk was initialized correctly
(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("SDK initialized by address:", address)
    } catch (err) {
        console.error("Failed to get apps from the sdk", err);
        process.exit(1);
    }
}) ();

// exporting the initialized thirdweb SDK so it can be utilized in other scripts
export default sdk;